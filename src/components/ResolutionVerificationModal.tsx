import React, { useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Image as ImageIcon, X } from 'lucide-react';
import { Complaint } from '../types';
import { useAuth } from '../context/AuthContext';
import { translations } from '../i18n/translations';

interface ResolutionVerificationModalProps {
  complaint: Complaint;
  isOpen: boolean;
  onClose: () => void;
  onVerify: (complaintId: string, isConfirmed: boolean, disputeReason?: string) => Promise<void>;
}

export const ResolutionVerificationModal: React.FC<ResolutionVerificationModalProps> = ({
  complaint,
  isOpen,
  onClose,
  onVerify
}) => {
  const { language } = useAuth();
  const t = translations[language];

  const [mode, setMode] = useState<'prompt' | 'dispute'>('prompt');
  const [disputeReason, setDisputeReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    await onVerify(complaint.id, true);
    setIsSubmitting(false);
    onClose();
  };

  const handleDisputeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeReason.trim()) {
      alert('Please describe why the issue persists before submitting.');
      return;
    }
    setIsSubmitting(true);
    await onVerify(complaint.id, false, disputeReason);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 to-emerald-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md">
              <CheckCircle2 className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">
                {t.verifyResolutionTitle}
              </h3>
              <p className="text-xs text-emerald-200">
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

        <div className="p-5 sm:p-6 space-y-5">
          {/* Officer Resolution Evidence */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Municipal Officer Remediation Report:
            </span>
            <p className="text-xs sm:text-sm text-slate-800 italic">
              "{complaint.resolutionNote || 'Maintenance department reported issue resolved.'}"
            </p>

            {complaint.resolutionEvidenceUrl && (
              <div>
                <span className="block text-[11px] font-medium text-slate-500 mb-1.5 flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-teal-600" />
                  <span>Completion Evidence Photograph:</span>
                </span>
                <img
                  src={complaint.resolutionEvidenceUrl}
                  alt="Resolution proof"
                  className="w-full h-44 object-cover rounded-xl border border-slate-200 shadow-2xs"
                />
              </div>
            )}
          </div>

          {mode === 'prompt' ? (
            <div className="space-y-4">
              <p className="text-sm font-semibold text-slate-800 text-center">
                {t.verifyResolutionPrompt}
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-200 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t.confirmResolved}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMode('dispute')}
                  className="flex-1 py-3 px-4 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <XCircle className="w-4 h-4" />
                  <span>{t.disputeResolution}</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleDisputeSubmit} className="space-y-4">
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>
                  Disputing this resolution will reopen the ticket and escalate it to the Supervising Ward Engineer for re-inspection.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.disputePrompt} *
                </label>
                <textarea
                  rows={3}
                  required
                  value={disputeReason}
                  onChange={e => setDisputeReason(e.target.value)}
                  placeholder="e.g. Only half of the pothole was filled, loose gravel left behind, or light is still flickering..."
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setMode('prompt')}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-rose-200 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4" />
                  <span>{isSubmitting ? 'Reopening...' : t.submitDispute}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
