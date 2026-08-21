import React, { useState } from 'react';
import { CLINIC_INFO, FOLLOWUP_TEMPLATES } from '../data/clinicData';
import { useClinic } from '../context/ClinicContext';
import { useAuth } from '../context/AuthContext';
import {
  generateWhatsAppLink,
  generateMailtoLink,
  createBookingWhatsAppMessage,
  createReminderWhatsAppMessage,
  createPostTreatmentWhatsAppMessage
} from '../utils/notifications';
import {
  Send,
  MessageCircle,
  Mail,
  CheckCircle,
  Copy,
  Clock,
  ExternalLink,
  Smartphone,
  Sparkles,
  Calendar,
  ShieldCheck,
  RefreshCw,
  FileText
} from 'lucide-react';

export const FollowUpHub: React.FC = () => {
  const { appointments, sendWhatsAppFollowUp, sendEmailFollowUp, showToast } = useClinic();
  const { isDoctor } = useAuth();

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('tmpl-booking');
  const [patientName, setPatientName] = useState<string>('Priya Sharma');
  const [patientPhone, setPatientPhone] = useState<string>('+91 98123 45678');
  const [patientEmail, setPatientEmail] = useState<string>('priya.sharma@example.com');
  const [treatment, setTreatment] = useState<string>('Root Canal Treatment (RCT)');
  const [date, setDate] = useState<string>('2026-08-22');
  const [timeSlot, setTimeSlot] = useState<string>('10:30 AM');
  const [copied, setCopied] = useState<boolean>(false);

  const currentTemplate = FOLLOWUP_TEMPLATES.find(t => t.id === selectedTemplateId) || FOLLOWUP_TEMPLATES[0];

  // Render dynamic message text replacing tokens
  const getRenderedBody = () => {
    return currentTemplate.body
      .replace(/{PATIENT_NAME}/g, patientName)
      .replace(/{DATE}/g, date)
      .replace(/{TIME}/g, timeSlot)
      .replace(/{TREATMENT}/g, treatment);
  };

  const renderedBody = getRenderedBody();
  const waUrl = generateWhatsAppLink(patientPhone, renderedBody);
  const mailSubject = currentTemplate.subject
    ? currentTemplate.subject.replace(/{PATIENT_NAME}/g, patientName).replace(/{TREATMENT}/g, treatment)
    : `SmileCraft Dental Studio — ${currentTemplate.title}`;
  const mailtoUrl = generateMailtoLink(patientEmail, mailSubject, renderedBody);

  const handleCopy = () => {
    navigator.clipboard.writeText(renderedBody);
    setCopied(true);
    showToast('Copied to Clipboard', 'Message template copied successfully!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-14 sm:py-16 bg-[#f8fafc] border-b border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200 mb-2.5">
            <Send className="w-3.5 h-3.5 text-teal-600" />
            <span>Automated WhatsApp & Email Patient Care</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            Follow-Up & Reminder <span className="text-teal-600">Dispatch Center</span>
          </h2>
          <p className="mt-2 text-slate-600 text-sm leading-relaxed">
            Stay connected before, during, and after your dental treatment with automated WhatsApp confirmations, reminders, recovery guides, and check-in alerts.
          </p>
        </div>

        {/* Interactive Follow-up Tester and Template Engine */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Template Selector & Dynamic Configuration */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Step 1: Select Follow-up Stage */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
              <h3 className="font-heading text-sm font-bold text-slate-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-600" />
                <span>Select Follow-Up Stage</span>
              </h3>

              <div className="space-y-1.5">
                {FOLLOWUP_TEMPLATES.map(t => {
                  const isSelected = t.id === selectedTemplateId;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTemplateId(t.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-teal-50/70 border-teal-300 text-teal-950 font-bold shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">
                          {t.type === 'whatsapp' ? '💬' : '✉️'}
                        </span>
                        <div>
                          <p className="text-xs font-semibold">{t.title}</p>
                          <span className="text-[10px] text-slate-400 capitalize">
                            Trigger: {t.triggerStage.replace('-', ' ')}
                          </span>
                        </div>
                      </div>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        t.type === 'whatsapp' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {t.type}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Patient Parameters Customizer */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
              <h4 className="font-heading text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Customize Recipient Parameters
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-medium text-slate-500 mb-1">Patient Name</label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-medium bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-slate-500 mb-1">WhatsApp Phone</label>
                  <input
                    type="text"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-medium bg-slate-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-medium text-slate-500 mb-1">Treatment Name</label>
                  <input
                    type="text"
                    value={treatment}
                    onChange={(e) => setTreatment(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-medium bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-slate-500 mb-1">Appointment Time</label>
                  <input
                    type="text"
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-medium bg-slate-50"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Live Mock Preview (WhatsApp Phone Simulator / Email Previewer) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Live WhatsApp / Email Device Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
              
              {/* Device Header Bar */}
              <div className="bg-slate-900 px-5 py-3 text-white flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">
                      SmileCraft Official Follow-Up Dispatcher
                    </p>
                    <p className="text-[10px] text-emerald-400">
                      Dr. Aarav Mehta ({CLINIC_INFO.phone})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Chat Canvas / Message Bubble */}
              <div className="p-5 bg-slate-100 min-h-[300px] flex flex-col justify-end">
                
                {/* Simulated Bubble */}
                <div className="max-w-md ml-auto bg-white text-slate-800 p-4 rounded-2xl rounded-tr-xs shadow-sm border border-slate-200 text-xs space-y-2 relative">
                  
                  {/* Verified Header in Bubble */}
                  <div className="flex items-center justify-between pb-1 border-b border-slate-100 text-[10px] text-emerald-800 font-bold">
                    <span>SmileCraft Dental Studio</span>
                    <span className="flex items-center gap-0.5 text-emerald-600">
                      <ShieldCheck className="w-3 h-3" /> Official Clinic
                    </span>
                  </div>

                  <p className="whitespace-pre-line leading-relaxed text-slate-700">
                    {renderedBody}
                  </p>

                  <div className="flex items-center justify-end gap-1 text-[9px] text-slate-400 pt-1">
                    <span>Just now</span>
                    <span className="text-teal-600 font-bold">✓✓</span>
                  </div>
                </div>

              </div>

              {/* Action Buttons Bar */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-teal-600" />
                  <span className="text-xs">Scheduled via WhatsApp gateway</span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {/* Open in WhatsApp Button */}
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-full shadow-xs transition-all"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-white/20" />
                    <span>Send via WhatsApp</span>
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </a>

                  {/* Send via Email Button */}
                  <a
                    href={mailtoUrl}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold rounded-full transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-teal-600" />
                    <span>Email Patient</span>
                  </a>
                </div>
              </div>

            </div>

            {/* Active Clinic Appointments Quick Dispatch Bar */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Recent Patient Appointments Queue ({appointments.length})
                </span>
                <span className="text-[10px] text-teal-700 font-semibold">Auto-Sync On</span>
              </div>

              <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto">
                {appointments.slice(0, 4).map(apt => (
                  <div key={apt.id} className="py-2 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <p className="font-bold text-slate-800 text-xs">{apt.patientName}</p>
                      <p className="text-[10px] text-slate-400">
                        {apt.treatment} • {apt.date} ({apt.timeSlot})
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <a
                        href={generateWhatsAppLink(
                          apt.patientPhone,
                          createReminderWhatsAppMessage(apt)
                        )}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => sendWhatsAppFollowUp(apt.id)}
                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full font-semibold text-[10px] flex items-center gap-1"
                      >
                        <MessageCircle className="w-3 h-3 text-emerald-600" />
                        <span>WA</span>
                      </a>

                      <button
                        onClick={() => sendEmailFollowUp(apt.id)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-semibold text-[10px] flex items-center gap-1 cursor-pointer"
                      >
                        <Mail className="w-3 h-3 text-slate-500" />
                        <span>Email</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
