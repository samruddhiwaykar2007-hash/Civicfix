import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, Language } from '../types';
import { DEMO_USERS, getStoredUser, saveStoredUser } from '../lib/storage';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

interface AuthContextType {
  user: UserProfile | null;
  language: Language;
  setLanguage: (lang: Language) => void;
  loginAsDemoUser: (userIndex: number) => void;
  signInWithEmail: (email: string, password: string) => Promise<{ error?: string }>;
  signUpWithEmail: (name: string, email: string, password: string, lang: Language) => Promise<{ error?: string }>;
  logout: () => void;
  isSupabaseLive: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [language, setLanguageState] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isSupabaseLive = isSupabaseConfigured();

  useEffect(() => {
    // Check if Supabase session is active
    if (isSupabaseLive && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const profile: UserProfile = {
            id: session.user.id,
            displayName: session.user.user_metadata?.display_name || session.user.email?.split('@')[0] || 'Citizen',
            email: session.user.email || '',
            preferredLanguage: (session.user.user_metadata?.preferred_language as Language) || 'en',
            createdAt: session.user.created_at,
            isDemo: false
          };
          setUser(profile);
          setLanguageState(profile.preferredLanguage);
        } else {
          loadStoredDemoUser();
        }
        setIsLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const profile: UserProfile = {
            id: session.user.id,
            displayName: session.user.user_metadata?.display_name || session.user.email?.split('@')[0] || 'Citizen',
            email: session.user.email || '',
            preferredLanguage: (session.user.user_metadata?.preferred_language as Language) || 'en',
            createdAt: session.user.created_at,
            isDemo: false
          };
          setUser(profile);
          setLanguageState(profile.preferredLanguage);
        } else {
          loadStoredDemoUser();
        }
      });

      return () => subscription.unsubscribe();
    } else {
      loadStoredDemoUser();
      setIsLoading(false);
    }
  }, [isSupabaseLive]);

  const loadStoredDemoUser = () => {
    const stored = getStoredUser();
    if (stored) {
      setUser(stored);
      setLanguageState(stored.preferredLanguage);
    } else {
      setUser(DEMO_USERS[0]);
      setLanguageState(DEMO_USERS[0].preferredLanguage);
    }
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (user) {
      const updated = { ...user, preferredLanguage: lang };
      setUser(updated);
      saveStoredUser(updated);
    }
  };

  const loginAsDemoUser = (userIndex: number) => {
    const selected = DEMO_USERS[userIndex] || DEMO_USERS[0];
    setUser(selected);
    setLanguageState(selected.preferredLanguage);
    saveStoredUser(selected);
  };

  const signInWithEmail = async (email: string, password: string): Promise<{ error?: string }> => {
    if (isSupabaseLive && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message };
      if (data.user) {
        const profile: UserProfile = {
          id: data.user.id,
          displayName: data.user.user_metadata?.display_name || email.split('@')[0],
          email: data.user.email || email,
          preferredLanguage: (data.user.user_metadata?.preferred_language as Language) || language,
          createdAt: data.user.created_at,
          isDemo: false
        };
        setUser(profile);
        setLanguageState(profile.preferredLanguage);
        return {};
      }
    }

    // In demo mode, sign in with minimal validation
    const customUser: UserProfile = {
      id: `usr_${Date.now()}`,
      displayName: email.split('@')[0],
      email,
      preferredLanguage: language,
      createdAt: new Date().toISOString(),
      isDemo: true
    };
    setUser(customUser);
    saveStoredUser(customUser);
    return {};
  };

  const signUpWithEmail = async (name: string, email: string, password: string, lang: Language): Promise<{ error?: string }> => {
    if (isSupabaseLive && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: name,
            preferred_language: lang
          }
        }
      });
      if (error) return { error: error.message };
      if (data.user) {
        const profile: UserProfile = {
          id: data.user.id,
          displayName: name,
          email,
          preferredLanguage: lang,
          createdAt: data.user.created_at,
          isDemo: false
        };
        setUser(profile);
        setLanguageState(lang);
        return {};
      }
    }

    // Demo mode registration
    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      displayName: name,
      email,
      preferredLanguage: lang,
      createdAt: new Date().toISOString(),
      isDemo: true
    };
    setUser(newUser);
    setLanguageState(lang);
    saveStoredUser(newUser);
    return {};
  };

  const logout = async () => {
    if (isSupabaseLive && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    saveStoredUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        language,
        setLanguage,
        loginAsDemoUser,
        signInWithEmail,
        signUpWithEmail,
        logout,
        isSupabaseLive,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
