import { useCallback, useEffect, useRef, useState } from "react";
import { AlertCircle, Camera, CameraOff, CheckCircle2, Loader2, Mic, Pause, Play, Send, Sparkles, Square } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useVoiceInterview, type VoiceInterviewState } from "../../features/aiInterview/hooks/useVoiceInterview";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const auth = () => `Bearer ${localStorage.getItem("c2c_student_token") || ""}`;
const mediaError = (error: unknown) => {
  const name = error instanceof DOMException ? error.name : "";
  if (name === "NotAllowedError" || name === "SecurityError") return "Camera permission denied.";
  if (name === "NotFoundError") return "No camera detected.";
  if (name === "NotReadableError") return "Camera is being used by another application.";
  if (name === "OverconstrainedError") return "The requested camera is not available.";
  return error instanceof Error ? error.message : "Unable to access the camera. Check browser permissions.";
};
type Session = { sessionId: string; role: string; totalQuestions: number; currentQuestion: number };
type Question = { questionId: string; question: string };
type Result = { sessionId: string; overallScore: number; technicalScore: number; communicationScore: number; strengths: string[]; weaknesses: string[]; recommendation?: string };

async function request<T>(path: string, options: RequestInit = {}) {
  const response = await fetch(`${API}${path}`, { ...options, headers: { Authorization: auth(), "Content-Type": "application/json", ...options.headers } });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.message || "AI interviewer temporarily unavailable. Please try again.");
  return data as T;
}

export default function AIInterview() {
  const navigate = useNavigate();
  const { driveId } = useParams<{ driveId: string }>();
  const [session, setSession] = useState<Session | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [textMode, setTextMode] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const cameraStartedRef = useRef(false);

  /**
   * Prevents double-submission if the candidate clicks
   * "Finish Answer" more than once or clicks while transcribing.
   */
  const isSubmittingAnswerRef = useRef(false);

  const stopCamera = useCallback(() => {
    recorderRef.current?.stop();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    cameraStartedRef.current = false;
    setCameraOn(false);
    setRecording(false);
  }, []);

  const finishInterview = useCallback(async () => {
    if (!session) return;
    try {
      const response = await request<{ result: Result }>(`/ai-interview/${session.sessionId}/complete`, { method: "POST" });
      setResult(response.result);
      setQuestion(null);
      stopCamera();
    } catch (completionError) { setError(completionError instanceof Error ? completionError.message : "Unable to complete the interview."); }
  }, [session, stopCamera]);

  const submitAnswer = useCallback(async (value: string) => {
    if (!session || !question || processing || !value.trim()) return;
    setProcessing(true);
    setAnswer(value);
    setError("");
    try {
      const response = await request<{ completed: boolean; currentQuestion?: Question }>(`/ai-interview/${session.sessionId}/answer`, { method: "POST", body: JSON.stringify({ questionId: question.questionId, question: question.question, answer: value.trim() }) });
      if (response.completed) await finishInterview();
      else if (response.currentQuestion?.question) { setSession((current) => current ? { ...current, currentQuestion: current.currentQuestion + 1 } : current); setQuestion(response.currentQuestion); setAnswer(""); }
    } catch (submitError) { setError(submitError instanceof Error ? submitError.message : "Unable to process your response."); }
    finally { setProcessing(false); }
  }, [finishInterview, processing, question, session]);

  /**
   * Called by useVoiceInterview when transcription completes.
   * The transcript from Groq Whisper becomes the candidate's answer.
   */
  const handleTranscriptComplete = useCallback(
    (transcript: string) => {
      isSubmittingAnswerRef.current = false;
      void submitAnswer(transcript);
    },
    [submitAnswer],
  );

  const voice = useVoiceInterview(handleTranscriptComplete);

  /**
   * Called when candidate clicks "Finish Answer".
   * Guards against double-submission using isSubmittingAnswerRef.
   */
  const handleFinishAnswer = useCallback(() => {
    if (isSubmittingAnswerRef.current) return;
    isSubmittingAnswerRef.current = true;
    void voice.finishListening();
  }, [voice]);

  const startInterview = useCallback(async () => {
    if (!driveId) { setError("Hiring drive was not found."); setLoading(false); return; }
    try {
      const response = await request<{ session: Session; currentQuestion: Question; firstQuestion: string }>("/ai-interview/start", { method: "POST", body: JSON.stringify({ driveId, role: "Software Engineer", totalQuestions: 5 }) });
      setSession(response.session);
      setQuestion(response.currentQuestion || { questionId: crypto.randomUUID(), question: response.firstQuestion });
    } catch (startError) { setError(startError instanceof Error ? startError.message : "Unable to start the AI interview."); }
    finally { setLoading(false); }
  }, [driveId]);

  const startCamera = useCallback(async () => {
    if (cameraStartedRef.current || streamRef.current) return;
    cameraStartedRef.current = true;
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error("Camera and microphone are not supported by this browser.");
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (!stream.getVideoTracks().length) throw new Error("No camera detected.");
      const video = videoRef.current;
      if (!video) throw new Error("Camera preview is not ready.");
      streamRef.current = stream;
      video.srcObject = stream;
      video.muted = true;
      if (video.readyState < HTMLMediaElement.HAVE_METADATA) await new Promise<void>((resolve, reject) => { video.addEventListener("loadedmetadata", () => resolve(), { once: true }); video.addEventListener("error", () => reject(new Error("Camera video could not load.")), { once: true }); });
      await video.play();
      if (!video.videoWidth || !video.videoHeight) throw new Error("Camera is not sending video frames.");
      console.debug("AI interview camera ready", { videoTracks: stream.getVideoTracks().length, readyState: video.readyState, videoWidth: video.videoWidth, videoHeight: video.videoHeight });
      setCameraOn(true);
    } catch (cameraError) { streamRef.current?.getTracks().forEach((track) => track.stop()); streamRef.current = null; cameraStartedRef.current = false; setError(mediaError(cameraError)); }
  }, []);

  useEffect(() => { startInterview(); }, [startInterview]);
  useEffect(() => { if (!loading && question?.question) startCamera(); }, [loading, question?.question, startCamera]);

  // Speak the question via TTS whenever a new question arrives
  useEffect(() => {
    if (question?.question && !processing) {
      voice.speak(question.question);
    }
  }, [question?.question, processing, voice.speak]);

  useEffect(() => () => { voice.stop(); stopCamera(); }, [stopCamera, voice.stop]);

  function toggleRecording() {
    if (!streamRef.current) { setError("Turn on the camera before recording."); return; }
    if (recording && recorderRef.current) { recorderRef.current.stop(); setRecording(false); return; }
    chunksRef.current = [];
    const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus") ? "video/webm;codecs=vp9,opus" : MediaRecorder.isTypeSupported("video/webm;codecs=vp8,opus") ? "video/webm;codecs=vp8,opus" : "video/webm";
    const recorder = new MediaRecorder(streamRef.current, { mimeType });
    recorder.ondataavailable = (event) => { if (event.data.size) chunksRef.current.push(event.data); };
    recorder.onstop = async () => { if (!session || !chunksRef.current.length) return; const formData = new FormData(); formData.append("video", new Blob(chunksRef.current, { type: mimeType }), `interview-${session.sessionId}.webm`); const response = await fetch(`${API}/ai-interview/${session.sessionId}/recording`, { method: "POST", headers: { Authorization: auth() }, body: formData }); if (!response.ok) setError("Unable to upload the interview recording."); };
    recorderRef.current = recorder; recorder.start(1000); setRecording(true); setRecordingSeconds(0);
  }
  useEffect(() => { if (!recording) return; const timer = window.setInterval(() => setRecordingSeconds((seconds) => seconds + 1), 1000); return () => window.clearInterval(timer); }, [recording]);

  if (loading) return <main className="flex min-h-screen items-center justify-center bg-slate-50"><div className="text-center"><Loader2 className="mx-auto h-8 w-8 animate-spin text-[#5400D6]" /><p className="mt-3 text-sm font-semibold text-slate-600">Preparing your AI interview...</p></div></main>;
  if (result) return <ResultView result={result} onContinue={() => navigate("/student/placementprep")} />;

  const isVoiceBusy =
    voice.state === "speaking" ||
    voice.state === "processing" ||
    voice.state === "transcribing";

  const labels: Record<VoiceInterviewState, string> = {
    idle: "Ready",
    speaking: "AI is speaking",
    listening: "YOUR TURN",
    transcribing: "TRANSCRIBING...",
    processing: "Analyzing your response",
    error: voice.errorMessage || "Microphone unavailable",
  };

  const listening = voice.state === "listening";
  const transcribing = voice.state === "transcribing";

  return <main className="min-h-screen bg-[#f8f7fb] px-4 py-6 text-slate-900 sm:px-6 lg:px-10"><div className="mx-auto max-w-6xl"><header className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#5400D6]">C2C AI Interview</p><h1 className="mt-2 text-3xl font-black tracking-tight">A conversation about how you think.</h1><p className="mt-2 text-sm text-slate-500">{session?.role || "Software Engineer"} · Question {session?.currentQuestion || 1} of {session?.totalQuestions || 5}</p></div><div className="flex items-center gap-2 text-xs font-bold text-emerald-700"><span className="h-2 w-2 rounded-full bg-emerald-500" />Live session</div></header>{error && <div className="mt-5 flex items-center gap-2 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700"><AlertCircle className="h-4 w-4" />{error}</div>}<div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]"><section className="relative flex min-h-[620px] flex-col items-center justify-center overflow-hidden rounded-3xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm"><div className={`flex h-28 w-28 items-center justify-center rounded-full ${voice.state === "speaking" ? "bg-[#eee5ff] shadow-[0_0_0_18px_#f7f3ff]" : listening ? "bg-emerald-50 shadow-[0_0_0_18px_#f0fdf8]" : transcribing ? "bg-amber-50 shadow-[0_0_0_18px_#fffbeb]" : "bg-slate-100"}`}><Sparkles className="h-10 w-10 text-[#5400D6]" /></div><p className="mt-10 text-[11px] font-black uppercase tracking-[0.25em] text-slate-400">{labels[voice.state]}</p><h2 className="mt-3 max-w-2xl text-2xl font-black leading-tight sm:text-3xl">{listening ? "🎙 Recording... Speak naturally. Take your time." : transcribing ? "Converting your response to text..." : voice.state === "processing" ? "Understanding your answer..." : question?.question || "Welcome to your interview."}</h2>{listening && <div className="mt-8 flex h-10 items-center gap-1.5">{[12,24,38,20,32,15,28,42,22].map((height, index) => <span key={index} className="w-1 animate-pulse rounded-full bg-emerald-400" style={{ height }} />)}</div>}{transcribing && <div className="mt-6 flex items-center gap-2 text-amber-600"><Loader2 className="h-5 w-5 animate-spin" /><span className="text-sm font-semibold">Transcribing...</span></div>}{answer && <p className="mt-8 max-w-xl text-sm leading-6 text-slate-500">"{answer}"</p>}<div className="mt-10 flex items-center gap-3">{listening ? <button type="button" onClick={handleFinishAnswer} disabled={isSubmittingAnswerRef.current} className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-5 py-3 text-sm font-bold text-white disabled:opacity-40"><Square className="h-4 w-4" />Finish Answer</button> : <button type="button" onClick={() => { if (session) { isSubmittingAnswerRef.current = false; void voice.startListening(session.sessionId); } }} disabled={isVoiceBusy || processing} className="inline-flex items-center gap-2 rounded-full bg-[#5400D6] px-5 py-3 text-sm font-bold text-white disabled:opacity-40"><Mic className="h-4 w-4" />Start Speaking</button>}<button type="button" onClick={() => setTextMode((value) => !value)} className="rounded-full border border-slate-200 px-4 py-3 text-xs font-bold text-slate-600">{textMode ? "Hide text" : "Type instead"}</button></div>{textMode && <div className="mt-5 flex w-full max-w-xl gap-2"><textarea value={answer} onChange={(event) => setAnswer(event.target.value)} rows={2} placeholder="Type your answer here..." className="flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none" /><button type="button" onClick={() => submitAnswer(answer)} disabled={!answer.trim() || processing} className="rounded-xl bg-slate-900 px-4 text-white disabled:opacity-40"><Send className="h-4 w-4" /></button></div>}<p className="absolute bottom-5 text-[11px] text-slate-400">Your answer is evaluated privately. Detailed feedback appears at the end.</p></section><aside className="space-y-4"><section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="relative aspect-video bg-slate-950"><video ref={videoRef} autoPlay playsInline muted className={`h-full w-full object-cover ${cameraOn ? "block" : "hidden"}`} />{!cameraOn && <div className="flex h-full items-center justify-center"><CameraOff className="h-8 w-8 text-slate-600" /></div>}{recording && <span className="absolute left-3 top-3 rounded-full bg-rose-500 px-2 py-1 text-[10px] font-black text-white">REC {String(Math.floor(recordingSeconds / 60)).padStart(2, "0")}:{String(recordingSeconds % 60).padStart(2, "0")}</span>}</div><div className="flex gap-2 p-3"><button type="button" onClick={() => { if (cameraOn) stopCamera(); else startCamera(); }} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-100 py-2 text-xs font-bold text-slate-700">{cameraOn ? <CameraOff className="h-4 w-4" /> : <Camera className="h-4 w-4" />}{cameraOn ? "Camera off" : "Camera on"}</button><button type="button" onClick={toggleRecording} className="rounded-xl bg-slate-100 px-3 text-slate-700">{recording ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}</button></div></section><section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Interview rhythm</p><div className="mt-4 space-y-3 text-xs font-semibold text-slate-600"><p className={voice.state === "speaking" ? "text-[#5400D6]" : ""}><Sparkles className="mr-2 inline h-3.5 w-3.5" />AI interviewer speaks</p><p className={listening ? "text-emerald-600" : ""}><Mic className="mr-2 inline h-3.5 w-3.5" />You respond naturally</p><p className={transcribing ? "text-amber-600" : ""}><Loader2 className="mr-2 inline h-3.5 w-3.5" />Groq transcribes your voice</p><p className={voice.state === "processing" ? "text-amber-600" : ""}><Loader2 className="mr-2 inline h-3.5 w-3.5" />Gemini adapts the next question</p></div></section></aside></div></div></main>;
}

function ResultView({ result, onContinue }: { result: Result; onContinue: () => void }) { return <main className="flex min-h-screen items-center justify-center bg-[#f8f7fb] px-4 py-8"><section className="w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"><div className="text-center"><CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500" /><p className="mt-5 text-[10px] font-black uppercase tracking-[0.25em] text-[#5400D6]">Interview complete</p><h1 className="mt-2 text-3xl font-black">Your interview evaluation</h1></div><div className="mt-8 grid gap-3 sm:grid-cols-3">{[["Overall", result.overallScore], ["Technical", result.technicalScore], ["Communication", result.communicationScore]].map(([label, value]) => <div key={label} className="rounded-2xl bg-[#f5f0ff] p-5 text-center"><p className="text-xs font-bold text-slate-500">{label}</p><p className="mt-1 text-3xl font-black text-[#5400D6]">{value}<span className="text-base">/100</span></p></div>)}</div><div className="mt-8 grid gap-6 sm:grid-cols-2"><div><h2 className="font-black">Strengths</h2><ul className="mt-3 space-y-2 text-sm text-slate-600">{result.strengths?.map((item) => <li key={item}>• {item}</li>)}</ul></div><div><h2 className="font-black">Areas to improve</h2><ul className="mt-3 space-y-2 text-sm text-slate-600">{result.weaknesses?.map((item) => <li key={item}>• {item}</li>)}</ul></div></div>{result.recommendation && <p className="mt-8 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">{result.recommendation}</p>}<button type="button" onClick={onContinue} className="mt-8 w-full rounded-xl bg-[#5400D6] py-3 text-sm font-bold text-white">Continue</button></section></main>; }
