import React, { useState } from 'react';
import { ArrowUpCircle, AlertTriangle, ShieldCheck, X, Check } from 'lucide-react';
import { Complaint } from '../types';
import { useAuth } from '../context/AuthContext';
import { translations } from '../i18n/translations';

interface EscalationModalProps {
  complaint: Complaint;
  isOpen: boolean;
  onClose: () => void;
  onEscalate: (complaintId: string, reason: string, notes?: string) => Promise<void>;
}

export const EscalationModal: React.FC<EscalationModalProps> = ({
  complaint,
  isOpen,
  onClose,
  onEscalate
}) => {
  const { language } = useAuth();
  const t = translations[language];

  const currentLevel = complaint.escalationLevel || 1;
  const nextLevel = Math.min(currentLevel + 1, 3);

  const escalationLadder = [
    { level: 1, title: 'Ward Field Junior Engineer', desc: 'Primary field response & inspection team' },
    { level: 2, title: 'Executive Ward Officer / Assistant Commissioner', desc: 'Administrative supervisor overseeing ward operations' },
    { level: 3, title: 'Additional Municipal Commissioner / Central Grievance Cell', desc: 'Apex municipal authority with direct oversight' }
  ];

  const reasons = [
    'No acknowledgement received within statutory SLA window',
    'Field inspection overdue beyond guaranteed municipal charter',
    'Repair work commenced but abandoned without explanation',
    'Severe public safety hazard requiring immediate supervisory intervention',
    'Previous resolution attempt was unsatisfactory'
  ];

  const [selectedReason, setSelectedReason] = useState(reasons[0]);
  const [citizenNotes, setCitizenNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onEscalate(complaint.id, selectedReason, citizenNotes);
      setIsSubmitting(false);
      onClose();
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-700 to-indigo-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md">
              <ArrowUpCircle className="w-6 h-6 text-purple-200" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">
                {t.escalateComplaint}
              </h3>
              <p className="text-xs text-purple-200">
                Ticket #{complaint.publicReferenceId}
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

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
          {/* Notice banner */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              {t.escalationNotice} This creates an auditable record in the Municipal Commissioner Grievance Ledger.
            </span>
          </div>

          {/* Escalation Hierarchy ladder */}
          <div>
            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Municipal Escalation Ladder:
            </span>
            <div className="space-y-2">
              {escalationLadder.map(tier => {
                const isCurrent = tier.level === currentLevel;
                const isTarget = tier.level === nextLevel;

                return (
                  <div
                    key={tier.level}
                    className={`p-3 rounded-2xl border text-xs flex items-center justify-between ${
                      isTarget
                        ? 'bg-purple-50/80 border-purple-300 ring-2 ring-purple-100'
                        : isCurrent
                        ? 'bg-slate-50 border-slate-200 opacity-70'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">
                          Tier {tier.level}: {tier.title}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                            Current
                          </span>
                        )}
                        {isTarget && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-600 text-white font-bold animate-pulse">
                            Escalating To
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{tier.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Justification Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {t.escalationReason} *
            </label>
            <select
              value={selectedReason}
              onChange={e => setSelectedReason(e.target.value)}
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-purple-500 bg-white"
            >
              {reasons.map((r, i) => (
                <option key={i} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Citizen Follow-up Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Additional Citizen Remarks (Optional):
            </label>
            <textarea
              rows={3}
              value={citizenNotes}
              onChange={e => setCitizenNotes(e.target.value)}
              placeholder="Provide specific notes regarding the hazard or lack of officer response..."
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs sm:text-sm font-bold shadow-md shadow-purple-200 flex items-center gap-2 transition-transform active:scale-95 disabled:opacity-50"
            >
              <ArrowUpCircle className="w-4 h-4" />
              <span>{isSubmitting ? 'Recording Escalation...' : t.confirmEscalation}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
