import React, { useState } from 'react';
import { Database, ShieldCheck, Copy, Check, Terminal, ExternalLink, X, RefreshCw } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabaseClient';
import { useComplaints } from '../context/ComplaintContext';

interface SupabaseSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseSetupModal: React.FC<SupabaseSetupModalProps> = ({ isOpen, onClose }) => {
  const isConfigured = isSupabaseConfigured();
  const { resetAllDemoData } = useComplaints();
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const envSnippet = `# CivicFix Production Supabase Configuration
VITE_SUPABASE_URL="https://your-project-ref.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
GEMINI_API_KEY="AIzaSy..."`;

  const migrationCommand = `-- 1. In Supabase Dashboard -> SQL Editor
-- 2. Open /supabase/migrations/20261024000000_civicfix_init.sql
-- 3. Click 'Run' to establish profiles, complaints, departments, events, and RLS policies.`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md text-sky-400">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg">Backend & Supabase Integration</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isConfigured ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                }`}>
                  {isConfigured ? 'Connected to Live Cloud' : 'Running in Local Demo Mode'}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Transparent civic audit trail architecture & configuration
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-left">
          {/* Status banner */}
          <div className={`p-4 rounded-2xl border ${
            isConfigured
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            <h4 className="font-bold text-sm mb-1 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>
                {isConfigured
                  ? 'Active Production Supabase Connection Detected'
                  : 'Operating in High-Fidelity Demo Mode (Local Storage Persistence)'}
              </span>
            </h4>
            <p className="text-xs leading-relaxed">
              {isConfigured
                ? 'Your application is reading and writing to your live Supabase PostgreSQL database with Row Level Security enforced.'
                : 'All complaint lifecycles, Gemini AI analyses, SLA countdowns, and auditable events are stored locally in browser storage. No real municipal authorities are contacted in Demo Mode.'}
            </p>
          </div>

          {/* Setup Guide */}
          <div className="space-y-3">
            <h5 className="font-bold text-sm text-slate-900">
              To Connect Your Live Supabase Project:
            </h5>
            <ol className="list-decimal list-inside text-xs text-slate-600 space-y-2">
              <li>Create a new project at <strong>supabase.com</strong>.</li>
              <li>Navigate to <strong>Project Settings &gt; API</strong> and copy your Project URL & Anon Key.</li>
              <li>Provide these keys in your environment (e.g. via <code>.env</code> or AI Studio Secrets).</li>
              <li>Execute the database migration in the Supabase SQL Editor.</li>
            </ol>
          </div>

          {/* Environment Variables Code Box */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span>Required Environment Variables:</span>
              <button
                onClick={() => copyToClipboard(envSnippet, 'env')}
                className="text-sky-600 hover:text-sky-700 flex items-center gap-1 font-mono text-[11px]"
              >
                {copiedSection === 'env' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'env' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-3 bg-slate-900 text-sky-300 font-mono text-xs rounded-xl overflow-x-auto">
              {envSnippet}
            </pre>
          </div>

          {/* SQL Migration Script Reference */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span>SQL Migration Script:</span>
              <button
                onClick={() => copyToClipboard(migrationCommand, 'sql')}
                className="text-sky-600 hover:text-sky-700 flex items-center gap-1 font-mono text-[11px]"
              >
                {copiedSection === 'sql' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'sql' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              The complete schema with RLS policies is ready in <code>/supabase/migrations/20261024000000_civicfix_init.sql</code>.
            </p>
          </div>

          {/* Reset Demo Data Action */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-800">Reset Demo Complaints</p>
              <p className="text-[11px] text-slate-500">Restore default sample pothole, garbage, and streetlight grievances.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                resetAllDemoData();
                alert('Demo data has been reset to initial municipal state.');
                onClose();
              }}
              className="px-3 py-1.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5 text-sky-600" />
              <span>Reset Demo State</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
