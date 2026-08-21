/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ClinicProvider, useClinic } from './context/ClinicContext';
import { CLINIC_INFO } from './data/clinicData';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { ReviewsSection } from './components/ReviewsSection';
import { FollowUpHub } from './components/FollowUpHub';
import { SecureConsultationChat } from './components/SecureConsultationChat';
import { DoctorDashboard } from './components/DoctorDashboard';
import { PatientPortal } from './components/PatientPortal';
import { BookingModal } from './components/BookingModal';
import { ReviewModal } from './components/ReviewModal';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import {
  MessageCircle,
  Calendar,
  Phone,
  ShieldCheck,
  CheckCircle,
  X,
  AlertTriangle,
  Info
} from 'lucide-react';

const ClinicAppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('home');
  const {
    isBookingOpen,
    closeBooking,
    selectedTreatmentForBooking,
    isReviewModalOpen,
    closeReviewModal,
    activeToast,
    dismissToast,
    openBooking
  } = useClinic();
  const { isDoctor } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      
      {/* Top Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Pages based on Active Tab */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <div>
            <Hero
              onExploreServices={() => setActiveTab('services')}
              onViewReviews={() => setActiveTab('reviews')}
            />
            <ServicesSection />
            <ReviewsSection />
            <FollowUpHub />
            <SecureConsultationChat />
          </div>
        )}

        {activeTab === 'services' && <ServicesSection />}

        {activeTab === 'reviews' && <ReviewsSection />}

        {activeTab === 'followups' && <FollowUpHub />}

        {activeTab === 'e2ee-chat' && <SecureConsultationChat />}

        {activeTab === 'doctor-portal' && <DoctorDashboard />}

        {activeTab === 'patient-portal' && <PatientPortal />}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={(tab) => {
        setActiveTab(tab);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }} />

      {/* Floating Action Bar on Mobile & Desktop */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2.5">
        {/* WhatsApp Direct Chat Trigger */}
        <a
          href={`https://wa.me/${CLINIC_INFO.rawPhone}?text=${encodeURIComponent(
            'Hello Dr. Aarav Mehta! I would like to book a dental consultation at SmileCraft Dental Studio, Model Town, Ludhiana.'
          )}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-3.5 py-2.5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white rounded-full shadow-lg shadow-emerald-600/30 transition-all font-bold text-xs group"
          title="Direct WhatsApp with Dr. Aarav Mehta"
        >
          <MessageCircle className="w-5 h-5 fill-white/20" />
          <span className="hidden sm:inline">WhatsApp Studio</span>
        </a>

        {/* Quick Book Floating Button */}
        <button
          onClick={() => openBooking()}
          className="flex items-center gap-2 px-4 py-3 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white rounded-full shadow-xl shadow-teal-600/30 transition-all font-bold text-xs sm:text-sm cursor-pointer"
        >
          <Calendar className="w-4 h-4" />
          <span>Book Visit (₹500)</span>
        </button>
      </div>

      {/* Global Interactive Modals */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={closeBooking}
        preselectedTreatment={selectedTreatmentForBooking}
      />

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={closeReviewModal}
      />

      <AuthModal />

      {/* Global Notification Toast */}
      {activeToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 duration-200">
          <div className="bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 text-xs sm:text-sm max-w-md">
            {activeToast.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-teal-400 shrink-0" />
            ) : activeToast.type === 'warning' ? (
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            ) : (
              <Info className="w-5 h-5 text-teal-400 shrink-0" />
            )}
            <div>
              <p className="font-bold text-white leading-tight">{activeToast.title}</p>
              <p className="text-slate-300 text-xs mt-0.5">{activeToast.message}</p>
            </div>
            <button
              onClick={dismissToast}
              className="ml-2 text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ClinicProvider>
        <ClinicAppContent />
      </ClinicProvider>
    </AuthProvider>
  );
}
