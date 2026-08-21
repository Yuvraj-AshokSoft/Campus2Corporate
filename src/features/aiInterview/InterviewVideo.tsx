import { useEffect, useRef, useState } from "react";
import {
  Camera,
  CameraOff,
  Loader2,
  Mic,
  MicOff,
  Square,
  Video,
} from "lucide-react";

interface InterviewVideoProps {
  isCameraReady?: boolean;
  isRecording?: boolean;
  onStartRecording?: () => void | Promise<void>;
  onStopRecording?: () => void | Promise<void>;
}

export default function InterviewVideo({
  isCameraReady = false,
  isRecording = false,
  onStartRecording,
  onStopRecording,
}: InterviewVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraLoading, setCameraLoading] = useState(true);
  const [cameraError, setCameraError] = useState("");

  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);

  useEffect(() => {
    let mounted = true;
    let localStream: MediaStream | null = null;

    const startCamera = async () => {
      setCameraLoading(true);
      setCameraError("");

      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error(
            "Camera and microphone access is not supported by this browser.",
          );
        }

        localStream =
          await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 1280 },
              height: { ideal: 720 },
              facingMode: "user",
            },
            audio: true,
          });

        if (!mounted) {
          localStream.getTracks().forEach((track) => track.stop());
          return;
        }

        setStream(localStream);
        setCameraEnabled(true);
        setMicEnabled(true);

        if (videoRef.current) {
          videoRef.current.srcObject = localStream;
        }
      } catch (error) {
        if (!mounted) return;

        setCameraError(
          error instanceof Error
            ? error.message
            : "Unable to access your camera and microphone.",
        );
      } finally {
        if (mounted) {
          setCameraLoading(false);
        }
      }
    };

    startCamera();

    return () => {
      mounted = false;

      if (localStream) {
        localStream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, []);

  useEffect(() => {
    if (!videoRef.current || !stream) {
      return;
    }

    videoRef.current.srcObject = stream;
  }, [stream]);

  const toggleCamera = () => {
    if (!stream) return;

    const videoTracks = stream.getVideoTracks();

    videoTracks.forEach((track) => {
      track.enabled = !cameraEnabled;
    });

    setCameraEnabled((enabled) => !enabled);
  };

  const toggleMicrophone = () => {
    if (!stream) return;

    const audioTracks = stream.getAudioTracks();

    audioTracks.forEach((track) => {
      track.enabled = !micEnabled;
    });

    setMicEnabled((enabled) => !enabled);
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Live Interview
          </p>

          <h2 className="mt-0.5 text-sm font-black text-slate-900">
            Camera & Recording
          </h2>
        </div>

        {isRecording && (
          <div className="flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-bold text-rose-600">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-500" />
            Recording
          </div>
        )}
      </div>

      {/* Video */}
      <div className="relative aspect-video bg-slate-950">

        {cameraLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950 text-center">
            <Loader2 className="h-7 w-7 animate-spin text-white" />

            <p className="mt-3 text-xs font-semibold text-white">
              Starting camera...
            </p>

            <p className="mt-1 max-w-[240px] text-[10px] leading-4 text-slate-400">
              Please allow camera and microphone permissions.
            </p>
          </div>
        )}

        {cameraError && !cameraLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
            <CameraOff className="h-8 w-8 text-slate-500" />

            <p className="mt-3 text-xs font-bold text-white">
              Camera unavailable
            </p>

            <p className="mt-1 text-[10px] leading-4 text-slate-400">
              {cameraError}
            </p>
          </div>
        )}

        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className={`h-full w-full object-cover ${
            cameraEnabled ? "block" : "hidden"
          }`}
        />

        {!cameraEnabled && !cameraLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-800">
              <CameraOff className="h-7 w-7 text-slate-400" />
            </div>
          </div>
        )}

        {/* Recording indicator */}
        {isRecording && (
          <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 backdrop-blur-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-rose-500" />

            <span className="text-[10px] font-bold text-white">
              REC
            </span>
          </div>
        )}

        {/* Camera / Mic status */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <StatusBadge
            active={cameraEnabled}
            icon={
              cameraEnabled ? (
                <Camera className="h-3 w-3" />
              ) : (
                <CameraOff className="h-3 w-3" />
              )
            }
            label={cameraEnabled ? "Camera" : "Camera Off"}
          />

          <StatusBadge
            active={micEnabled}
            icon={
              micEnabled ? (
                <Mic className="h-3 w-3" />
              ) : (
                <MicOff className="h-3 w-3" />
              )
            }
            label={micEnabled ? "Mic" : "Mic Off"}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="p-4">

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleCamera}
            disabled={!stream}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold transition ${
              cameraEnabled
                ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                : "bg-rose-50 text-rose-600 hover:bg-rose-100"
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {cameraEnabled ? (
              <Camera className="h-4 w-4" />
            ) : (
              <CameraOff className="h-4 w-4" />
            )}

            {cameraEnabled ? "Camera On" : "Camera Off"}
          </button>

          <button
            type="button"
            onClick={toggleMicrophone}
            disabled={!stream}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold transition ${
              micEnabled
                ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                : "bg-rose-50 text-rose-600 hover:bg-rose-100"
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {micEnabled ? (
              <Mic className="h-4 w-4" />
            ) : (
              <MicOff className="h-4 w-4" />
            )}

            {micEnabled ? "Mic On" : "Mic Off"}
          </button>
        </div>

        {/* Recording button */}
        <button
          type="button"
          disabled={!stream || !isCameraReady}
          onClick={
            isRecording
              ? onStopRecording
              : onStartRecording
          }
          className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-bold transition ${
            isRecording
              ? "bg-rose-600 text-white hover:bg-rose-700"
              : "bg-[#5400D6] text-white hover:bg-[#4500AD]"
          } disabled:cursor-not-allowed disabled:opacity-40`}
        >
          {isRecording ? (
            <>
              <Square className="h-3.5 w-3.5 fill-current" />
              Stop Recording
            </>
          ) : (
            <>
              <Video className="h-4 w-4" />
              Start Recording
            </>
          )}
        </button>

        <p className="mt-3 text-center text-[10px] leading-4 text-slate-400">
          Your interview video is recorded for AI-assisted
          evaluation and interview review.
        </p>
      </div>
    </section>
  );
}

function StatusBadge({
  active,
  icon,
  label,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div
      className={`flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[9px] font-bold backdrop-blur-sm ${
        active
          ? "bg-black/60 text-white"
          : "bg-rose-500/80 text-white"
      }`}
    >
      {icon}
      {label}
    </div>
  );
}