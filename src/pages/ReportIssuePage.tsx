import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useComplaints } from '../context/ComplaintContext';
import { translations } from '../i18n/translations';
import { CameraCapture } from '../components/CameraCapture';
import { LocationPicker } from '../components/LocationPicker';
import { AiAnalysisCard } from '../components/AiAnalysisCard';
import {
  AiAnalysisResponse,
  ComplaintCategory,
  ComplaintSeverity,
  Language,
  Complaint
} from '../types';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  FileText,
  Building2,
  MapPin,
  Clock,
  Layers,
  Send
} from 'lucide-react';

interface ReportIssuePageProps {
  onComplaintSubmitted: (complaintId: string) => void;
  onCancel: () => void;
}

export const ReportIssuePage: React.FC<ReportIssuePageProps> = ({
  onComplaintSubmitted,
  onCancel
}) => {
  const { language } = useAuth();
  const { createComplaint } = useComplaints();
  const t = translations[language];

  // Wizard Step: 1 (Media/Location) -> 2 (Describe & AI) -> 3 (Review AI Suggestions) -> 4 (Final Submit) -> 5 (Confirmed)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [latitude, setLatitude] = useState<number | undefined>(19.0178);
  const [longitude, setLongitude] = useState<number | undefined>(72.8358);
  const [address, setAddress] = useState<string>('Near Dadar Flower Market, Senapati Bapat Marg, Dadar West, Mumbai 400028');
  const [locationSource, setLocationSource] = useState<'gps_browser' | 'manual_address' | 'map_pin'>('gps_browser');

  const [description, setDescription] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AiAnalysisResponse | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<ComplaintCategory>('roads_potholes');
  const [selectedSeverity, setSelectedSeverity] = useState<ComplaintSeverity>('High');
  const [clarifyingAnswer, setClarifyingAnswer] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedComplaint, setSubmittedComplaint] = useState<Complaint | null>(null);

  // Quick Prompt Helpers for Marathi, Hindi, and English
  const quickPrompts = [
    {
      label: language === 'mr' ? 'रस्त्यावर मोठा खड्डा' : language === 'hi' ? 'सड़क पर गड्ढा' : 'Deep Road Pothole',
      text: language === 'mr'
        ? 'या रस्त्यावर मोठा खड्डा पडला असून वाहने घसरत आहेत. तातडीने डांबरीकरण हवे.'
        : language === 'hi'
        ? 'सड़क पर बहुत बड़ा गड्ढा हो गया है, जिससे दुर्घटना की आशंका बनी हुई है।'
        : 'There is a deep road cavity and broken asphalt creating severe risk of vehicular accidents.'
    },
    {
      label: language === 'mr' ? 'कचरा कुंडी तुंबली' : language === 'hi' ? 'कचरे का ढेर' : 'Overflowing Waste',
      text: language === 'mr'
        ? 'कचरा कुंडी ३ दिवसांपासून उचललेली नाही. प्रचंड दुर्गंधी सुटली आहे.'
        : language === 'hi'
        ? 'यहाँ पिछले कई दिनों से कचरा नहीं उठाया गया है। दुर्गंध के कारण सांस लेना मुश्किल है।'
        : 'Community waste receptacle overflowing with uncollected garbage creating sanitary danger.'
    },
    {
      label: language === 'mr' ? 'पथदिवे बंद आहेत' : language === 'hi' ? 'स्ट्रीट लाइट बंद' : 'Streetlights Out',
      text: language === 'mr'
        ? 'गेल्या एका आठवड्यापासून या रस्त्यावरील पथदिवे बंद आहेत, रात्री अंधार असतो.'
        : language === 'hi'
        ? 'यहाँ की स्ट्रीट लाइट कई दिनों से खराब है। रात के समय अंधेरा रहता है।'
        : 'Public streetlight luminaires along this corridor are completely non-functional.'
    }
  ];

  // Call Server-Side Gemini API
  const runAiAnalysis = async (customDesc?: string) => {
    const textToAnalyze = customDesc !== undefined ? customDesc : description;
    if (!textToAnalyze.trim() && !photoDataUrl) {
      setAnalysisError('Please provide either a photo or a short description to analyze.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const response = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: textToAnalyze,
          imageBase64: photoDataUrl || undefined,
          mimeType: 'image/jpeg',
          userLanguage: language
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const resData = await response.json();
      if (resData.success && resData.data) {
        const data: AiAnalysisResponse = resData.data;
        setAnalysisResult(data);
        setSelectedCategory(data.suggestedCategory);
        setSelectedSeverity(data.severity || 'Medium');
        setCurrentStep(3); // Advance to AI Review Step
      } else {
        throw new Error(resData.error || 'Failed to process AI analysis');
      }
    } catch (err: any) {
      console.error('AI Analysis failed:', err);
      setAnalysisError('Could not connect to Gemini AI. You may proceed by manually choosing your category.');
      // Auto fallback
      const fallbackData: AiAnalysisResponse = {
        detectedLanguage: language,
        suggestedTitle: description.slice(0, 40) || 'Civic Problem Report',
        suggestedTitleEn: 'Civic Problem Report',
        suggestedCategory: 'roads_potholes',
        severity: 'Medium',
        confidenceScore: 0.75,
        confidenceBand: 'Moderate',
        citizenSummary: 'Report categorized under standard municipal civic framework.',
        standardizedDescriptionEn: description || 'Civic grievance reported by citizen.',
        visibleEvidence: photoDataUrl ? ['Photographic evidence uploaded'] : ['Citizen written description'],
        reasoning: 'Standard routing based on user input.',
        missingInformation: '',
        suggestedNextStep: 'Submit report to notify municipal field cell.',
        suggestedDepartmentId: 'dept_roads',
        suggestedDepartmentName: 'Roads & Public Works Department (PWD)',
        suggestedDepartmentNameMr: 'रस्ते व सार्वजनिक बांधकाम विभाग',
        suggestedDepartmentNameHi: 'सड़क एवं लोक निर्माण विभाग',
        slaAckHours: 24,
        slaResolveDays: 3
      };
      setAnalysisResult(fallbackData);
      setSelectedCategory('roads_potholes');
      setCurrentStep(3);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      const created = await createComplaint({
        title: analysisResult?.suggestedTitle || description.slice(0, 50) || 'Civic Grievance',
        originalDescription: description || 'Photographic complaint report without description.',
        normalizedDescription: analysisResult?.standardizedDescriptionEn || description,
        originalLanguage: (analysisResult?.detectedLanguage as Language) || language,
        categoryId: selectedCategory,
        citizenConfirmedCategory: selectedCategory,
        suggestedDepartmentId: analysisResult?.suggestedDepartmentId || 'dept_general_administration',
        assignedDepartmentId: analysisResult?.suggestedDepartmentId || 'dept_general_administration',
        severity: selectedSeverity,
        aiConfidenceScore: analysisResult?.confidenceScore || 0.85,
        aiConfidenceBand: analysisResult?.confidenceBand || 'High',
        aiMetadata: {
          visibleEvidence: analysisResult?.visibleEvidence,
          reasoning: analysisResult?.reasoning,
          clarifyingAnswer: clarifyingAnswer || undefined
        },
        latitude,
        longitude,
        address,
        locationSource,
        photoDataUrl: photoDataUrl || undefined,
        slaAckHours: analysisResult?.slaAckHours || 24,
        slaResolveDays: analysisResult?.slaResolveDays || 3
      });

      setSubmittedComplaint(created);
      setCurrentStep(5); // Advance to confirmation
    } catch (err) {
      console.error('Submission failed:', err);
      alert('Failed to submit complaint. Please check your network and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* Wizard Progress Stepper */}
      {currentStep < 5 && (
        <div className="bg-white p-4 rounded-2xl border border-sky-100 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
            <span>
              {currentStep === 1
                ? 'Step 1 of 4: Photo & Location'
                : currentStep === 2
                ? 'Step 2 of 4: Natural Language Description'
                : currentStep === 3
                ? 'Step 3 of 4: AI Department Routing'
                : 'Step 4 of 4: Final Review & Submission'}
            </span>
            <span className="text-sky-600 font-mono">
              {Math.round((currentStep / 4) * 100)}%
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-teal-500 transition-all duration-300 rounded-full"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* STEP 1: CAPTURE PHOTO & LOCATION */}
      {currentStep === 1 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-5 sm:p-7 rounded-3xl border border-sky-100 shadow-xs space-y-5">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                {t.photoStepTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                {t.photoStepSubtitle}
              </p>
            </div>

            {/* Photo Capture & Upload Box */}
            <CameraCapture
              imageDataUrl={photoDataUrl}
              setImageDataUrl={setPhotoDataUrl}
            />

            {/* Location Picker */}
            <LocationPicker
              latitude={latitude}
              longitude={longitude}
              address={address}
              locationSource={locationSource}
              onLocationChange={data => {
                setLatitude(data.latitude);
                setLongitude(data.longitude);
                setAddress(data.address);
                setLocationSource(data.locationSource);
              }}
            />

            {/* Step 1 Next Button */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-sky-200 flex items-center gap-2 transition-transform active:scale-95"
              >
                <span>Continue to Description</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: NATURAL LANGUAGE DESCRIPTION & AI INITIATION */}
      {currentStep === 2 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-5 sm:p-7 rounded-3xl border border-sky-100 shadow-xs space-y-5">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                {t.describeStepTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                {t.describeStepSubtitle}
              </p>
            </div>

            {/* Photo & Location Mini Preview */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                {photoDataUrl ? (
                  <img
                    src={photoDataUrl}
                    alt="Preview"
                    className="w-10 h-10 rounded-lg object-cover border border-slate-300 shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center font-bold text-xs shrink-0">
                    No Img
                  </div>
                )}
                <div className="truncate">
                  <p className="font-semibold text-slate-800 truncate">{address}</p>
                  <span className="text-[10px] text-slate-400">
                    {photoDataUrl ? 'Photo attached' : 'No photo attached'} · {locationSource}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="text-xs text-sky-600 font-semibold hover:underline shrink-0"
              >
                Edit
              </button>
            </div>

            {/* Description Textarea */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Describe the problem in Marathi (मराठी), Hindi (हिन्दी), or English:
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder={t.descriptionPlaceholder}
                className="w-full p-3.5 text-xs sm:text-sm rounded-2xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500 bg-white"
              />
            </div>

            {/* Quick Prompt Suggestions */}
            <div>
              <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                {t.quickPrompts}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {quickPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setDescription(p.text);
                    }}
                    className="p-2.5 text-left rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 transition-colors text-xs text-slate-700"
                  >
                    <span className="font-bold text-sky-700 block mb-0.5">{p.label}</span>
                    <span className="line-clamp-2 text-[11px] text-slate-500">{p.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {analysisError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{analysisError}</span>
              </div>
            )}

            {/* Step 2 Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => runAiAnalysis()}
                disabled={isAnalyzing}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-sky-200 flex items-center gap-2 transition-transform active:scale-95 disabled:opacity-50"
              >
                <Sparkles className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
                <span>{isAnalyzing ? t.analyzingWithAi : 'Analyze with Gemini AI'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: AI ANALYSIS & DEPARTMENT RECOMMENDATION */}
      {currentStep === 3 && analysisResult && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <AiAnalysisCard
            analysis={analysisResult}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedSeverity={selectedSeverity}
            onSeverityChange={setSelectedSeverity}
            clarifyingAnswer={clarifyingAnswer}
            onClarifyingAnswerChange={setClarifyingAnswer}
            onConfirm={() => setCurrentStep(4)}
            onReanalyze={() => setCurrentStep(2)}
          />
        </div>
      )}

      {/* STEP 4: FINAL SUMMARY & FORMAL SUBMISSION */}
      {currentStep === 4 && analysisResult && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-5 sm:p-7 rounded-3xl border border-sky-100 shadow-xs space-y-6">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                {t.finalReviewTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                {t.finalReviewSubtitle}
              </p>
            </div>

            {/* Complaint Summary Card */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Complaint Title
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    {analysisResult.suggestedTitle}
                  </h3>
                </div>
                <span className="self-start sm:self-auto text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
                  {t.categoryLabels[selectedCategory] || selectedCategory}
                </span>
              </div>

              {/* Photo & Location preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {photoDataUrl && (
                  <div>
                    <span className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Evidence Photograph:
                    </span>
                    <img
                      src={photoDataUrl}
                      alt="Complaint preview"
                      className="w-full h-36 object-cover rounded-xl border border-slate-200"
                    />
                  </div>
                )}

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-semibold text-slate-500 block">Incident Location:</span>
                    <p className="font-medium text-slate-800 mt-0.5">{address}</p>
                    {latitude && longitude && (
                      <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                        GPS: {latitude.toFixed(5)}, {longitude.toFixed(5)} ({locationSource})
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="font-semibold text-slate-500 block">Target Municipal Department:</span>
                    <p className="font-bold text-slate-900 mt-0.5">
                      {language === 'mr' && analysisResult.suggestedDepartmentNameMr
                        ? analysisResult.suggestedDepartmentNameMr
                        : language === 'hi' && analysisResult.suggestedDepartmentNameHi
                        ? analysisResult.suggestedDepartmentNameHi
                        : analysisResult.suggestedDepartmentName}
                    </p>
                    <span className="text-[10px] text-slate-500">
                      Ack SLA: {analysisResult.slaAckHours}h · Target Resolution: {analysisResult.slaResolveDays}d
                    </span>
                  </div>
                </div>
              </div>

              {/* Original & Standardized Description */}
              <div className="pt-2 border-t border-slate-200 space-y-2 text-xs">
                <div>
                  <span className="font-semibold text-slate-500 block">Citizen Original Description ({analysisResult.detectedLanguage.toUpperCase()}):</span>
                  <p className="text-slate-700 italic mt-0.5">
                    "{description || 'Provided via photographic evidence.'}"
                  </p>
                </div>
                <div>
                  <span className="font-semibold text-slate-500 block">Standardized Municipal Technical Description:</span>
                  <p className="text-slate-800 font-medium mt-0.5 bg-white p-2.5 rounded-xl border border-slate-200">
                    {analysisResult.standardizedDescriptionEn}
                  </p>
                </div>
              </div>
            </div>

            {/* Privacy reminder */}
            <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-100 flex items-start gap-2.5 text-xs text-slate-600">
              <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <span>
                By submitting, your complaint enters the immutable municipal grievance ledger. An audit ID will be generated to track SLA milestones.
              </span>
            </div>

            {/* Submission Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Review</span>
              </button>

              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-200 flex items-center gap-2 transition-transform active:scale-95 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? t.submitting : t.submitComplaint}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: SUBMISSION SUCCESS & CONFIRMATION SCREEN */}
      {currentStep === 5 && submittedComplaint && (
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-sky-100 shadow-md text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              {t.submissionSuccessTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
              {t.submissionSuccessSubtitle}
            </p>
          </div>

          {/* Reference ID Banner */}
          <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 max-w-md mx-auto space-y-1">
            <span className="text-[11px] font-semibold text-sky-800 uppercase tracking-wider">
              {t.referenceIdLabel}
            </span>
            <div className="text-xl sm:text-2xl font-mono font-black text-sky-950 tracking-wider">
              {submittedComplaint.publicReferenceId}
            </div>
            <p className="text-[11px] text-slate-500">
              {t.submittedOn}: {new Date(submittedComplaint.createdAt).toLocaleString()}
            </p>
          </div>

          {/* Next Steps Information */}
          <div className="max-w-md mx-auto text-left p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div className="flex items-center gap-2 text-slate-800 font-bold">
              <Clock className="w-4 h-4 text-sky-600" />
              <span>Next Expected Action:</span>
            </div>
            <p className="text-slate-600">
              Assigned to <strong>{submittedComplaint.assignedDepartmentId}</strong>. Field inspection acknowledgement is scheduled within <strong>24 hours</strong>. If delayed, you can escalate via the tracking timeline.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onComplaintSubmitted(submittedComplaint.id)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-sky-200 flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <span>{t.viewTrackingTimeline}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-300 text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-50"
            >
              {t.backToHome}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
