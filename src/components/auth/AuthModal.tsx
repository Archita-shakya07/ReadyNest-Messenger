import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { api } from '../../services/api';
import { User } from '../../types';
import { ReadyNestLogo } from '../common/ReadyNestLogo';
import {
  ShieldCheck,
  UserPlus,
  LogIn,
  Sparkles,
  ArrowRight,
  Lock,
  Mail,
  User as UserIcon,
  Eye,
  EyeOff,
  X,
  CheckCircle2,
  Zap,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setAuthModalOpen, setCurrentUser, isDarkMode } = useStore();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [demoUsers, setDemoUsers] = useState<User[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDemoUsers, setShowDemoUsers] = useState(true);

  useEffect(() => {
    api
      .getDemoUsers()
      .then((res) => {
        setDemoUsers(res.users || []);
      })
      .catch(console.error);
  }, []);

  if (!isAuthModalOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.login(email || 'admin@readynest.com');
      setCurrentUser(res.user, res.token);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password && confirmPassword && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!agreeTerms) {
      setError('Please accept the Terms of Service to create an account.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.signup({
        name: name || 'New User',
        email: email || `user_${Date.now()}@readynest.com`,
        statusMessage: statusMsg || 'Available for professional chat',
      });
      setCurrentUser(res.user, res.token);
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectDemoUser = async (user: User) => {
    setError('');
    setLoading(true);
    try {
      const res = await api.login(user.email);
      setCurrentUser(res.user, res.token);
    } catch (err: any) {
      // Fallback register if not found
      const res = await api.signup({
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        statusMessage: user.statusMessage,
      });
      setCurrentUser(res.user, res.token);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row my-auto transition-colors"
      >
        {/* Left Side: Emerald Green Brand Panel */}
        <div className="md:w-5/12 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 p-6 lg:p-10 flex flex-col justify-between relative overflow-hidden text-white select-none min-h-[240px] md:min-h-[580px]">
          {/* Subtle Geometric Background Pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand Header */}
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                <ReadyNestLogo size={32} variant="icon" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-white block">ReadyNest</span>
                <span className="text-[11px] text-emerald-200 font-medium tracking-wider uppercase block">
                  Messenger
                </span>
              </div>
            </div>
          </div>

          {/* Center Graphic & Marketing Headlines */}
          <div className="relative z-10 my-6 md:my-auto space-y-4">
            <AnimatePresence mode="wait">
              {isSignup ? (
                <motion.div
                  key="signup-left"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-3"
                >
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-700/60 border border-emerald-400/30 rounded-full text-xs font-semibold text-emerald-100">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-300" /> Professional Messenger
                  </span>
                  <h2 className="text-2xl lg:text-3xl font-black leading-tight tracking-tight text-white">
                    Communication Redefined.
                  </h2>
                  <p className="text-xs lg:text-sm text-emerald-100/90 leading-relaxed">
                    Join thousands of professionals and teams who trust ReadyNest for fast, secure, real-time messaging.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="login-left"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-3"
                >
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-700/60 border border-emerald-400/30 rounded-full text-xs font-semibold text-emerald-100">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" /> Secure Workspace
                  </span>
                  <h2 className="text-2xl lg:text-3xl font-black leading-tight tracking-tight text-white">
                    Welcome Back to Nest
                  </h2>
                  <p className="text-xs lg:text-sm text-emerald-100/90 leading-relaxed">
                    Access your secure workspace and stay connected with your network in real-time.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Feature Badges */}
            <div className="pt-2 grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/20 backdrop-blur-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-300 flex-shrink-0" />
                <span className="font-semibold text-emerald-100 text-[11px]">End-to-End</span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/20 backdrop-blur-sm flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-300 flex-shrink-0" />
                <span className="font-semibold text-emerald-100 text-[11px]">Ultra Fast</span>
              </div>
            </div>
          </div>

          {/* Bottom Testimonial / Footer Note */}
          <div className="relative z-10 pt-4 border-t border-emerald-700/40">
            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-600/20">
              <p className="text-[11px] italic text-emerald-100/90 leading-snug">
                "Security and speed in one elegant package."
              </p>
              <div className="mt-2 flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black flex items-center justify-center">
                  RN
                </div>
                <span className="text-[10px] font-semibold text-emerald-200">ReadyNest Platform</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Clean White & Green Auth Form */}
        <div className="md:w-7/12 p-6 lg:p-10 bg-white dark:bg-slate-900 flex flex-col justify-between relative">
          {/* Close Modal Button */}
          <button
            onClick={() => setAuthModalOpen(false)}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div>
            {/* Page Title & Subtitle */}
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {isSignup ? 'Create Account' : 'Sign In'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isSignup
                  ? 'Start your professional messaging experience.'
                  : 'Enter your credentials to continue to your workspace.'}
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-5 p-3.5 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2.5 animate-fadeIn">
                <Lock className="w-4 h-4 text-rose-500 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Auth Form */}
            <form onSubmit={isSignup ? handleSignup : handleLogin} className="space-y-4">
              {isSignup && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Archit Shakya"
                      required
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 transition-all"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 transition-all"
                  />
                </div>
              </div>

              {isSignup && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Status Message / Bio
                  </label>
                  <input
                    type="text"
                    value={statusMsg}
                    onChange={(e) => setStatusMsg(e.target.value)}
                    placeholder="e.g. Building awesome real-time applications..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 transition-all"
                  />
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  {!isSignup && (
                    <button
                      type="button"
                      onClick={() => setError('Password reset link has been sent to your email.')}
                      className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required={isSignup}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {isSignup && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Checkboxes */}
              {!isSignup ? (
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
                  />
                  <label htmlFor="remember" className="text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                    Stay logged in for 30 days
                  </label>
                </div>
              ) : (
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
                  />
                  <label htmlFor="terms" className="text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                    I agree to the <span className="text-emerald-700 dark:text-emerald-400 font-semibold underline">Terms of Service</span> and <span className="text-emerald-700 dark:text-emerald-400 font-semibold underline">Privacy Policy</span>.
                  </label>
                </div>
              )}

              {/* Primary Green Action Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 text-xs sm:text-sm cursor-pointer disabled:opacity-50"
              >
                {isSignup ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                {loading
                  ? 'Processing...'
                  : isSignup
                  ? 'Create Account'
                  : 'Login to Nest'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Bottom Switcher */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isSignup ? 'Already have an account?' : 'New to ReadyNest?'}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignup(!isSignup);
                  setError('');
                }}
                className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline ml-1"
              >
                {isSignup ? 'Log In' : 'Create an account'}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
