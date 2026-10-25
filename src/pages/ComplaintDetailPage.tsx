import React, { useState } from 'react';
import { Complaint } from '../types';
import { useAuth } from '../context/AuthContext';
import { useComplaints } from '../context/ComplaintContext';
import { translations } from '../i18n/translations';
import { TimelineView } from '../components/TimelineView';
import { EscalationModal } from '../components/EscalationModal';
import { ResolutionVerificationModal } from '../components/ResolutionVerificationModal';
import {
  ArrowLeft,
  MapPin,
  Clock,
  AlertTriangle,
  Building2,
  CheckCircle2,
  ShieldCheck,
  FileText,
  ArrowUpCircle,
  Sparkles,
  Layers,
  Wrench,
  UserCheck,
  CheckSquare
} from 'lucide-react';

interface ComplaintDetailPageProps {
  complaintId: string;
  onBack: () => void;
}

export const ComplaintDetailPage: React.FC<ComplaintDetailPageProps> = ({
  complaintId,
  onBack
}) => {
  const { language } = useAuth();
  const { complaints, escalateComplaint, verifyResolution, simulateOfficerAction } = useComplaints();
  const t = translations[language];

  const complaint = complaints.find(c => c.id === complaintId);

  const [isEscalateModalOpen, setIsEscalateModalOpen] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);

  if (!complaint) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-4">
        <h3 className="text-lg font-bold text-slate-800">Complaint Not Found</h3>
        <p className="text-xs text-slate-500">The requested complaint reference does not exist or has been removed.</p>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-semibold hover:bg-sky-700"
        >
          Return to Complaints
        </button>
      </div>
    );
  }

  // Calculate SLA Remaining or Overdue
  const now = new Date().getTime();
  const ackDeadline = new Date(complaint.acknowledgementDeadline).getTime();
  const resDeadline = new Date(complaint.resolutionDeadline).getTime();
  const isAckPast = now > ackDeadline;
  const isResPast = now > resDeadline;

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Complaints</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
            #{complaint.publicReferenceId}
          </span>
          {complaint.isDemo && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
              Demo Audit Record
            </span>
          )}
        </div>
      </div>

      {/* Main Status & SLA Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-sky-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border ${
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

              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                {t.categoryLabels[complaint.categoryId] || complaint.categoryId}
              </span>

              {complaint.escalationLevel > 1 && (
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-800">
                  Escalation Tier {complaint.escalationLevel}
                </span>
              )}
            </div>

            <h1 className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {complaint.title}
            </h1>
          </div>

          {/* Primary Action Button (Escalate or Verify Resolution) */}
          <div className="flex flex-wrap items-center gap-2">
            {complaint.status === 'resolved' && complaint.resolutionConfirmedByCitizen === undefined && (
              <button
                type="button"
                onClick={() => setIsVerifyModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-sm shadow-emerald-200 flex items-center gap-2 animate-bounce transition-transform"
              >
                <CheckSquare className="w-4 h-4" />
                <span>Verify Resolution</span>
              </button>
            )}

            {(complaint.isOverdue || complaint.status === 'submitted' || isAckPast) && complaint.status !== 'closed' && (
              <button
                type="button"
                onClick={() => setIsEscalateModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs sm:text-sm font-bold shadow-sm shadow-purple-200 flex items-center gap-2 transition-transform active:scale-95"
              >
                <ArrowUpCircle className="w-4 h-4" />
                <span>{t.escalateComplaint}</span>
              </button>
            )}
          </div>
        </div>

        {/* SLA Timers & Department Routing Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Responsible Department:
            </span>
            <p className="text-xs sm:text-sm font-bold text-slate-900">
              {complaint.assignedDepartmentId}
            </p>
            <span className="text-[11px] text-slate-500">Assigned via deterministic municipal routing</span>
          </div>

          <div className={`p-3.5 rounded-2xl border ${
            isAckPast && complaint.status === 'submitted'
              ? 'bg-rose-50 border-rose-200 text-rose-900'
              : 'bg-slate-50 border-slate-200 text-slate-800'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider opacity-75">
                Acknowledgement SLA:
              </span>
              {isAckPast && complaint.status === 'submitted' && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-rose-200 text-rose-900">
                  Breached
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm font-bold mt-1">
              {new Date(complaint.acknowledgementDeadline).toLocaleString([], {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
            <span className="text-[11px] opacity-75">
              {isAckPast && complaint.status === 'submitted' ? 'Overdue for field response' : 'Standard 24h statutory window'}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Target Resolution:
            </span>
            <p className="text-xs sm:text-sm font-bold text-slate-900">
              {new Date(complaint.resolutionDeadline).toLocaleDateString([], {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
            <span className="text-[11px] text-slate-500">SLA Citizen Charter Standard</span>
          </div>
        </div>
      </div>

      {/* Complaint Evidence & Incident Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Photo Evidence */}
        <div className="bg-white p-5 rounded-3xl border border-sky-100 shadow-xs space-y-3">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-sky-600" />
            <span>Complaint Evidence & Details</span>
          </h3>

          {complaint.attachments[0]?.storagePath ? (
            <img
              src={complaint.attachments[0].storagePath}
              alt={complaint.title}
              className="w-full h-56 object-cover rounded-2xl border border-slate-200 shadow-2xs"
            />
          ) : (
            <div className="w-full h-40 bg-slate-100 rounded-2xl flex items-center justify-center text-xs text-slate-400">
              No photographic attachment provided
            </div>
          )}

          <div className="space-y-2 text-xs">
            <div>
              <span className="font-bold text-slate-700 block">Citizen Original Description ({complaint.originalLanguage.toUpperCase()}):</span>
              <p className="text-slate-600 italic mt-0.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                "{complaint.originalDescription}"
              </p>
            </div>

            <div>
              <span className="font-bold text-slate-700 block">Standardized Municipal Technical Description:</span>
              <p className="text-slate-800 font-medium mt-0.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                {complaint.normalizedDescription}
              </p>
            </div>
          </div>
        </div>

        {/* Location & AI Audit Confidence */}
        <div className="bg-white p-5 rounded-3xl border border-sky-100 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-sky-600" />
            <span>Location & Audit Verification</span>
          </h3>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div>
              <span className="font-bold text-slate-700 block">Physical Address:</span>
              <p className="text-slate-800 font-medium mt-0.5">{complaint.address || 'Street Coordinates Recorded'}</p>
            </div>

            {complaint.latitude && complaint.longitude && (
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between font-mono text-[11px] text-slate-600">
                <span>Lat: {complaint.latitude.toFixed(5)}</span>
                <span>Lng: {complaint.longitude.toFixed(5)}</span>
                <span className="text-emerald-700 font-sans font-semibold">{complaint.locationSource}</span>
              </div>
            )}
          </div>

          {/* AI Metadata Box */}
          <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-100 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sky-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                <span>AI Confidence Rating</span>
              </span>
              <span className="font-bold text-sky-800">
                {Math.round(complaint.aiConfidenceScore * 100)}% ({complaint.aiConfidenceBand})
              </span>
            </div>
            {complaint.aiMetadata?.visibleEvidence && (
              <div>
                <span className="font-semibold text-slate-600 block text-[11px]">Visible Evidence Verified:</span>
                <ul className="list-disc list-inside text-slate-700 text-[11px] mt-0.5 space-y-0.5">
                  {complaint.aiMetadata.visibleEvidence.map((ev, i) => (
                    <li key={i}>{ev}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Resolution Review Card if Resolved */}
          {complaint.status === 'resolved' && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
              <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Field Remediation Submitted by Officer</span>
              </span>
              <p className="text-xs text-emerald-800 italic">
                "{complaint.resolutionNote || 'Remediation completed.'}"
              </p>
              {complaint.resolutionConfirmedByCitizen === undefined ? (
                <button
                  type="button"
                  onClick={() => setIsVerifyModalOpen(true)}
                  className="w-full py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-xs"
                >
                  Verify or Dispute Resolution
                </button>
              ) : complaint.resolutionConfirmedByCitizen ? (
                <div className="text-[11px] font-bold text-emerald-700">
                  Citizen confirmed issue resolved. Ticket verified closed.
                </div>
              ) : (
                <div className="text-[11px] font-bold text-rose-700">
                  Citizen disputed resolution. Reopened for supervisory review.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Visual Timeline of Events (Section 8) */}
      <div className="bg-white p-5 sm:p-7 rounded-3xl border border-sky-100 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {t.timelineTitle}
            </h2>
            <p className="text-xs text-slate-500">
              {t.timelineSubtitle}
            </p>
          </div>
          <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
            {complaint.events.length} Milestones
          </span>
        </div>

        <TimelineView events={complaint.events} />
      </div>

      {/* Interactive Demonstration Controls (Section 16 Demo Mode) */}
      <div className="p-5 rounded-3xl bg-slate-900 text-white space-y-3 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-sky-400" />
            <h4 className="font-bold text-xs sm:text-sm text-sky-200">
              Judges / Demo Test Actions (Simulate Officer Lifecycle):
            </h4>
          </div>
          <span className="text-[10px] text-slate-400">Simulate official responses in real time</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => simulateOfficerAction(complaint.id, 'acknowledge')}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 text-center transition-colors"
          >
            1. Officer Acknowledge
          </button>
          <button
            type="button"
            onClick={() => simulateOfficerAction(complaint.id, 'dispatch_crew')}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 text-center transition-colors"
          >
            2. Dispatch Crew
          </button>
          <button
            type="button"
            onClick={() => simulateOfficerAction(complaint.id, 'submit_resolution')}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-semibold border border-slate-700 text-center transition-colors"
          >
            3. Mark Resolved
          </button>
          <button
            type="button"
            onClick={() => simulateOfficerAction(complaint.id, 'make_overdue')}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-semibold border border-slate-700 text-center transition-colors"
          >
            4. Fast-forward Overdue
          </button>
        </div>
      </div>

      {/* Modals */}
      <EscalationModal
        complaint={complaint}
        isOpen={isEscalateModalOpen}
        onClose={() => setIsEscalateModalOpen(false)}
        onEscalate={escalateComplaint}
      />

      <ResolutionVerificationModal
        complaint={complaint}
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        onVerify={verifyResolution}
      />
    </div>
  );
};
