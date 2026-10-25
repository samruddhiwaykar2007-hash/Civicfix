import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  Layers,
  ArrowRight,
  Edit2,
  Check,
  Building2,
  Flame,
  ShieldAlert
} from 'lucide-react';
import { AiAnalysisResponse, ComplaintCategory, ComplaintSeverity } from '../types';
import { useAuth } from '../context/AuthContext';
import { translations } from '../i18n/translations';

interface AiAnalysisCardProps {
  analysis: AiAnalysisResponse;
  selectedCategory: ComplaintCategory;
  onCategoryChange: (cat: ComplaintCategory) => void;
  selectedSeverity: ComplaintSeverity;
  onSeverityChange: (sev: ComplaintSeverity) => void;
  clarifyingAnswer: string;
  onClarifyingAnswerChange: (ans: string) => void;
  onConfirm: () => void;
  onReanalyze: () => void;
}

export const AiAnalysisCard: React.FC<AiAnalysisCardProps> = ({
  analysis,
  selectedCategory,
  onCategoryChange,
  selectedSeverity,
  onSeverityChange,
  clarifyingAnswer,
  onClarifyingAnswerChange,
  onConfirm,
  onReanalyze
}) => {
  const { language } = useAuth();
  const t = translations[language];

  const [isEditingCategory, setIsEditingCategory] = useState(false);

  const categories: { id: ComplaintCategory; name: string }[] = [
    { id: 'roads_potholes', name: t.categoryLabels.roads_potholes },
    { id: 'garbage_sanitation', name: t.categoryLabels.garbage_sanitation },
    { id: 'drainage_sewage', name: t.categoryLabels.drainage_sewage },
    { id: 'water_supply_leakage', name: t.categoryLabels.water_supply_leakage },
    { id: 'streetlights_lighting', name: t.categoryLabels.streetlights_lighting },
    { id: 'infrastructure_damage', name: t.categoryLabels.infrastructure_damage },
    { id: 'food_safety_health', name: t.categoryLabels.food_safety_health },
    { id: 'other_civic_issues', name: t.categoryLabels.other_civic_issues }
  ];

  const severities: ComplaintSeverity[] = ['Low', 'Medium', 'High', 'Critical'];

  const confidencePercent = Math.round(analysis.confidenceScore * 100);

  return (
    <div className="bg-gradient-to-b from-sky-50/70 to-white rounded-3xl border border-sky-100 p-5 sm:p-7 shadow-sm space-y-6">
      {/* Header with AI Model Badge & Confidence Meter */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center shadow-sm shadow-sky-200">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-slate-900">
                {t.aiReviewTitle}
              </h3>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 border border-sky-200">
                Gemini 3.8 Flash
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Multilingual complaint understanding & municipal department routing
            </p>
          </div>
        </div>

        {/* Confidence pill */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-sky-200 shadow-2xs">
          <span className="text-xs font-medium text-slate-600">{t.confidenceLabel}</span>
          <div className="flex items-center gap-1">
            <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  confidencePercent >= 85
                    ? 'bg-emerald-500'
                    : confidencePercent >= 70
                    ? 'bg-sky-500'
                    : 'bg-amber-500'
                }`}
                style={{ width: `${confidencePercent}%` }}
              />
            </div>
            <span className="text-xs font-bold text-slate-800">{confidencePercent}%</span>
          </div>
        </div>
      </div>

      {/* Citizen-Facing Interpretation Summary */}
      <div className="p-4 rounded-2xl bg-white border border-sky-100 shadow-2xs">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {language === 'mr' ? 'समस्या विश्लेषण' : language === 'hi' ? 'समस्या का सारांश' : 'Verified Issue Summary'}
            </p>
            <h4 className="text-sm sm:text-base font-bold text-slate-900">
              {analysis.suggestedTitle}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {analysis.citizenSummary}
            </p>
          </div>
        </div>
      </div>

      {/* Primary Category & Department Recommendation Review Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category Card */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <Layers className="w-4 h-4 text-sky-600" />
              <span>{t.suggestedCategory}</span>
            </div>
            <button
              type="button"
              onClick={() => setIsEditingCategory(!isEditingCategory)}
              className="text-xs text-sky-600 font-semibold hover:text-sky-700 flex items-center gap-1"
            >
              <Edit2 className="w-3 h-3" />
              <span>{isEditingCategory ? 'Done' : t.changeCategory}</span>
            </button>
          </div>

          {!isEditingCategory ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">
                {t.categoryLabels[selectedCategory] || selectedCategory}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium border border-emerald-100">
                Recommended
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-1.5 pt-1">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    onCategoryChange(cat.id);
                    setIsEditingCategory(false);
                  }}
                  className={`text-left text-xs px-3 py-2 rounded-xl border transition-colors flex items-center justify-between ${
                    selectedCategory === cat.id
                      ? 'border-sky-500 bg-sky-50 font-bold text-sky-800'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span>{cat.name}</span>
                  {selectedCategory === cat.id && <Check className="w-3.5 h-3.5 text-sky-600" />}
                </button>
              ))}
            </div>
          )}

          <p className="text-[11px] text-slate-500 leading-normal">
            {analysis.reasoning}
          </p>
        </div>

        {/* Responsible Department Card */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Building2 className="w-4 h-4 text-sky-600" />
            <span>{t.suggestedDepartment}</span>
          </div>

          <div>
            <h5 className="text-sm font-bold text-slate-900">
              {language === 'mr' && analysis.suggestedDepartmentNameMr
                ? analysis.suggestedDepartmentNameMr
                : language === 'hi' && analysis.suggestedDepartmentNameHi
                ? analysis.suggestedDepartmentNameHi
                : analysis.suggestedDepartmentName}
            </h5>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                <Clock className="w-3 h-3 text-sky-600" />
                <span>Ack SLA: {analysis.slaAckHours}h</span>
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                <Clock className="w-3 h-3 text-emerald-600" />
                <span>Target Fix: {analysis.slaResolveDays}d</span>
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 leading-normal">
            Deterministic civic routing policy allocates complaint tickets to this designated ward department.
          </p>
        </div>
      </div>

      {/* Visible Evidence vs Assumptions Checklist */}
      {analysis.visibleEvidence && analysis.visibleEvidence.length > 0 && (
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{t.visibleEvidenceLabel}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {analysis.visibleEvidence.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 text-xs text-slate-700 p-2 rounded-xl bg-slate-50 border border-slate-100"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="truncate">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Severity Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
        <div>
          <span className="block text-xs font-semibold text-slate-700">{t.severityLabel}</span>
          <span className="text-[11px] text-slate-500">Controls priority in the municipal field queue</span>
        </div>
        <div className="flex items-center gap-1.5">
          {severities.map(sev => (
            <button
              key={sev}
              type="button"
              onClick={() => onSeverityChange(sev)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedSeverity === sev
                  ? sev === 'Critical'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : sev === 'High'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t.severityLabels[sev] || sev}
            </button>
          ))}
        </div>
      </div>

      {/* Clarifying Question (If Ambiguous or Low Confidence) */}
      {analysis.clarifyingQuestion && analysis.clarifyingQuestion.trim().length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
            <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Clarification Needed for Municipal Dispatch:</span>
          </div>
          <p className="text-xs text-amber-900 font-medium">
            {analysis.clarifyingQuestion}
          </p>
          <input
            type="text"
            value={clarifyingAnswer}
            onChange={e => onClarifyingAnswerChange(e.target.value)}
            placeholder="Type quick clarification (e.g. In front of chemist shop, near pole 4)..."
            className="w-full px-3 py-2 text-xs rounded-xl border border-amber-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-white"
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onReanalyze}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
        >
          {t.reanalyze}
        </button>

        <button
          type="button"
          onClick={onConfirm}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-sky-200 flex items-center justify-center gap-2 transition-all active:scale-98"
        >
          <span>{t.confirmSuggestion}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
