import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useComplaints } from '../context/ComplaintContext';
import { translations } from '../i18n/translations';
import { Complaint } from '../types';
import { Search, MapPin, Clock, ArrowRight, ShieldCheck, AlertCircle, FileText } from 'lucide-react';

interface TrackSearchPageProps {
  onOpenDetail: (id: string) => void;
  onNewReport: () => void;
}

export const TrackSearchPage: React.FC<TrackSearchPageProps> = ({
  onOpenDetail,
  onNewReport
}) => {
  const { language } = useAuth();
  const { complaints, getComplaintByRef } = useComplaints();
  const t = translations[language];

  const [refInput, setRefInput] = useState('');
  const [searchedComplaint, setSearchedComplaint] = useState<Complaint | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refInput.trim()) return;

    setHasSearched(true);
    const found = getComplaintByRef(refInput.trim());
    setSearchedComplaint(found || null);
  };

  const sampleRefs = complaints.slice(0, 3);

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-16">
      {/* Search Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white mx-auto flex items-center justify-center shadow-md shadow-sky-200">
          <Search className="w-6 h-6" />
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          {t.trackIssueTitle}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          {t.trackIssueSubtitle}
        </p>
      </div>

      {/* Reference Input Form */}
      <form onSubmit={handleSearch} className="bg-white p-4 sm:p-6 rounded-3xl border border-sky-100 shadow-sm space-y-4">
        <div className="relative">
          <input
            type="text"
            value={refInput}
            onChange={e => setRefInput(e.target.value)}
            placeholder="Enter Public Reference ID (e.g. CFX-2026-MUM-84920)..."
            className="w-full pl-4 pr-12 py-3.5 text-xs sm:text-sm rounded-2xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500 font-mono"
          />
          <button
            type="submit"
            className="absolute right-2 top-2 bottom-2 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-transform active:scale-95"
          >
            Track
          </button>
        </div>

        {/* Quick Click Samples */}
        {sampleRefs.length > 0 && (
          <div className="pt-2 text-left">
            <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Or Try A Sample Complaint:
            </span>
            <div className="flex flex-wrap gap-2">
              {sampleRefs.map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setRefInput(c.publicReferenceId);
                    setSearchedComplaint(c);
                    setHasSearched(true);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 font-mono text-xs border border-sky-200 transition-colors"
                >
                  #{c.publicReferenceId}
                </button>
              ))}
            </div>
          </div>
        )}
      </form>

      {/* Search Result Display */}
      {hasSearched && (
        <div className="animate-in fade-in duration-200">
          {searchedComplaint ? (
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-sky-200 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-900">
                    #{searchedComplaint.publicReferenceId}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                      searchedComplaint.status === 'resolved' || searchedComplaint.status === 'closed'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : searchedComplaint.status === 'in_progress'
                        ? 'bg-sky-50 text-sky-700 border-sky-200'
                        : searchedComplaint.status === 'escalated'
                        ? 'bg-purple-50 text-purple-700 border-purple-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {t.statusLabels[searchedComplaint.status] || searchedComplaint.status}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">
                  {new Date(searchedComplaint.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  {searchedComplaint.title}
                </h3>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{searchedComplaint.address}</span>
                </p>
              </div>

              {/* Latest Timeline Event Preview */}
              {searchedComplaint.events.length > 0 && (
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Latest Official Action:
                  </span>
                  <p className="text-slate-800 font-medium">
                    {searchedComplaint.events[searchedComplaint.events.length - 1].description}
                  </p>
                  <span className="text-[10px] text-slate-400 block">
                    {new Date(searchedComplaint.events[searchedComplaint.events.length - 1].createdAt).toLocaleString()}
                  </span>
                </div>
              )}

              <button
                type="button"
                onClick={() => onOpenDetail(searchedComplaint.id)}
                className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-sky-200 flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                <span>View Full Audit Timeline & SLA</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
              <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">No matching complaint found</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Please verify the reference format (e.g. <code>CFX-2026-MUM-84920</code>) or report a new issue.
              </p>
              <button
                type="button"
                onClick={onNewReport}
                className="text-xs font-bold text-sky-600 hover:underline"
              >
                Report a New Issue Instead
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
