'use client'
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Webdata } from '@/data/data';
import { useAuth } from './AuthContext';

interface Process {
  name: string;
  description?: string;
  locations: string[];
  features?: string[];
  stats?: string[];
  headings: {
    hero_title: string;
    hero_subtitle: string;
    footer_text: string;
  };
  style: {
    primary_color: string;
    secondary_color: string;
    accent_color: string;
  };
  images: {
    logo: string;
    hero_bg: string;
    banner: string;
  };
  links?: {
    website?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    github?: string;
  };
  about?: {
    overview: string;
    mission: string;
    vision: string;
    objectives: string[];
  };
  projects?: Array<{
    title: string;
    description: string;
    impact: string;
    status: string;
    image?: string;
    bgImage?: string;
    link?: string;
  }>;
  contactPage?: {
    offices: Array<{ name: string; location: string; phone?: string }>;
    support: {
      helpline?: string;
      email: string;
    };
    working_hours: string;
  };
}

interface ProcessContextType {
  selectedProcess: Process | null;
  setSelectedProcess: (process: Process | null) => void;
}

const ProcessContext = createContext<ProcessContextType | undefined>(undefined);

export function ProcessProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null);

  // Sync process with user data
  useEffect(() => {
    if (user && user.process) {
      const userProcess = (Webdata.processes as any)[user.process];
      if (userProcess) {
        setSelectedProcess(userProcess);
        localStorage.setItem('selectedProcess', JSON.stringify(userProcess));
      }
    } else if (!user) {
      // For guest users, try to load from local storage or use default
      const storedProcess = localStorage.getItem('selectedProcess');
      if (storedProcess) {
        try {
          setSelectedProcess(JSON.parse(storedProcess));
        } catch (e) {
          setSelectedProcess(Webdata.processes.visionPlus as any);
        }
      } else {
        setSelectedProcess(Webdata.processes.visionPlus as any);
      }
    }
  }, [user]);

  const handleSetSelectedProcess = (process: Process | null) => {
    // Only allow setting process if user is NOT logged in
    // or if it's during the signup/login flow (which is handled by useEffect above)
    if (!user) {
      setSelectedProcess(process);
      if (process) {
        localStorage.setItem('selectedProcess', JSON.stringify(process));
      } else {
        localStorage.removeItem('selectedProcess');
      }
    }
  };

  return (
    <ProcessContext.Provider value={{ selectedProcess, setSelectedProcess: handleSetSelectedProcess }}>
      {children}
    </ProcessContext.Provider>
  );
}

export function useProcess() {
  const context = useContext(ProcessContext);
  if (context === undefined) {
    throw new Error('useProcess must be used within a ProcessProvider');
  }
  return context;
}
