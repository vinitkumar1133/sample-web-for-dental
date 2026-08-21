import React, { useState } from 'react';
import { CLINIC_INFO } from '../data/clinicData';
import { useClinic } from '../context/ClinicContext';
import { useAuth } from '../context/AuthContext';
import {
  createReminderWhatsAppMessage,
  generateWhatsAppLink,
  downloadCalendarEvent
} from '../utils/notifications';
import {
  User,
  Calendar,
  Clock,
  ShieldCheck,
  Lock,
  MessageCircle,
  Download,
  Star,
  FileText,
  AlertCircle,
  PlusCircle,
  CheckCircle2,
  Stethoscope
} from 'lucide-react';

export const PatientPortal: React.FC = () => {
  const { appointments, openBooking, openReviewModal, openChat, updateAppointmentStatus } = useClinic();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'appointments' | 'records' | 'postcare'>('appointments');

  // Filter appointments for this patient (or show sample patient appointments if matching email/name)
  const myAppointments = appointments.filter(
    apt => !user || apt.patientName.toLowerCase().includes(user.name.toLowerCase()) || apt.patientEmail === user.email || true
  );

  return (
    <section className="py-10 sm:py-14 bg-[#f8fafc] border-b border-slate-200 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Patient Profile Card */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 pb-5 border-b border-slate-100">
            
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-700 font-extrabold flex items-center justify-center text-2xl shadow-xs border border-teal-100">
                👤
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-heading text-xl font-bold text-slate-800">
                    {user?.name || 'Priya Sharma'}
                  </h1>
                  <span className="text-[9px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Verified Patient
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {user?.phone || '+91 98123 45678'} • {user?.email || 'priya.sharma@example.com'}
                </p>
                <div className="mt-1 flex items-center gap-1.5 text-[10px] text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full font-mono w-fit border border-teal-100">
                  <Lock className="w-2.5 h-2.5 text-teal-600" />
                  <span>E2EE Vault ID: {user?.publicKey || 'SHA256:7B8F:901A:3C4E'}</span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => openBooking()}
                className="flex-1 sm:flex-none px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-full text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Visit (₹500)</span>
              </button>
              <button
                onClick={openChat}
                className="flex-1 sm:flex-none px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-teal-400" />
                <span>Doctor Chat</span>
              </button>
              <button
                onClick={openReviewModal}
                className="flex-1 sm:flex-none px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>Review</span>
              </button>
            </div>

          </div>

          {/* Navigation Tabs inside portal */}
          <div className="flex items-center gap-1.5 pt-3.5">
            {[
              { id: 'appointments', label: 'My Appointments', icon: Calendar },
              { id: 'records', label: 'E2EE Medical Records', icon: Lock },
              { id: 'postcare', label: 'Post-Care Guides', icon: FileText },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-teal-50 text-teal-800 border border-teal-200 shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab 1: Appointments List */}
        {activeTab === 'appointments' && (
          <div className="space-y-3">
            <h2 className="font-heading text-base font-bold text-slate-800">
              Scheduled & Past Dental Visits
            </h2>

            {myAppointments.map(apt => {
              const waLink = generateWhatsAppLink(
                CLINIC_INFO.rawPhone,
                createReminderWhatsAppMessage(apt)
              );

              return (
                <div
                  key={apt.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-heading font-bold text-sm sm:text-base text-slate-800">
                          {apt.treatment}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            apt.status === 'confirmed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : apt.status === 'completed'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {apt.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500">
                        <span className="flex items-center gap-1 font-semibold text-slate-700">
                          <Calendar className="w-3 h-3 text-teal-600" /> {apt.date}
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-slate-700">
                          <Clock className="w-3 h-3 text-teal-600" /> {apt.timeSlot}
                        </span>
                        <span>•</span>
                        <span>{CLINIC_INFO.doctor}</span>
                        <span>•</span>
                        <span>Fee: ₹{apt.fee}</span>
                      </div>
                    </div>

                    {/* Patient Actions on Appointment */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold flex items-center gap-1.5"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>WhatsApp Studio</span>
                      </a>

                      <button
                        onClick={() => downloadCalendarEvent({
                          patientName: apt.patientName,
                          treatment: apt.treatment,
                          date: apt.date,
                          timeSlot: apt.timeSlot
                        })}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3 h-3" />
                        <span>Add to Cal</span>
                      </button>

                      {apt.status === 'confirmed' && (
                        <button
                          onClick={() => updateAppointmentStatus(apt.id, 'cancelled')}
                          className="px-2.5 py-1.5 text-rose-600 hover:bg-rose-50 rounded-full text-xs font-medium cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                    <span>📍 Clinic: 2nd Floor, Green Avenue, Model Town, Ludhiana</span>
                    <span className="text-teal-700 font-semibold">📞 {CLINIC_INFO.emergencyPhone}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Encrypted Records */}
        {activeTab === 'records' && (
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-base text-slate-800 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-teal-600" />
                  <span>Confidential Clinical Notes & Prescriptions Vault</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Decrypted on-device via Web Crypto PBKDF2 & AES-GCM 256-bit.
                </p>
              </div>
            </div>

            <div className="space-y-2.5 pt-1">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">
                    Clinical Assessment: Single Sitting Rotary RCT
                  </span>
                  <span className="text-slate-400 text-[11px]">2026-08-15</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Pulp extirpation performed on tooth #46 under 2% Lignocaine. Apex locator working length: MB 21mm, ML 21mm, D 21.5mm. Obturation with bioceramic sealer. Core buildup completed.
                </p>
                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-teal-700 font-mono">
                  <span>Prescribed: Amoxicillin 500mg (1-1-1 x 5 days), Ketorolac 10mg SOS</span>
                  <span className="text-emerald-600 font-bold">✓ Signed by Dr. Aarav Mehta</span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">
                    Full Mouth Digital Screening & Shade Assessment
                  </span>
                  <span className="text-slate-400 text-[11px]">2026-06-10</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Intraoral 3D camera assessment shows healthy periodontal tissues. Initial shade recorded as Vita A3. Cold blue laser whitening recommended.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Post-Care Guides */}
        {activeTab === 'postcare' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-2.5 shadow-sm">
              <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100">
                Root Canal & Extraction Recovery
              </span>
              <h4 className="font-heading font-bold text-sm text-slate-800">
                First 48 Hours After Treatment
              </h4>
              <ul className="text-xs text-slate-600 space-y-1.5">
                <li>• Do not chew hard foods on the treated side until the permanent crown is seated.</li>
                <li>• Avoid hot tea/coffee while numbness is active to prevent accidental cheek bites.</li>
                <li>• Warm salt water rinses 3 times daily starting 24 hours after the visit.</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-2.5 shadow-sm">
              <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100">
                Laser Teeth Whitening
              </span>
              <h4 className="font-heading font-bold text-sm text-slate-800">
                White Diet Protocol (48 Hours)
              </h4>
              <ul className="text-xs text-slate-600 space-y-1.5">
                <li>• Avoid staining foods/drinks: turmeric gravies, dark chai/coffee, red wine, and soy sauce.</li>
                <li>• Consume white rice, milk, paneer, oats, yogurt, and plain water.</li>
                <li>• Use the provided remineralizing desensitizing gel if mild sensitivity arises.</li>
              </ul>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
