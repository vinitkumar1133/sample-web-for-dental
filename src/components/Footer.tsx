import React, { useState } from 'react';
import { CLINIC_INFO, CLINIC_FAQS } from '../data/clinicData';
import { useClinic } from '../context/ClinicContext';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Star,
  MessageCircle,
  Calendar,
  ChevronDown,
  ChevronUp,
  Heart,
  Globe,
  ExternalLink
} from 'lucide-react';

export const Footer: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const { openBooking } = useClinic();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Clinic FAQ Section */}
        <div className="mb-14 pb-12 border-b border-slate-800">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
              Got Questions?
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mt-1">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-2.5">
            {CLINIC_FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-slate-800/80 rounded-2xl border border-slate-700/60 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 sm:p-4.5 text-left flex items-center justify-between gap-4 text-white font-semibold text-xs sm:text-sm focus:outline-hidden cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-teal-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-4.5 pb-4 text-xs sm:text-sm text-slate-300 border-t border-slate-700/50 pt-3 leading-relaxed animate-in fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Footer 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-12 border-b border-slate-800">
          
          {/* Col 1: Clinic Brand & Doctor Bio */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-500 text-white font-black flex items-center justify-center text-lg shadow-sm">
                🦷
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-lg text-white tracking-tight">
                  {CLINIC_INFO.name}
                </h3>
                <p className="text-xs text-teal-400 italic">“{CLINIC_INFO.tagline}”</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Founded in {CLINIC_INFO.established} by <strong className="text-slate-200">{CLINIC_INFO.doctor}</strong>. Bringing pain-free rotary endodontics, cold-laser whitening, and computer-guided implant dentistry to Model Town, Ludhiana.
            </p>

            <div className="flex items-center gap-2 text-xs text-amber-400 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700 w-fit">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-bold text-white text-xs">{CLINIC_INFO.rating} / 5</span>
              <span className="text-slate-400 text-[10px]">({CLINIC_INFO.patientsTreated} Patients)</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-white">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-teal-400 transition-colors cursor-pointer">
                  Overview
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-teal-400 transition-colors cursor-pointer">
                  Treatments & Pricing
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('reviews')} className="hover:text-teal-400 transition-colors cursor-pointer">
                  Happy Patients (Reviews)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('followups')} className="hover:text-teal-400 transition-colors cursor-pointer">
                  WhatsApp & Email Alerts
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('e2ee-chat')} className="hover:text-teal-400 transition-colors cursor-pointer">
                  E2EE Doctor Chat
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Clinic Hours & Consultation Fee */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-white">
              Clinic Timings & Fees
            </h4>
            
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2 text-slate-300">
                <Clock className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Monday – Saturday</p>
                  <p className="text-slate-400 text-xs">9:00 AM – 7:00 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-2 text-slate-400">
                <span className="w-4 text-center font-bold text-rose-400">✕</span>
                <div>
                  <p className="font-semibold text-slate-300">Sunday</p>
                  <p className="text-slate-400 text-xs">Closed (Sanitization Day)</p>
                </div>
              </div>

              <div className="mt-3 p-3 bg-teal-950/60 rounded-xl border border-teal-800/60">
                <p className="text-teal-300 font-bold text-xs">
                  Consultation Fee: ₹{CLINIC_INFO.consultationFee}
                </p>
                <p className="text-[11px] text-teal-200/80 mt-0.5">
                  Includes digital camera screening & bite analysis
                </p>
              </div>
            </div>
          </div>

          {/* Col 4: Address, Emergency & Contact */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-white">
              Contact & Location
            </h4>

            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>{CLINIC_INFO.address}</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <a href={`tel:${CLINIC_INFO.phone}`} className="hover:text-teal-300 text-slate-200">
                  {CLINIC_INFO.phone}
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <a href={`mailto:${CLINIC_INFO.email}`} className="hover:text-teal-300 text-slate-200">
                  {CLINIC_INFO.email}
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-teal-400 shrink-0" />
                <span className="text-slate-200">{CLINIC_INFO.website}</span>
              </div>

              <div className="pt-2 flex gap-2">
                <a
                  href={`https://wa.me/${CLINIC_INFO.rawPhone}?text=${encodeURIComponent(
                    'Hello Dr. Aarav Mehta! I would like directions to SmileCraft Dental Studio in Model Town, Ludhiana.'
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>

                <button
                  onClick={() => openBooking()}
                  className="flex-1 py-2 px-3 bg-teal-600 hover:bg-teal-700 text-white rounded-full font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Legal & Security Disclaimer */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} SmileCraft Dental Studio. All rights reserved.</p>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-teal-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Web Crypto 256-bit E2EE</span>
            </span>
            <span>•</span>
            <span>Dr. Aarav Mehta, BDS, MDS</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
