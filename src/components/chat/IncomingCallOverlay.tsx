import React from 'react';
import { useStore } from '../../store/useStore';
import { Phone, PhoneOff, Video, ShieldCheck, Radio } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const IncomingCallOverlay: React.FC = () => {
  const { incomingCall, acceptIncomingCall, rejectIncomingCall } = useStore();

  if (!incomingCall) return null;

  const { caller, type } = incomingCall;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: -20 }}
          className="w-full max-w-md bg-slate-900 border border-emerald-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col items-center p-8 relative text-white text-center"
        >
          {/* Header Tag */}
          <div className="flex items-center gap-2 mb-6 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
              Incoming {type === 'video' ? 'Video' : 'Voice'} Call
            </span>
          </div>

          {/* Caller Avatar with Ring Animation */}
          <div className="relative mb-6">
            <img
              src={caller.avatar}
              alt={caller.name}
              className="w-28 h-28 rounded-full object-cover border-4 border-emerald-500 shadow-2xl relative z-10"
            />
            <div className="absolute -inset-3 rounded-full border-2 border-emerald-400/50 animate-ping pointer-events-none"></div>
            <div className="absolute -inset-6 rounded-full border border-emerald-500/20 animate-pulse pointer-events-none"></div>
          </div>

          {/* Caller Name & Status */}
          <h2 className="text-2xl font-black text-white drop-shadow-md">{caller.name}</h2>
          <p className="text-xs text-slate-400 mt-1 font-medium">{caller.email}</p>
          <p className="text-xs text-emerald-400 font-semibold mt-3 flex items-center justify-center gap-1">
            <ShieldCheck className="w-4 h-4" /> ReadyNest HD Encrypted Signal
          </p>

          {/* Call Actions (Accept / Reject) */}
          <div className="flex items-center justify-center gap-6 mt-8 w-full">
            <button
              onClick={rejectIncomingCall}
              className="flex-1 py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-rose-950/50 flex items-center justify-center gap-2 cursor-pointer"
            >
              <PhoneOff className="w-5 h-5" />
              <span>Decline</span>
            </button>

            <button
              onClick={acceptIncomingCall}
              className="flex-1 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-2xl transition-all shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 cursor-pointer animate-bounce"
            >
              {type === 'video' ? <Video className="w-5 h-5" /> : <Phone className="w-5 h-5" />}
              <span>Accept</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
