import { Language, ComplaintCategory, ComplaintStatus, ComplaintSeverity } from '../types';

export interface Translations {
  appName: string;
  tagline: string;
  navHome: string;
  navReport: string;
  navTrack: string;
  navComplaints: string;
  navProfile: string;
  login: string;
  signup: string;
  logout: string;
  demoMode: string;
  demoNotice: string;
  welcomeBack: string;
  openComplaints: string;
  inProgressComplaints: string;
  resolvedComplaints: string;
  overdueComplaints: string;
  quickActions: string;
  reportIssueTitle: string;
  reportIssueSubtitle: string;
  trackIssueTitle: string;
  trackIssueSubtitle: string;
  myComplaintsTitle: string;
  myComplaintsSubtitle: string;
  howItWorksTitle: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  recentActivity: string;
  noComplaintsYet: string;
  noComplaintsDesc: string;
  photoStepTitle: string;
  photoStepSubtitle: string;
  capturePhoto: string;
  uploadPhoto: string;
  retakePhoto: string;
  removePhoto: string;
  locationTitle: string;
  detectGps: string;
  detectingGps: string;
  gpsSuccess: string;
  manualAddressLabel: string;
  manualAddressPlaceholder: string;
  describeStepTitle: string;
  describeStepSubtitle: string;
  descriptionPlaceholder: string;
  promptExample1: string;
  promptExample2: string;
  promptExample3: string;
  quickPrompts: string;
  helpMeDescribe: string;
  analyzingWithAi: string;
  analyzingSubtext: string;
  aiReviewTitle: string;
  aiReviewSubtitle: string;
  suggestedCategory: string;
  suggestedDepartment: string;
  reasoningLabel: string;
  visibleEvidenceLabel: string;
  confidenceLabel: string;
  severityLabel: string;
  changeCategory: string;
  confirmSuggestion: string;
  reanalyze: string;
  finalReviewTitle: string;
  finalReviewSubtitle: string;
  submitComplaint: string;
  submitting: string;
  submissionSuccessTitle: string;
  submissionSuccessSubtitle: string;
  referenceIdLabel: string;
  submittedOn: string;
  viewTrackingTimeline: string;
  backToHome: string;
  timelineTitle: string;
  timelineSubtitle: string;
  searchPlaceholder: string;
  filterAll: string;
  filterSubmitted: string;
  filterUnderReview: string;
  filterInProgress: string;
  filterResolved: string;
  filterOverdue: string;
  escalateComplaint: string;
  escalationNotice: string;
  escalationLevel: string;
  escalatedTo: string;
  escalationReason: string;
  confirmEscalation: string;
  slaAckTimer: string;
  slaResolveTimer: string;
  overdueBadge: string;
  verifyResolutionTitle: string;
  verifyResolutionPrompt: string;
  confirmResolved: string;
  disputeResolution: string;
  disputePrompt: string;
  submitDispute: string;
  auditTrailTitle: string;
  privacyNoticeTitle: string;
  privacyNoticeBody: string;
  languageSelectLabel: string;
  statusLabels: Record<ComplaintStatus, string>;
  categoryLabels: Record<ComplaintCategory, string>;
  severityLabels: Record<ComplaintSeverity, string>;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: 'CivicFix',
    tagline: 'Report It. Track It. Get It Resolved.',
    navHome: 'Home',
    navReport: 'Report Issue',
    navTrack: 'Track',
    navComplaints: 'My Complaints',
    navProfile: 'Profile',
    login: 'Sign In',
    signup: 'Create Citizen Account',
    logout: 'Sign Out',
    demoMode: 'Demo Mode (Local Persistence)',
    demoNotice: 'Running in demonstrative mode with local storage. Real Gemini AI & Supabase can be activated.',
    welcomeBack: 'Welcome, Citizen',
    openComplaints: 'Open Complaints',
    inProgressComplaints: 'In Progress',
    resolvedComplaints: 'Resolved',
    overdueComplaints: 'Overdue / Escalated',
    quickActions: 'Citizen Services',
    reportIssueTitle: 'Report an Issue',
    reportIssueSubtitle: 'Upload photo & GPS location. AI will classify and route to the correct municipal ward.',
    trackIssueTitle: 'Track My Complaints',
    trackIssueSubtitle: 'Enter complaint reference ID to view real-time audit milestones and SLA timelines.',
    myComplaintsTitle: 'My Complaints',
    myComplaintsSubtitle: 'View all your submitted grievances, official updates, and resolution statuses.',
    howItWorksTitle: 'How CivicFix Works',
    step1Title: '1. Snap & Describe',
    step1Desc: 'Photograph the issue and add a short voice or written note in Marathi, Hindi, or English.',
    step2Title: '2. AI Municipal Routing',
    step2Desc: 'Gemini AI identifies the exact municipal department and initiates deterministic SLA tracking.',
    step3Title: '3. Transparent Resolution',
    step3Desc: 'Track live progress. If overdue, escalate to senior ward commissioners with an auditable trail.',
    recentActivity: 'Recent Complaint Activity',
    noComplaintsYet: 'No complaints submitted yet',
    noComplaintsDesc: 'Notice an issue in your locality? Roads, garbage, broken streetlights? Submit a report now.',
    photoStepTitle: 'Step 1: Capture the Civic Issue',
    photoStepSubtitle: 'Provide a clear photograph and verify the incident location.',
    capturePhoto: 'Take Photo with Camera',
    uploadPhoto: 'Upload Image File',
    retakePhoto: 'Retake / Change Photo',
    removePhoto: 'Remove Photo',
    locationTitle: 'Incident Location',
    detectGps: 'Detect GPS Location',
    detectingGps: 'Locating via Browser GPS...',
    gpsSuccess: 'GPS Coordinates Captured',
    manualAddressLabel: 'Or Enter Street Address / Landmark:',
    manualAddressPlaceholder: 'e.g. Near Dadar Station West, Senapati Bapat Marg, Mumbai',
    describeStepTitle: 'Step 2: Describe the Problem',
    describeStepSubtitle: 'Write naturally in Marathi, Hindi, or English. AI will interpret and standardize.',
    descriptionPlaceholder: 'Tell us what happened... (e.g., Deep pothole causing skids, garbage bin overflowing for 3 days)',
    promptExample1: 'Road pothole near junction',
    promptExample2: 'Garbage not collected',
    promptExample3: 'Streetlight not working',
    quickPrompts: 'Quick Examples:',
    helpMeDescribe: 'Help Me Describe with AI',
    analyzingWithAi: 'Analyzing with Gemini AI...',
    analyzingSubtext: 'Detecting language, inspecting photographic evidence, and calculating department routing...',
    aiReviewTitle: 'Step 3: AI Analysis & Department Routing',
    aiReviewSubtitle: 'Review the AI suggestions before sending to the municipal authority.',
    suggestedCategory: 'Suggested Category:',
    suggestedDepartment: 'Responsible Department:',
    reasoningLabel: 'AI Reasoning & Evidence:',
    visibleEvidenceLabel: 'Visible Evidence Detected:',
    confidenceLabel: 'Confidence Score:',
    severityLabel: 'Suggested Severity:',
    changeCategory: 'Change Category',
    confirmSuggestion: 'Looks Good, Continue',
    reanalyze: 'Re-Analyze',
    finalReviewTitle: 'Step 4: Final Verification & Submit',
    finalReviewSubtitle: 'Confirm the details before official submission to the municipal grievance cell.',
    submitComplaint: 'Submit Complaint',
    submitting: 'Submitting to Municipal Registry...',
    submissionSuccessTitle: 'Complaint Submitted Successfully!',
    submissionSuccessSubtitle: 'Your grievance has been logged in the municipal audit registry.',
    referenceIdLabel: 'Public Tracking Reference ID',
    submittedOn: 'Logged Timestamp',
    viewTrackingTimeline: 'View Tracking Timeline',
    backToHome: 'Back to Citizen Dashboard',
    timelineTitle: 'Complaint Tracking & Audit Trail',
    timelineSubtitle: 'Transparent, immutable event history from submission to resolution.',
    searchPlaceholder: 'Search by reference ID or title...',
    filterAll: 'All',
    filterSubmitted: 'Submitted',
    filterUnderReview: 'Under Review',
    filterInProgress: 'In Progress',
    filterResolved: 'Resolved',
    filterOverdue: 'Overdue / Escalated',
    escalateComplaint: 'Escalate to Higher Authority',
    escalationNotice: 'This complaint has exceeded its official response deadline. You may trigger formal escalation.',
    escalationLevel: 'Current Escalation Tier',
    escalatedTo: 'Escalated Authority',
    escalationReason: 'Escalation Justification',
    confirmEscalation: 'Record Formal Escalation',
    slaAckTimer: 'Acknowledgement SLA Deadline',
    slaResolveTimer: 'Target Resolution Deadline',
    overdueBadge: 'SLA Overdue',
    verifyResolutionTitle: 'Resolution Verification',
    verifyResolutionPrompt: 'The municipal department has marked this complaint resolved. Does the fix meet your satisfaction?',
    confirmResolved: 'Yes, Confirm Issue Resolved',
    disputeResolution: 'No, Issue Persists (Dispute)',
    disputePrompt: 'Please describe why the issue remains unresolved. A supervisor will review:',
    submitDispute: 'Submit Dispute & Reopen',
    auditTrailTitle: 'Immutable Civic Audit Log',
    privacyNoticeTitle: 'Citizen Privacy & Data Protection',
    privacyNoticeBody: 'Your GPS coordinates and photos are utilized strictly for municipal remediation. Personal contact data is never made public.',
    languageSelectLabel: 'Language / भाषा',
    statusLabels: {
      submitted: 'Submitted',
      under_review: 'Under Review',
      in_progress: 'In Progress',
      resolved: 'Resolved (Pending Citizen Check)',
      closed: 'Closed & Verified',
      escalated: 'Escalated to Supervisor'
    },
    categoryLabels: {
      roads_potholes: 'Roads & Potholes',
      garbage_sanitation: 'Garbage & Sanitation',
      drainage_sewage: 'Drainage & Sewage',
      water_supply_leakage: 'Water Supply & Leakage',
      streetlights_lighting: 'Streetlights & Public Lighting',
      infrastructure_damage: 'Public Infrastructure Damage',
      food_safety_health: 'Food Safety & Public Health',
      other_civic_issues: 'Other Civic Grievance'
    },
    severityLabels: {
      Low: 'Low',
      Medium: 'Medium',
      High: 'High',
      Critical: 'Critical'
    }
  },
  mr: {
    appName: 'सिव्हिकफिक्स (CivicFix)',
    tagline: 'नोंदवा. ट्रॅक करा. सोडवून घ्या.',
    navHome: 'मुख्यपृष्ठ',
    navReport: 'तक्रार नोंदवा',
    navTrack: 'ट्रॅक करा',
    navComplaints: 'माझ्या तक्रारी',
    navProfile: 'माझे प्रोफाईल',
    login: 'लॉगिन करा',
    signup: 'नागरिक खाते उघडा',
    logout: 'बाहेर पडा',
    demoMode: 'डेमो मोड (स्थानिक जतन)',
    demoNotice: 'स्थानिक स्टोरेजसह डेमो मोड सुरू आहे. जेमिनी AI आणि सुप्राबेस सक्रिय करता येईल.',
    welcomeBack: 'स्वागत आहे, नागरिक',
    openComplaints: 'प्रलंबित तक्रारी',
    inProgressComplaints: 'काम सुरू आहे',
    resolvedComplaints: 'निवारण झाले',
    overdueComplaints: 'मुदत उलटलेल्या / वाढवलेल्या',
    quickActions: 'नागरिक सेवा',
    reportIssueTitle: 'नागरी समस्या नोंदवा',
    reportIssueSubtitle: 'फोटो व स्थान (GPS) जोडा. AI अचूक पालिका विभागाकडे तक्रार पाठवेल.',
    trackIssueTitle: 'तक्रार ट्रॅक करा',
    trackIssueSubtitle: 'तक्रार संदर्भ क्रमांक टाकून थेट प्रगती व मुदत तपासा.',
    myComplaintsTitle: 'माझ्या सर्व तक्रारी',
    myComplaintsSubtitle: 'तुम्ही दाखल केलेल्या तक्रारींची स्थिती व अधिकृत उत्तरे पहा.',
    howItWorksTitle: 'सिव्हिकफिक्स कसे कार्य करते?',
    step1Title: '१. फोटो व माहिती द्या',
    step1Desc: 'समस्येचा फोटो काढा आणि मराठीत संक्षिप्त वर्णन लिहा किंवा बोला.',
    step2Title: '२. AI द्वारे योग्य विभाग निवड',
    step2Desc: 'जेमिनी AI अचूक पालिका विभागाची शिफारस करते आणि मुदत ठरवते.',
    step3Title: '३. पारदर्शक निवारण व पाठपुरावा',
    step3Desc: 'कामाची प्रगती तपासा. वेळेत काम न झाल्यास वरिष्ठ अधिकाऱ्यांकडे तक्रार वाढवा.',
    recentActivity: 'अलीकडील हालचाली',
    noComplaintsYet: 'अद्याप कोणतीही तक्रार नोंदवलेली नाही',
    noComplaintsDesc: 'परिसरात खड्डा, कचरा किंवा पथदिवे बंद आहेत का? आत्ताच तक्रार नोंदवा.',
    photoStepTitle: 'पायरी १: समस्येचा फोटो घ्या',
    photoStepSubtitle: 'स्पष्ट फोटो द्या आणि घटनेचे अचूक ठिकाण निश्चित करा.',
    capturePhoto: 'कॅमेऱ्याने फोटो काढा',
    uploadPhoto: 'गॅलरीतून फोटो अपलोड करा',
    retakePhoto: 'दुसरा फोटो घ्या',
    removePhoto: 'फोटो काढा',
    locationTitle: 'घटनेचे ठिकाण',
    detectGps: 'GPS द्वारे ठिकाण मिळवा',
    detectingGps: 'GPS शोधत आहे...',
    gpsSuccess: 'GPS स्थान नोंदवले गेले',
    manualAddressLabel: 'किंवा पत्ता / प्रसिद्ध खूण टाका:',
    manualAddressPlaceholder: 'उदा. दादर पश्चिम स्टेशनजवळ, सेनापती बापट मार्ग, मुंबई',
    describeStepTitle: 'पायरी २: समस्येचे वर्णन करा',
    describeStepSubtitle: 'मराठीत साध्या शब्दांत लिहा. AI त्याचे योग्य वर्गीकरण करेल.',
    descriptionPlaceholder: 'समस्या काय आहे ते सांगा... (उदा. या रस्त्यावर मोठा खड्डा आहे, ३ दिवसांपासून कचरा उचलला नाही)',
    promptExample1: 'रस्त्यावर मोठा खड्डा',
    promptExample2: 'कचरा साचला आहे',
    promptExample3: 'पथदिवे बंद आहेत',
    quickPrompts: 'उदाहरणे:',
    helpMeDescribe: 'AI कडून मदतीची विनंती',
    analyzingWithAi: 'जेमिनी AI द्वारे विश्लेषण सुरू आहे...',
    analyzingSubtext: 'भाषा ओळखणे, पुरावे तपासणे आणि पालिका विभाग निश्चित करण्याचे काम सुरू आहे...',
    aiReviewTitle: 'पायरी ३: AI शिफारस व विभाग निवड',
    aiReviewSubtitle: 'तक्रार पालिकेकडे पाठवण्यापूर्वी AI शिफारसी तपासून घ्या.',
    suggestedCategory: 'शिफारस केलेली श्रेणी:',
    suggestedDepartment: 'जबाबदार पालिका विभाग:',
    reasoningLabel: 'AI विश्लेषण व कारण:',
    visibleEvidenceLabel: 'फोटोमध्ये आढळलेले पुरावे:',
    confidenceLabel: 'विश्वासार्हता निर्देशांक:',
    severityLabel: 'समस्येचे गांभीर्य:',
    changeCategory: 'श्रेणी बदला',
    confirmSuggestion: 'माहिती योग्य आहे, पुढे चला',
    reanalyze: 'पुन्हा विश्लेषण करा',
    finalReviewTitle: 'पायरी ४: अंतिम पुनरावलोकन व सबमिट',
    finalReviewSubtitle: 'तक्रार अधिकृतपणे दाखल करण्यापूर्वी सर्व तपशील तपासा.',
    submitComplaint: 'तक्रार दाखल करा',
    submitting: 'नोंदणी होत आहे...',
    submissionSuccessTitle: 'तक्रार यशस्वीरित्या नोंदवली गेली!',
    submissionSuccessSubtitle: 'आपली तक्रार पालिका अभिलेखात सुरक्षितपणे नोंदवली आहे.',
    referenceIdLabel: 'सार्वजनिक तक्रार संदर्भ क्रमांक',
    submittedOn: 'नोंदणीची तारीख व वेळ',
    viewTrackingTimeline: 'प्रगती टाइमलाइन पहा',
    backToHome: 'मुख्यपृष्ठावर परत जा',
    timelineTitle: 'तक्रार प्रगती व ऑडिट ट्रेल',
    timelineSubtitle: 'नोंदणीपासून ते निवारणापर्यंतचा पारदर्शक अधिकृत इतिहास.',
    searchPlaceholder: 'संदर्भ क्रमांक किंवा शीर्षक शोधा...',
    filterAll: 'सर्व',
    filterSubmitted: 'नोंदवलेली',
    filterUnderReview: 'तपासणी सुरू',
    filterInProgress: 'काम प्रगतीत',
    filterResolved: 'निवारण झाले (पडताळणी बाकी)',
    filterOverdue: 'मुदत संपलेली / वाढवलेली',
    escalateComplaint: 'वरिष्ठ अधिकाऱ्यांकडे वाढवा (Escalate)',
    escalationNotice: 'या तक्रारीची अधिकृत प्रतिसाद मुदत संपली आहे. आपण वरिष्ठ स्तरावर तक्रार नोंदवू शकता.',
    escalationLevel: 'सध्याचा तक्रार स्तर',
    escalatedTo: 'तक्रार वर्ग केलेले अधिकारी',
    escalationReason: 'तक्रार वाढवण्याचे कारण',
    confirmEscalation: 'अधिकृत तक्रार वाढ नोंदवा',
    slaAckTimer: 'पोचपावतीची अधिकृत मुदत',
    slaResolveTimer: 'निवारणाची लक्ष्य तारीख',
    overdueBadge: 'मुदत संपली (Overdue)',
    verifyResolutionTitle: 'निवारण पडताळणी',
    verifyResolutionPrompt: 'पालिका विभागाने ही तक्रार सोडवली असल्याचे चिन्हांकित केले आहे. कामाबद्दल आपले समाधान आहे का?',
    confirmResolved: 'होय, समस्या सुटली आहे',
    disputeResolution: 'नाही, समस्या कायम आहे (तक्रार पुन्हा उघडा)',
    disputePrompt: 'समस्या का सुटलेली नाही याचे कारण लिहा. वरिष्ठ अधिकारी पुनर्परीक्षण करतील:',
    submitDispute: 'तक्रार पुन्हा उघडा',
    auditTrailTitle: 'अपरिवर्तनीय नागरी ऑडिट नोंद',
    privacyNoticeTitle: 'नागरिक गोपनीयता व डेटा सुरक्षा',
    privacyNoticeBody: 'आपले GPS स्थान व फोटो केवळ नागरी निवारणासाठी वापरले जातात. आपली वैयक्तिक माहिती सार्वजनिक केली जात नाही.',
    languageSelectLabel: 'भाषा / Language',
    statusLabels: {
      submitted: 'नोंदवली गेली',
      under_review: 'तपासणी सुरू',
      in_progress: 'काम प्रगतीपथावर',
      resolved: 'निवारण झाले (पडताळणी बाकी)',
      closed: 'बंद व प्रमाणित',
      escalated: 'वरिष्ठांकडे वर्ग (Escalated)'
    },
    categoryLabels: {
      roads_potholes: 'रस्ते व खड्डे',
      garbage_sanitation: 'कचरा व स्वच्छता',
      drainage_sewage: 'सांडपाणी व गटारे',
      water_supply_leakage: 'पाणी पुरवठा व गळती',
      streetlights_lighting: 'पथदिवे व वीज पुरवठा',
      infrastructure_damage: 'सार्वजनिक पायाभूत सुविधांचे नुकसान',
      food_safety_health: 'अन्न सुरक्षा व सार्वजनिक आरोग्य',
      other_civic_issues: 'इतर नागरी समस्या'
    },
    severityLabels: {
      Low: 'कमी',
      Medium: 'मध्यम',
      High: 'जास्त',
      Critical: 'अतिगंभीर'
    }
  },
  hi: {
    appName: 'सिविकफिक्स (CivicFix)',
    tagline: 'दर्ज करें। ट्रैक करें। समाधान पाएं।',
    navHome: 'होम',
    navReport: 'समस्या दर्ज करें',
    navTrack: 'ट्रैक करें',
    navComplaints: 'मेरी शिकायतें',
    navProfile: 'मेरी प्रोफाइल',
    login: 'लॉग इन करें',
    signup: 'नागरिक खाता बनाएं',
    logout: 'लॉग आउट',
    demoMode: 'डेमो मोड (स्थानीय डेटा)',
    demoNotice: 'लोकल स्टोरेज के साथ डेमो मोड चल रहा है। जेमिनी AI व सुपाबेस जोड़ा जा सकता है।',
    welcomeBack: 'स्वागत है, नागरिक',
    openComplaints: 'लंबित शिकायतें',
    inProgressComplaints: 'कार्य प्रगति पर',
    resolvedComplaints: 'समाधान हो चुका',
    overdueComplaints: 'समय सीमा पार / एस्केलेटेड',
    quickActions: 'नागरिक सेवाएं',
    reportIssueTitle: 'नागरिक समस्या दर्ज करें',
    reportIssueSubtitle: 'फोटो व स्थान (GPS) दें। AI सही नगरपालिका विभाग को भेजेगा।',
    trackIssueTitle: 'शिकायत ट्रैक करें',
    trackIssueSubtitle: 'शिकायत संदर्भ संख्या दर्ज कर स्थिति और समय सीमा देखें।',
    myComplaintsTitle: 'मेरी सभी शिकायतें',
    myComplaintsSubtitle: 'अपनी दर्ज की गई शिकायतों की वर्तमान स्थिति और सरकारी कार्यवाई देखें।',
    howItWorksTitle: 'सिविकफिक्स कैसे काम करता है?',
    step1Title: '१. फोटो लें और बताएं',
    step1Desc: 'समस्या की फोटो लें और हिंदी में संक्षिप्त विवरण लिखें।',
    step2Title: '२. AI द्वारा विभाग आवंटन',
    step2Desc: 'जेमिनी AI सही नगरपालिका विभाग की पहचान कर समय सीमा तय करता है।',
    step3Title: '३. पारदर्शी समाधान व ट्रैकिंग',
    step3Desc: 'प्रगति ट्रैक करें। देरी होने पर वरिष्ठ अधिकारियों को सीधे एस्केलेट करें।',
    recentActivity: 'हालिया गतिविधियां',
    noComplaintsYet: 'अभी तक कोई शिकायत दर्ज नहीं है',
    noComplaintsDesc: 'क्या आपके क्षेत्र में गड्ढा, कचरा या स्ट्रीट लाइट खराब है? अभी शिकायत दर्ज करें।',
    photoStepTitle: 'चरण १: समस्या की फोटो लें',
    photoStepSubtitle: 'साफ तस्वीर अपलोड करें और स्थान की पुष्टि करें।',
    capturePhoto: 'कैमरे से फोटो लें',
    uploadPhoto: 'गैलरी से फोटो अपलोड करें',
    retakePhoto: 'दूसरी फोटो लें',
    removePhoto: 'फोटो हटाएं',
    locationTitle: 'घटना का स्थान',
    detectGps: 'GPS द्वारा स्थान पहचानें',
    detectingGps: 'GPS खोज रहा है...',
    gpsSuccess: 'GPS स्थान दर्ज हो गया',
    manualAddressLabel: 'या सड़क का पता / निकटतम पहचान चिह्न लिखें:',
    manualAddressPlaceholder: 'उदा. दादर वेस्ट स्टेशन के पास, सेनापति बापट मार्ग, मुंबई',
    describeStepTitle: 'चरण २: समस्या का विवरण दें',
    describeStepSubtitle: 'हिंदी में सहजता से लिखें। AI इसका सही वर्गीकरण करेगा।',
    descriptionPlaceholder: 'बताएं क्या समस्या है... (उदा. यहाँ सड़क पर बड़ा गड्ढा है, नाली का पानी सड़क पर बह रहा है)',
    promptExample1: 'सड़क पर बड़ा गड्ढा',
    promptExample2: 'कचरा नहीं उठाया गया',
    promptExample3: 'स्ट्रीट लाइट बंद है',
    quickPrompts: 'उदाहरण:',
    helpMeDescribe: 'AI से विवरण में सहायता लें',
    analyzingWithAi: 'जेमिनी AI विश्लेषण कर रहा है...',
    analyzingSubtext: 'भाषा की पहचान, फोटो के साक्ष्य और नगरपालिका विभाग का चयन जारी है...',
    aiReviewTitle: 'चरण ३: AI सुझाव एवं विभाग चयन',
    aiReviewSubtitle: 'शिकायत भेजने से पहले AI द्वारा चुने गए विभाग की समीक्षा करें।',
    suggestedCategory: 'अनुशंसित श्रेणी:',
    suggestedDepartment: 'जिम्मेदार नगरपालिका विभाग:',
    reasoningLabel: 'AI कारण एवं साक्ष्य:',
    visibleEvidenceLabel: 'फोटो में मिले स्पष्ट साक्ष्य:',
    confidenceLabel: 'सटीकता स्कोर:',
    severityLabel: 'गंभीरता स्तर:',
    changeCategory: 'श्रेणी बदलें',
    confirmSuggestion: 'विवरण सही है, आगे बढ़ें',
    reanalyze: 'पुनः विश्लेषण करें',
    finalReviewTitle: 'चरण ४: अंतिम समीक्षा और जमा करें',
    finalReviewSubtitle: 'नगरपालिका को भेजने से पहले सभी विवरण जांचें।',
    submitComplaint: 'शिकायत दर्ज करें',
    submitting: 'शिकायत दर्ज हो रही है...',
    submissionSuccessTitle: 'शिकायत सफलतापूर्वक दर्ज हो गई!',
    submissionSuccessSubtitle: 'आपकी शिकायत नगरपालिका रिकॉर्ड में सुरक्षित रूप से दर्ज कर दी गई है।',
    referenceIdLabel: 'सार्वजनिक ट्रैकिंग संदर्भ संख्या',
    submittedOn: 'दर्ज करने का समय',
    viewTrackingTimeline: 'प्रगति टाइमलाइन देखें',
    backToHome: 'नागरिक डैशबोर्ड पर वापस जाएं',
    timelineTitle: 'शिकायत ट्रैकिंग एवं ऑडिट ट्रेल',
    timelineSubtitle: 'शिकायत दर्ज होने से लेकर समाधान तक का पारदर्शी इतिहास।',
    searchPlaceholder: 'संदर्भ संख्या या शीर्षक खोजें...',
    filterAll: 'सभी',
    filterSubmitted: 'दर्ज हुई',
    filterUnderReview: 'समीक्षाधीन',
    filterInProgress: 'प्रगति पर',
    filterResolved: 'समाधानित (सत्यापन बाकी)',
    filterOverdue: 'समय सीमा पार / एस्केलेटेड',
    escalateComplaint: 'उच्च अधिकारी को एस्केलेट करें',
    escalationNotice: 'इस शिकायत की आधिकारिक समय सीमा समाप्त हो गई है। आप इसे उच्च स्तर पर बढ़ा सकते हैं।',
    escalationLevel: 'वर्तमान स्तर',
    escalatedTo: 'एस्केलेट किया गया पद',
    escalationReason: 'एस्केलेशन का कारण',
    confirmEscalation: 'औपचारिक एस्केलेशन दर्ज करें',
    slaAckTimer: 'पावती की आधिकारिक समय सीमा',
    slaResolveTimer: 'समाधान की निर्धारित तारीख',
    overdueBadge: 'समय सीमा पार (Overdue)',
    verifyResolutionTitle: 'समाधान सत्यापन',
    verifyResolutionPrompt: 'नगरपालिका विभाग ने इस शिकायत को हल चिह्नित किया है। क्या आप इस कार्य से संतुष्ट हैं?',
    confirmResolved: 'हाँ, समस्या हल हो गई है',
    disputeResolution: 'नहीं, समस्या अभी भी बनी हुई है',
    disputePrompt: 'कृपया बताएं कि समस्या का समाधान क्यों नहीं हुआ। पर्यवेक्षक अधिकारी इसकी जांच करेंगे:',
    submitDispute: 'शिकायत पुनः खोलें',
    auditTrailTitle: 'अपरिवर्तनीय नागरिक ऑडिट लॉग',
    privacyNoticeTitle: 'नागरिक गोपनीयता एवं डेटा सुरक्षा',
    privacyNoticeBody: 'आपका GPS स्थान व फोटो केवल नागरिक समस्याओं के निवारण हेतु उपयोग किए जाते हैं। आपकी निजी जानकारी कभी सार्वजनिक नहीं की जाएगी।',
    languageSelectLabel: 'भाषा / Language',
    statusLabels: {
      submitted: 'दर्ज हुई',
      under_review: 'समीक्षाधीन',
      in_progress: 'कार्य प्रगति पर',
      resolved: 'समाधानित (सत्यापन बाकी)',
      closed: 'बंद एवं सत्यापित',
      escalated: 'वरिष्ठ अधिकारी को एस्केलेट (Escalated)'
    },
    categoryLabels: {
      roads_potholes: 'सड़क एवं गड्ढे',
      garbage_sanitation: 'कचरा एवं स्वच्छता',
      drainage_sewage: 'जल निकासी एवं सीवरेज',
      water_supply_leakage: 'जल आपूर्ति एवं लीकेज',
      streetlights_lighting: 'स्ट्रीट लाइट एवं प्रकाश व्यवस्था',
      infrastructure_damage: 'सार्वजनिक अवसंरचना क्षति',
      food_safety_health: 'खाद्य सुरक्षा एवं जन स्वास्थ्य',
      other_civic_issues: 'अन्य नागरिक समस्याएं'
    },
    severityLabels: {
      Low: 'कम',
      Medium: 'मध्यम',
      High: 'अधिक',
      Critical: 'अति गंभीर'
    }
  }
};
