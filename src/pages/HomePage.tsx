import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useComplaints } from '../context/ComplaintContext';
import { translations } from '../i18n/translations';
import {
  PlusCircle,
  Search,
  FileText,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Shield,
  MapPin,
  ChevronRight,
  Info,
  Building2,
  Award
} from 'lucide-react';

interface HomePageProps {
  setCurrentTab: (tab: string) => void;
  openTrackingDetail: (id: string) => void;
  openSupabaseModal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  setCurrentTab,
  openTrackingDetail,
  openSupabaseModal
}) => {
  const { user, language } = useAuth();
  const { complaints } = useComplaints();
  const t = translations[language];

  // Calculate citizen stats
  const totalOpen = complaints.filter(c => c.status === 'submitted' || c.status === 'under_review').length;
  const inProgress = complaints.filter(c => c.status === 'in_progress').length;
  const resolved = complaints.filter(c => c.status === 'resolved' || c.status === 'closed').length;
  const overdueCount = complaints.filter(c => c.isOverdue || c.status === 'escalated').length;

  const recentComplaints = [...complaints]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-700 via-sky-800 to-slate-900 text-white p-6 sm:p-10 shadow-lg">
        {/* Subtle decorative background circles */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-sky-500/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-teal-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-sky-200 text-xs font-semibold mb-4 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-sky-300" />
            <span>CivicTech Multilingual Platform</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            {t.welcomeBack}, {user ? user.displayName.split(' ')[0] : 'Citizen'}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-sky-100 font-medium leading-relaxed">
            {t.tagline}
          </p>
          <p className="mt-1 text-xs sm:text-sm text-sky-200/80 max-w-xl">
            Report civic issues in your native language (मराठी, हिन्दी, English). AI classifies the evidence, assigns the responsible municipal department, and tracks resolution deadlines.
          </p>

          {/* Quick Metrics Bar */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10">
            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/5">
              <span className="block text-[11px] text-sky-200 uppercase font-semibold">{t.openComplaints}</span>
              <span className="text-xl sm:text-2xl font-black text-white">{totalOpen}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/5">
              <span className="block text-[11px] text-sky-200 uppercase font-semibold">{t.inProgressComplaints}</span>
              <span className="text-xl sm:text-2xl font-black text-white">{inProgress}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/5">
              <span className="block text-[11px] text-sky-200 uppercase font-semibold">{t.resolvedComplaints}</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-300">{resolved}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/5">
              <span className="block text-[11px] text-rose-300 uppercase font-semibold">{t.overdueComplaints}</span>
              <span className="text-xl sm:text-2xl font-black text-rose-300">{overdueCount}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Primary Citizen Actions */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            {t.quickActions}
          </h2>
          <span className="text-xs text-slate-500">Citizen Self-Service Hub</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Action 1: Report an Issue */}
          <div
            onClick={() => setCurrentTab('report')}
            className="group relative bg-white p-6 rounded-3xl border border-sky-100 shadow-xs hover:shadow-md hover:border-sky-300 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-teal-500 text-white flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-sm shadow-sky-200">
                <PlusCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1 group-hover:text-sky-700 transition-colors">
                {t.reportIssueTitle}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {t.reportIssueSubtitle}
              </p>
            </div>
            <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-sky-600 group-hover:translate-x-1 transition-transform">
              <span>Start Report</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Action 2: Track My Complaints */}
          <div
            onClick={() => setCurrentTab('track')}
            className="group relative bg-white p-6 rounded-3xl border border-sky-100 shadow-xs hover:shadow-md hover:border-sky-300 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-sky-600 text-white flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-sm shadow-indigo-200">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1 group-hover:text-indigo-700 transition-colors">
                {t.trackIssueTitle}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {t.trackIssueSubtitle}
              </p>
            </div>
            <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-transform">
              <span>Search Status</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Action 3: My Complaints */}
          <div
            onClick={() => setCurrentTab('complaints')}
            className="group relative bg-white p-6 rounded-3xl border border-sky-100 shadow-xs hover:shadow-md hover:border-sky-300 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-600 text-white flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-sm shadow-teal-200">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1 group-hover:text-teal-700 transition-colors">
                {t.myComplaintsTitle}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {t.myComplaintsSubtitle}
              </p>
            </div>
            <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-teal-600 group-hover:translate-x-1 transition-transform">
              <span>View All ({complaints.length})</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </section>

      {/* How CivicFix Works: 3 Concise Steps */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-xs">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-4">
          {t.howItWorksTitle}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 font-bold text-xs flex items-center justify-center shrink-0">
              1
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">{t.step1Title}</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {t.step1Desc}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
              2
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">{t.step2Title}</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {t.step2Desc}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0">
              3
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">{t.step3Title}</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {t.step3Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Complaint Updates / Feed */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            {t.recentActivity}
          </h2>
          <button
            onClick={() => setCurrentTab('complaints')}
            className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {recentComplaints.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-slate-200">
            <Info className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">{t.noComplaintsYet}</p>
            <p className="text-xs text-slate-400 mt-1">{t.noComplaintsDesc}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentComplaints.map(complaint => (
              <div
                key={complaint.id}
                onClick={() => openTrackingDetail(complaint.id)}
                className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-sky-300 hover:shadow-sm transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3.5">
                  {complaint.attachments[0]?.storagePath ? (
                    <img
                      src={complaint.attachments[0].storagePath}
                      alt={complaint.title}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-xs shrink-0">
                      CFX
                    </div>
                  )}

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-slate-900">
                        #{complaint.publicReferenceId}
                      </span>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {t.categoryLabels[complaint.categoryId] || complaint.categoryId}
                      </span>
                      {complaint.isOverdue && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 animate-pulse">
                          {t.overdueBadge}
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 line-clamp-1">
                      {complaint.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1 line-clamp-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{complaint.address || 'Location Coordinates Recorded'}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                      complaint.status === 'resolved' || complaint.status === 'closed'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : complaint.status === 'in_progress'
                        ? 'bg-sky-50 text-sky-700 border-sky-200'
                        : complaint.status === 'escalated'
                        ? 'bg-purple-50 text-purple-700 border-purple-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {t.statusLabels[complaint.status] || complaint.status}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Statutory Citizen Charter & Department Directory */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 mb-1">
              <Award className="w-3 h-3 text-amber-600" />
              <span>STATUTORY SERVICE GUARANTEE</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Department SLA Directory & Citizen Charter
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">Right to Public Services Act (RTS Compliant)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800">Roads & Footpaths</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">SLA: 48 Hrs</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Potholes, open trenches, damaged curbs, broken pavers.
            </p>
            <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
              <span>Nodal: Exec. Engineer</span>
              <span className="font-semibold text-emerald-700">98.2% on-time</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800">Solid Waste (SWM)</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">SLA: 24 Hrs</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Garbage dumps, overflowing bins, debris, carcass clearance.
            </p>
            <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
              <span>Nodal: Health Officer</span>
              <span className="font-semibold text-emerald-700">99.1% on-time</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800">Water Supply & Sewage</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">SLA: 24-72 Hrs</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Pipeline burst, contaminated water, manhole overflow.
            </p>
            <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
              <span>Nodal: Hydraulic Eng.</span>
              <span className="font-semibold text-emerald-700">96.8% on-time</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800">Street Lighting & Power</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">SLA: 24 Hrs</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Dark spots, flickering poles, exposed high-voltage wiring.
            </p>
            <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
              <span>Nodal: Electrical Supt.</span>
              <span className="font-semibold text-emerald-700">97.5% on-time</span>
            </div>
          </div>
        </div>
      </section>

      {/* Citizen Privacy Notice Banner */}
      <section className="p-4 sm:p-5 rounded-2xl bg-sky-50/60 border border-sky-100 flex items-start gap-3">
        <Shield className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-600 space-y-1">
          <p className="font-bold text-slate-800">{t.privacyNoticeTitle}</p>
          <p className="leading-relaxed">
            {t.privacyNoticeBody} Photographs and GPS coordinates are utilized solely to direct municipal field crews and establish statutory SLA audit timestamps.
          </p>
        </div>
      </section>
    </div>
  );
};
