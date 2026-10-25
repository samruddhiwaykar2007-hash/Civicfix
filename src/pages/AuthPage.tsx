import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { translations } from '../i18n/translations';
import { Language } from '../types';
import { ShieldCheck, User, Mail, Lock, Globe, ArrowRight, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';

interface AuthPageProps {
  onSuccess: () => void;
  onBackToLanding?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess, onBackToLanding }) => {
  const {
    language,
    setLanguage,
    loginAsDemoUser,
    signInWithEmail,
    signUpWithEmail,
    isSupabaseLive
  } = useAuth();
  const t = translations[language];

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [preferredLang, setPreferredLang] = useState<Language>(language);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      if (mode === 'signin') {
        const { error } = await signInWithEmail(email, password);
        if (error) {
          setErrorMessage(error);
          setIsSubmitting(false);
          return;
        }
      } else {
        if (!name.trim()) {
          setErrorMessage('Please enter your full citizen name.');
          setIsSubmitting(false);
          return;
        }
        const { error } = await signUpWithEmail(name, email, password, preferredLang);
        if (error) {
          setErrorMessage(error);
          setIsSubmitting(false);
          return;
        }
      }
      setIsSubmitting(false);
      onSuccess();
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication error. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleDemoPreset = (index: number) => {
    loginAsDemoUser(index);
    onSuccess();
  };

  return (
    <div className="max-w-md mx-auto py-6 sm:py-10 space-y-5 animate-in fade-in duration-200">
      {/* Back to landing */}
      {onBackToLanding && (
        <button
          type="button"
          onClick={onBackToLanding}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Platform Overview</span>
        </button>
      )}

      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-600 to-teal-500 text-white mx-auto flex items-center justify-center shadow-md shadow-sky-200">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Civic<span className="text-sky-600">Fix</span>
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          {t.tagline}
        </p>
      </div>

      {/* Auth Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sky-100 shadow-sm space-y-6">
        {/* Tab Toggle (Sign In vs Sign Up) */}
        <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              mode === 'signin' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {t.login}
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              mode === 'signup' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {t.signup}
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Citizen Display Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Ramesh Patil"
                  className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="citizen@example.in"
                className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Preferred Language
              </label>
              <select
                value={preferredLang}
                onChange={e => setPreferredLang(e.target.value as Language)}
                className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500 bg-white"
              >
                <option value="mr">मराठी (Marathi)</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="en">English</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-sky-200 flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Authenticating...' : mode === 'signin' ? t.login : t.signup}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Citizen Presets (Section 4) */}
        <div className="pt-4 border-t border-slate-100">
          <div className="text-center mb-3">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Instant Demo Sign-In
            </span>
            <p className="text-[11px] text-slate-500">
              Test full citizen flow with sample credentials:
            </p>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => handleDemoPreset(0)}
              className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 text-left transition-colors flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-bold text-slate-800">Ramesh Patil (रमेश पाटील)</span>
                <span className="text-[10px] text-slate-500 block">Marathi Preference · Mumbai Ward G/North</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-sky-100 text-sky-800">MR</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoPreset(1)}
              className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 text-left transition-colors flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-bold text-slate-800">Pooja Sharma (पूजा शर्मा)</span>
                <span className="text-[10px] text-slate-500 block">Hindi Preference · Pune Zone 3</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800">HI</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoPreset(2)}
              className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 text-left transition-colors flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-bold text-slate-800">Arjun Mehta</span>
                <span className="text-[10px] text-slate-500 block">English Preference · Bandra Ward H/West</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">EN</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
