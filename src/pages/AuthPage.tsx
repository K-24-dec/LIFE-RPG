import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Lock, Mail, Shield, Sparkles, Swords, User } from 'lucide-react';

interface AuthPageProps {
  mode: 'login' | 'signup';
  onNavigate: (path: string) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ mode, onNavigate }) => {
  const { loginUser } = useGame();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [characterName, setCharacterName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please provide valid credentials.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      // mode === 'signup' creates brand new Level 1 hero; mode === 'login' loads existing
      loginUser(email.trim(), mode === 'signup');
      setLoading(false);
      onNavigate('/dashboard');
    }, 400);
  };

  const handleAccountALogin = () => {
    loginUser('account.a@liferpg.io', false, 'account_a');
    onNavigate('/dashboard');
  };

  const handleAccountBLogin = () => {
    loginUser('account.b@liferpg.io', true, 'account_b');
    onNavigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 font-mono flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative w-full max-w-md bg-[#0d1322]/90 border border-cyan-500/30 rounded-3xl p-8 shadow-[0_0_60px_rgba(0,240,255,0.25)] backdrop-blur-xl">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 p-[2px] mx-auto mb-3 shadow-[0_0_20px_rgba(0,240,255,0.4)]">
            <div className="w-full h-full bg-[#080c14] rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <h2 className="text-2xl font-black text-white tracking-wider">
            {mode === 'login' ? 'WELCOME BACK, HERO' : 'CREATE YOUR HERO'}
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            {mode === 'login'
              ? 'Enter your credentials to load your persistent hero profile'
              : 'Begin your journey with a fresh Level 1 character'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {mode === 'signup' && (
            <div>
              <label className="block text-slate-300 font-bold mb-1">CHARACTER NAME</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={characterName}
                  onChange={(e) => setCharacterName(e.target.value)}
                  placeholder="e.g. Kaelen Vance"
                  className="w-full bg-[#080c14] border border-slate-700 focus:border-cyan-400 rounded-xl pl-10 pr-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-slate-300 font-bold mb-1">EMAIL ADDRESS</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hero@liferpg.io"
                className="w-full bg-[#080c14] border border-slate-700 focus:border-cyan-400 rounded-xl pl-10 pr-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">PASSWORD</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#080c14] border border-slate-700 focus:border-cyan-400 rounded-xl pl-10 pr-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-[#080c14] font-black tracking-widest text-xs shadow-[0_0_25px_rgba(0,240,255,0.4)] transition"
          >
            {loading ? 'INITIALIZING HERO...' : mode === 'login' ? 'LOGIN TO REALM' : 'CREATE FRESH LEVEL 1 HERO'}
          </button>
        </form>

        {/* Quick Multi-Account Test Buttons */}
        <div className="mt-6 pt-6 border-t border-slate-800 space-y-2 text-center">
          <p className="text-[11px] text-slate-400 mb-2 font-bold">HACKATHON ISOLATION DEMO ACCOUNTS</p>
          <button
            onClick={handleAccountALogin}
            className="w-full py-2.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 font-bold text-xs flex items-center justify-center gap-2 transition"
          >
            <Swords className="w-4 h-4" />
            <span>ACCOUNT A: RETURNING HERO (LVL 5)</span>
          </button>
          <button
            onClick={handleAccountBLogin}
            className="w-full py-2.5 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 font-bold text-xs flex items-center justify-center gap-2 transition"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>ACCOUNT B: FRESH NEW HERO (LVL 1)</span>
          </button>
        </div>

        <div className="mt-6 text-center text-xs text-slate-400">
          {mode === 'login' ? (
            <p>
              New hero?{' '}
              <button onClick={() => onNavigate('/signup')} className="text-cyan-400 font-bold hover:underline">
                Create character
              </button>
            </p>
          ) : (
            <p>
              Already have a hero?{' '}
              <button onClick={() => onNavigate('/login')} className="text-cyan-400 font-bold hover:underline">
                Login here
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
