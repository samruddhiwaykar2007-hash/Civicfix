import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ComplaintProvider } from './context/ComplaintContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { SupabaseSetupModal } from './components/SupabaseSetupModal';
import { LandingPage } from './pages/LandingPage';
import { HomePage } from './pages/HomePage';
import { ReportIssuePage } from './pages/ReportIssuePage';
import { MyComplaintsPage } from './pages/MyComplaintsPage';
import { ComplaintDetailPage } from './pages/ComplaintDetailPage';
import { TrackSearchPage } from './pages/TrackSearchPage';
import { ProfilePage } from './pages/ProfilePage';
import { AuthPage } from './pages/AuthPage';
import { translations } from './i18n/translations';
import { Shield, Sparkles, Database } from 'lucide-react';

function AppContent() {
  const { user, language, isSupabaseLive, loginAsDemoUser } = useAuth();
  const t = translations[language];

  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [activeComplaintId, setActiveComplaintId] = useState<string | null>(null);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState<boolean>(false);

  const openTrackingDetail = (complaintId: string) => {
    setActiveComplaintId(complaintId);
    setCurrentTab('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigate = (tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isLanding = currentTab === 'landing';

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col" style={{ fontFamily: "'Plus Jakarta Sans', 'Noto Sans Devanagari', sans-serif" }}>
      {/* Top Navigation - hidden on landing */}
      {!isLanding && (
        <Navbar
          currentTab={currentTab}
          setCurrentTab={navigate}
          openSupabaseModal={() => setIsSupabaseModalOpen(true)}
          openTrackingDetail={openTrackingDetail}
        />
      )}

      {/* Main Content */}
      <main className={`flex-1 w-full mx-auto ${isLanding ? 'p-0' : 'max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8'}`}>
        {currentTab === 'landing' && (
          <LandingPage
            onGetStarted={() => navigate('auth')}
            onDemoLogin={(index) => {
              loginAsDemoUser(index);
              navigate('home');
            }}
          />
        )}

        {currentTab === 'home' && (
          <HomePage
            setCurrentTab={navigate}
            openTrackingDetail={openTrackingDetail}
            openSupabaseModal={() => setIsSupabaseModalOpen(true)}
          />
        )}

        {currentTab === 'report' && (
          <ReportIssuePage
            onComplaintSubmitted={(id) => openTrackingDetail(id)}
            onCancel={() => navigate('home')}
          />
        )}

        {currentTab === 'track' && (
          <TrackSearchPage
            onOpenDetail={openTrackingDetail}
            onNewReport={() => navigate('report')}
          />
        )}

        {currentTab === 'complaints' && (
          <MyComplaintsPage
            onSelectComplaint={openTrackingDetail}
            onNewReport={() => navigate('report')}
          />
        )}

        {currentTab === 'detail' && activeComplaintId && (
          <ComplaintDetailPage
            complaintId={activeComplaintId}
            onBack={() => navigate('complaints')}
          />
        )}

        {currentTab === 'profile' && (
          <ProfilePage
            onLogout={() => navigate('landing')}
            openSupabaseModal={() => setIsSupabaseModalOpen(true)}
          />
        )}

        {currentTab === 'auth' && (
          <AuthPage
            onSuccess={() => navigate('home')}
            onBackToLanding={() => navigate('landing')}
          />
        )}
      </main>

      {/* Government Footer - hidden on landing */}
      {!isLanding && (
        <footer className="bg-white border-t border-slate-200 mt-auto pb-20 md:pb-0">
          {/* Top footer bar */}
          <div className="border-b border-slate-100 py-4 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-700 to-sky-500 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">CivicFix Municipal Grievance & Accountability System</p>
                  <p className="text-[10px] text-slate-500">Empowering Citizens · Accountable Governance</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-indigo-500" />
                  <span>Gemini AI Powered</span>
                </span>
                <span className="hidden sm:inline text-slate-300">|</span>
                <button
                  onClick={() => setIsSupabaseModalOpen(true)}
                  className={`flex items-center gap-1.5 hover:underline font-medium transition-colors ${
                    isSupabaseLive ? 'text-emerald-600' : 'text-amber-600'
                  }`}
                >
                  <Database className="w-3 h-3" />
                  <span>{isSupabaseLive ? 'Supabase Connected' : 'Demo Mode'}</span>
                </button>
              </div>
            </div>
          </div>
          {/* Bottom footer */}
          <div className="py-3 px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-[10px] text-slate-400 max-w-2xl mx-auto leading-relaxed">
              CivicFix provides citizens with transparent tracking, automated departmental routing, and auditable escalation timers
              according to statutory Citizen Service Charters. Designed for scalable deployment across municipal corporations.
            </p>
            <p className="text-[10px] text-slate-400 mt-1">
              © {new Date().getFullYear()} CivicFix · Municipal Digital Services Platform
            </p>
          </div>
        </footer>
      )}

      {/* Mobile Bottom Navigation */}
      {!isLanding && (
        <BottomNav
          currentTab={currentTab}
          setCurrentTab={navigate}
        />
      )}

      {/* Supabase Configuration Modal */}
      <SupabaseSetupModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ComplaintProvider>
        <AppContent />
      </ComplaintProvider>
    </AuthProvider>
  );
}
