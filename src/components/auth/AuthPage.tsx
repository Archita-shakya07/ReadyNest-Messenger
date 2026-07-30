import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { api } from '../../services/api';
import { ReadyNestLogo } from '../common/ReadyNestLogo';
import {
  ArrowRight,
  Lock,
  Mail,
  User as UserIcon,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
  Sun,
  Moon,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AuthPage: React.FC = () => {
  const { authPageMode, setAuthPageMode, setCurrentUser, isDarkMode, toggleDarkMode } = useStore();
  const isSignup = authPageMode === 'signup';

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
        statusMessage: 'Available for professional chat',
      });
      setCurrentUser(res.user, res.token);
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col justify-between items-center p-3 sm:p-6 lg:p-8 font-sans transition-colors duration-300">
      {/* Top Bar Navigation */}
      <div className="w-full max-w-5xl flex items-center justify-between py-2 px-1">
        <button
          onClick={() => setAuthPageMode('landing')}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 font-semibold text-xs shadow-sm hover:shadow transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition-colors cursor-pointer"
            title="Toggle theme mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-emerald-700" />}
          </button>
        </div>
      </div>

      {/* Main Full Page Auth Split Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="w-full max-w-5xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row my-auto transition-colors"
      >
        {/* Left Side: Solid Emerald Green Brand Panel */}
        <div className="md:w-5/12 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden text-white select-none min-h-[260px] md:min-h-[600px]">
          {/* Subtle Grid Background Pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />

          {/* Top Logo */}
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white rounded-2xl shadow-md flex items-center justify-center">
                <ReadyNestLogo size={32} variant="icon" />
              </div>
              <div>
                <span className="font-extrabold text-2xl tracking-tight text-white block">ReadyNest</span>
                <span className="text-[11px] text-emerald-200 font-bold tracking-wider uppercase block">
                  Messenger
                </span>
              </div>
            </div>
          </div>

          {/* Middle Copy */}
          <div className="relative z-10 my-8 md:my-auto space-y-4">
            <AnimatePresence mode="wait">
              {isSignup ? (
                <motion.div
                  key="signup-left"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-4"
                >
                  <h2 className="text-3xl lg:text-4xl font-black leading-tight tracking-tight text-white">
                    Professional Communication Redefined.
                  </h2>
                  <p className="text-xs lg:text-sm text-emerald-100/90 leading-relaxed font-normal">
                    Join thousands of teams who trust ReadyNest for secure, real-time professional messaging.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="login-left"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-4"
                >
                  <h2 className="text-3xl lg:text-4xl font-black leading-tight tracking-tight text-white">
                    Welcome Back
                  </h2>
                  <p className="text-xs lg:text-sm text-emerald-100/90 leading-relaxed font-normal">
                    Access your secure workspace and stay connected with your professional network in real-time.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Feature Badges */}
            <div className="pt-2 grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-emerald-950/50 border border-emerald-500/20 backdrop-blur-sm flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span className="font-bold text-emerald-100 text-xs">End-to-End</span>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-950/50 border border-emerald-500/20 backdrop-blur-sm flex items-center justify-center gap-2">
                <Zap className="w-4 h-4 text-emerald-300" />
                <span className="font-bold text-emerald-100 text-xs">Ultra Fast</span>
              </div>
            </div>
          </div>

          {/* Quote Footer */}
          <div className="relative z-10 pt-4 border-t border-emerald-700/40">
            <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-600/20 space-y-2">
              <p className="text-xs italic text-emerald-100/90 leading-snug">
                "The fastest transition our IT team ever made. Security and speed in one elegant package."
              </p>
              <div className="flex items-center gap-2.5 pt-1">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black flex items-center justify-center shadow">
                  JD
                </div>
                <div>
                  <span className="text-xs font-bold text-emerald-100 block leading-none">James D. Miller</span>
                  <span className="text-[10px] text-emerald-300 font-medium">CTO, VERTEX GLOBAL</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="md:w-7/12 p-6 sm:p-10 lg:p-12 bg-white dark:bg-slate-900 flex flex-col justify-between">
          <div>
            {/* Title & Subtitle */}
            <div className="mb-6">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {isSignup ? 'Create Account' : 'Sign In'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
                {isSignup
                  ? 'Enter your credentials to create your ReadyNest workspace account.'
                  : 'Enter your professional credentials to continue to ReadyNest.'}
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-5 p-3.5 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50 rounded-2xl text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2.5 animate-fadeIn">
                <Lock className="w-4 h-4 text-rose-500 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Auth Form */}
            <form onSubmit={isSignup ? handleSignup : handleLogin} className="space-y-4">
              {isSignup && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-600 focus:outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {isSignup ? 'Work Email' : 'Email Address'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-600 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Password</label>
                  {!isSignup && (
                    <button
                      type="button"
                      onClick={() => setError('Password reset link sent to your email.')}
                      className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-600 focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {isSignup && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <CheckCircle2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-600 focus:outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Checkboxes */}
              {!isSignup ? (
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-600 border-slate-300 cursor-pointer"
                  />
                  <label htmlFor="rememberMe" className="text-xs text-slate-600 dark:text-slate-400 font-medium cursor-pointer">
                    Stay logged in for 30 days
                  </label>
                </div>
              ) : (
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-600 border-slate-300 cursor-pointer"
                  />
                  <label htmlFor="agreeTerms" className="text-xs text-slate-600 dark:text-slate-400 font-medium cursor-pointer">
                    I agree to the <span className="text-emerald-700 dark:text-emerald-400 font-bold">Terms of Service</span> and <span className="text-emerald-700 dark:text-emerald-400 font-bold">Privacy Policy</span>.
                  </label>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-700 dark:hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-800/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {loading ? (
                  <span className="inline-block animate-spin font-normal">⌛ Processing...</span>
                ) : isSignup ? (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>Login to Nest</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom Toggle Link */}
            <div className="mt-6 text-center text-xs text-slate-600 dark:text-slate-400 font-medium">
              {isSignup ? (
                <p>
                  Already have an account?{' '}
                  <button
                    onClick={() => setAuthPageMode('signin')}
                    className="font-bold text-emerald-800 dark:text-emerald-400 hover:underline cursor-pointer ml-1"
                  >
                    Log In
                  </button>
                </p>
              ) : (
                <p>
                  New to ReadyNest?{' '}
                  <button
                    onClick={() => setAuthPageMode('signup')}
                    className="font-bold text-emerald-800 dark:text-emerald-400 hover:underline cursor-pointer ml-1"
                  >
                    Create an account
                  </button>
                </p>
              )}
            </div>
          </div>

          {/* Footer Rights */}
          <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 font-medium">
            <span>© {new Date().getFullYear()} ReadyNest Messenger</span>
            <div className="flex items-center gap-3">
              <span className="hover:underline cursor-pointer">Privacy</span>
              <span>•</span>
              <span className="hover:underline cursor-pointer">Terms</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Empty space footer alignment */}
      <div className="h-2" />
    </div>
  );
};