import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { translations } from '../i18n/translations';
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Camera,
  MapPin,
  Clock,
  CheckCircle2,
  Building2,
  Globe,
  ChevronRight,
  Shield,
  FileText,
  Bell
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onDemoLogin: (index: number) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onDemoLogin }) => {
  const { language, setLanguage } = useAuth();
  const t = translations[language];
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const headlines = [
    {
      lang: 'मराठी',
      badge: 'महाराष्ट्र नागरिक सेवा हमी',
      title: 'नोंदवा. ट्रॅक करा. सोडवून घ्या.',
      sub: 'तुमच्या परिसरातील खड्डे, कचरा आणि नागरी समस्यांचे पारदर्शक व जलद निवारण.',
    },
    {
      lang: 'हिन्दी',
      badge: 'डिजिटल नागरिक सशक्तिकरण',
      title: 'दर्ज करें। ट्रैक करें। समाधान पाएं।',
      sub: 'फोटो लें, विवरण दें और AI द्वारा सही नगरपालिका विभाग को तुरंत भेजें।',
    },
    {
      lang: 'English',
      badge: 'Next-Gen Civic Accountability',
      title: 'Report It. Track It. Get It Resolved.',
      sub: 'AI-powered complaint understanding, automatic department routing, and statutory SLA escalation.',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setHeadlineIndex(prev => (prev + 1) % headlines.length);
        setAnimating(false);
      }, 300);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const current = headlines[headlineIndex];

  const features = [
    { icon: Camera, title: 'AI Photo Analysis', desc: 'Snap a photo; Gemini AI identifies the issue and routes to the right department automatically.', color: 'text-sky-600', bg: 'bg-sky-50' },
    { icon: Globe, title: 'मराठी · हिन्दी · English', desc: 'Submit in your mother tongue. AI understands colloquial expressions across 3 languages.', color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { icon: Clock, title: 'Statutory SLA Enforcement', desc: 'Every complaint carries a legal response deadline. Missed deadlines trigger automatic escalation.', color: 'text-amber-600', bg: 'bg-amber-50' },
    { icon: CheckCircle2, title: 'Citizen-Verified Resolution', desc: 'An officer cannot close a complaint without photographic proof. You confirm the fix.', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { icon: Bell, title: 'Live Status Notifications', desc: 'Real-time updates at every milestone: acknowledgement, crew dispatch, resolution.', color: 'text-rose-600', bg: 'bg-rose-50' },
    { icon: Shield, title: 'Municipal-Grade Security', desc: 'Row-level security, append-only audit logs, encrypted image storage on Supabase PostgreSQL.', color: 'text-slate-600', bg: 'bg-slate-50' },
  ];

  const stats = [
    { value: '94.8%', label: 'AI Routing Accuracy' },
    { value: '< 12h', label: 'SLA Acknowledgement' },
    { value: '3', label: 'Regional Languages' },
    { value: '100%', label: 'Auditable Milestones' },
  ];

  const steps = [
    { num: '01', title: 'Report', desc: 'Photograph the issue, describe it in your language, share your location.' },
    { num: '02', title: 'AI Routes', desc: 'Gemini analyzes evidence, classifies category, assigns responsible department.' },
    { num: '03', title: 'Track & Escalate', desc: 'Monitor SLA countdown, escalate to Municipal Commissioner if deadline lapses.' },
    { num: '04', title: 'Verify Fix', desc: 'Confirm resolution or dispute it — keeping officials accountable.' },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">

      {/* ── GOVERNMENT TOP RIBBON ─────────────────────────────── */}
      <div className="bg-[#1a3a6b] text-white text-[11px] py-1.5 px-4 flex items-center justify-between">
        <span className="font-medium opacity-80">Government of Maharashtra · Municipal Digital Services</span>
        <div className="hidden sm:flex items-center gap-1 opacity-80">
          <span>Official Citizen Grievance Platform</span>
        </div>
      </div>

      {/* ── MAIN NAVBAR ───────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1a3a6b] to-[#0f6cbd] flex items-center justify-center shadow-md">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-black text-lg tracking-tight text-slate-900">
                Civic<span className="text-[#0f6cbd]">Fix</span>
              </div>
              <div className="text-[10px] text-slate-500 font-medium -mt-0.5 hidden sm:block">AI Civic Complaint Portal</div>
            </div>
          </div>

          {/* Right nav */}
          <div className="flex items-center gap-2">
            {/* Language pills */}
            <div className="hidden sm:flex items-center bg-slate-100 rounded-full p-1 gap-0.5 text-xs font-semibold">
              {(['mr', 'hi', 'en'] as const).map(code => (
                <button
                  key={code}
                  onClick={() => setLanguage(code)}
                  className={`px-3 py-1 rounded-full transition-all ${
                    language === code
                      ? 'bg-[#1a3a6b] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {code === 'mr' ? 'मराठी' : code === 'hi' ? 'हिन्दी' : 'EN'}
                </button>
              ))}
            </div>

            <button
              onClick={onGetStarted}
              className="px-4 py-2 rounded-xl bg-[#1a3a6b] hover:bg-[#0f2d5c] text-white text-sm font-bold shadow-md transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <span>Citizen Login</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ── HERO SECTION ──────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#f0f6ff] to-white pt-16 pb-20">
        {/* Decorative background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -left-20 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-sky-200/40 to-blue-100/30 blur-3xl" />
          <div className="absolute top-10 -right-20 w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-indigo-200/30 to-sky-100/20 blur-3xl" />
          {/* Government-style watermark lines */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, #1a3a6b 0px, transparent 1px, transparent 40px)',
          }} />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-sky-200 shadow-md text-xs font-semibold text-[#1a3a6b]">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            <span className={`transition-all duration-300 ${animating ? 'opacity-0' : 'opacity-100'}`}>
              {current.badge}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-500 font-normal">Gemini AI Inside</span>
          </div>

          {/* Headline */}
          <div className="min-h-[120px] sm:min-h-[150px] flex flex-col items-center justify-center">
            <h1
              className={`text-4xl sm:text-6xl font-black tracking-tight text-slate-900 leading-tight max-w-4xl transition-all duration-300 ${
                animating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
              }`}
            >
              {current.title}
            </h1>
            <p className={`mt-4 text-base sm:text-lg text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed transition-all duration-300 ${
              animating ? 'opacity-0' : 'opacity-100'
            }`}>
              {current.sub}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#1a3a6b] to-[#0f6cbd] hover:from-[#0f2d5c] hover:to-[#0a5aa8] text-white font-bold text-base shadow-xl shadow-blue-900/20 flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 group"
            >
              <span>Proceed to Citizen Portal</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onDemoLogin(0)}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white border-2 border-slate-200 hover:border-sky-400 hover:bg-sky-50/50 text-slate-800 font-semibold text-sm shadow-sm flex items-center justify-center gap-2 transition-all"
            >
              <span>⚡ Instant Demo: Ramesh Patil (मराठी)</span>
            </button>
          </div>

          {/* Alt demo users */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
            <span>Or try:</span>
            {[{ label: 'Pooja Sharma (हिन्दी)', idx: 1 }, { label: 'Arjun Mehta (English)', idx: 2 }].map(d => (
              <button
                key={d.idx}
                onClick={() => onDemoLogin(d.idx)}
                className="px-3 py-1 rounded-lg bg-white border border-slate-200 hover:border-sky-300 hover:bg-sky-50 text-slate-700 font-medium transition-colors"
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BAR ─────────────────────────────────────────── */}
      <section className="bg-[#1a3a6b] py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {stats.map(s => (
            <div key={s.label}>
              <div className="text-3xl sm:text-4xl font-black text-white">{s.value}</div>
              <div className="text-xs text-blue-200 mt-1 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── AI SCANNER DEMO ───────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-xs font-semibold text-sky-800">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Live AI Demo — Gemini Vision Analysis</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">See How the AI Engine Works</h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">Submit a civic issue in any language — Gemini analyzes evidence, classifies the category, and routes to the correct municipal department.</p>
        </div>

        <div className="relative rounded-3xl bg-slate-900 border-2 border-slate-700 p-4 sm:p-6 shadow-2xl overflow-hidden">
          {/* Terminal header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-700 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="ml-2 font-mono text-slate-300 font-bold">CivicFix AI Vision Engine · Gemini 1.5 Flash</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px] font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>REAL-TIME ANALYSIS ACTIVE</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4">
            {/* Photo + scan animation */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-black aspect-video">
              <img
                src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80"
                alt="Pothole scanner demo"
                className="w-full h-full object-cover opacity-70"
              />
              {/* Scanning line */}
              <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_#22d3ee] animate-bounce" />
              {/* Detection box */}
              <div className="absolute top-1/3 left-1/4 w-1/2 h-1/3 border-2 border-cyan-400/80 rounded-lg bg-cyan-500/10 flex flex-col justify-between p-2">
                <div className="flex justify-between text-[10px] font-mono font-bold text-cyan-300">
                  <span>EVIDENCE #1</span>
                  <span>94.2%</span>
                </div>
                <span className="text-[10px] font-mono text-cyan-200">Asphalt crater ~1.2m</span>
              </div>
              {/* Location pill */}
              <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded-xl border border-slate-700 text-[11px] text-white flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>Dadar West, Senapati Bapat Marg (GPS Verified)</span>
              </div>
            </div>

            {/* AI Output */}
            <div className="space-y-3 text-xs font-sans">
              <div className="p-3.5 rounded-2xl bg-slate-800 border border-slate-700">
                <div className="flex justify-between text-[11px] text-slate-400 mb-1.5">
                  <span className="font-semibold uppercase tracking-wider">Citizen Input (Marathi):</span>
                  <span className="font-mono text-sky-400">Detected: mr</span>
                </div>
                <p className="text-white italic">"दादर पश्चिम सेनापती बापट मार्गावर खूप खोल खड्डा पडला आहे. वाहने घसरत आहेत."</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-sky-950/50 border border-sky-800/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-sky-300 uppercase tracking-wider">Assigned Department:</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">SLA: 24h ACK</span>
                </div>
                <p className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-sky-400" />
                  Roads & Public Works Department (PWD)
                </p>
                <p className="text-[11px] text-slate-300 mt-1">रस्ते व सार्वजनिक बांधकाम विभाग · Priority: High</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700">
                  <span className="block text-slate-400 font-semibold mb-0.5">Severity:</span>
                  <span className="font-bold text-amber-400">High (Accident Risk)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700">
                  <span className="block text-slate-400 font-semibold mb-0.5">Reference ID:</span>
                  <span className="font-bold font-mono text-cyan-300">#CFX-2026-MUM-84920</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-800/40 flex items-center gap-2 text-emerald-300">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span className="text-[11px] font-semibold">AI Confidence: 94.2% · Heuristic Routing: PWD Ward Field Cell</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────── */}
      <section className="bg-slate-50 border-t border-slate-200 py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">How CivicFix Works</h2>
            <p className="text-sm text-slate-500 max-w-xl mx-auto">Four transparent steps from civic problem to verified resolution.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={step.num} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-slate-300 to-transparent z-0 -translate-x-4" />
                )}
                <div className="relative z-10 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-2xl bg-[#1a3a6b] text-white font-black text-base flex items-center justify-center mb-4">
                    {step.num}
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1">{step.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ─────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Built for Real Municipal Accountability
          </h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            Solving five core bottlenecks that cause citizen frustration and delayed municipal action.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(f => (
            <div key={f.title} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-sky-300 hover:shadow-md transition-all group">
              <div className={`w-11 h-11 rounded-xl ${f.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <f.icon className={`w-5 h-5 ${f.color}`} />
              </div>
              <h3 className="font-bold text-slate-900 mb-2 text-sm">{f.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── BOTTOM CTA ────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-[#1a3a6b] to-[#0f6cbd] py-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Ready to Make Your Neighbourhood Accountable?
          </h2>
          <p className="text-sm text-blue-200 max-w-md mx-auto">
            Sign in or create your citizen profile to report potholes, overflowing bins, and public hazards — in your preferred language.
          </p>
          <button
            onClick={onGetStarted}
            className="px-10 py-4 rounded-2xl bg-white hover:bg-blue-50 text-[#1a3a6b] font-black text-sm shadow-xl flex items-center justify-center gap-2 mx-auto transition-all hover:scale-105 active:scale-95"
          >
            <span>Enter Citizen Portal</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* ── LANDING FOOTER ────────────────────────────────────── */}
      <footer className="bg-slate-900 py-8 px-4 sm:px-6 text-center">
        <div className="flex items-center justify-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-lg bg-[#1a3a6b] border border-white/10 flex items-center justify-center">
            <Shield className="w-4 h-4 text-sky-300" />
          </div>
          <span className="font-bold text-white text-sm">CivicFix · Municipal Digital Services Platform</span>
        </div>
        <p className="text-xs text-slate-500 max-w-xl mx-auto leading-relaxed">
          Designed for scalable deployment across municipal corporations. Built on Supabase PostgreSQL with Row Level Security, append-only audit logs, and Gemini AI for multilingual complaint intelligence.
        </p>
        <p className="text-[10px] text-slate-600 mt-3">© {new Date().getFullYear()} CivicFix · All rights reserved</p>
      </footer>
    </div>
  );
};
