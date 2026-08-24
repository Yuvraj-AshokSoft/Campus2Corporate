import { useCallback, useEffect, useRef, useState } from "react";

interface UseInterviewVideoOptions {
  onRecordingComplete?: (video: Blob) => void | Promise<void>;
}

export function useInterviewVideo(
  options: UseInterviewVideoOptions = {},
) {
  const { onRecordingComplete } = options;

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef =
    useRef<MediaRecorder | null>(null);

  const recordedChunksRef = useRef<Blob[]>([]);

  const [stream, setStream] =
    useState<MediaStream | null>(null);

  const [isCameraReady, setIsCameraReady] =
    useState(false);

  const [isRecording, setIsRecording] =
    useState(false);

  const [cameraEnabled, setCameraEnabled] =
    useState(true);

  const [microphoneEnabled, setMicrophoneEnabled] =
    useState(true);

  const [error, setError] = useState("");

  /*
   * Start camera + microphone
   */
  const startCamera = useCallback(async () => {
    setError("");

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error(
          "Camera and microphone are not supported by this browser.",
        );
      }

      const mediaStream =
        await navigator.mediaDevices.getUserMedia({
          video: {
            width: {
              ideal: 1280,
            },
            height: {
              ideal: 720,
            },
            facingMode: "user",
          },
          audio: true,
        });

      streamRef.current = mediaStream;
      setStream(mediaStream);

      setCameraEnabled(true);
      setMicrophoneEnabled(true);
      setIsCameraReady(true);

      if (videoRef.current) {
        videoRef.current.srcObject =
          mediaStream;
      }

      return mediaStream;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to access camera and microphone.";

      setError(message);
      setIsCameraReady(false);

      return null;
    }
  }, []);

  /*
   * Attach stream to video element
   */
  const attachVideo = useCallback(
    (element: HTMLVideoElement | null) => {
      videoRef.current = element;

      if (element && streamRef.current) {
        element.srcObject =
          streamRef.current;
      }
    },
    [],
  );

  /*
   * Start recording
   */
  const startRecording = useCallback(() => {
    const currentStream =
      streamRef.current;

    if (!currentStream) {
      setError(
        "Camera and microphone must be enabled before recording.",
      );
      return false;
    }

    if (
      !("MediaRecorder" in window)
    ) {
      setError(
        "Video recording is not supported by this browser.",
      );
      return false;
    }

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !==
        "inactive"
    ) {
      return false;
    }

    recordedChunksRef.current = [];

    const preferredMimeTypes = [
      "video/webm;codecs=vp9,opus",
      "video/webm;codecs=vp8,opus",
      "video/webm",
    ];

    const supportedMimeType =
      preferredMimeTypes.find((mimeType) =>
        MediaRecorder.isTypeSupported(
          mimeType,
        ),
      );

    try {
      const recorder = supportedMimeType
        ? new MediaRecorder(
            currentStream,
            {
              mimeType:
                supportedMimeType,
            },
          )
        : new MediaRecorder(
            currentStream,
          );

      mediaRecorderRef.current =
        recorder;

      recorder.ondataavailable = (
        event,
      ) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(
            event.data,
          );
        }
      };

      recorder.onerror = () => {
        setError(
          "An error occurred while recording the interview.",
        );

        setIsRecording(false);
      };

      recorder.onstop = async () => {
        const chunks =
          recordedChunksRef.current;

        if (chunks.length === 0) {
          setIsRecording(false);
          return;
        }

        const videoBlob = new Blob(
          chunks,
          {
            type:
              supportedMimeType ||
              "video/webm",
          },
        );

        recordedChunksRef.current = [];

        setIsRecording(false);

        if (onRecordingComplete) {
          try {
            await onRecordingComplete(
              videoBlob,
            );
          } catch (err) {
            setError(
              err instanceof Error
                ? err.message
                : "Unable to process the interview recording.",
            );
          }
        }
      };

      recorder.start(1000);

      setIsRecording(true);

      return true;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to start video recording.",
      );

      return false;
    }
  }, [onRecordingComplete]);

  /*
   * Stop recording
   */
  const stopRecording = useCallback(() => {
    const recorder =
      mediaRecorderRef.current;

    if (
      !recorder ||
      recorder.state === "inactive"
    ) {
      setIsRecording(false);
      return;
    }

    recorder.stop();
    mediaRecorderRef.current = null;
  }, []);

  /*
   * Toggle camera
   */
  const toggleCamera = useCallback(() => {
    const currentStream =
      streamRef.current;

    if (!currentStream) {
      return;
    }

    const videoTracks =
      currentStream.getVideoTracks();

    const nextState = !cameraEnabled;

    videoTracks.forEach((track) => {
      track.enabled = nextState;
    });

    setCameraEnabled(nextState);
  }, [cameraEnabled]);

  /*
   * Toggle microphone
   */
  const toggleMicrophone = useCallback(() => {
    const currentStream =
      streamRef.current;

    if (!currentStream) {
      return;
    }

    const audioTracks =
      currentStream.getAudioTracks();

    const nextState =
      !microphoneEnabled;

    audioTracks.forEach((track) => {
      track.enabled = nextState;
    });

    setMicrophoneEnabled(nextState);
  }, [microphoneEnabled]);

  /*
   * Stop camera + microphone
   */
  const stopCamera = useCallback(() => {
    const currentStream =
      streamRef.current;

    if (currentStream) {
      currentStream
        .getTracks()
        .forEach((track) => {
          track.stop();
        });
    }

    streamRef.current = null;

    setStream(null);
    setIsCameraReady(false);
    setCameraEnabled(false);
    setMicrophoneEnabled(false);

    if (videoRef.current) {
      videoRef.current.srcObject =
        null;
    }
  }, []);

  /*
   * Cleanup when component unmounts
   */
  useEffect(() => {
    return () => {
      const recorder =
        mediaRecorderRef.current;

      if (
        recorder &&
        recorder.state !== "inactive"
      ) {
        recorder.stop();
      }

      const currentStream =
        streamRef.current;

      if (currentStream) {
        currentStream
          .getTracks()
          .forEach((track) => {
            track.stop();
          });
      }
    };
  }, []);

  return {
    videoRef,
    stream,

    isCameraReady,
    isRecording,

    cameraEnabled,
    microphoneEnabled,

    error,

    startCamera,
    attachVideo,

    startRecording,
    stopRecording,

    toggleCamera,
    toggleMicrophone,

    stopCamera,
  };
}