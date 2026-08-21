import React, { useState } from 'react';
import { CLINIC_INFO, CLINIC_SERVICES, TIME_SLOTS } from '../data/clinicData';
import { TreatmentType } from '../types';
import { useClinic } from '../context/ClinicContext';
import {
  Calendar,
  MessageCircle,
  Star,
  ShieldCheck,
  Award,
  Users,
  MapPin,
  Clock,
  Lock,
  ArrowRight,
  Sparkles,
  PhoneCall,
  CheckCircle,
  Check,
  Send,
  HeartHandshake
} from 'lucide-react';

interface HeroProps {
  onExploreServices: () => void;
  onViewReviews: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreServices, onViewReviews }) => {
  const { openBooking, openChat } = useClinic();
  const [quickTreatment, setQuickTreatment] = useState<TreatmentType>('General Consultation');
  const [quickDate, setQuickDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    if (d.getDay() === 0) d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [quickTime, setQuickTime] = useState<string>('10:30 AM');

  return (
    <section className="bg-[#f8fafc] py-8 sm:py-10 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 3-Column Sleek Interface Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Doctor Profile & E2EE Security Card */}
          <div className="lg:col-span-4 space-y-5">
            {/* Doctor Profile Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3.5">
                <div className="relative shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80"
                    alt={CLINIC_INFO.doctor}
                    className="w-14 h-14 rounded-full object-cover border-2 border-teal-100 shadow-xs"
                  />
                  <div
                    className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white"
                    title="Clinic Active"
                  ></div>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base leading-tight">
                    {CLINIC_INFO.doctor}
                  </h3>
                  <p className="text-xs text-teal-600 font-semibold mt-0.5">
                    {CLINIC_INFO.specialization}
                  </p>
                  <p className="text-[11px] text-slate-400 font-medium">
                    BDS, MDS • {CLINIC_INFO.experience} Exp
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span className="leading-snug">{CLINIC_INFO.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{CLINIC_INFO.hours}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Painless Micro-Dentistry & AI Smile Design</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">Consultation Fee</span>
                <span className="text-sm font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                  ₹{CLINIC_INFO.consultationFee} Only
                </span>
              </div>
            </div>

            {/* End-to-End Encrypted Banner */}
            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-5 rounded-2xl text-white shadow-lg space-y-3 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none" />
              
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-white" />
                </div>
                <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  256-bit Security
                </span>
              </div>

              <div>
                <h4 className="font-bold text-sm text-white">End-to-End Encrypted</h4>
                <p className="text-xs text-indigo-100 mt-1 leading-relaxed">
                  Military-grade AES-256 GCM encryption ensures your dental charts and medical chat remain strictly confidential.
                </p>
              </div>

              <button
                onClick={openChat}
                className="w-full py-2 bg-white text-indigo-700 rounded-xl text-xs font-bold hover:bg-indigo-50 transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Launch Encrypted Chat</span>
              </button>
            </div>
          </div>

          {/* Center Column: Sleek Appointment Booking Card */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-teal-600" />
                  <span>Book Appointment</span>
                </h2>
                <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-500 rounded-full italic">
                  {CLINIC_INFO.tagline}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                    Select Treatment
                  </label>
                  <select
                    value={quickTreatment}
                    onChange={(e) => setQuickTreatment(e.target.value as TreatmentType)}
                    aria-label="Select Treatment"
                    className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 focus:bg-white focus:border-teal-500 focus:outline-hidden transition-colors cursor-pointer"
                  >
                    {CLINIC_SERVICES.map(s => (
                      <option key={s.id} value={s.title}>
                        {s.title} ({s.price})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      value={quickDate}
                      onChange={(e) => setQuickDate(e.target.value)}
                      aria-label="Preferred Date"
                      className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 focus:bg-white focus:border-teal-500 focus:outline-hidden transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                      Available Slot
                    </label>
                    <select
                      value={quickTime}
                      onChange={(e) => setQuickTime(e.target.value)}
                      aria-label="Available Slot"
                      className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 focus:bg-white focus:border-teal-500 focus:outline-hidden transition-colors cursor-pointer"
                    >
                      {TIME_SLOTS.slice(0, 8).map(slot => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Dashed Notifications Note */}
                <div className="bg-slate-50 rounded-xl p-4 border border-dashed border-slate-200 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                    <Send className="w-4 h-4" />
                  </div>
                  <p className="text-xs text-slate-500 leading-snug">
                    Instant notifications will be sent via <strong className="text-slate-700">WhatsApp & Email</strong> with calendar integration.
                  </p>
                </div>

                {/* Primary Booking Button */}
                <button
                  onClick={() => openBooking(quickTreatment)}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-sm hover:shadow-md transition-all text-sm flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Confirm Appointment (₹{CLINIC_INFO.consultationFee} Fee)</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>

                {/* Secondary WhatsApp & Reviews Actions */}
                <div className="flex items-center gap-3 pt-1">
                  <a
                    href={`https://wa.me/${CLINIC_INFO.rawPhone}?text=${encodeURIComponent(
                      'Hello Dr. Aarav Mehta! I would like to book a dental consultation at SmileCraft Dental Studio in Model Town, Ludhiana.'
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>WhatsApp Booking</span>
                  </a>

                  <button
                    onClick={onViewReviews}
                    className="flex-1 py-2.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{CLINIC_INFO.rating} Rating (840+)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Stats, Popular Treatments & 24/7 Emergency */}
          <div className="lg:col-span-3 space-y-5">
            {/* Clinic Stats Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Clinic Stats
                </span>
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Verified
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-2xl font-black text-slate-800">{CLINIC_INFO.rating}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mt-0.5">
                    Rating
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-2xl font-black text-teal-600">{CLINIC_INFO.patientsTreated}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mt-0.5">
                    Patients
                  </p>
                </div>
              </div>
            </div>

            {/* Popular Treatments Chips */}
            <div className="bg-teal-50 p-5 rounded-2xl border border-teal-100 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                  Popular Treatments
                </h4>
                <button
                  onClick={onExploreServices}
                  className="text-xs font-semibold text-teal-700 hover:underline cursor-pointer"
                >
                  View All
                </button>
              </div>

              <div className="space-y-2">
                {[
                  { name: 'Root Canal Treatment', price: '₹3,500' },
                  { name: 'Ceramic Veneers', price: '₹8,000' },
                  { name: 'Teeth Whitening', price: '₹5,000' },
                  { name: 'Clear Aligners', price: '₹45,000' },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => openBooking(item.name as TreatmentType)}
                    className="w-full flex items-center justify-between p-2.5 bg-white rounded-xl text-xs font-medium text-slate-700 shadow-2xs hover:border-teal-300 border border-transparent transition-all cursor-pointer group"
                  >
                    <span>{item.name}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-teal-600 font-bold">{item.price}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-teal-500 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 24/7 Emergency Line Dark Card */}
            <div className="bg-slate-800 p-5 rounded-2xl text-white relative overflow-hidden shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest flex items-center gap-1">
                  <PhoneCall className="w-3 h-3 animate-pulse" /> 24/7 Emergency Line
                </span>
                <span className="text-[9px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-1.5 py-0.5 rounded-md font-semibold">
                  Immediate
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Severe toothache or dental trauma in Ludhiana? Call direct:
              </p>
              <a
                href={`tel:${CLINIC_INFO.emergencyPhone}`}
                className="block text-teal-400 font-mono font-bold text-base hover:underline"
              >
                {CLINIC_INFO.emergencyPhone}
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
