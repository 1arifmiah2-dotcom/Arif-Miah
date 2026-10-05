import React, { useState, useEffect, useRef } from 'react';
import { X, Camera, Video, RefreshCw, Check, Sparkles } from 'lucide-react';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapturePhoto: (blobUrl: string) => void;
  onRecordVideo: (blobUrl: string) => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({
  isOpen,
  onClose,
  onCapturePhoto,
  onRecordVideo,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [mode, setMode] = useState<'photo' | 'video'>('photo');
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) {
      cleanup();
      return;
    }

    startCamera(facingMode);

    return () => {
      cleanup();
    };
  }, [isOpen, facingMode]);

  const startCamera = async (facing: 'user' | 'environment') => {
    cleanup();
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: facing }, width: { ideal: 640 }, height: { ideal: 480 } },
        audio: true,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.warn('Could not start hardware camera:', err);
    }
  };

  const cleanup = () => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRecording(false);
    setRecordSeconds(0);
  };

  const flipCamera = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  const handleTakePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    onCapturePhoto(dataUrl);
    cleanup();
    onClose();
  };

  const handleStartRecording = () => {
    if (!stream) return;
    videoChunksRef.current = [];
    const mr = new MediaRecorder(stream);
    mr.ondataavailable = (e) => {
      if (e.data.size > 0) videoChunksRef.current.push(e.data);
    };
    mr.onstop = () => {
      const blob = new Blob(videoChunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      onRecordVideo(url);
      cleanup();
      onClose();
    };
    mr.start();
    mediaRecorderRef.current = mr;
    setIsRecording(true);
    setRecordSeconds(0);

    timerRef.current = window.setInterval(() => {
      setRecordSeconds((s) => s + 1);
    }, 1000);
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 select-none animate-in fade-in duration-150">
      <div className="relative w-full max-w-md h-full flex flex-col justify-between overflow-hidden bg-black sm:rounded-3xl shadow-2xl">
        {/* Top Controls */}
        <div className="relative z-20 pt-4 px-4 flex items-center justify-between text-white">
          <button
            onClick={() => { cleanup(); onClose(); }}
            className="p-2 rounded-full bg-black/40 hover:bg-white/20 backdrop-blur-md transition"
          >
            <X className="w-5 h-5" />
          </button>

          {isRecording && (
            <div className="flex items-center gap-2 bg-rose-600/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold animate-pulse">
              <span className="w-2 h-2 rounded-full bg-white" />
              <span>
                {Math.floor(recordSeconds / 60)}:
                {(recordSeconds % 60).toString().padStart(2, '0')}
              </span>
            </div>
          )}

          <button
            onClick={flipCamera}
            className="p-2 rounded-full bg-black/40 hover:bg-white/20 backdrop-blur-md transition"
            title="Switch Camera"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* Live Camera Viewfinder */}
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          {!stream && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <Camera className="w-12 h-12 mb-3 text-slate-600 animate-pulse" />
              <p className="text-xs font-semibold text-white">Connecting to Camera...</p>
              <p className="text-[11px] text-slate-500 mt-1">Please allow camera permissions if prompted</p>
            </div>
          )}
        </div>

        {/* Bottom Shutter Controls */}
        <div className="relative z-20 pb-8 px-6 flex flex-col items-center gap-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          {/* Mode Switcher */}
          <div className="flex items-center gap-4 bg-black/50 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-semibold text-slate-300 border border-white/10">
            <button
              onClick={() => setMode('photo')}
              className={`transition ${mode === 'photo' ? 'text-indigo-400 font-bold' : 'hover:text-white'}`}
            >
              Photo
            </button>
            <button
              onClick={() => setMode('video')}
              className={`transition ${mode === 'video' ? 'text-indigo-400 font-bold' : 'hover:text-white'}`}
            >
              Video
            </button>
          </div>

          {/* Shutter Button */}
          {mode === 'photo' ? (
            <button
              onClick={handleTakePhoto}
              className="w-18 h-18 rounded-full border-4 border-white p-1 flex items-center justify-center transition active:scale-95 shadow-xl hover:scale-105"
            >
              <div className="w-full h-full rounded-full bg-white" />
            </button>
          ) : (
            <button
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              className={`w-18 h-18 rounded-full border-4 border-white p-1 flex items-center justify-center transition active:scale-95 shadow-xl ${
                isRecording ? 'border-rose-500' : ''
              }`}
            >
              <div
                className={`transition-all duration-200 ${
                  isRecording
                    ? 'w-6 h-6 rounded-md bg-rose-500'
                    : 'w-full h-full rounded-full bg-rose-500'
                }`}
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
