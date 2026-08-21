import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { CLINIC_INFO } from '../data/clinicData';
import { generateFingerprint } from '../utils/crypto';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isDoctor: boolean;
  login: (email: string, role?: UserRole, name?: string, phone?: string) => Promise<void>;
  signup: (name: string, email: string, phone: string, role: UserRole, medicalHistory?: string) => Promise<void>;
  logout: () => void;
  switchDemoRole: (role: UserRole) => Promise<void>;
  isAuthModalOpen: boolean;
  openAuthModal: (initialRole?: UserRole) => void;
  closeAuthModal: () => void;
  authModalInitialRole: UserRole;
}

const DOCTOR_USER: User = {
  id: 'usr-doctor-aarav',
  name: 'Dr. Aarav Mehta',
  email: CLINIC_INFO.email,
  phone: CLINIC_INFO.phone,
  role: 'dentist',
  avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80',
  createdAt: '2018-01-01',
};

const PATIENT_USER: User = {
  id: 'usr-patient-priya',
  name: 'Priya Sharma',
  email: 'priya.sharma@example.com',
  phone: '+91 98123 45678',
  role: 'patient',
  medicalHistory: 'Mild tooth sensitivity, no known drug allergies.',
  allergies: ['Penicillin: None', 'Latex: None'],
  createdAt: '2026-06-10',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('smilecraft_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return PATIENT_USER;
      }
    }
    return PATIENT_USER; // Default to patient logged in for immediate friendly UX
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalInitialRole, setAuthModalInitialRole] = useState<UserRole>('patient');

  useEffect(() => {
    if (user) {
      localStorage.setItem('smilecraft_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('smilecraft_user');
    }
  }, [user]);

  const login = async (email: string, role: UserRole = 'patient', name?: string, phone?: string) => {
    // If logging in as doctor email
    if (email.toLowerCase().includes('aarav') || email.toLowerCase().includes('smilecraft') || role === 'dentist') {
      const fp = await generateFingerprint('Dr_Aarav_Mehta_Dental_Key_2026');
      const doc = { ...DOCTOR_USER, publicKey: fp };
      setUser(doc);
    } else {
      const fp = await generateFingerprint(email);
      const newUser: User = {
        id: `usr-${Date.now()}`,
        name: name || (email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1)),
        email,
        phone: phone || '+91 98765 00000',
        role: 'patient',
        publicKey: fp,
        createdAt: new Date().toISOString(),
      };
      setUser(newUser);
    }
    setIsAuthModalOpen(false);
  };

  const signup = async (
    name: string,
    email: string,
    phone: string,
    role: UserRole,
    medicalHistory?: string
  ) => {
    const fp = await generateFingerprint(`${email}-${Date.now()}`);
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name,
      email,
      phone,
      role,
      medicalHistory: medicalHistory || 'None reported',
      publicKey: fp,
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
  };

  const switchDemoRole = async (role: UserRole) => {
    if (role === 'dentist') {
      const fp = await generateFingerprint('Dr_Aarav_Mehta_Key');
      setUser({ ...DOCTOR_USER, publicKey: fp });
    } else {
      const fp = await generateFingerprint('Priya_Sharma_Key');
      setUser({ ...PATIENT_USER, publicKey: fp });
    }
  };

  const openAuthModal = (initialRole: UserRole = 'patient') => {
    setAuthModalInitialRole(initialRole);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isDoctor: user?.role === 'dentist',
        login,
        signup,
        logout,
        switchDemoRole,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        authModalInitialRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
