import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import {
  PhoneOff,
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  Volume2,
  Maximize2,
  ShieldCheck,
  Radio
} from 'lucide-react';
import { motion } from 'motion/react';

export const VoiceVideoCallModal: React.FC = () => {
  const { activeCallModal, setActiveCallModal } = useStore();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    if (activeCallModal) {
      const timer = setInterval(() => {
        setCallDuration((s) => s + 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setCallDuration(0);
    }
  }, [activeCallModal]);

  if (!activeCallModal) return null;

  const { type, user } = activeCallModal;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-lg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col relative text-white"
      >
        {/* Header Status */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              ReadyNest Encrypted {type === 'video' ? 'Video Call' : 'Voice Call'}
            </span>
          </div>
          <span className="text-xs font-mono font-medium text-slate-300">
            {formatTime(callDuration)}
          </span>
        </div>

        {/* Main Call Stage */}
        <div className="relative min-h-[380px] bg-slate-950 flex flex-col items-center justify-center p-8 overflow-hidden">
          {type === 'video' && !isVideoOff ? (
            <div className="absolute inset-0 bg-slate-900">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full object-cover filter brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40"></div>
            </div>
          ) : null}

          {/* User Avatar & Waveforms */}
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="relative mb-4">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-28 h-28 rounded-full object-cover border-4 border-emerald-500/40 shadow-2xl"
              />
              <div className="absolute -inset-2 rounded-full border border-emerald-500/30 animate-ping pointer-events-none"></div>
            </div>
            <h3 className="text-xl font-bold text-white drop-shadow-md">{user.name}</h3>
            <p className="text-xs text-emerald-400 font-medium mt-1 drop-shadow flex items-center gap-1 justify-center">
              <ShieldCheck className="w-3.5 h-3.5" /> 256-Bit Encrypted HD Stream
            </p>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="p-6 bg-slate-950 border-t border-slate-800 flex items-center justify-center gap-4 z-10">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3.5 rounded-2xl border transition-all ${
              isMuted
                ? 'bg-rose-600 border-rose-500 text-white'
                : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
            }`}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {type === 'video' && (
            <button
              onClick={() => setIsVideoOff(!isVideoOff)}
              className={`p-3.5 rounded-2xl border transition-all ${
                isVideoOff
                  ? 'bg-rose-600 border-rose-500 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
              }`}
            >
              {isVideoOff ? <VideoOff className="w-5 h-5" /> : <VideoIcon className="w-5 h-5" />}
            </button>
          )}

          <button
            onClick={() => setActiveCallModal(null)}
            className="px-6 py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-rose-950/50 flex items-center gap-2"
          >
            <PhoneOff className="w-5 h-5" />
            <span>End Call</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
