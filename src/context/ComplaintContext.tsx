import React, { createContext, useContext, useState, useEffect } from 'react';
import { Complaint, ComplaintEvent, AppNotification, ComplaintCategory, ComplaintSeverity } from '../types';
import { getStoredComplaints, saveComplaints, getStoredNotifications, saveNotifications, resetDemoStorage } from '../lib/storage';
import { useAuth } from './AuthContext';

interface CreateComplaintInput {
  title: string;
  originalDescription: string;
  normalizedDescription: string;
  originalLanguage: 'en' | 'mr' | 'hi';
  categoryId: ComplaintCategory;
  citizenConfirmedCategory: ComplaintCategory;
  suggestedDepartmentId: string;
  assignedDepartmentId: string;
  severity: ComplaintSeverity;
  aiConfidenceScore: number;
  aiConfidenceBand: 'High' | 'Moderate' | 'Low';
  aiMetadata?: Record<string, any>;
  latitude?: number;
  longitude?: number;
  address?: string;
  locationSource: 'gps_browser' | 'manual_address' | 'map_pin';
  photoDataUrl?: string;
  slaAckHours: number;
  slaResolveDays: number;
}

interface ComplaintContextType {
  complaints: Complaint[];
  notifications: AppNotification[];
  unreadNotifsCount: number;
  createComplaint: (input: CreateComplaintInput) => Promise<Complaint>;
  escalateComplaint: (complaintId: string, reason: string, notes?: string) => Promise<void>;
  verifyResolution: (complaintId: string, isConfirmed: boolean, disputeReason?: string) => Promise<void>;
  simulateOfficerAction: (complaintId: string, action: 'acknowledge' | 'dispatch_crew' | 'submit_resolution' | 'make_overdue') => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  resetAllDemoData: () => void;
  getComplaintByRef: (refId: string) => Complaint | undefined;
  getComplaintById: (id: string) => Complaint | undefined;
}

const ComplaintContext = createContext<ComplaintContextType | undefined>(undefined);

export const ComplaintProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    const loadedComplaints = getStoredComplaints();
    const loadedNotifications = getStoredNotifications();
    setComplaints(loadedComplaints);
    setNotifications(loadedNotifications);
  }, []);

  const unreadNotifsCount = notifications.filter(n => !n.isRead).length;

  const getComplaintByRef = (refId: string) => {
    return complaints.find(c => c.publicReferenceId.trim().toLowerCase() === refId.trim().toLowerCase());
  };

  const getComplaintById = (id: string) => {
    return complaints.find(c => c.id === id);
  };

  const createComplaint = async (input: CreateComplaintInput): Promise<Complaint> => {
    const now = new Date();
    const cityCode = input.address && input.address.toLowerCase().includes('pune') ? 'PUN' : 'MUM';
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const publicRefId = `CFX-2026-${cityCode}-${randomSuffix}`;
    const newId = `comp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const ackDeadline = new Date(now.getTime() + (input.slaAckHours || 24) * 3600 * 1000).toISOString();
    const resDeadline = new Date(now.getTime() + (input.slaResolveDays || 3) * 24 * 3600 * 1000).toISOString();

    const initialEvents: ComplaintEvent[] = [
      {
        id: `evt_${Date.now()}_1`,
        complaintId: newId,
        actorId: user?.id,
        actorRole: 'citizen',
        eventType: 'complaint_created',
        description: `Complaint submitted with location and description in ${input.originalLanguage.toUpperCase()}.`,
        descriptionMr: `नागरिकाने ${input.originalLanguage.toUpperCase()} भाषेत तक्रार दाखल केली.`,
        descriptionHi: `नागरिक द्वारा ${input.originalLanguage.toUpperCase()} भाषा में शिकायत दर्ज की गई।`,
        createdAt: now.toISOString()
      },
      {
        id: `evt_${Date.now()}_2`,
        complaintId: newId,
        actorRole: 'system_ai',
        eventType: 'department_assigned',
        description: `AI routing allocated to ${input.assignedDepartmentId}. Initial SLA clock started (${input.slaAckHours}h acknowledgement target).`,
        descriptionMr: `AI ने संबंधित विभागाकडे तक्रार वर्ग केली. ${input.slaAckHours} तासांची मुदत सुरू.`,
        descriptionHi: `AI द्वारा संबंधित विभाग को शिकायत आवंटित की गई। ${input.slaAckHours} घंटे की समय सीमा शुरू।`,
        createdAt: new Date(now.getTime() + 1000).toISOString()
      }
    ];

    const attachments = input.photoDataUrl
      ? [
          {
            id: `att_${Date.now()}`,
            complaintId: newId,
            storagePath: input.photoDataUrl,
            contentType: 'image/jpeg',
            attachmentType: 'issue_evidence' as const,
            uploadedAt: now.toISOString()
          }
        ]
      : [];

    const newComplaint: Complaint = {
      id: newId,
      publicReferenceId: publicRefId,
      citizenId: user?.id || 'guest_citizen',
      title: input.title,
      originalDescription: input.originalDescription,
      normalizedDescription: input.normalizedDescription,
      originalLanguage: input.originalLanguage,
      categoryId: input.categoryId,
      citizenConfirmedCategory: input.citizenConfirmedCategory,
      suggestedDepartmentId: input.suggestedDepartmentId,
      assignedDepartmentId: input.assignedDepartmentId,
      severity: input.severity,
      aiConfidenceScore: input.aiConfidenceScore,
      aiConfidenceBand: input.aiConfidenceBand,
      aiMetadata: input.aiMetadata,
      latitude: input.latitude,
      longitude: input.longitude,
      address: input.address,
      locationSource: input.locationSource,
      status: 'submitted',
      escalationLevel: 1,
      isOverdue: false,
      acknowledgementDeadline: ackDeadline,
      resolutionDeadline: resDeadline,
      attachments,
      events: initialEvents,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      isDemo: true
    };

    const updated = [newComplaint, ...complaints];
    setComplaints(updated);
    saveComplaints(updated);

    // Create notification
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      userId: user?.id || 'guest_citizen',
      complaintId: newComplaint.id,
      complaintRefId: newComplaint.publicReferenceId,
      title: 'Complaint Logged Successfully',
      message: `Your grievance #${newComplaint.publicReferenceId} has been registered and routed. SLA clock is active.`,
      type: 'status_change',
      isRead: false,
      createdAt: now.toISOString()
    };
    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);
    saveNotifications(updatedNotifs);

    return newComplaint;
  };

  const escalateComplaint = async (complaintId: string, reason: string, notes?: string) => {
    const now = new Date().toISOString();
    const updated = complaints.map(c => {
      if (c.id === complaintId) {
        const nextLevel = Math.min((c.escalationLevel || 1) + 1, 3);
        const destinationAuthority = nextLevel === 2
          ? 'Executive Ward Officer / Assistant Municipal Commissioner'
          : 'Additional Municipal Commissioner / Central Grievance Cell';

        const escalationEvent: ComplaintEvent = {
          id: `evt_esc_${Date.now()}`,
          complaintId: c.id,
          actorId: user?.id,
          actorRole: 'citizen',
          eventType: 'escalation_recorded',
          previousState: c.status,
          newState: 'escalated',
          description: `Citizen triggered formal escalation to Level ${nextLevel} (${destinationAuthority}). Reason: ${reason}. ${notes ? `Citizen remarks: "${notes}"` : ''}`,
          descriptionMr: `नागरिकाने तक्रार स्तर ${nextLevel} कडे वर्ग केली. कारण: ${reason}`,
          descriptionHi: `नागरिक द्वारा स्तर ${nextLevel} पर शिकायत एस्केलेट की गई। कारण: ${reason}`,
          metadata: {
            previousLevel: c.escalationLevel,
            newLevel: nextLevel,
            authority: destinationAuthority,
            reason
          },
          createdAt: now
        };

        return {
          ...c,
          status: 'escalated' as const,
          escalationLevel: nextLevel,
          escalatedAt: now,
          updatedAt: now,
          events: [...c.events, escalationEvent]
        };
      }
      return c;
    });

    setComplaints(updated);
    saveComplaints(updated);

    const targetComp = complaints.find(c => c.id === complaintId);
    if (targetComp) {
      const newNotif: AppNotification = {
        id: `notif_esc_${Date.now()}`,
        userId: user?.id || 'guest_citizen',
        complaintId: targetComp.id,
        complaintRefId: targetComp.publicReferenceId,
        title: 'Complaint Escalation Logged',
        message: `Complaint #${targetComp.publicReferenceId} has been escalated to Tier ${(targetComp.escalationLevel || 1) + 1} supervisory review.`,
        type: 'escalation',
        isRead: false,
        createdAt: now
      };
      const updatedNotifs = [newNotif, ...notifications];
      setNotifications(updatedNotifs);
      saveNotifications(updatedNotifs);
    }
  };

  const verifyResolution = async (complaintId: string, isConfirmed: boolean, disputeReason?: string) => {
    const now = new Date().toISOString();
    const updated = complaints.map(c => {
      if (c.id === complaintId) {
        if (isConfirmed) {
          const confirmEvent: ComplaintEvent = {
            id: `evt_conf_${Date.now()}`,
            complaintId: c.id,
            actorId: user?.id,
            actorRole: 'citizen',
            eventType: 'resolution_confirmed',
            previousState: c.status,
            newState: 'closed',
            description: 'Citizen inspected the site and confirmed issue resolution. Ticket officially closed with citizen approval.',
            descriptionMr: 'नागरिकाने कामाची पाहणी करून समाधान व्यक्त केले. तक्रार अधिकृतपणे बंद करण्यात आली.',
            descriptionHi: 'नागरिक द्वारा स्थल निरीक्षण कर समाधान की पुष्टि की गई। शिकायत आधिकारिक रूप से बंद।',
            createdAt: now
          };
          return {
            ...c,
            status: 'closed' as const,
            resolutionConfirmedByCitizen: true,
            closedAt: now,
            updatedAt: now,
            events: [...c.events, confirmEvent]
          };
        } else {
          const disputeEvent: ComplaintEvent = {
            id: `evt_disp_${Date.now()}`,
            complaintId: c.id,
            actorId: user?.id,
            actorRole: 'citizen',
            eventType: 'resolution_disputed',
            previousState: c.status,
            newState: 'in_progress',
            description: `Citizen disputed resolution: "${disputeReason || 'Issue persists upon physical verification'}". Ticket reopened for supervisory inspection.`,
            descriptionMr: `नागरिकाने कामावर आक्षेप नोंदवला: "${disputeReason || 'समस्या अजूनही कायम आहे'}". तक्रार पुन्हा सुरू.`,
            descriptionHi: `नागरिक द्वारा समाधान पर आपत्ति दर्ज की गई: "${disputeReason || 'समस्या अभी भी बनी हुई है'}". शिकायत पुनः खोली गई।`,
            createdAt: now
          };
          return {
            ...c,
            status: 'in_progress' as const,
            resolutionConfirmedByCitizen: false,
            citizenDisputeReason: disputeReason,
            updatedAt: now,
            events: [...c.events, disputeEvent]
          };
        }
      }
      return c;
    });

    setComplaints(updated);
    saveComplaints(updated);
  };

  const simulateOfficerAction = (complaintId: string, action: 'acknowledge' | 'dispatch_crew' | 'submit_resolution' | 'make_overdue') => {
    const now = new Date().toISOString();
    const updated = complaints.map(c => {
      if (c.id === complaintId) {
        let newStatus = c.status;
        let newEvents = [...c.events];
        let resolutionNote = c.resolutionNote;
        let resolutionEvidenceUrl = c.resolutionEvidenceUrl;
        let resolvedAt = c.resolvedAt;
        let isOverdue = c.isOverdue;
        let ackDeadline = c.acknowledgementDeadline;
        let resDeadline = c.resolutionDeadline;

        if (action === 'acknowledge') {
          newStatus = 'under_review';
          newEvents.push({
            id: `evt_sim_${Date.now()}`,
            complaintId: c.id,
            actorRole: 'officer',
            eventType: 'acknowledgement_recorded',
            description: 'Ward Officer reviewed ticket, confirmed jurisdiction, and scheduled field engineer inspection.',
            descriptionMr: 'प्रभाग अधिकाऱ्यांनी तक्रार तपासली व पाहणीची वेळ निश्चित केली.',
            descriptionHi: 'वार्ड अधिकारी ने शिकायत की समीक्षा की और निरीक्षण निर्धारित किया।',
            createdAt: now
          });
        } else if (action === 'dispatch_crew') {
          newStatus = 'in_progress';
          newEvents.push({
            id: `evt_sim_${Date.now()}`,
            complaintId: c.id,
            actorRole: 'officer',
            eventType: 'crew_dispatched',
            description: 'Municipal field maintenance crew and repair machinery mobilized to incident location.',
            descriptionMr: 'दुरुस्ती पथक आणि यंत्रसामग्री घटनास्थळी रवाना झाली आहे.',
            descriptionHi: 'मरम्मत दल और उपकरण घटनास्थल पर रवाना किए गए।',
            createdAt: now
          });
        } else if (action === 'submit_resolution') {
          newStatus = 'resolved';
          resolvedAt = now;
          resolutionNote = 'Remediation completed by municipal maintenance staff. Site cleaned and verified according to standard municipal specifications.';
          resolutionEvidenceUrl = 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=800&q=80';
          newEvents.push({
            id: `evt_sim_${Date.now()}`,
            complaintId: c.id,
            actorRole: 'officer',
            eventType: 'resolution_submitted',
            description: 'Field engineer marked works completed with post-repair photograph. Awaiting citizen verification.',
            descriptionMr: 'दुरुस्ती काम पूर्ण झाल्याचा अहवाल व फोटो जोडला. नागरिकाच्या पडताळणीची प्रतीक्षा.',
            descriptionHi: 'मरम्मत कार्य पूर्ण होने की रिपोर्ट व फोटो संलग्न। नागरिक सत्यापन की प्रतीक्षा।',
            createdAt: now
          });
        } else if (action === 'make_overdue') {
          isOverdue = true;
          ackDeadline = new Date(Date.now() - 48 * 3600 * 1000).toISOString();
          resDeadline = new Date(Date.now() - 12 * 3600 * 1000).toISOString();
          newEvents.push({
            id: `evt_sim_${Date.now()}`,
            complaintId: c.id,
            actorRole: 'system_ai',
            eventType: 'deadline_missed',
            description: 'Statutory SLA resolution window lapsed without verified fix. Complaint marked Overdue for citizen escalation.',
            descriptionMr: 'अधिकृत मुदत संपली. तक्रार मुदतबाहेर चिन्हांकित झाली.',
            descriptionHi: 'आधिकारिक समय सीमा समाप्त। शिकायत एस्केलेशन हेतु तैयार।',
            createdAt: now
          });
        }

        return {
          ...c,
          status: newStatus,
          isOverdue,
          acknowledgementDeadline: ackDeadline,
          resolutionDeadline: resDeadline,
          resolutionNote,
          resolutionEvidenceUrl,
          resolvedAt,
          updatedAt: now,
          events: newEvents
        };
      }
      return c;
    });

    setComplaints(updated);
    saveComplaints(updated);
  };

  const markNotificationRead = (id: string) => {
    const updated = notifications.map(n => (n.id === id ? { ...n, isRead: true } : n));
    setNotifications(updated);
    saveNotifications(updated);
  };

  const markAllNotificationsRead = () => {
    const updated = notifications.map(n => ({ ...n, isRead: true }));
    setNotifications(updated);
    saveNotifications(updated);
  };

  const resetAllDemoData = () => {
    resetDemoStorage();
    setComplaints(getStoredComplaints());
    setNotifications(getStoredNotifications());
  };

  return (
    <ComplaintContext.Provider
      value={{
        complaints,
        notifications,
        unreadNotifsCount,
        createComplaint,
        escalateComplaint,
        verifyResolution,
        simulateOfficerAction,
        markNotificationRead,
        markAllNotificationsRead,
        resetAllDemoData,
        getComplaintByRef,
        getComplaintById
      }}
    >
      {children}
    </ComplaintContext.Provider>
  );
};

export const useComplaints = () => {
  const context = useContext(ComplaintContext);
  if (!context) throw new Error('useComplaints must be used within a ComplaintProvider');
  return context;
};
