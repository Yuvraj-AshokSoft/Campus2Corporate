import { useCallback, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  finishAIInterview,
  getAIInterviewResult,
  respondToAIInterview,
  startAIInterview,
  uploadInterviewRecording,
} from "../services/aiInterviewApi";
import type {
  AIInterviewSession,
  InterviewMessage,
  InterviewResult,
} from "../types/interview";

export function useAIInterview() {
  const { driveId } = useParams<{ driveId: string }>();

  const [session, setSession] =
    useState<AIInterviewSession | null>(null);

  const [messages, setMessages] =
    useState<InterviewMessage[]>([]);

  const [questionNumber, setQuestionNumber] =
    useState(1);

  const [totalQuestions, setTotalQuestions] =
    useState(2);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [result, setResult] =
    useState<InterviewResult | null>(null);

  const [isCameraReady, setIsCameraReady] =
    useState(false);

  const [isRecording, setIsRecording] =
    useState(false);

  const mediaRecorderRef =
    useRef<MediaRecorder | null>(null);

  const recordedChunksRef =
    useRef<Blob[]>([]);

  /*
   * Start AI interview
   */
  const startInterview = useCallback(async () => {
    if (!driveId || session) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await startAIInterview({
        driveId,
      });

      setSession(response.session);

      setTotalQuestions(
        response.session.totalQuestions || 2,
      );

      setQuestionNumber(1);

      if (response.firstQuestion) {
        setMessages([
          {
            id: `question-${Date.now()}`,
            role: "ai",
            content: response.firstQuestion,
            questionId:
              response.currentQuestion?.questionId,
            createdAt: new Date().toISOString(),
          },
        ]);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to start the AI interview.",
      );
    } finally {
      setLoading(false);
    }
  }, [driveId, session]);

  /*
   * Submit candidate answer
   */
  const submitAnswer = useCallback(
    async (answer: string) => {
      if (!session || !answer.trim()) {
        return;
      }

      setLoading(true);
      setError("");

      const candidateMessage: InterviewMessage = {
        id: `answer-${Date.now()}`,
        role: "candidate",
        content: answer.trim(),
        createdAt: new Date().toISOString(),
      };

      setMessages((previous) => [
        ...previous,
        candidateMessage,
      ]);

      try {
        const activeQuestion = messages
          .filter((message) => message.role === "ai")
          .at(-1);

        const response = await respondToAIInterview({
          sessionId: session.sessionId,
          questionId:
            activeQuestion?.questionId,
          question:
            activeQuestion?.content,
          answer: answer.trim(),
        });

        const evaluation = response.evaluation;

        if (evaluation) {
          setMessages((previous) => [
            ...previous,
            {
              id: `feedback-${Date.now()}`,
              role: "ai",
              content: evaluation.feedback,
              createdAt: new Date().toISOString(),
            },
          ]);
        }

        const nextQuestion =
          response.nextQuestion;

        if (nextQuestion) {
          setQuestionNumber((current) => current + 1);

          setMessages((previous) => [
            ...previous,
            {
              id: `question-${Date.now()}`,
              role: "ai",
              content: nextQuestion,
              questionId:
                response.currentQuestion?.questionId,
              createdAt: new Date().toISOString(),
            },
          ]);
        }

        if (response.completed) {
          await finishInterview();
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to process your answer.",
        );
      } finally {
        setLoading(false);
      }
    },
    [messages, session],
  );

  /*
   * Start browser recording
   *
   * The actual camera stream will be supplied by the
   * browser when the interview video component is connected.
   */
  const startRecording = useCallback(async () => {
    try {
      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

      setIsCameraReady(true);

      recordedChunksRef.current = [];

      const mimeType =
        MediaRecorder.isTypeSupported(
          "video/webm;codecs=vp9,opus",
        )
          ? "video/webm;codecs=vp9,opus"
          : "video/webm";

      const recorder = new MediaRecorder(
        stream,
        {
          mimeType,
        },
      );

      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(
            event.data,
          );
        }
      };

      recorder.onstop = async () => {
        const videoBlob = new Blob(
          recordedChunksRef.current,
          {
            type: mimeType,
          },
        );

        if (session && videoBlob.size > 0) {
          try {
            await uploadInterviewRecording(
              session.sessionId,
              videoBlob,
            );
          } catch (err) {
            setError(
              err instanceof Error
                ? err.message
                : "Unable to upload interview recording.",
            );
          }
        }

        stream
          .getTracks()
          .forEach((track) => track.stop());

        setIsCameraReady(false);
      };

      recorder.start(1000);

      setIsRecording(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Camera and microphone permission is required.",
      );

      setIsCameraReady(false);
    }
  }, [session]);

  /*
   * Stop recording
   */
  const stopRecording = useCallback(async () => {
    const recorder = mediaRecorderRef.current;

    if (!recorder) {
      return;
    }

    if (recorder.state !== "inactive") {
      recorder.stop();
    }

    mediaRecorderRef.current = null;
    setIsRecording(false);
  }, []);

  /*
   * Finish interview
   */
  const finishInterview = useCallback(async () => {
    if (!session) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
      }

      const response =
        await finishAIInterview(
          session.sessionId,
        );

      const resultResponse =
        await getAIInterviewResult(
          session.sessionId,
        );

      setResult(
        resultResponse.result ||
          response.result,
      );

      setSession((previous) =>
        previous
          ? {
              ...previous,
              status: "completed",
            }
          : previous,
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to finish the interview.",
      );
    } finally {
      setLoading(false);
      setIsRecording(false);
    }
  }, [session]);

  return {
    session,
    messages,
    questionNumber,
    totalQuestions,
    loading,
    error,
    result,
    isCameraReady,
    isRecording,

    startInterview,
    submitAnswer,
    finishInterview,

    startRecording,
    stopRecording,
  };
}
