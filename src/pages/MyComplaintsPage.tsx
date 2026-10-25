import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useComplaints } from '../context/ComplaintContext';
import { translations } from '../i18n/translations';
import { ComplaintStatus, ComplaintCategory } from '../types';
import {
  Search,
  Filter,
  MapPin,
  Clock,
  AlertTriangle,
  ChevronRight,
  PlusCircle,
  FileText,
  SlidersHorizontal
} from 'lucide-react';

interface MyComplaintsPageProps {
  onSelectComplaint: (id: string) => void;
  onNewReport: () => void;
}

export const MyComplaintsPage: React.FC<MyComplaintsPageProps> = ({
  onSelectComplaint,
  onNewReport
}) => {
  const { language } = useAuth();
  const { complaints } = useComplaints();
  const t = translations[language];

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'latest_update' | 'oldest'>('latest_update');

  const filteredComplaints = complaints
    .filter(c => {
      // Search filter
      const matchesSearch =
        c.publicReferenceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.address && c.address.toLowerCase().includes(searchQuery.toLowerCase()));

      // Status filter
      let matchesStatus = true;
      if (statusFilter === 'submitted') matchesStatus = c.status === 'submitted';
      else if (statusFilter === 'under_review') matchesStatus = c.status === 'under_review';
      else if (statusFilter === 'in_progress') matchesStatus = c.status === 'in_progress';
      else if (statusFilter === 'resolved') matchesStatus = c.status === 'resolved' || c.status === 'closed';
      else if (statusFilter === 'overdue') matchesStatus = c.isOverdue || c.status === 'escalated';

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'latest_update') {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      } else {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
    });

  const filterTabs = [
    { id: 'all', label: t.filterAll, count: complaints.length },
    { id: 'submitted', label: t.filterSubmitted, count: complaints.filter(c => c.status === 'submitted').length },
    { id: 'in_progress', label: t.filterInProgress, count: complaints.filter(c => c.status === 'in_progress').length },
    { id: 'resolved', label: t.filterResolved, count: complaints.filter(c => c.status === 'resolved' || c.status === 'closed').length },
    { id: 'overdue', label: t.filterOverdue, count: complaints.filter(c => c.isOverdue || c.status === 'escalated').length }
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {t.myComplaintsTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {t.myComplaintsSubtitle}
          </p>
        </div>

        <button
          onClick={onNewReport}
          className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-bold shadow-sm shadow-sky-200 flex items-center gap-2 self-start sm:self-auto transition-transform active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report New Grievance</span>
        </button>
      </div>

      {/* Search & Sort Controls */}
      <div className="bg-white p-4 rounded-2xl border border-sky-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500 bg-slate-50 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-slate-600 font-medium">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
          <span>Sort by:</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="py-1.5 px-2 rounded-lg border border-slate-200 text-xs bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500"
          >
            <option value="latest_update">Latest Activity</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {filterTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              statusFilter === tab.id
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                statusFilter === tab.id ? 'bg-sky-700 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Complaint List */}
      {filteredComplaints.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
          <FileText className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No complaints found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery || statusFilter !== 'all'
              ? 'Try modifying your search term or active status filter.'
              : 'You have not submitted any complaints yet. Use the button above to file a report.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredComplaints.map(complaint => (
            <div
              key={complaint.id}
              onClick={() => onSelectComplaint(complaint.id)}
              className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 hover:border-sky-300 hover:shadow-sm transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
            >
              <div className="flex items-start gap-4 flex-1">
                {/* Photo Thumbnail */}
                {complaint.attachments[0]?.storagePath ? (
                  <img
                    src={complaint.attachments[0].storagePath}
                    alt={complaint.title}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-200 shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-xs shrink-0 border border-sky-100">
                    CFX
                  </div>
                )}

                <div className="space-y-1 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                      #{complaint.publicReferenceId}
                    </span>
                    <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {t.categoryLabels[complaint.categoryId] || complaint.categoryId}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      complaint.severity === 'Critical'
                        ? 'bg-rose-100 text-rose-800'
                        : complaint.severity === 'High'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-sky-50 text-sky-800'
                    }`}>
                      {complaint.severity} Priority
                    </span>
                    {complaint.isOverdue && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 animate-pulse">
                        <AlertTriangle className="w-3 h-3" />
                        <span>{t.overdueBadge}</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-sky-700 transition-colors line-clamp-1">
                    {complaint.title}
                  </h3>

                  <p className="text-xs text-slate-500 flex items-center gap-1 line-clamp-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{complaint.address || 'Location Coordinates Logged'}</span>
                  </p>

                  <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Updated {new Date(complaint.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                    </span>
                    {complaint.events.length > 0 && (
                      <span>· {complaint.events.length} audit milestones</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Badge & Arrow */}
              <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                <span
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${
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
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
