import { useCallback, useEffect, useRef, useState } from "react";

type RecognitionEvent = {
  resultIndex?: number;
  results: {
    length: number;
    [index: number]: { isFinal: boolean; [index: number]: { transcript: string } };
  };
};

type Recognition = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: RecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  start: () => void;
  stop: () => void;
};

type RecognitionWindow = Window & {
  SpeechRecognition?: new () => Recognition;
  webkitSpeechRecognition?: new () => Recognition;
};

export type VoiceInterviewState = "idle" | "speaking" | "listening" | "processing" | "error";

const ANSWER_SILENCE_MS = 4500;

export function useVoiceInterview(onTranscriptComplete: (transcript: string) => void) {
  const [state, setState] = useState<VoiceInterviewState>("idle");
  const [transcript, setTranscript] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef<Recognition | null>(null);
  const silenceTimerRef = useRef<number | null>(null);
  const lastSpokenQuestionRef = useRef("");
  const transcriptRef = useRef("");
  const finalTranscriptRef = useRef("");
  const listeningRef = useRef(false);
  const shouldKeepListeningRef = useRef(false);
  const submittedRef = useRef(false);
  const restartTimerRef = useRef<number | null>(null);
  const callbackRef = useRef(onTranscriptComplete);

  useEffect(() => {
    callbackRef.current = onTranscriptComplete;
  }, [onTranscriptComplete]);

  const finishListening = useCallback(() => {
    if (submittedRef.current) return;

    submittedRef.current = true;
    listeningRef.current = false;
    shouldKeepListeningRef.current = false;
    if (silenceTimerRef.current !== null) {
      window.clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    const completedTranscript = transcriptRef.current.trim();
    if (completedTranscript) {
      setState("processing");
      callbackRef.current(completedTranscript);
    } else {
      setState("idle");
    }
  }, []);

  const startListening = useCallback(() => {
    const recognitionConstructor = (window as RecognitionWindow).SpeechRecognition ||
      (window as RecognitionWindow).webkitSpeechRecognition;
    if (!recognitionConstructor) {
      setSupported(false);
      setState("idle");
      return;
    }

    if (recognitionRef.current || listeningRef.current) return;

    transcriptRef.current = "";
    finalTranscriptRef.current = "";
    setTranscript("");
    setErrorMessage("");
    submittedRef.current = false;
    listeningRef.current = true;
    shouldKeepListeningRef.current = true;
    const recognition = new recognitionConstructor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      let interimTranscript = "";
      const resultIndex = event.resultIndex || 0;

      for (let index = resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index];
        if (result.isFinal) {
          finalTranscriptRef.current += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }
      transcriptRef.current = `${finalTranscriptRef.current} ${interimTranscript}`.trim();
      setTranscript(transcriptRef.current);
      if (silenceTimerRef.current !== null) window.clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = window.setTimeout(finishListening, ANSWER_SILENCE_MS);
    };
    recognition.onerror = (event) => {
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        listeningRef.current = false;
        shouldKeepListeningRef.current = false;
        setErrorMessage("Microphone permission denied. Allow microphone access and try again.");
        setState("error");
        return;
      }

      if (event.error !== "aborted" && event.error !== "no-speech") {
        setErrorMessage(
          event.error === "audio-capture"
            ? "No microphone detected or the microphone is being used by another application."
            : `Speech recognition error: ${event.error}.`,
        );
        setState("error");
      }
    };
    recognition.onend = () => {
      recognitionRef.current = null;

      if (!shouldKeepListeningRef.current || submittedRef.current) return;

      if (restartTimerRef.current !== null) window.clearTimeout(restartTimerRef.current);
      restartTimerRef.current = window.setTimeout(() => {
        restartTimerRef.current = null;
        if (!shouldKeepListeningRef.current || submittedRef.current) return;

        try {
          const restartedRecognition = new recognitionConstructor();
          restartedRecognition.continuous = true;
          restartedRecognition.interimResults = true;
          restartedRecognition.lang = "en-US";
          restartedRecognition.onresult = recognition.onresult;
          restartedRecognition.onerror = recognition.onerror;
          restartedRecognition.onend = recognition.onend;
          recognitionRef.current = restartedRecognition;
          restartedRecognition.start();
        } catch {
          if (shouldKeepListeningRef.current) setState("error");
        }
      }, 100);
    };
    recognitionRef.current = recognition;
    setState("listening");
    try {
      recognition.start();
    } catch {
      recognitionRef.current = null;
      listeningRef.current = false;
      shouldKeepListeningRef.current = false;
      setState("error");
    }
  }, [finishListening]);

  const speak = useCallback((question: string) => {
    if (!question || question === lastSpokenQuestionRef.current) return;
    lastSpokenQuestionRef.current = question;
    recognitionRef.current?.stop();
    window.speechSynthesis.cancel();
    setState("speaking");
    const utterance = new SpeechSynthesisUtterance(question);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.onend = startListening;
    utterance.onerror = () => setState("error");
    window.speechSynthesis.speak(utterance);
  }, [startListening]);

  const stop = useCallback(() => {
    listeningRef.current = false;
    shouldKeepListeningRef.current = false;
    submittedRef.current = true;
    if (silenceTimerRef.current !== null) window.clearTimeout(silenceTimerRef.current);
    if (restartTimerRef.current !== null) window.clearTimeout(restartTimerRef.current);
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    window.speechSynthesis.cancel();
    setState("idle");
  }, []);

  useEffect(() => {
    return () => {
      if (silenceTimerRef.current !== null) window.clearTimeout(silenceTimerRef.current);
      if (restartTimerRef.current !== null) window.clearTimeout(restartTimerRef.current);
      listeningRef.current = false;
      shouldKeepListeningRef.current = false;
      recognitionRef.current?.stop();
      window.speechSynthesis.cancel();
    };
  }, []);

  return { state, transcript, errorMessage, supported, speak, startListening, finishListening, stop };
}
