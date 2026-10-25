import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useComplaints } from '../context/ComplaintContext';
import { translations } from '../i18n/translations';
import { Language } from '../types';
import {
  ShieldCheck,
  Globe,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  Database,
  User,
  LogOut,
  X
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openSupabaseModal: () => void;
  openTrackingDetail: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  openSupabaseModal,
  openTrackingDetail
}) => {
  const { user, language, setLanguage, logout, isSupabaseLive, loginAsDemoUser } = useAuth();
  const { notifications, unreadNotifsCount, markNotificationRead, markAllNotificationsRead } = useComplaints();
  const t = translations[language];

  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const languages: { code: Language; label: string; native: string }[] = [
    { code: 'mr', label: 'Marathi', native: 'मराठी' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'en', label: 'English', native: 'English' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/98 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Official Government Top Bar */}
      <div className="bg-slate-900 text-slate-200 text-[11px] py-1 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 font-bold tracking-wide text-amber-300">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              सत्यमेव जयते
            </span>
            <span className="text-slate-400 hidden sm:inline">|</span>
            <span className="font-semibold text-slate-200 hidden sm:inline">
              MUNICIPAL CORPORATION & CITIZEN GRIEVANCE PORTAL
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="hidden md:inline text-slate-300">
              Citizen Toll-Free Helpline: <strong className="text-amber-300 font-mono">1916 / 112</strong>
            </span>
            <span className="hidden sm:inline text-slate-500">|</span>
            <span className="inline-flex items-center gap-1 text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-medium">
              <span>RTI / Public Grievance Charter</span>
            </span>
          </div>
        </div>
      </div>
      {/* Tricolor accent bar */}
      <div className="h-[3px] w-full bg-gradient-to-r from-amber-500 via-white to-emerald-600"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tagline */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setCurrentTab('home')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white shadow-sm shadow-sky-200 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl tracking-tight text-slate-900">
                  Civic<span className="text-sky-600">Fix</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Citizen Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block font-medium">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setCurrentTab('landing')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'landing'
                  ? 'bg-sky-50 text-sky-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setCurrentTab('home')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'home'
                  ? 'bg-sky-50 text-sky-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t.navHome}
            </button>
            <button
              onClick={() => setCurrentTab('report')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'report'
                  ? 'bg-sky-50 text-sky-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t.navReport}
            </button>
            <button
              onClick={() => setCurrentTab('track')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'track'
                  ? 'bg-sky-50 text-sky-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t.navTrack}
            </button>
            <button
              onClick={() => setCurrentTab('complaints')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'complaints'
                  ? 'bg-sky-50 text-sky-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t.navComplaints}
            </button>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Supabase / Demo Status Indicator */}
            <button
              onClick={openSupabaseModal}
              title="Database & Cloud Sync Configuration"
              className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                isSupabaseLive
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>{isSupabaseLive ? 'Supabase Live' : 'Demo Mode'}</span>
            </button>

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
                aria-label="Change language"
              >
                <Globe className="w-4 h-4 text-sky-600" />
                <span className="font-semibold uppercase">{language}</span>
              </button>

              {showLangMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowLangMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-20">
                    <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Select Language
                    </div>
                    {languages.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setShowLangMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-sky-50 transition-colors ${
                          language === lang.code ? 'font-bold text-sky-700 bg-sky-50/50' : 'text-slate-700'
                        }`}
                      >
                        <span>{lang.native}</span>
                        <span className="text-xs text-slate-400 font-normal">({lang.label})</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>

              {showNotifMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowNotifMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-20">
                    <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                      <span className="font-semibold text-slate-900 text-sm">Notifications</span>
                      {unreadNotifsCount > 0 && (
                        <button
                          onClick={markAllNotificationsRead}
                          className="text-xs text-sky-600 hover:underline"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-xs text-slate-400">
                          No notifications yet.
                        </div>
                      ) : (
                        notifications.map(n => (
                          <div
                            key={n.id}
                            onClick={() => {
                              markNotificationRead(n.id);
                              if (n.complaintId) {
                                openTrackingDetail(n.complaintId);
                                setShowNotifMenu(false);
                              }
                            }}
                            className={`p-3 hover:bg-sky-50/60 cursor-pointer transition-colors text-left ${
                              !n.isRead ? 'bg-sky-50/30' : ''
                            }`}
                          >
                            <div className="flex items-start gap-2.5">
                              {n.type === 'sla_warning' ? (
                                <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                              ) : n.type === 'resolution' ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                              ) : (
                                <Clock className="w-4 h-4 text-sky-500 mt-0.5 shrink-0" />
                              )}
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <p className="text-xs font-semibold text-slate-800">{n.title}</p>
                                  {!n.isRead && (
                                    <span className="w-2 h-2 bg-sky-500 rounded-full" />
                                  )}
                                </div>
                                <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{n.message}</p>
                                <span className="text-[10px] text-slate-400 mt-1 block">
                                  {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* User Profile / Auth Button */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-lg hover:bg-slate-100 border border-slate-200 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-800 font-semibold text-xs flex items-center justify-center">
                    {user.displayName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-medium text-slate-700 hidden sm:inline max-w-[100px] truncate">
                    {user.displayName.split(' ')[0]}
                  </span>
                </button>

                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-20">
                      <div className="p-3 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-900 truncate">{user.displayName}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                        <span className="inline-block mt-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-sky-50 text-sky-700">
                          {user.isDemo ? 'Demo Citizen Account' : 'Authenticated Citizen'}
                        </span>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => {
                            setCurrentTab('profile');
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2"
                        >
                          <User className="w-3.5 h-3.5 text-slate-500" />
                          <span>Citizen Profile & Preferences</span>
                        </button>
                      </div>

                      <div className="pt-1 border-t border-slate-100">
                        <p className="text-[10px] font-semibold text-slate-400 px-3 py-1 uppercase">Switch Demo Citizen</p>
                        <button
                          onClick={() => {
                            loginAsDemoUser(0);
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-3 py-1.5 text-xs text-slate-600 hover:bg-sky-50 rounded-lg flex items-center justify-between"
                        >
                          <span>Ramesh Patil (मराठी)</span>
                          <span className="text-[10px] text-slate-400">MR</span>
                        </button>
                        <button
                          onClick={() => {
                            loginAsDemoUser(1);
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-3 py-1.5 text-xs text-slate-600 hover:bg-sky-50 rounded-lg flex items-center justify-between"
                        >
                          <span>Pooja Sharma (हिन्दी)</span>
                          <span className="text-[10px] text-slate-400">HI</span>
                        </button>
                        <button
                          onClick={() => {
                            loginAsDemoUser(2);
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-3 py-1.5 text-xs text-slate-600 hover:bg-sky-50 rounded-lg flex items-center justify-between"
                        >
                          <span>Arjun Mehta (English)</span>
                          <span className="text-[10px] text-slate-400">EN</span>
                        </button>
                      </div>

                      <div className="pt-2 border-t border-slate-100">
                        <button
                          onClick={() => {
                            logout();
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-2"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>{t.logout}</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={() => setCurrentTab('auth')}
                className="px-3.5 py-1.5 rounded-lg bg-sky-600 text-white text-xs font-semibold hover:bg-sky-700 transition-colors shadow-xs"
              >
                {t.login}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
