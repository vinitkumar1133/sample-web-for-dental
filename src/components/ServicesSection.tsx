import React, { useState } from 'react';
import { CLINIC_SERVICES, CLINIC_INFO } from '../data/clinicData';
import { TreatmentType, DentalService } from '../types';
import { useClinic } from '../context/ClinicContext';
import {
  Sparkles,
  Stethoscope,
  ShieldCheck,
  Clock,
  Check,
  Calendar,
  Calculator,
  ArrowRight,
  ShieldAlert,
  Smile,
  Activity,
  HeartHandshake,
  CheckCircle2,
  Zap,
  Users
} from 'lucide-react';

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Stethoscope,
  Sparkles,
  ShieldAlert,
  Smile,
  ShieldCheck,
  HeartHandshake,
  Activity,
  CheckCircle2,
  Zap,
  Users
};

export const ServicesSection: React.FC = () => {
  const { openBooking } = useClinic();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [calcItems, setCalcItems] = useState<string[]>(['consultation']);

  const categories = ['All', 'General Dentistry', 'Cosmetic Dentistry', 'Specialized Procedures'];

  const filteredServices = selectedCategory === 'All'
    ? CLINIC_SERVICES
    : CLINIC_SERVICES.filter(s => s.category === selectedCategory);

  const toggleCalcItem = (id: string) => {
    if (id === 'consultation') return; // consultation always included
    setCalcItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const getServicePriceNumber = (priceStr: string): number => {
    const num = parseInt(priceStr.replace(/[^0-9]/g, ''), 10);
    return isNaN(num) ? 500 : num;
  };

  const calculatedTotal = calcItems.reduce((sum, id) => {
    const s = CLINIC_SERVICES.find(srv => srv.id === id);
    return sum + (s ? getServicePriceNumber(s.price) : 0);
  }, 0);

  return (
    <section className="py-14 sm:py-16 bg-[#f8fafc] border-b border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200 mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Comprehensive Dental Treatments</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            Specialized Care by <span className="text-teal-600">{CLINIC_INFO.doctorShort}</span>
          </h2>
          <p className="mt-2 text-slate-600 text-sm leading-relaxed">
            From painless rotary root canals to instant laser whitening and clear aligners, experience transparent dental care in Model Town, Ludhiana.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                selectedCategory === category
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map(service => {
            const IconComponent = iconMap[service.iconName] || Stethoscope;
            return (
              <div
                key={service.id}
                className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-teal-300 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Icon + Category + Popular Badge */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {service.popular && (
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                          ★ Most Popular
                        </span>
                      )}
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {service.category}
                      </span>
                    </div>
                  </div>

                  {/* Title & Price */}
                  <div className="mb-2">
                    <h3 className="font-heading text-lg font-bold text-slate-800 group-hover:text-teal-700 transition-colors">
                      {service.title}
                    </h3>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-xl font-extrabold text-teal-600">
                        {service.price}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {service.duration}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {service.description}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-1.5 pt-3 border-t border-slate-100 mb-5">
                    {service.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                        <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Action */}
                <button
                  onClick={() => openBooking(service.title)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-teal-600 text-white text-xs font-semibold transition-colors shadow-xs cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book {service.title.split(' ')[0]}</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Interactive Treatment Estimator Tool */}
        <div className="mt-12 bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-6 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                <Calculator className="w-3.5 h-3.5" />
                <span>Transparent Smile Pricing Estimator</span>
              </div>
              <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Know Your Estimated Investment Upfront
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Select your required procedures below. We uphold 100% transparent pricing with zero surprise add-ons. Every treatment begins with a ₹500 comprehensive consultation.
              </p>

              {/* Checkboxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                {CLINIC_SERVICES.slice(0, 6).map(s => {
                  const isChecked = calcItems.includes(s.id);
                  const isConsultation = s.id === 'consultation';
                  return (
                    <label
                      key={s.id}
                      onClick={() => toggleCalcItem(s.id)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-teal-900/40 border-teal-400 text-teal-200 font-semibold'
                          : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      <span className="truncate mr-2">
                        {isConsultation ? '✓ ' : ''}{s.title}
                      </span>
                      <span className="text-teal-400 font-bold shrink-0">{s.price}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Estimator Summary Card */}
            <div className="lg:col-span-6 bg-white text-slate-900 rounded-2xl p-6 shadow-md border border-slate-100">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Selected Treatments ({calcItems.length})
                  </p>
                  <p className="text-xs font-semibold text-slate-800 mt-0.5">
                    Dr. Aarav Mehta • SmileCraft Studio
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-400">Estimated Total</span>
                  <p className="text-2xl font-black text-teal-600">
                    ₹{calculatedTotal.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              <div className="py-3 space-y-1.5 text-xs text-slate-600">
                <p className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Includes digital camera assessment & teeth charting</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>WhatsApp post-treatment care routines and follow-up support</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>End-to-End encrypted digital prescription storage</span>
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex gap-3">
                <button
                  onClick={() => openBooking()}
                  className="flex-1 py-3 px-4 rounded-full bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm text-center shadow-xs transition-all cursor-pointer"
                >
                  Book Consultation (₹500)
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
