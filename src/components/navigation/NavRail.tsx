import React from 'react';
import { useStore } from '../../store/useStore';
import { ReadyNestLogo } from '../common/ReadyNestLogo';
import {
  MessageSquare,
  PhoneCall,
  CircleDashed,
  Shield,
  Layers,
  Plus,
  Sun,
  Moon,
  User,
  Sparkles,
  LogOut,
  Users
} from 'lucide-react';

export const NavRail: React.FC = () => {
  const {
    currentUser,
    viewMode,
    setViewMode,
    isDarkMode,
    toggleDarkMode,
    setNewGroupModalOpen,
    setAuthModalOpen,
    logout
  } = useStore();

  return (
    <nav className="hidden md:flex flex-col items-center justify-between w-16 lg:w-20 bg-indigo-900 border border-indigo-800/80 rounded-2xl p-3 shadow-xl text-white select-none flex-shrink-0 z-30">
      {/* Top Branding & Navigation Icons */}
      <div className="flex flex-col items-center gap-2 w-full">
        {/* RN Brand Logo */}
        <button
          onClick={() => setViewMode('chat')}
          className="cursor-pointer hover:scale-105 transition-transform focus:outline-none"
          title="Ready Nest Messenger"
        >
          <ReadyNestLogo size={42} variant="icon" />
        </button>

        <div className="w-8 h-[1px] bg-indigo-700/60 my-1"></div>

        {/* Chats Tab */}
        <button
          onClick={() => setViewMode('chat')}
          className={`p-2.5 lg:p-3 rounded-xl transition-all relative group ${
            viewMode === 'chat'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/50'
              : 'text-indigo-200 hover:bg-indigo-800/80 hover:text-white'
          }`}
          title="Messages & Chats"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="absolute left-16 bg-slate-900 text-white text-xs px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg border border-slate-700">
            Chats
          </span>
        </button>

        {/* Calls Tab */}
        <button
          onClick={() => setViewMode('calls')}
          className={`p-2.5 lg:p-3 rounded-xl transition-all relative group ${
            viewMode === 'calls'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/50'
              : 'text-indigo-200 hover:bg-indigo-800/80 hover:text-white'
          }`}
          title="Call Logs & Voice/Video"
        >
          <PhoneCall className="w-5 h-5" />
          <span className="absolute left-16 bg-slate-900 text-white text-xs px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg border border-slate-700">
            Call Logs
          </span>
        </button>

        {/* Status Tab */}
        <button
          onClick={() => setViewMode('status')}
          className={`p-2.5 lg:p-3 rounded-xl transition-all relative group ${
            viewMode === 'status'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/50'
              : 'text-indigo-200 hover:bg-indigo-800/80 hover:text-white'
          }`}
          title="Status & Updates"
        >
          <CircleDashed className="w-5 h-5" />
          <span className="absolute left-16 bg-slate-900 text-white text-xs px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg border border-slate-700">
            Status Stories
          </span>
        </button>

        {/* New Group Button */}
        <button
          onClick={() => setNewGroupModalOpen(true)}
          className="p-2.5 lg:p-3 rounded-xl text-indigo-200 hover:bg-indigo-800/80 hover:text-white transition-all relative group"
          title="Create New Group"
        >
          <Users className="w-5 h-5" />
          <span className="absolute left-16 bg-slate-900 text-white text-xs px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg border border-slate-700">
            Create Group
          </span>
        </button>

        {/* Admin Dashboard Tab */}
        <button
          onClick={() => setViewMode('admin')}
          className={`p-2.5 lg:p-3 rounded-xl transition-all relative group ${
            viewMode === 'admin'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/50'
              : 'text-indigo-200 hover:bg-indigo-800/80 hover:text-white'
          }`}
          title="Admin Console"
        >
          <Shield className="w-5 h-5" />
          {currentUser?.role === 'admin' && (
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          )}
          <span className="absolute left-16 bg-slate-900 text-white text-xs px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg border border-slate-700">
            Admin Console
          </span>
        </button>

        {/* Specs & Roadmap Tab */}
        <button
          onClick={() => setViewMode('specs')}
          className={`p-2.5 lg:p-3 rounded-xl transition-all relative group ${
            viewMode === 'specs'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/50'
              : 'text-indigo-200 hover:bg-indigo-800/80 hover:text-white'
          }`}
          title="Specs & Roadmap"
        >
          <Layers className="w-5 h-5" />
          <span className="absolute left-16 bg-slate-900 text-white text-xs px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg border border-slate-700">
            Specs & Roadmap
          </span>
        </button>
      </div>

      {/* Bottom Controls & User Badge */}
      <div className="flex flex-col items-center gap-2 w-full mt-auto pt-8">
        {/* Dark Mode Switcher */}
        <button
          onClick={toggleDarkMode}
          className="p-2.5 text-indigo-200 hover:text-amber-300 hover:bg-indigo-800/80 rounded-xl transition-colors"
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <div className="w-8 h-[1px] bg-indigo-700/60 my-0.5"></div>

        {/* User Profile Avatar */}
        {currentUser ? (
          <div className="relative group cursor-pointer" onClick={() => setAuthModalOpen(true)}>
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-9 h-9 lg:w-10 lg:h-10 rounded-full object-cover border-2 border-indigo-400 shadow-md"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-indigo-900"></span>
            <span className="absolute left-16 bg-slate-900 text-white text-xs px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg border border-slate-700">
              {currentUser.name} (Switch Account)
            </span>
          </div>
        ) : (
          <button
            onClick={() => setAuthModalOpen(true)}
            className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs transition-colors"
            title="Sign In"
          >
            <User className="w-5 h-5" />
          </button>
        )}
      </div>
    </nav>
  );
};
