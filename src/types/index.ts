export type Language = 'en' | 'mr' | 'hi';

export type ComplaintCategory =
  | 'roads_potholes'
  | 'garbage_sanitation'
  | 'drainage_sewage'
  | 'water_supply_leakage'
  | 'streetlights_lighting'
  | 'infrastructure_damage'
  | 'food_safety_health'
  | 'other_civic_issues';

export type ComplaintSeverity = 'Low' | 'Medium' | 'High' | 'Critical';

export type ComplaintStatus =
  | 'submitted'
  | 'under_review'
  | 'in_progress'
  | 'resolved'
  | 'closed'
  | 'escalated';

export type ActorRole = 'citizen' | 'system_ai' | 'officer' | 'supervisor' | 'admin';

export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  preferredLanguage: Language;
  createdAt: string;
  isDemo?: boolean;
}

export interface Department {
  id: string;
  name: string;
  nameMr: string;
  nameHi: string;
  supportedCategories: ComplaintCategory[];
  slaAckHours: number;
  slaResolveDays: number;
}

export interface ComplaintAttachment {
  id: string;
  complaintId: string;
  storagePath: string; // URL or base64 data URI
  contentType: string;
  fileSize?: number;
  attachmentType: 'issue_evidence' | 'resolution_proof' | 'dispute_proof';
  uploadedAt: string;
}

export interface ComplaintEvent {
  id: string;
  complaintId: string;
  actorId?: string;
  actorRole: ActorRole;
  eventType:
    | 'complaint_created'
    | 'image_uploaded'
    | 'category_confirmed'
    | 'department_assigned'
    | 'status_changed'
    | 'acknowledgement_recorded'
    | 'crew_dispatched'
    | 'deadline_missed'
    | 'escalation_requested'
    | 'escalation_recorded'
    | 'resolution_submitted'
    | 'resolution_confirmed'
    | 'resolution_disputed'
    | 'complaint_closed'
    | 'complaint_reopened';
  previousState?: string;
  newState?: string;
  description: string;
  descriptionMr?: string;
  descriptionHi?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface Complaint {
  id: string;
  publicReferenceId: string; // e.g. CFX-2026-MUM-84920
  citizenId: string;
  title: string;
  originalDescription: string;
  normalizedDescription: string;
  originalLanguage: Language;
  categoryId: ComplaintCategory;
  citizenConfirmedCategory: ComplaintCategory;
  suggestedDepartmentId: string;
  assignedDepartmentId: string;
  severity: ComplaintSeverity;
  aiConfidenceScore: number;
  aiConfidenceBand: 'High' | 'Moderate' | 'Low';
  aiMetadata?: {
    visibleEvidence?: string[];
    reasoning?: string;
    modelUsed?: string;
    isRealAi?: boolean;
    clarifyingQuestion?: string;
    suggestedNextStep?: string;
  };
  latitude?: number;
  longitude?: number;
  address?: string;
  locationSource: 'gps_browser' | 'manual_address' | 'map_pin';
  status: ComplaintStatus;
  escalationLevel: number; // 1: Ward Field, 2: Exec Officer, 3: Municipal Commissioner
  isOverdue: boolean;
  acknowledgementDeadline: string; // ISO timestamp
  resolutionDeadline: string; // ISO timestamp
  escalatedAt?: string;
  resolvedAt?: string;
  closedAt?: string;
  resolutionNote?: string;
  resolutionEvidenceUrl?: string;
  resolutionConfirmedByCitizen?: boolean;
  citizenDisputeReason?: string;
  attachments: ComplaintAttachment[];
  events: ComplaintEvent[];
  createdAt: string;
  updatedAt: string;
  isDemo?: boolean;
}

export interface EscalationRule {
  id: string;
  categoryId: string;
  sourceLevel: number;
  destinationLevel: number;
  sourceAuthority: string;
  destinationAuthority: string;
  acknowledgementDurationHours: number;
  resolutionDurationDays: number;
}

export interface AppNotification {
  id: string;
  userId: string;
  complaintId?: string;
  complaintRefId?: string;
  title: string;
  message: string;
  type: 'status_change' | 'escalation' | 'resolution' | 'acknowledgement' | 'sla_warning';
  isRead: boolean;
  createdAt: string;
}

export interface AiAnalysisResponse {
  detectedLanguage: string;
  suggestedTitle: string;
  suggestedTitleEn: string;
  suggestedCategory: ComplaintCategory;
  severity: ComplaintSeverity;
  confidenceScore: number;
  confidenceBand: 'High' | 'Moderate' | 'Low';
  citizenSummary: string;
  standardizedDescriptionEn: string;
  visibleEvidence: string[];
  reasoning: string;
  missingInformation: string;
  suggestedNextStep: string;
  clarifyingQuestion?: string;
  suggestedDepartmentId: string;
  suggestedDepartmentName: string;
  suggestedDepartmentNameMr: string;
  suggestedDepartmentNameHi: string;
  slaAckHours: number;
  slaResolveDays: number;
}
