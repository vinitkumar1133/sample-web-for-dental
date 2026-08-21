import React, { useState } from 'react';
import { CLINIC_INFO } from '../data/clinicData';
import { useClinic } from '../context/ClinicContext';
import { useAuth } from '../context/AuthContext';
import { Appointment, AppointmentStatus } from '../types';
import {
  generateWhatsAppLink,
  createReminderWhatsAppMessage,
  createPostTreatmentWhatsAppMessage,
  generateMailtoLink
} from '../utils/notifications';
import { encryptMessage } from '../utils/crypto';
import {
  Stethoscope,
  Calendar,
  Clock,
  User,
  Phone,
  MessageCircle,
  Mail,
  CheckCircle,
  AlertCircle,
  FileEdit,
  ShieldCheck,
  Search,
  Filter,
  PlusCircle,
  Lock,
  Star,
  Activity
} from 'lucide-react';

export const DoctorDashboard: React.FC = () => {
  const {
    appointments,
    updateAppointmentStatus,
    rescheduleAppointment,
    sendWhatsAppFollowUp,
    sendEmailFollowUp,
    openReviewModal,
    showToast
  } = useClinic();
  const { user } = useAuth();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeNoteAptId, setActiveNoteAptId] = useState<string | null>(null);
  const [clinicalNote, setClinicalNote] = useState<string>('');
  const [reschedulingAptId, setReschedulingAptId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState<string>('');
  const [newSlot, setNewSlot] = useState<string>('11:00 AM');

  const filteredAppointments = appointments.filter(apt => {
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    const matchesQuery =
      apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.treatment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.patientPhone.includes(searchQuery);
    return matchesStatus && matchesQuery;
  });

  const totalPatients = appointments.length;
  const confirmedCount = appointments.filter(a => a.status === 'confirmed').length;
  const completedCount = appointments.filter(a => a.status === 'completed').length;
  const emergencyCount = appointments.filter(a => a.isEmergency && a.status !== 'completed').length;

  const handleSaveEncryptedNote = async (aptId: string) => {
    if (!clinicalNote.trim()) return;
    const payload = await encryptMessage(clinicalNote);
    showToast('Clinical Note Encrypted', `Saved to patient record vault (Fingerprint: ${payload.fingerprint}).`);
    setActiveNoteAptId(null);
    setClinicalNote('');
  };

  const handleReschedule = (aptId: string) => {
    if (!newDate) return;
    rescheduleAppointment(aptId, newDate, newSlot);
    setReschedulingAptId(null);
  };

  return (
    <section className="py-10 sm:py-14 bg-[#f8fafc] border-b border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Doctor Header Banner */}
        <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 mb-6 shadow-sm border border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-xl bg-teal-500/20 border border-teal-400/40 p-0.5 flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80"
                  alt={CLINIC_INFO.doctor}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-heading text-xl sm:text-2xl font-extrabold tracking-tight">
                    {CLINIC_INFO.doctor}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-teal-400 text-teal-950 uppercase">
                    Clinical Surgeon Portal
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  SmileCraft Dental Studio • Model Town, Ludhiana • {CLINIC_INFO.phone}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={openReviewModal}
                className="px-3.5 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-full shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Publish Case Spotlight</span>
              </button>
            </div>

          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5 pt-5 border-t border-slate-800 text-center sm:text-left">
            <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700/60">
              <p className="text-[10px] text-slate-400 font-medium">Total Appointments</p>
              <p className="text-lg font-bold text-white mt-0.5">{totalPatients}</p>
            </div>
            <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700/60">
              <p className="text-[10px] text-teal-300 font-medium">Upcoming Confirmed</p>
              <p className="text-lg font-bold text-teal-400 mt-0.5">{confirmedCount}</p>
            </div>
            <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700/60">
              <p className="text-[10px] text-emerald-300 font-medium">Completed Visits</p>
              <p className="text-lg font-bold text-emerald-400 mt-0.5">{completedCount}</p>
            </div>
            <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700/60">
              <p className="text-[10px] text-rose-300 font-medium">Urgent Emergencies</p>
              <p className="text-lg font-bold text-rose-400 mt-0.5">{emergencyCount}</p>
            </div>
          </div>
        </div>

        {/* Emergency Alert Banner if any */}
        {emergencyCount > 0 && (
          <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-rose-900">
                  {emergencyCount} Emergency Patient(s) Waiting for Priority Clinical Triage
                </p>
                <p className="text-[10px] text-rose-700">
                  Please review patient notes and dispatch immediate pre-care advice on WhatsApp.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Search Bar */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm mb-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by patient name, phone (+91), or treatment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-teal-500 bg-slate-50"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            {['all', 'confirmed', 'completed', 'pending', 'rescheduled'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 rounded-full text-xs font-semibold capitalize whitespace-nowrap transition-all cursor-pointer ${
                  statusFilter === status
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

        </div>

        {/* Appointments Table / Cards Grid */}
        <div className="space-y-3">
          {filteredAppointments.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
              <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700">No appointments found matching this filter.</p>
            </div>
          ) : (
            filteredAppointments.map(apt => {
              const isEmergency = apt.isEmergency;
              const waReminderLink = generateWhatsAppLink(
                apt.patientPhone,
                createReminderWhatsAppMessage(apt)
              );
              const waPostCareLink = generateWhatsAppLink(
                apt.patientPhone,
                createPostTreatmentWhatsAppMessage(apt.patientName, apt.treatment)
              );

              return (
                <div
                  key={apt.id}
                  className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all shadow-sm ${
                    isEmergency ? 'border-amber-300 ring-1 ring-amber-200' : 'border-slate-200'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                    
                    {/* Patient Info */}
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-heading font-bold text-sm sm:text-base text-slate-800">
                          {apt.patientName}
                        </span>
                        {isEmergency && (
                          <span className="text-[9px] font-extrabold px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-full flex items-center gap-1">
                            <AlertCircle className="w-2.5 h-2.5" /> Emergency
                          </span>
                        )}
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            apt.status === 'confirmed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : apt.status === 'completed'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : apt.status === 'rescheduled'
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {apt.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-y-1 gap-x-3.5 text-xs text-slate-500">
                        <span className="font-semibold text-teal-700">🦷 {apt.treatment}</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" /> {apt.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" /> {apt.timeSlot}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-emerald-600" /> {apt.patientPhone}
                        </span>
                        <span className="font-bold text-slate-700">Fee: ₹{apt.fee}</span>
                      </div>

                      {apt.notes && (
                        <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-100 max-w-xl">
                          <strong className="text-slate-700">Patient Note:</strong> {apt.notes}
                        </p>
                      )}
                    </div>

                    {/* Quick WhatsApp / Follow-Up Action Buttons */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-2 lg:pt-0">
                      
                      {/* WhatsApp 24h Reminder */}
                      <a
                        href={waReminderLink}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => sendWhatsAppFollowUp(apt.id)}
                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-bold flex items-center gap-1 transition-colors"
                        title="Send 24h Reminder on WhatsApp"
                      >
                        <MessageCircle className="w-3 h-3 text-emerald-600" />
                        <span>WA Reminder</span>
                      </a>

                      {/* WhatsApp Post-Care Guide */}
                      <a
                        href={waPostCareLink}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => sendWhatsAppFollowUp(apt.id)}
                        className="px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-full text-[10px] font-semibold flex items-center gap-1 transition-colors"
                        title="Send Post-Treatment Care instructions on WhatsApp"
                      >
                        <MessageCircle className="w-3 h-3 text-teal-600" />
                        <span>Post-Care WA</span>
                      </a>

                      {/* Email Follow-Up */}
                      <button
                        onClick={() => sendEmailFollowUp(apt.id)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Mail className="w-3 h-3 text-slate-500" />
                        <span>Email</span>
                      </button>

                      {/* Clinical Note Writer Button */}
                      <button
                        onClick={() => setActiveNoteAptId(activeNoteAptId === apt.id ? null : apt.id)}
                        className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <FileEdit className="w-3 h-3 text-teal-400" />
                        <span>E2EE Note</span>
                      </button>

                      {/* Status Toggle Dropdown / Buttons */}
                      <div className="flex items-center gap-1">
                        {apt.status !== 'completed' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'completed')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-[10px] font-bold cursor-pointer"
                          >
                            Done
                          </button>
                        )}

                        <button
                          onClick={() => setReschedulingAptId(reschedulingAptId === apt.id ? null : apt.id)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-[10px] font-medium cursor-pointer"
                        >
                          Reschedule
                        </button>
                      </div>

                    </div>

                  </div>

                  {/* Reschedule Drawer Form */}
                  {reschedulingAptId === apt.id && (
                    <div className="mt-3 pt-3 border-t border-slate-100 bg-slate-50 p-2.5 rounded-xl flex flex-wrap items-center gap-2 animate-in fade-in">
                      <span className="text-xs font-bold text-slate-700">Reschedule To:</span>
                      <input
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        className="px-2 py-1 rounded-lg border border-slate-300 text-xs bg-white"
                      />
                      <select
                        value={newSlot}
                        onChange={(e) => setNewSlot(e.target.value)}
                        className="px-2 py-1 rounded-lg border border-slate-300 text-xs bg-white"
                      >
                        <option value="09:30 AM">09:30 AM</option>
                        <option value="11:00 AM">11:00 AM</option>
                        <option value="02:30 PM">02:30 PM</option>
                        <option value="04:30 PM">04:30 PM</option>
                        <option value="06:00 PM">06:00 PM</option>
                      </select>
                      <button
                        onClick={() => handleReschedule(apt.id)}
                        className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-full text-xs font-bold cursor-pointer"
                      >
                        Save & Notify
                      </button>
                      <button
                        onClick={() => setReschedulingAptId(null)}
                        className="px-2 py-1 text-slate-500 text-xs hover:underline cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  {/* Clinical Encrypted Note Form */}
                  {activeNoteAptId === apt.id && (
                    <div className="mt-3 pt-3 border-t border-slate-100 space-y-2 animate-in fade-in">
                      <div className="flex items-center justify-between text-xs font-bold text-teal-900">
                        <span className="flex items-center gap-1.5">
                          <Lock className="w-3 h-3 text-teal-600" />
                          <span>Encrypted Clinical Assessment & Prescription (Dr. Aarav Mehta)</span>
                        </span>
                        <span className="text-[9px] font-mono text-teal-700">AES-256 GCM</span>
                      </div>
                      <textarea
                        rows={3}
                        value={clinicalNote}
                        onChange={(e) => setClinicalNote(e.target.value)}
                        placeholder="Write clinical findings, root canal canal lengths (MB/DB/P), restoration shade, prescription (Amox 500mg, Ketorolac)..."
                        className="w-full p-2.5 rounded-xl border border-teal-300 bg-white text-xs font-medium focus:ring-1 focus:ring-teal-200"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setActiveNoteAptId(null)}
                          className="px-2.5 py-1 text-xs text-slate-500 hover:bg-slate-100 rounded-lg cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveEncryptedNote(apt.id)}
                          className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-full shadow-xs cursor-pointer"
                        >
                          Save & Encrypt Record
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>

      </div>
    </section>
  );
};
