import React, { useState } from 'react';
import { CLINIC_INFO } from '../data/clinicData';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import {
  X,
  Lock,
  Mail,
  User,
  Phone,
  ShieldCheck,
  Stethoscope,
  Key,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, login, signup, authModalInitialRole } = useAuth();
  
  const [isLoginTab, setIsLoginTab] = useState<boolean>(true);
  const [role, setRole] = useState<UserRole>(authModalInitialRole || 'patient');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [medicalHistory, setMedicalHistory] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isLoginTab) {
        await login(email, role, name, phone);
      } else {
        await signup(name, email, phone, role, medicalHistory);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemoDoctor = () => {
    setRole('dentist');
    setEmail(CLINIC_INFO.email);
    setName(CLINIC_INFO.doctor);
    setPhone(CLINIC_INFO.phone);
  };

  const handleFillDemoPatient = () => {
    setRole('patient');
    setEmail('priya.sharma@example.com');
    setName('Priya Sharma');
    setPhone('+91 98123 45678');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="bg-slate-900 p-4 sm:p-5 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center text-lg border border-teal-500/30">
              🦷
            </div>
            <div>
              <h3 className="font-heading font-bold text-base sm:text-lg tracking-tight">
                {isLoginTab ? 'Sign In to SmileCraft' : 'Create Patient Account'}
              </h3>
              <p className="text-[11px] text-slate-300">
                Model Town, Ludhiana • E2EE Protected
              </p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher (Login vs Sign Up) */}
        <div className="flex border-b border-slate-100 bg-slate-50/50">
          <button
            onClick={() => setIsLoginTab(true)}
            className={`flex-1 py-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              isLoginTab
                ? 'border-teal-600 text-teal-800 bg-white shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsLoginTab(false)}
            className={`flex-1 py-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              !isLoginTab
                ? 'border-teal-600 text-teal-800 bg-white shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Quick Demo Pre-fills */}
        <div className="px-5 pt-3.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Instant Demo Logins:
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={handleFillDemoDoctor}
              className="px-2.5 py-1 rounded-full border border-teal-200 bg-teal-50 hover:bg-teal-100 text-teal-800 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <Stethoscope className="w-3 h-3" />
              <span>Dr. Aarav Mehta</span>
            </button>
            <button
              type="button"
              onClick={handleFillDemoPatient}
              className="px-2.5 py-1 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <User className="w-3 h-3 text-slate-500" />
              <span>Priya Sharma</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3">
          
          {/* Role Choice */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              I am logging in as:
            </label>
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setRole('patient')}
                className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  role === 'patient'
                    ? 'bg-white text-teal-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Patient
              </button>
              <button
                type="button"
                onClick={() => setRole('dentist')}
                className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  role === 'dentist'
                    ? 'bg-white text-teal-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Dentist / Staff
              </button>
            </div>
          </div>

          {/* Name Field (for signup or optional in login) */}
          {(!isLoginTab || !email) && (
            <div>
              <label className="block text-xs text-slate-600 font-semibold mb-1">Full Name</label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="e.g. Gurpreet Singh"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 focus:border-teal-500 text-xs font-medium bg-slate-50"
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="block text-xs text-slate-600 font-semibold mb-1">Email Address *</label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                placeholder="e.g. priya@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 focus:border-teal-500 text-xs font-medium bg-slate-50"
                required
              />
            </div>
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-xs text-slate-600 font-semibold mb-1">WhatsApp Mobile (+91)</label>
            <div className="relative">
              <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 focus:border-teal-500 text-xs font-medium bg-slate-50"
              />
            </div>
          </div>

          {/* Medical history for signup */}
          {!isLoginTab && (
            <div>
              <label className="block text-xs text-slate-600 font-semibold mb-1">
                Medical History / Allergies (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Penicillin allergy, mild hypertension"
                value={medicalHistory}
                onChange={(e) => setMedicalHistory(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-slate-50"
              />
            </div>
          )}

          {/* E2EE Guarantee */}
          <div className="flex items-center gap-1.5 text-[10px] text-teal-800 bg-teal-50 p-2 rounded-xl border border-teal-200">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span>
              End-to-End Cryptographic Key derived automatically on device.
            </span>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isSubmitting || !email}
            className="w-full py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-full font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-1"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>
              {isSubmitting ? 'Authenticating...' : isLoginTab ? 'Sign In Securely' : 'Complete Registration'}
            </span>
          </button>

        </form>

      </div>
    </div>
  );
};
