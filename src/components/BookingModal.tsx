import React, { useState } from 'react';
import { CLINIC_INFO, CLINIC_SERVICES, TIME_SLOTS } from '../data/clinicData';
import { TreatmentType, Appointment } from '../types';
import { useClinic } from '../context/ClinicContext';
import { useAuth } from '../context/AuthContext';
import {
  createBookingWhatsAppMessage,
  generateWhatsAppLink,
  generateMailtoLink,
  downloadCalendarEvent
} from '../utils/notifications';
import {
  X,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  FileText,
  ShieldCheck,
  AlertCircle,
  MessageCircle,
  Download,
  Send,
  CheckCircle2,
  Lock,
  Sparkles
} from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedTreatment?: TreatmentType;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  preselectedTreatment,
}) => {
  const { bookAppointment, appointments, openChat } = useClinic();
  const { user } = useAuth();

  // Helper to format today's date YYYY-MM-DD
  const getTomorrowDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    // If tomorrow is Sunday, skip to Monday
    if (d.getDay() === 0) d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const [date, setDate] = useState<string>(getTomorrowDate());
  const [timeSlot, setTimeSlot] = useState<string>('10:30 AM');
  const [treatment, setTreatment] = useState<TreatmentType>(
    preselectedTreatment || 'General Consultation'
  );
  const [patientName, setPatientName] = useState<string>(user?.name || '');
  const [patientPhone, setPatientPhone] = useState<string>(user?.phone || '');
  const [patientEmail, setPatientEmail] = useState<string>(user?.email || '');
  const [notes, setNotes] = useState<string>('');
  const [isEmergency, setIsEmergency] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmedApt, setConfirmedApt] = useState<Appointment | null>(null);

  if (!isOpen) return null;

  // Check if selected date is a Sunday
  const isSunday = new Date(date).getDay() === 0;

  // Find existing booked slots for this date
  const bookedSlotsOnDate = appointments
    .filter(a => a.date === date && a.status !== 'cancelled')
    .map(a => a.timeSlot);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSunday) return;
    if (!patientName.trim() || !patientPhone.trim()) return;

    setIsSubmitting(true);
    try {
      const apt = await bookAppointment({
        patientName,
        patientPhone: patientPhone.startsWith('+91') ? patientPhone : `+91 ${patientPhone}`,
        patientEmail: patientEmail || `${patientName.toLowerCase().replace(/\s+/g, '')}@example.com`,
        treatment,
        date,
        timeSlot,
        notes,
        isEmergency,
        fee: CLINIC_INFO.consultationFee,
        whatsappReminderSent: true,
        emailReminderSent: true,
        followUpStage: 'booking-confirmation',
      });
      setConfirmedApt(apt);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setConfirmedApt(null);
    onClose();
  };

  // WhatsApp click link for this appointment
  const waMessage = confirmedApt
    ? createBookingWhatsAppMessage({
        patientName: confirmedApt.patientName,
        treatment: confirmedApt.treatment,
        date: confirmedApt.date,
        timeSlot: confirmedApt.timeSlot,
        isEmergency: confirmedApt.isEmergency,
      })
    : '';

  const waLink = generateWhatsAppLink(CLINIC_INFO.rawPhone, waMessage);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-slate-900 p-5 sm:p-6 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600/30 border border-teal-500/30 flex items-center justify-center text-xl">
              🦷
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-lg sm:text-xl tracking-tight">
                {confirmedApt ? 'Appointment Confirmed! 🎉' : 'Book Dental Appointment'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {CLINIC_INFO.doctor} • {CLINIC_INFO.address}
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 max-h-[80vh] overflow-y-auto">
          {confirmedApt ? (
            /* --- Post-Booking Confirmation & Follow-up Actions Screen --- */
            <div className="space-y-5">
              
              <div className="p-4 bg-teal-50 rounded-2xl border border-teal-200 text-center space-y-1.5">
                <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-heading font-bold text-base text-teal-950">
                  Your Slot is Reserved at SmileCraft Dental Studio
                </h4>
                <p className="text-xs text-teal-800 max-w-md mx-auto">
                  We look forward to welcoming you on <strong className="font-bold">{confirmedApt.date}</strong> at <strong className="font-bold">{confirmedApt.timeSlot}</strong> for <strong className="font-bold">{confirmedApt.treatment}</strong>.
                </p>
              </div>

              {/* Booking Summary Ticket */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Patient Name</span>
                  <span className="font-bold text-slate-800">{confirmedApt.patientName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Service / Treatment</span>
                  <span className="font-bold text-teal-700">{confirmedApt.treatment}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Consultation Fee</span>
                  <span className="font-bold text-slate-800">₹{confirmedApt.fee} (Pay at Clinic)</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Clinic Helpline</span>
                  <span className="font-bold text-slate-800">{CLINIC_INFO.phone}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-teal-700 bg-teal-50 p-2 rounded-lg font-mono">
                  <Lock className="w-3 h-3" />
                  <span>Medical Record Hash: {confirmedApt.id.toUpperCase()}</span>
                </div>
              </div>

              {/* Instant WhatsApp & Notification Actions */}
              <div className="space-y-2.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Instant Follow-up & Calendar Sync
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* WhatsApp Action */}
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
                  >
                    <MessageCircle className="w-4 h-4 fill-white/20" />
                    <span>Send to WhatsApp (+91)</span>
                  </a>

                  {/* Calendar Sync */}
                  <button
                    onClick={() => downloadCalendarEvent({
                      patientName: confirmedApt.patientName,
                      treatment: confirmedApt.treatment,
                      date: confirmedApt.date,
                      timeSlot: confirmedApt.timeSlot
                    })}
                    className="flex items-center justify-center gap-2 p-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Add to Google / Apple Cal</span>
                  </button>
                </div>

                {/* Email follow up mailto */}
                <a
                  href={generateMailtoLink(
                    CLINIC_INFO.email,
                    `Appointment Confirmation: ${confirmedApt.patientName} (${confirmedApt.date})`,
                    `Hello SmileCraft Clinic,\n\nI have booked my appointment for ${confirmedApt.treatment} on ${confirmedApt.date} at ${confirmedApt.timeSlot}.\n\nPatient: ${confirmedApt.patientName}\nPhone: ${confirmedApt.patientPhone}\nNotes: ${confirmedApt.notes || 'None'}`
                  )}
                  className="w-full flex items-center justify-center gap-2 p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-teal-600" />
                  <span>Email Confirmation to Clinic ({CLINIC_INFO.email})</span>
                </a>
              </div>

              {/* Done button */}
              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => {
                    handleResetAndClose();
                    openChat();
                  }}
                  className="flex-1 py-2.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-full text-xs font-bold transition-colors cursor-pointer"
                >
                  💬 Open Doctor Chat
                </button>
                <button
                  onClick={handleResetAndClose}
                  className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xs font-bold transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>

            </div>
          ) : (
            /* --- Booking Form --- */
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Emergency Banner Toggle */}
              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-2xl border border-amber-200">
                <div className="flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-amber-900">Severe Toothache or Dental Trauma?</p>
                    <p className="text-[10px] text-amber-700">Flag as urgent priority triage for Dr. Aarav Mehta</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isEmergency}
                    onChange={(e) => setIsEmergency(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4.5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>

              {/* Treatment Selection */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Select Treatment / Service
                </label>
                <select
                  value={treatment}
                  onChange={(e) => setTreatment(e.target.value as TreatmentType)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-xs sm:text-sm font-medium text-slate-800 bg-white transition-all"
                >
                  {CLINIC_SERVICES.map(s => (
                    <option key={s.id} value={s.title}>
                      {s.title} ({s.price}) — {s.duration}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date & Time Slot Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Date Picker */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Appointment Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-xs sm:text-sm font-medium text-slate-800 bg-white"
                      required
                    />
                  </div>
                  {isSunday ? (
                    <p className="text-[10px] text-rose-600 font-semibold mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Sunday is Closed for Deep Sanitization.
                    </p>
                  ) : (
                    <p className="text-[10px] text-slate-400 mt-1">
                      Clinic Hours: 9:00 AM – 7:00 PM
                    </p>
                  )}
                </div>

                {/* Selected Time Slot Display */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Selected Slot: <span className="text-teal-600 font-bold">{timeSlot}</span>
                  </label>
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-teal-600" />
                      <span className="font-bold text-slate-800">{timeSlot}</span>
                    </div>
                    <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                      Available
                    </span>
                  </div>
                </div>

              </div>

              {/* Time Slots Chips Selection */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Choose Preferred Slot (Mon–Sat)
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 max-h-32 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-200">
                  {TIME_SLOTS.map(slot => {
                    const isBooked = bookedSlotsOnDate.includes(slot);
                    const isSelected = timeSlot === slot;
                    return (
                      <button
                        type="button"
                        key={slot}
                        disabled={isBooked || isSunday}
                        onClick={() => setTimeSlot(slot)}
                        className={`py-1.5 px-1.5 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-teal-600 text-white shadow-xs'
                            : isBooked
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed line-through'
                            : 'bg-white text-slate-700 hover:bg-teal-50 border border-slate-200'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Patient Contact Details */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-700">
                  Patient Contact Information
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Full Name *</label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="e.g. Rahul Sharma"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-xs font-medium"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">
                      WhatsApp Mobile Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={patientPhone}
                        onChange={(e) => setPatientPhone(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-xs font-medium"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Email Address (For Reminders)</label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      placeholder="e.g. rahul@example.com"
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-xs font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">
                    Dental Symptoms or Special Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Sensitivity to cold water on upper right molar..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-xs font-medium"
                  />
                </div>
              </div>

              {/* Consultation Fee & Security Shield Note */}
              <div className="p-2.5 bg-teal-50/70 rounded-xl border border-teal-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
                  <span className="text-teal-900 font-medium text-[11px]">
                    Consultation Fee: <strong className="font-bold">₹{CLINIC_INFO.consultationFee}</strong> (Payable at clinic)
                  </span>
                </div>
                <span className="text-[9px] text-teal-700 bg-white px-2 py-0.5 rounded-full font-semibold border border-teal-200">
                  E2EE Protected
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex gap-2.5">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="flex-1 py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || isSunday}
                  className="flex-2 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-full font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {isSubmitting ? 'Reserving...' : `Confirm Booking (${timeSlot})`}
                  </span>
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
