import { Complaint, AppNotification, UserProfile } from '../types';

const COMPLAINTS_STORAGE_KEY = 'civicfix_complaints_v1';
const NOTIFICATIONS_STORAGE_KEY = 'civicfix_notifications_v1';
const USER_STORAGE_KEY = 'civicfix_user_v1';

export const DEMO_USERS: UserProfile[] = [
  {
    id: 'user_ramesh_patil',
    displayName: 'Ramesh Patil (रमेश पाटील)',
    email: 'ramesh.patil@example.in',
    preferredLanguage: 'mr',
    createdAt: '2026-09-15T10:00:00.000Z',
    isDemo: true
  },
  {
    id: 'user_pooja_sharma',
    displayName: 'Pooja Sharma (पूजा शर्मा)',
    email: 'pooja.sharma@example.in',
    preferredLanguage: 'hi',
    createdAt: '2026-09-18T14:30:00.000Z',
    isDemo: true
  },
  {
    id: 'user_arjun_mehta',
    displayName: 'Arjun Mehta',
    email: 'arjun.mehta@example.in',
    preferredLanguage: 'en',
    createdAt: '2026-10-01T09:15:00.000Z',
    isDemo: true
  }
];

export const INITIAL_DEMO_COMPLAINTS: Complaint[] = [
  {
    id: 'comp_demo_1',
    publicReferenceId: 'CFX-2026-MUM-84920',
    citizenId: 'user_ramesh_patil',
    title: 'Severe road pothole causing two-wheeler skids',
    originalDescription: 'दादर पश्चिम सेनापती बापट मार्गावर खूप खोल खड्डा पडला आहे. काल रात्री दोन दुचाकी घसरल्या. कृपया तातडीने दुरुस्ती करा.',
    normalizedDescription: 'Deep road cavity and asphalt breakdown measuring approx 1.2m diameter on Senapati Bapat Marg near Dadar West junction causing severe hazard to two-wheelers.',
    originalLanguage: 'mr',
    categoryId: 'roads_potholes',
    citizenConfirmedCategory: 'roads_potholes',
    suggestedDepartmentId: 'dept_roads',
    assignedDepartmentId: 'dept_roads',
    severity: 'High',
    aiConfidenceScore: 0.94,
    aiConfidenceBand: 'High',
    aiMetadata: {
      visibleEvidence: ['Depressed asphalt crater with exposed ballast stones', 'Vehicular traffic in close proximity'],
      reasoning: 'Image and Marathi text clearly indicate road surface disintegration and hazardous crater.',
      modelUsed: 'gemini-3.8-flash',
      isRealAi: true,
      suggestedNextStep: 'Cold-mix asphalt patch team dispatch within 48 hours.'
    },
    latitude: 19.0178,
    longitude: 72.8358,
    address: 'Near Dadar Flower Market, Senapati Bapat Marg, Dadar West, Mumbai, MH 400028',
    locationSource: 'gps_browser',
    status: 'in_progress',
    escalationLevel: 1,
    isOverdue: false,
    acknowledgementDeadline: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    resolutionDeadline: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
    attachments: [
      {
        id: 'att_1_1',
        complaintId: 'comp_demo_1',
        storagePath: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
        contentType: 'image/jpeg',
        attachmentType: 'issue_evidence',
        uploadedAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString()
      }
    ],
    events: [
      {
        id: 'evt_1_1',
        complaintId: 'comp_demo_1',
        actorRole: 'citizen',
        eventType: 'complaint_created',
        description: 'Complaint submitted by citizen with GPS location and photo evidence.',
        descriptionMr: 'नागरिकाने GPS स्थान आणि फोटो पुराव्यासह तक्रार नोंदवली.',
        descriptionHi: 'नागरिक द्वारा GPS स्थान और फोटो साक्ष्य के साथ शिकायत दर्ज की गई।',
        createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString()
      },
      {
        id: 'evt_1_2',
        complaintId: 'comp_demo_1',
        actorRole: 'system_ai',
        eventType: 'department_assigned',
        description: 'Gemini AI classified issue as "Roads & Potholes" (94% confidence) and routed to Roads & PWD.',
        descriptionMr: 'जेमिनी AI ने "रस्ते व खड्डे" (९४% अचूकता) म्हणून रस्ते व बांधकाम विभागाकडे वर्ग केले.',
        descriptionHi: 'जेमिनी AI ने "सड़क एवं गड्ढे" के रूप में सड़क एवं लोक निर्माण विभाग को आवंटित किया।',
        createdAt: new Date(Date.now() - 48 * 3600 * 1000 + 120000).toISOString()
      },
      {
        id: 'evt_1_3',
        complaintId: 'comp_demo_1',
        actorRole: 'officer',
        eventType: 'acknowledgement_recorded',
        description: 'Junior Engineer (Ward G/North Roads) acknowledged grievance and generated inspection work order #WO-4091.',
        descriptionMr: 'कनिष्ठ अभियंत्यांनी (जी/उत्तर प्रभाग) तक्रारीची दखल घेतली व पाहणी आदेश #WO-4091 जारी केला.',
        descriptionHi: 'कनिष्ठ अभियंता द्वारा शिकायत स्वीकार की गई और निरीक्षण आदेश जारी किया गया।',
        createdAt: new Date(Date.now() - 32 * 3600 * 1000).toISOString()
      },
      {
        id: 'evt_1_4',
        complaintId: 'comp_demo_1',
        actorRole: 'officer',
        eventType: 'crew_dispatched',
        description: 'Field repair team dispatched with cold asphalt mix. Patchwork commencing.',
        descriptionMr: 'डांबरी कामासाठी दुरुस्ती पथक रवाना झाले आहे. काम प्रगतीपथावर आहे.',
        descriptionHi: 'मरम्मत दल मौके पर रवाना किया गया। पैचवर्क का कार्य प्रगति पर है।',
        createdAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    isDemo: true
  },
  {
    id: 'comp_demo_2',
    publicReferenceId: 'CFX-2026-MUM-84921',
    citizenId: 'user_ramesh_patil',
    title: 'Overflowing municipal garbage bin creating sanitary risk',
    originalDescription: 'शिवाजी पार्क गेट ४ समोर कचरा कुंडी ३ दिवसांपासून ओसंडून वाहत आहे. प्रचंड दुर्गंधी सुटली असून मोकाट जनावरे कचरा रस्त्यावर पसरवत आहेत.',
    normalizedDescription: 'Municipal community waste receptacle overflowing past capacity for 72 hours. Stray cattle scattering solid waste across pedestrian footpath on Cadell Road.',
    originalLanguage: 'mr',
    categoryId: 'garbage_sanitation',
    citizenConfirmedCategory: 'garbage_sanitation',
    suggestedDepartmentId: 'dept_solid_waste',
    assignedDepartmentId: 'dept_solid_waste',
    severity: 'High',
    aiConfidenceScore: 0.91,
    aiConfidenceBand: 'High',
    aiMetadata: {
      visibleEvidence: ['Metal waste container overflow', 'Plastic bags and decomposing organic waste on curb'],
      reasoning: 'Severe sanitary violation under SWM Bye-laws. Potential public health hazard.',
      modelUsed: 'gemini-3.8-flash',
      isRealAi: true
    },
    latitude: 19.0284,
    longitude: 72.8386,
    address: 'Opposite Gate 4, Shivaji Park, Cadell Road, Dadar West, Mumbai',
    locationSource: 'gps_browser',
    status: 'submitted',
    escalationLevel: 1,
    isOverdue: true, // EXPLICIT OVERDUE COMPLAINT FOR DEMONSTRATING ESCALATION
    acknowledgementDeadline: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), // 24 hours ago!
    resolutionDeadline: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    attachments: [
      {
        id: 'att_2_1',
        complaintId: 'comp_demo_2',
        storagePath: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80',
        contentType: 'image/jpeg',
        attachmentType: 'issue_evidence',
        uploadedAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString()
      }
    ],
    events: [
      {
        id: 'evt_2_1',
        complaintId: 'comp_demo_2',
        actorRole: 'citizen',
        eventType: 'complaint_created',
        description: 'Complaint registered by citizen. 12-hour statutory acknowledgement SLA clock initiated.',
        descriptionMr: 'नागरिकाने तक्रार नोंदवली. १२ तासांची पोचपावती मुदत सुरू झाली.',
        descriptionHi: 'नागरिक द्वारा शिकायत दर्ज की गई। १२ घंटे की पावती समय सीमा शुरू।',
        createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString()
      },
      {
        id: 'evt_2_2',
        complaintId: 'comp_demo_2',
        actorRole: 'system_ai',
        eventType: 'deadline_missed',
        description: 'Automated System Alert: Ward Solid Waste cell failed to acknowledge within 12 hours SLA. Escalation condition satisfied.',
        descriptionMr: 'स्वयंचलित प्रणाली इशारा: घनकचरा विभागाने १२ तासांत पोचपावती दिली नाही. तक्रार वाढवण्यास पात्र.',
        descriptionHi: 'प्रणाली चेतावनी: ठोस अपशिष्ट विभाग द्वारा १२ घंटे में पावती नहीं दी गई। एस्केलेशन हेतु पात्र।',
        createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    isDemo: true
  },
  {
    id: 'comp_demo_3',
    publicReferenceId: 'CFX-2026-PUN-51204',
    citizenId: 'user_ramesh_patil',
    title: 'Non-functional streetlights causing dark danger zone',
    originalDescription: 'कोथरूड डीपी रस्त्यावरील पोल क्रमांक SW-14 चे पथदिवे गेल्या आठवड्यापासून बंद आहेत. रात्री महिला व ज्येष्ठ नागरिकांना चालणे धोकादायक झाले आहे.',
    normalizedDescription: 'Luminaire blackout on municipal lamp post SW-14 along DP Road, Kothrud. Complete absence of illumination over a 60-meter pedestrian corridor.',
    originalLanguage: 'mr',
    categoryId: 'streetlights_lighting',
    citizenConfirmedCategory: 'streetlights_lighting',
    suggestedDepartmentId: 'dept_electrical',
    assignedDepartmentId: 'dept_electrical',
    severity: 'Medium',
    aiConfidenceScore: 0.96,
    aiConfidenceBand: 'High',
    latitude: 18.5074,
    longitude: 73.8077,
    address: 'Near City Pride Theatre, Kothrud DP Road, Pune, MH 411038',
    locationSource: 'gps_browser',
    status: 'resolved', // DEMONSTRATING RESOLUTION VERIFICATION WORKFLOW
    escalationLevel: 1,
    isOverdue: false,
    acknowledgementDeadline: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    resolutionDeadline: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    resolvedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    resolutionNote: 'Electrical division maintenance team replaced blown 120W LED driver unit and tested illumination. Restored to 100% operational lux.',
    resolutionEvidenceUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    resolutionConfirmedByCitizen: undefined, // Pending citizen response!
    attachments: [
      {
        id: 'att_3_1',
        complaintId: 'comp_demo_3',
        storagePath: 'https://images.unsplash.com/photo-1517420879524-86d64ac2f339?auto=format&fit=crop&w=800&q=80',
        contentType: 'image/jpeg',
        attachmentType: 'issue_evidence',
        uploadedAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString()
      }
    ],
    events: [
      {
        id: 'evt_3_1',
        complaintId: 'comp_demo_3',
        actorRole: 'citizen',
        eventType: 'complaint_created',
        description: 'Complaint registered by citizen.',
        createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString()
      },
      {
        id: 'evt_3_2',
        complaintId: 'comp_demo_3',
        actorRole: 'officer',
        eventType: 'acknowledgement_recorded',
        description: 'Electrical Dept Wireman assigned.',
        createdAt: new Date(Date.now() - 60 * 3600 * 1000).toISOString()
      },
      {
        id: 'evt_3_3',
        complaintId: 'comp_demo_3',
        actorRole: 'officer',
        eventType: 'resolution_submitted',
        description: 'Work completed by Lineman P. Shinde. LED driver replaced. Attached illuminated night test photograph.',
        descriptionMr: 'लाइनमन पी. शिंदे यांनी काम पूर्ण केले. नवीन LED ड्रायव्हर बसवला. चाचणी फोटो जोडला आहे.',
        descriptionHi: 'लाइनमैन द्वारा कार्य पूर्ण किया गया। नया LED ड्राइवर लगाया गया। रात का परीक्षण फोटो संलग्न।',
        createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    isDemo: true
  },
  {
    id: 'comp_demo_4',
    publicReferenceId: 'CFX-2026-MUM-84924',
    citizenId: 'user_ramesh_patil',
    title: 'Sewage drain choke-up and dirty water backflow',
    originalDescription: 'साकीनाका मेट्रो स्टेशनजवळ गटार तुंबून सांडपाणी रस्त्यावर वाहत आहे. पादचाऱ्यांना चालणे अशक्य झाले आहे.',
    normalizedDescription: 'Stormwater culvert clogged with silt and debris causing foul wastewater overflow onto arterial carriageway adjacent to metro staircase.',
    originalLanguage: 'mr',
    categoryId: 'drainage_sewage',
    citizenConfirmedCategory: 'drainage_sewage',
    suggestedDepartmentId: 'dept_storm_drainage',
    assignedDepartmentId: 'dept_storm_drainage',
    severity: 'High',
    aiConfidenceScore: 0.89,
    aiConfidenceBand: 'High',
    latitude: 19.1026,
    longitude: 72.8872,
    address: 'Near Metro Pillar 118, Andheri-Kurla Road, Sakinaka, Mumbai',
    locationSource: 'manual_address',
    status: 'under_review',
    escalationLevel: 1,
    isOverdue: false,
    acknowledgementDeadline: new Date(Date.now() + 14 * 3600 * 1000).toISOString(),
    resolutionDeadline: new Date(Date.now() + 60 * 3600 * 1000).toISOString(),
    attachments: [],
    events: [
      {
        id: 'evt_4_1',
        complaintId: 'comp_demo_4',
        actorRole: 'citizen',
        eventType: 'complaint_created',
        description: 'Complaint registered by citizen with manual address entry.',
        createdAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString()
      },
      {
        id: 'evt_4_2',
        complaintId: 'comp_demo_4',
        actorRole: 'officer',
        eventType: 'status_changed',
        description: 'Storm Water Drainage department marked ticket Under Review for suction tanker scheduling.',
        createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    isDemo: true
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_1',
    userId: 'user_ramesh_patil',
    complaintId: 'comp_demo_2',
    complaintRefId: 'CFX-2026-MUM-84921',
    title: 'SLA Overdue: Escalation Available',
    message: 'Your garbage complaint #CFX-2026-MUM-84921 has passed its 12-hour acknowledgement deadline. You may now escalate to Executive Ward Officer.',
    type: 'sla_warning',
    isRead: false,
    createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString()
  },
  {
    id: 'notif_2',
    userId: 'user_ramesh_patil',
    complaintId: 'comp_demo_3',
    complaintRefId: 'CFX-2026-PUN-51204',
    title: 'Resolution Submitted for Verification',
    message: 'Electrical Department marked streetlight complaint #CFX-2026-PUN-51204 as Resolved. Please verify the work.',
    type: 'resolution',
    isRead: false,
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString()
  },
  {
    id: 'notif_3',
    userId: 'user_ramesh_patil',
    complaintId: 'comp_demo_1',
    complaintRefId: 'CFX-2026-MUM-84920',
    title: 'Field Crew Dispatched',
    message: 'Roads & PWD has dispatched a cold-mix repair crew for your pothole complaint.',
    type: 'status_change',
    isRead: true,
    createdAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString()
  }
];

// Storage helpers
export function getStoredComplaints(): Complaint[] {
  try {
    const raw = localStorage.getItem(COMPLAINTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(COMPLAINTS_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_COMPLAINTS));
      return INITIAL_DEMO_COMPLAINTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_DEMO_COMPLAINTS;
  }
}

export function saveComplaints(complaints: Complaint[]): void {
  try {
    localStorage.setItem(COMPLAINTS_STORAGE_KEY, JSON.stringify(complaints));
  } catch (e) {
    console.error('Failed to save complaints to localStorage:', e);
  }
}

export function getStoredNotifications(): AppNotification[] {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_NOTIFICATIONS;
  }
}

export function saveNotifications(notifications: AppNotification[]): void {
  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
  } catch (e) {
    console.error('Failed to save notifications:', e);
  }
}

export function getStoredUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) {
      // Default to Ramesh Patil (Marathi preference) or Arjun Mehta
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(DEMO_USERS[0]));
      return DEMO_USERS[0];
    }
    return JSON.parse(raw);
  } catch (e) {
    return DEMO_USERS[0];
  }
}

export function saveStoredUser(user: UserProfile | null): void {
  try {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  } catch (e) {
    console.error('Failed to save user:', e);
  }
}

export function resetDemoStorage(): void {
  localStorage.setItem(COMPLAINTS_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_COMPLAINTS));
  localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(DEMO_USERS[0]));
}
