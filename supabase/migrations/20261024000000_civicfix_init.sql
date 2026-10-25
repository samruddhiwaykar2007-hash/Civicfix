-- CivicFix — AI-Powered Civic Complaint & Accountability Platform
-- Production PostgreSQL Database Migration with Row Level Security (RLS)

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    email TEXT,
    preferred_language VARCHAR(5) DEFAULT 'en', -- 'en', 'mr', 'hi'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Departments Table
CREATE TABLE IF NOT EXISTS public.departments (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    name_mr TEXT,
    name_hi TEXT,
    supported_categories TEXT[] DEFAULT '{}',
    sla_ack_hours INT DEFAULT 24,
    sla_resolve_days INT DEFAULT 3,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed initial municipal departments
INSERT INTO public.departments (id, name, name_mr, name_hi, supported_categories, sla_ack_hours, sla_resolve_days) VALUES
('dept_roads', 'Roads & Public Works Department (PWD)', 'रस्ते व सार्वजनिक बांधकाम विभाग', 'सड़क एवं लोक निर्माण विभाग', ARRAY['roads_potholes'], 24, 3),
('dept_solid_waste', 'Solid Waste Management & Sanitation Department', 'घनकचरा व्यवस्थापन व स्वच्छता विभाग', 'ठोस अपशिष्ट प्रबंधन एवं स्वच्छता विभाग', ARRAY['garbage_sanitation'], 12, 2),
('dept_storm_drainage', 'Storm Water Drainage & Sewage Department', 'मलनिःसारण व पावसाळी गटारे विभाग', 'जल निकासी एवं सीवरेज विभाग', ARRAY['drainage_sewage'], 24, 3),
('dept_water_supply', 'Hydraulic Engineering & Water Supply', 'जल अभियंता व पाणी पुरवठा विभाग', 'जल आपूर्ति एवं पाइपलाइन विभाग', ARRAY['water_supply_leakage'], 12, 2),
('dept_electrical', 'Municipal Electrical & Public Lighting Department', 'विद्युत व सार्वजनिक पथदिवे विभाग', 'विद्युत एवं सार्वजनिक मार्ग प्रकाश विभाग', ARRAY['streetlights_lighting'], 24, 2),
('dept_infra_maintenance', 'Municipal Infrastructure & Building Maintenance', 'पालिका पायाभूत सुविधा व देखभाल विभाग', 'नगरपालिका अवसंरचना एवं भवन अनुरक्षण विभाग', ARRAY['infrastructure_damage'], 48, 7),
('dept_public_health', 'Public Health & Food Safety Directorate', 'सार्वजनिक आरोग्य व अन्न सुरक्षा संचालनालय', 'सार्वजनिक स्वास्थ्य एवं खाद्य सुरक्षा निदेशालय', ARRAY['food_safety_health'], 24, 4),
('dept_general_administration', 'Central Ward Citizen Grievance Cell', 'मध्यवर्ती प्रभाग नागरिक तक्रार कक्ष', 'केंद्रीय वार्ड नागरिक शिकायत निवारण प्रकोष्ठ', ARRAY['other_civic_issues'], 48, 5)
ON CONFLICT (id) DO NOTHING;

-- 4. Complaints Table
CREATE TABLE IF NOT EXISTS public.complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    public_reference_id TEXT UNIQUE NOT NULL,
    citizen_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    original_description TEXT,
    normalized_description TEXT,
    original_language VARCHAR(10) DEFAULT 'en',
    category_id TEXT NOT NULL,
    citizen_confirmed_category TEXT NOT NULL,
    suggested_department_id TEXT REFERENCES public.departments(id),
    assigned_department_id TEXT REFERENCES public.departments(id),
    severity VARCHAR(20) DEFAULT 'Medium', -- 'Low', 'Medium', 'High', 'Critical'
    ai_confidence_score NUMERIC(3, 2),
    ai_confidence_band VARCHAR(20),
    ai_metadata JSONB DEFAULT '{}'::jsonb,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    address TEXT,
    location_source VARCHAR(30) DEFAULT 'manual', -- 'gps_browser', 'manual_address', 'map_pin'
    status VARCHAR(30) DEFAULT 'submitted', -- 'submitted', 'under_review', 'in_progress', 'resolved', 'closed', 'escalated'
    escalation_level INT DEFAULT 1, -- 1: Field Dept, 2: Supervising Officer, 3: Municipal Commissioner
    is_overdue BOOLEAN DEFAULT FALSE,
    acknowledgement_deadline TIMESTAMPTZ,
    resolution_deadline TIMESTAMPTZ,
    escalated_at TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ,
    closed_at TIMESTAMPTZ,
    resolution_note TEXT,
    resolution_evidence_url TEXT,
    resolution_confirmed_by_citizen BOOLEAN,
    citizen_dispute_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexing for citizen dashboard queries & performance
CREATE INDEX IF NOT EXISTS idx_complaints_citizen ON public.complaints(citizen_id);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON public.complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_ref_id ON public.complaints(public_reference_id);
CREATE INDEX IF NOT EXISTS idx_complaints_category ON public.complaints(category_id);
CREATE INDEX IF NOT EXISTS idx_complaints_deadlines ON public.complaints(acknowledgement_deadline, resolution_deadline);

-- 5. Complaint Attachments Table
CREATE TABLE IF NOT EXISTS public.complaint_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    content_type TEXT NOT NULL,
    file_size BIGINT,
    attachment_type VARCHAR(30) DEFAULT 'issue_evidence', -- 'issue_evidence', 'resolution_proof', 'dispute_proof'
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Complaint Events (Immutable Audit Trail)
CREATE TABLE IF NOT EXISTS public.complaint_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
    actor_id UUID,
    actor_role VARCHAR(50) DEFAULT 'citizen', -- 'citizen', 'system_ai', 'officer', 'supervisor', 'admin'
    event_type VARCHAR(50) NOT NULL,
    previous_state VARCHAR(30),
    new_state VARCHAR(30),
    description TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_complaint_events_complaint ON public.complaint_events(complaint_id, created_at ASC);

-- 7. Escalation Rules Table
CREATE TABLE IF NOT EXISTS public.escalation_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id TEXT NOT NULL,
    source_level INT NOT NULL,
    destination_level INT NOT NULL,
    source_authority TEXT NOT NULL,
    destination_authority TEXT NOT NULL,
    acknowledgement_duration_hours INT NOT NULL,
    resolution_duration_days INT NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed standard escalation ladder
INSERT INTO public.escalation_rules (category_id, source_level, destination_level, source_authority, destination_authority, acknowledgement_duration_hours, resolution_duration_days) VALUES
('all', 1, 2, 'Ward Field Junior Engineer', 'Executive Ward Officer / Assistant Commissioner', 24, 3),
('all', 2, 3, 'Executive Ward Officer', 'Additional Municipal Commissioner / Central Grievance Cell', 48, 7);

-- 8. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    complaint_id UUID REFERENCES public.complaints(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(40) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Row Level Security (RLS) Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaint_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaint_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escalation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: Citizens can read & update their own profile only
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Complaints: Authenticated citizens can view their own complaints
CREATE POLICY "Citizens can view own complaints" ON public.complaints FOR SELECT USING (auth.uid() = citizen_id);
CREATE POLICY "Citizens can insert own complaints" ON public.complaints FOR INSERT WITH CHECK (auth.uid() = citizen_id);
CREATE POLICY "Citizens can update dispute or confirmation on their complaints" ON public.complaints FOR UPDATE USING (auth.uid() = citizen_id);

-- Complaint Attachments: View attachments belonging to own complaints
CREATE POLICY "Citizens can view attachments for own complaints" ON public.complaint_attachments FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.complaints WHERE id = complaint_attachments.complaint_id AND citizen_id = auth.uid())
);
CREATE POLICY "Citizens can insert attachments for own complaints" ON public.complaint_attachments FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.complaints WHERE id = complaint_attachments.complaint_id AND citizen_id = auth.uid())
);

-- Complaint Events: Read-only for citizens, append-only
CREATE POLICY "Citizens can view events of own complaints" ON public.complaint_events FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.complaints WHERE id = complaint_events.complaint_id AND citizen_id = auth.uid())
);
CREATE POLICY "Citizens can log dispute/confirmation events on own complaints" ON public.complaint_events FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.complaints WHERE id = complaint_events.complaint_id AND citizen_id = auth.uid())
);

-- Public catalogs: readable by authenticated users
CREATE POLICY "Departments are readable by all authenticated" ON public.departments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Escalation rules are readable by all authenticated" ON public.escalation_rules FOR SELECT TO authenticated USING (true);

-- Notifications: Only target user can view & mark read
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
