import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useComplaints } from '../context/ComplaintContext';
import { translations } from '../i18n/translations';
import { Language } from '../types';
import {
  User,
  Globe,
  Shield,
  FileCheck,
  RefreshCw,
  LogOut,
  CheckCircle2,
  Lock,
  Download
} from 'lucide-react';

interface ProfilePageProps {
  onLogout: () => void;
  openSupabaseModal: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  onLogout,
  openSupabaseModal
}) => {
  const { user, language, setLanguage, isSupabaseLive } = useAuth();
  const { complaints, resetAllDemoData } = useComplaints();
  const t = translations[language];

  const languages: { code: Language; label: string; native: string }[] = [
    { code: 'mr', label: 'Marathi', native: 'मराठी' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'en', label: 'English', native: 'English' }
  ];

  const exportCitizenData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(complaints, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `civicfix_complaints_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          {t.navProfile}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Manage your language, municipal notifications, and citizen privacy
        </p>
      </div>

      {/* Citizen Card */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-sky-100 shadow-xs flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-600 to-teal-500 text-white font-bold text-2xl flex items-center justify-center shadow-md shadow-sky-200">
          {user ? user.displayName.charAt(0).toUpperCase() : 'C'}
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {user?.displayName || 'Citizen'}
            </h2>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
              {user?.isDemo ? 'Demo Mode' : 'Verified'}
            </span>
          </div>
          <p className="text-xs text-slate-500">{user?.email}</p>
          <p className="text-[11px] text-slate-400">
            Registered Citizen Account · {complaints.length} Filed Grievances
          </p>
        </div>
      </div>

      {/* Language Preference Section */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-sky-100 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-sky-600" />
          <h3 className="font-bold text-sm text-slate-900">{t.languageSelectLabel}</h3>
        </div>
        <p className="text-xs text-slate-500">
          Choose your preferred interface language. AI complaints will automatically format in your chosen language.
        </p>

        <div className="grid grid-cols-3 gap-2 pt-2">
          {languages.map(lang => (
            <button
              key={lang.code}
              type="button"
              onClick={() => setLanguage(lang.code)}
              className={`py-3 px-2 rounded-2xl border text-center transition-all flex flex-col items-center justify-center ${
                language === lang.code
                  ? 'bg-sky-50 border-sky-500 font-bold text-sky-800 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="text-sm sm:text-base font-bold">{lang.native}</span>
              <span className="text-[10px] text-slate-400 mt-0.5">{lang.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Municipal Citizen Charter Standards */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-sky-100 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-emerald-600" />
          <h3 className="font-bold text-sm text-slate-900">Municipal Citizen Charter Guarantee</h3>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="font-semibold text-slate-500 block">Garbage & Sanitation:</span>
            <p className="font-bold text-slate-800 mt-0.5">12h Ack · 48h Resolution</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="font-semibold text-slate-500 block">Potholes & Roads:</span>
            <p className="font-bold text-slate-800 mt-0.5">24h Ack · 72h Resolution</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="font-semibold text-slate-500 block">Streetlights:</span>
            <p className="font-bold text-slate-800 mt-0.5">24h Ack · 48h Resolution</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="font-semibold text-slate-500 block">Water Pipeline Leak:</span>
            <p className="font-bold text-slate-800 mt-0.5">12h Ack · 48h Resolution</p>
          </div>
        </div>
      </div>

      {/* Cloud & Data Management */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-sky-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Database & Data Export</h3>
            <p className="text-xs text-slate-500">Download your complaint history or inspect Supabase cloud sync</p>
          </div>
          <button
            type="button"
            onClick={openSupabaseModal}
            className="px-3 py-1.5 rounded-xl border border-sky-200 bg-sky-50 text-sky-700 text-xs font-semibold hover:bg-sky-100"
          >
            {isSupabaseLive ? 'Supabase Live' : 'Demo Setup'}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <button
            type="button"
            onClick={exportCitizenData}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export Complaints JSON</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (confirm('Are you sure you want to restore default demo records?')) {
                resetAllDemoData();
                alert('Demo complaints restored.');
              }
            }}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4 text-slate-500" />
            <span>Reset Demo Records</span>
          </button>
        </div>
      </div>

      {/* Sign Out Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onLogout}
          className="w-full py-3 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-100 text-rose-700 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>{t.logout}</span>
        </button>
      </div>
    </div>
  );
};
