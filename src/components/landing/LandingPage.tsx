import React from 'react';
import { ReadyNestLogo } from '../common/ReadyNestLogo';
import { useStore } from '../../store/useStore';
import {
  MessageSquare,
  ShieldCheck,
  Zap,
  Sparkles,
  PhoneCall,
  Video,
  UserPlus,
  LogIn,
  ArrowRight,
  CheckCircle2,
  Lock,
  Globe,
  Sun,
  Moon,
  Layers,
  Smile,
  CheckCheck,
  Code
} from 'lucide-react';
import { motion } from 'motion/react';

export const LandingPage: React.FC = () => {
  const { setAuthPageMode, isDarkMode, toggleDarkMode } = useStore();

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      {/* Top Header Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 lg:px-12 py-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-600 rounded-xl text-white shadow-md shadow-emerald-600/20">
            <ReadyNestLogo size={28} variant="icon" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">ReadyNest</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 rounded-full border border-emerald-300/60 dark:border-emerald-800/60">
                v2.5
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
              Enterprise Real-Time Messenger & AI Platform
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Dark / Light Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            title="Toggle theme mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-emerald-700" />}
          </button>

          {/* Login & Register Buttons */}
          <button
            onClick={() => setAuthPageMode('signin')}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-600 text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5" />
            Sign In
          </button>

          <button
            onClick={() => setAuthPageMode('signup')}
            className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md shadow-emerald-700/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Create Account
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-24 px-4 lg:px-12 max-w-7xl mx-auto w-full flex flex-col items-center text-center">
        {/* Subtle Background Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 max-w-3xl space-y-6"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold shadow-sm">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Powered by Gemini 3.6 Flash & WebSockets</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
            Real-Time Messaging with{' '}
            <span className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
              ReadyNest Messenger
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
            Experience sub-100ms real-time chat, AI conversation summaries, HD video calls, and group workspace collaboration in a crisp, modern interface.
          </p>

          {/* Primary Call To Actions */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={() => setAuthPageMode('signin')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-xl shadow-emerald-700/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              Sign In to Workspace
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setAuthPageMode('signup')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-emerald-600/40 hover:border-emerald-600 text-emerald-800 dark:text-emerald-300 font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-emerald-600" />
              Create New Account
            </button>
          </div>

          {/* Feature Micro-Badges */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-semibold">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Sub-100ms Speed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Gemini 3.6 Flash AI</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Voice & Video Calls</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>End-to-End Encrypted</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Interactive Chat UI Preview Mockup */}
      <section className="px-4 lg:px-12 max-w-6xl mx-auto w-full mb-20">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
          {/* Mock Window Header */}
          <div className="bg-emerald-900 text-white px-5 py-3 flex items-center justify-between border-b border-emerald-800">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-xs font-bold text-emerald-100">ReadyNest Messenger — Active Workspace</span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-200 px-2.5 py-0.5 rounded-full bg-emerald-800/80">
              🟢 Connected
            </span>
          </div>

          {/* Mock Chat Content */}
          <div className="p-6 md:p-8 bg-slate-50 dark:bg-slate-950 grid md:grid-cols-3 gap-6">
            {/* Left Mock Users */}
            <div className="space-y-3 hidden md:block">
              <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-emerald-500/30 shadow-sm flex items-center gap-3">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80"
                    alt="AI Assistant"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white absolute bottom-0 right-0" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">ReadyNest AI Assistant</h4>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Online • Gemini 3.6</p>
                </div>
              </div>

              <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-3 opacity-80">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                  alt="Archit Shakya"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Archit Shakya (Admin)</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Available for project chat</p>
                </div>
              </div>
            </div>

            {/* Main Mock Messages */}
            <div className="md:col-span-2 space-y-4">
              {/* User Msg */}
              <div className="flex items-start gap-3 justify-end">
                <div className="bg-emerald-700 text-white p-3.5 rounded-2xl rounded-tr-none text-xs max-w-sm shadow-md">
                  <p>Hello! What is today's date and how can ReadyNest help my team?</p>
                  <span className="text-[9px] text-emerald-200 mt-1 block text-right flex items-center justify-end gap-1">
                    Just now <CheckCheck className="w-3 h-3 text-emerald-300" />
                  </span>
                </div>
              </div>

              {/* AI Msg */}
              <div className="flex items-start gap-3">
                <img
                  src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80"
                  alt="AI Assistant"
                  className="w-8 h-8 rounded-full object-cover border border-emerald-500"
                />
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl rounded-tl-none text-xs max-w-md shadow-sm text-slate-800 dark:text-slate-200 space-y-2">
                  <p className="font-bold text-emerald-700 dark:text-emerald-400">🤖 ReadyNest AI Assistant:</p>
                  <p>Today is <strong>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>.</p>
                  <p className="text-slate-600 dark:text-slate-400">
                    ReadyNest Messenger empowers your team with real-time chat, AI summarization, HD video calling, and white & green theme aesthetics!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="py-16 px-4 lg:px-12 max-w-7xl mx-auto w-full border-t border-slate-200 dark:border-slate-800">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Designed for Speed, Security, and Clarity
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
            Everything you need for seamless communication in one clean, white & green workspace.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 shadow-sm hover:shadow-lg transition-all space-y-3 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Sub-100ms WebSockets</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Instant real-time message delivery with live typing indicators, online presence, and double tick read receipts.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 shadow-sm hover:shadow-lg transition-all space-y-3 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Gemini 3.6 Flash AI</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Built-in AI assistant to answer questions, generate code snippets, and produce 1-click conversation summaries.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 shadow-sm hover:shadow-lg transition-all space-y-3 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <PhoneCall className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">HD Voice & Video Calls</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              In-app peer audio and video calling with screen controls, mute/unmute, and call duration logs.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 shadow-sm hover:shadow-lg transition-all space-y-3 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">End-to-End Encrypted</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Enterprise security standards ensuring your private conversations remain protected and secure.
            </p>
          </div>

          {/* Card 5 */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 shadow-sm hover:shadow-lg transition-all space-y-3 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Status Stories & Media</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Share status stories with custom duration, image attachments, voice notes, and document sharing.
            </p>
          </div>

          {/* Card 6 */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 shadow-sm hover:shadow-lg transition-all space-y-3 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Smile className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">White & Emerald Theme</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Clean white default aesthetic with vibrant emerald green accents designed for maximum legibility and focus.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="py-16 px-4 lg:px-12 max-w-5xl mx-auto w-full my-8">
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-950 rounded-3xl p-8 lg:p-12 text-center text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-xl mx-auto space-y-5">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              Ready to experience ReadyNest Messenger?
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/90 font-medium leading-relaxed">
              Sign in to your account or create a new profile in seconds to start chatting in real-time.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setAuthPageMode('signin')}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white text-emerald-950 font-bold text-xs shadow-lg hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-emerald-800" />
                Sign In to Workspace
              </button>
              <button
                onClick={() => setAuthPageMode('signup')}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-800 border border-emerald-600 text-white font-bold text-xs shadow-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-emerald-200" />
                Create New Account
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 lg:px-12 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ReadyNestLogo size={20} variant="icon" />
            <span className="font-bold text-slate-800 dark:text-slate-200">ReadyNest Messenger</span>
            <span>• Built by Archit Shakya</span>
          </div>
          <p>© {new Date().getFullYear()} ReadyNest Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};