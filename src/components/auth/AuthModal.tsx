import React, { useState } from 'react';
import { auraStorage } from '../../services/storage';
import { User } from '../../types';
import { ShieldCheck, Phone, Mail, Lock, User as UserIcon, ArrowRight, CheckCircle2, RefreshCw, X } from 'lucide-react';
import { Avatar } from '../common/Avatar';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, currentUser }) => {
  const [tab, setTab] = useState<'phone' | 'email' | 'switch'>('switch');
  const [phone, setPhone] = useState('+1 415 555 0192');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const users = auraStorage.getUsers();

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 8) {
      setError('Please enter a valid phone number');
      return;
    }
    setError('');
    setOtpSent(true);
    // Simulated OTP code for convenient testing
    setOtp('7392');
    setSuccess('OTP verification code sent! Use 7392');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== '7392') {
      setError('Invalid OTP code. Please enter 7392');
      return;
    }
    setError('');
    // Look up or register phone user
    const existing = users.find((u) => u.phone === phone);
    if (existing) {
      auraStorage.setCurrentUserId(existing.id);
      onClose();
    } else {
      const newUser = auraStorage.registerUser(name || 'Mobile User', phone);
      auraStorage.setCurrentUserId(newUser.id);
      onClose();
    }
  };

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setError('');

    if (isRegistering) {
      const newUser = auraStorage.registerUser(name || 'New User', email, username);
      auraStorage.setCurrentUserId(newUser.id);
      onClose();
    } else {
      const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        auraStorage.setCurrentUserId(existing.id);
        onClose();
      } else {
        // Auto-create or log in
        const newUser = auraStorage.registerUser(email.split('@')[0], email);
        auraStorage.setCurrentUserId(newUser.id);
        onClose();
      }
    }
  };

  const handleSwitchUser = (userId: string) => {
    auraStorage.setCurrentUserId(userId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-6 text-slate-100 shadow-2xl relative flex flex-col max-h-[90vh] overflow-y-auto no-scrollbar">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-600/30 flex items-center justify-center mb-3">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">Aura Account</h2>
          <p className="text-xs text-slate-400 mt-1">Multi-user simulation & secure sign-in</p>
        </div>

        {/* Tab switcher */}
        <div className="flex p-1 bg-slate-800/80 rounded-2xl mb-5 text-xs font-semibold">
          <button
            onClick={() => { setTab('switch'); setError(''); }}
            className={`flex-1 py-2 rounded-xl transition ${
              tab === 'switch' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Switch User
          </button>
          <button
            onClick={() => { setTab('phone'); setError(''); }}
            className={`flex-1 py-2 rounded-xl transition ${
              tab === 'phone' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Phone & OTP
          </button>
          <button
            onClick={() => { setTab('email'); setError(''); }}
            className={`flex-1 py-2 rounded-xl transition ${
              tab === 'email' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Email Auth
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Tab 1: Instant Switch User (great for testing real chatting back and forth!) */}
        {tab === 'switch' && (
          <div className="flex flex-col gap-2.5">
            <p className="text-xs text-slate-400 mb-1">
              Select an account to test real-time peer messaging, reactions, audio calls, and 24h stories:
            </p>
            {users.map((u) => {
              const isCurrent = u.id === currentUser.id;
              return (
                <div
                  key={u.id}
                  onClick={() => handleSwitchUser(u.id)}
                  className={`flex items-center justify-between p-3 rounded-2xl border transition cursor-pointer ${
                    isCurrent
                      ? 'bg-indigo-600/20 border-indigo-500/50 shadow-sm'
                      : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/80 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar src={u.avatar} name={u.name} size="sm" isOnline={u.isOnline} />
                    <div className="text-left">
                      <p className="text-sm font-semibold text-white flex items-center gap-1.5">
                        {u.name}
                        {isCurrent && (
                          <span className="text-[10px] bg-indigo-500 text-white px-1.5 py-0.2 rounded-full font-normal">
                            Active
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-slate-400">@{u.username}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Phone & OTP */}
        {tab === 'phone' && (
          <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Phone Number</label>
              <div className="relative flex items-center">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-slate-800/70 border border-slate-700 rounded-xl py-2.5 pl-10 pr-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  disabled={otpSent}
                />
              </div>
            </div>

            {otpSent && (
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">Enter 4-Digit OTP</label>
                  <span className="text-[11px] text-indigo-400 cursor-pointer" onClick={() => setOtp('7392')}>
                    Auto-fill 7392
                  </span>
                </div>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="7392"
                  className="w-full bg-slate-800/70 border border-slate-700 rounded-xl py-2.5 text-center tracking-widest text-lg font-mono text-white focus:outline-none focus:border-indigo-500"
                  autoFocus
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl text-sm transition shadow-lg shadow-indigo-600/20 active:scale-95"
            >
              {otpSent ? 'Verify & Continue' : 'Send Verification Code'}
            </button>

            {otpSent && (
              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Change phone number
              </button>
            )}
          </form>
        )}

        {/* Tab 3: Email & Password Auth */}
        {tab === 'email' && (
          <form onSubmit={handleEmailAuth} className="flex flex-col gap-3.5">
            {isRegistering && (
              <>
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">Full Name</label>
                  <div className="relative flex items-center">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Jordan Miller"
                      className="w-full bg-slate-800/70 border border-slate-700 rounded-xl py-2 pl-10 pr-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="jordan_m"
                    className="w-full bg-slate-800/70 border border-slate-700 rounded-xl py-2 px-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">Email Address</label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@aura.io"
                  className="w-full bg-slate-800/70 border border-slate-700 rounded-xl py-2 pl-10 pr-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">Password</label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-800/70 border border-slate-700 rounded-xl py-2 pl-10 pr-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl text-sm transition shadow-lg shadow-indigo-600/20 active:scale-95 mt-1"
            >
              {isRegistering ? 'Create Account' : 'Sign In'}
            </button>

            <div className="text-center mt-1">
              <button
                type="button"
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-xs text-indigo-400 hover:underline"
              >
                {isRegistering ? 'Already have an account? Sign In' : 'New to Aura? Create an account'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
