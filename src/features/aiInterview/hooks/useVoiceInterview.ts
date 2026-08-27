import { useCallback, useEffect, useRef, useState } from "react";
import { transcribeAnswer } from "../services/aiInterviewApi";

/*
 * Voice state machine
 *
 *  idle  ──► speaking  ──► listening  ──► transcribing  ──► processing
 *   ▲                                                           │
 *   └───────────────────── (via callback) ─────────────────────┘
 *
 * "error" can be reached from any state.
 */
export type VoiceInterviewState =
  | "idle"
  | "speaking"
  | "listening"
  | "transcribing"
  | "processing"
  | "error";

export function useVoiceInterview(
  onTranscriptComplete: (transcript: string) => void,
) {
  const [state, setState] =
    useState<VoiceInterviewState>("idle");

  const [errorMessage, setErrorMessage] = useState("");

  // ── refs ────────────────────────────────────────────────────

  /** MediaRecorder for the current answer recording */
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  /** Accumulated audio chunks while recording */
  const audioChunksRef = useRef<Blob[]>([]);

  /** The mic-only stream we opened */
  const micStreamRef = useRef<MediaStream | null>(null);

  /** Question spoken last — prevents duplicate TTS */
  const lastSpokenQuestionRef = useRef("");

  /** Stable reference to the callback so effects don't re-run */
  const callbackRef = useRef(onTranscriptComplete);

  /** Prevents double-submit if finishListening is called twice */
  const isSubmittingRef = useRef(false);

  /** sessionId stored when startListening is called */
  const sessionIdRef = useRef<string>("");

  useEffect(() => {
    callbackRef.current = onTranscriptComplete;
  }, [onTranscriptComplete]);

  // ── cleanup helpers ──────────────────────────────────────────

  /** Stop and release the microphone stream */
  const stopMicStream = useCallback(() => {
    micStreamRef.current
      ?.getTracks()
      .forEach((track) => track.stop());
    micStreamRef.current = null;
  }, []);

  // ── finishListening ─────────────────────────────────────────
  /**
   * Called when the candidate clicks "Finish Answer".
   * Stops MediaRecorder, assembles the Blob, sends to backend
   * for Groq transcription, then hands the transcript to the
   * existing submitAnswer flow.
   */
  const finishListening = useCallback(async () => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    const recorder = mediaRecorderRef.current;

    if (!recorder || recorder.state === "inactive") {
      // Nothing was recorded — reset quietly
      isSubmittingRef.current = false;
      setState("idle");
      return;
    }

    /*
     * Stop the MediaRecorder.  The "stop" event fires
     * asynchronously, so we wait for it with a Promise.
     */
    await new Promise<void>((resolve) => {
      recorder.addEventListener(
        "stop",
        () => resolve(),
        { once: true },
      );
      recorder.stop();
    });

    const mimeType =
      recorder.mimeType || "audio/webm";

    const audioBlob = new Blob(audioChunksRef.current, {
      type: mimeType,
    });

    // Clear chunks immediately so they aren't retained
    audioChunksRef.current = [];

    // Stop mic tracks — camera is unaffected
    stopMicStream();
    mediaRecorderRef.current = null;

    if (audioBlob.size === 0) {
      setErrorMessage(
        "No audio was recorded. Please try again.",
      );
      setState("error");
      isSubmittingRef.current = false;
      return;
    }

    // Transition to transcribing state
    setState("transcribing");

    try {
      const result = await transcribeAnswer(
        sessionIdRef.current,
        audioBlob,
      );

      const transcript = result.transcript?.trim() || "";

      if (!transcript) {
        setErrorMessage(
          "Could not understand the audio. Please try again or use text input.",
        );
        setState("error");
        isSubmittingRef.current = false;
        return;
      }

      setState("processing");
      callbackRef.current(transcript);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to transcribe your response. Please try again.",
      );
      setState("error");
    } finally {
      isSubmittingRef.current = false;
    }
  }, [stopMicStream]);

  // ── startListening ──────────────────────────────────────────
  /**
   * Opens an audio-only MediaRecorder.
   * Does NOT touch the existing camera stream.
   *
   * @param sessionId  The active interview session ID needed
   *                   to call the transcription endpoint.
   */
  const startListening = useCallback(
    async (sessionId: string) => {
      if (
        mediaRecorderRef.current ||
        isSubmittingRef.current
      ) {
        return;
      }

      setErrorMessage("");
      sessionIdRef.current = sessionId;
      audioChunksRef.current = [];

      try {
        /*
         * Request audio-only.  The camera stream opened by
         * AIInterview.tsx is completely separate and must not
         * be touched here.
         */
        const stream =
          await navigator.mediaDevices.getUserMedia({
            audio: true,
          });

        micStreamRef.current = stream;

        /*
         * Pick the most compatible MIME type.
         * Groq Whisper accepts audio/webm.
         */
        const mimeType =
          MediaRecorder.isTypeSupported(
            "audio/webm;codecs=opus",
          )
            ? "audio/webm;codecs=opus"
            : MediaRecorder.isTypeSupported("audio/webm")
              ? "audio/webm"
              : "";

        const recorder = mimeType
          ? new MediaRecorder(stream, { mimeType })
          : new MediaRecorder(stream);

        mediaRecorderRef.current = recorder;

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        // Collect data every second so chunks accumulate
        recorder.start(1000);

        setState("listening");
      } catch (error) {
        stopMicStream();
        mediaRecorderRef.current = null;

        const name =
          error instanceof DOMException ? error.name : "";

        setErrorMessage(
          name === "NotAllowedError" ||
            name === "SecurityError"
            ? "Microphone permission denied. Allow microphone access and try again."
            : name === "NotFoundError"
              ? "No microphone detected."
              : name === "NotReadableError"
                ? "Microphone is in use by another application."
                : "Unable to access the microphone. Check browser permissions.",
        );

        setState("error");
      }
    },
    [stopMicStream],
  );

  // ── speak ────────────────────────────────────────────────────
  /**
   * Speaks the question text via browser speechSynthesis (TTS).
   * Unchanged from original behaviour.
   */
  const speak = useCallback(
    (question: string) => {
      if (
        !question ||
        question === lastSpokenQuestionRef.current
      ) {
        return;
      }

      if (!window.speechSynthesis || !("SpeechSynthesisUtterance" in window)) {
        setErrorMessage("Voice playback is not supported by this browser.");
        setState("error");
        return;
      }

      lastSpokenQuestionRef.current = question;
      const speechSynthesis = window.speechSynthesis;
      speechSynthesis.cancel();
      speechSynthesis.resume();
      setState("speaking");

      const utterance = new SpeechSynthesisUtterance(
        question,
      );
      utterance.rate = 0.95;
      utterance.pitch = 1;
      utterance.volume = 1;

      // After AI finishes speaking the state returns to idle
      // so the candidate can click "Start Speaking"
      utterance.onend = () => setState("idle");
      utterance.onerror = () => setState("error");

      speechSynthesis.speak(utterance);
    },
    [],
  );

  // ── stop ─────────────────────────────────────────────────────
  /** Hard-stop everything (unmount / interview ends) */
  const stop = useCallback(() => {
    isSubmittingRef.current = true; // prevent re-entry

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }

    mediaRecorderRef.current = null;
    audioChunksRef.current = [];

    stopMicStream();
    window.speechSynthesis.cancel();

    setState("idle");
    isSubmittingRef.current = false;
  }, [stopMicStream]);

  // ── cleanup on unmount ───────────────────────────────────────
  useEffect(() => {
    return () => {
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
      }

      micStreamRef.current
        ?.getTracks()
        .forEach((track) => track.stop());

      window.speechSynthesis.cancel();
    };
  }, []);

  return {
    state,
    errorMessage,
    speak,
    startListening,
    finishListening,
    stop,
  };
}
