import React, { useState, useEffect, useRef } from 'react';
import { CallSession, User } from '../../types';
import { auraStorage } from '../../services/storage';
import { auraCallManager } from '../../services/webrtc';
import { soundEffects } from '../../services/audioSynthesis';
import { Avatar } from '../common/Avatar';
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  RefreshCw,
  Volume2,
  VolumeX,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface CallModalProps {
  session: CallSession | null;
  currentUser: User;
  onEndCall: () => void;
}

export const CallModal: React.FC<CallModalProps> = ({ session, currentUser, onEndCall }) => {
  const [callStatus, setCallStatus] = useState<'ringing' | 'connected' | 'ended'>('ringing');
  const [duration, setDuration] = useState(0);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!session) return;

    setCallStatus(session.status === 'connected' ? 'connected' : 'ringing');
    setDuration(0);

    // Audio tones
    if (session.direction === 'outgoing') {
      soundEffects.startRingback();

      // Auto-connect after 3.5s for realistic simulation
      const connectTimeout = setTimeout(async () => {
        handleConnect();
      }, 3500);

      return () => {
        clearTimeout(connectTimeout);
        soundEffects.stopCallSounds();
      };
    } else {
      soundEffects.startIncomingRingtone();
      return () => {
        soundEffects.stopCallSounds();
      };
    }
  }, [session?.id]);

  const handleConnect = async () => {
    soundEffects.stopCallSounds();
    soundEffects.playCallConnected();
    setCallStatus('connected');

    // Start call duration timer
    timerRef.current = window.setInterval(() => {
      setDuration((d) => d + 1);
    }, 1000);

    // Request media
    const isVideo = session?.type === 'video';
    const localStream = await auraCallManager.requestLocalMedia(isVideo, true, facingMode);
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }

    // Remote simulated peer stream
    if (session && remoteVideoRef.current) {
      const remoteStream = auraCallManager.createRemoteSimulationStream(session.peerName);
      remoteVideoRef.current.srcObject = remoteStream;
    }
  };

  const handleAccept = async () => {
    await handleConnect();
  };

  const handleDecline = () => {
    soundEffects.stopCallSounds();
    soundEffects.playCallEnded();

    if (session) {
      auraStorage.addCallHistoryItem({
        peerId: session.peerId,
        peerName: session.peerName,
        peerAvatar: session.peerAvatar,
        type: session.type,
        direction: 'missed',
        timestamp: Date.now(),
        duration: 0,
      });
    }

    auraCallManager.stopLocalMedia();
    onEndCall();
  };

  const handleEnd = () => {
    soundEffects.stopCallSounds();
    soundEffects.playCallEnded();

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (session) {
      auraStorage.addCallHistoryItem({
        peerId: session.peerId,
        peerName: session.peerName,
        peerAvatar: session.peerAvatar,
        type: session.type,
        direction: session.direction,
        timestamp: Date.now() - duration * 1000,
        duration,
      });
    }

    auraCallManager.stopLocalMedia();
    onEndCall();
  };

  const toggleMic = () => {
    const newState = auraCallManager.toggleAudio();
    setIsMicMuted(!newState);
  };

  const toggleCamera = () => {
    const newState = auraCallManager.toggleVideo();
    setIsVideoMuted(!newState);
  };

  const switchCamera = async () => {
    const result = await auraCallManager.switchCamera(facingMode);
    setFacingMode(result.newMode);
    if (result.stream && localVideoRef.current) {
      localVideoRef.current.srcObject = result.stream;
    }
  };

  if (!session) return null;

  const isVideoCall = session.type === 'video';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/98 select-none animate-in fade-in duration-200">
      <div className="relative w-full max-w-md h-full flex flex-col justify-between overflow-hidden bg-slate-950 sm:rounded-3xl shadow-2xl">
        {/* Remote Video Stream (or audio background) */}
        <div className="absolute inset-0 z-0 flex items-center justify-center bg-slate-950">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />

          {/* Vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/80 pointer-events-none" />
        </div>

        {/* Local Camera Floating PiP (Picture-in-Picture) */}
        {callStatus === 'connected' && isVideoCall && (
          <div className="absolute top-16 right-4 z-20 w-28 h-40 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 bg-slate-900">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {isVideoMuted && (
              <div className="absolute inset-0 bg-slate-900/90 flex items-center justify-center text-slate-400">
                <VideoOff className="w-5 h-5" />
              </div>
            )}
          </div>
        )}

        {/* Top Bar */}
        <div className="relative z-20 pt-6 px-6 flex flex-col items-center text-center">
          <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-[11px] text-emerald-400 border border-emerald-500/20 mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>End-to-End Encrypted</span>
          </div>

          <Avatar src={session.peerAvatar} name={session.peerName} size="2xl" />

          <h2 className="text-xl font-bold text-white mt-3">{session.peerName}</h2>
          <p className="text-xs text-slate-300 font-medium mt-1">
            {callStatus === 'ringing'
              ? session.direction === 'incoming'
                ? 'Incoming ' + (isVideoCall ? 'Video' : 'Audio') + ' Call...'
                : 'Calling...'
              : `Connected • ${Math.floor(duration / 60)}:${(duration % 60)
                  .toString()
                  .padStart(2, '0')}`}
          </p>
        </div>

        {/* Bottom Call Controls */}
        <div className="relative z-20 pb-10 px-6">
          {callStatus === 'ringing' && session.direction === 'incoming' ? (
            /* Incoming call Answer / Decline buttons */
            <div className="flex items-center justify-around max-w-xs mx-auto">
              <button
                onClick={handleDecline}
                className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-600/40 transition active:scale-95"
                title="Decline"
              >
                <PhoneOff className="w-7 h-7" />
              </button>
              <button
                onClick={handleAccept}
                className="w-16 h-16 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-600/40 transition active:scale-95 animate-bounce"
                title="Accept"
              >
                <Phone className="w-7 h-7" />
              </button>
            </div>
          ) : (
            /* Connected or Outgoing call In-call Controls */
            <div className="flex flex-col items-center gap-6">
              {/* Secondary toggles */}
              <div className="flex items-center justify-center gap-4 bg-black/40 backdrop-blur-md p-2 rounded-3xl border border-white/10">
                <button
                  onClick={toggleMic}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition ${
                    isMicMuted ? 'bg-rose-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                  title={isMicMuted ? 'Unmute Mic' : 'Mute Mic'}
                >
                  {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                {isVideoCall && (
                  <>
                    <button
                      onClick={toggleCamera}
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition ${
                        isVideoMuted ? 'bg-rose-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                      title={isVideoMuted ? 'Turn on Camera' : 'Turn off Camera'}
                    >
                      {isVideoMuted ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                    </button>

                    <button
                      onClick={switchCamera}
                      className="w-12 h-12 rounded-2xl bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition"
                      title="Flip Camera"
                    >
                      <RefreshCw className="w-5 h-5" />
                    </button>
                  </>
                )}

                <button
                  onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition ${
                    !isSpeakerOn ? 'bg-slate-700 text-slate-300' : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                  title="Toggle Speaker"
                >
                  {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </button>
              </div>

              {/* End Call Button */}
              <button
                onClick={handleEnd}
                className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-xl shadow-rose-600/50 transition active:scale-95"
                title="End Call"
              >
                <PhoneOff className="w-7 h-7" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
