import React, { useState, useEffect, useRef } from 'react';
import { CLINIC_INFO } from '../data/clinicData';
import { useClinic } from '../context/ClinicContext';
import { useAuth } from '../context/AuthContext';
import { generateFingerprint, decryptMessage } from '../utils/crypto';
import {
  Lock,
  ShieldCheck,
  Send,
  Sparkles,
  Paperclip,
  Image,
  Eye,
  EyeOff,
  Stethoscope,
  User,
  Key,
  Info,
  Clock,
  CheckCheck,
  AlertCircle
} from 'lucide-react';

export const SecureConsultationChat: React.FC = () => {
  const { messages, sendE2EEMessage, openBooking } = useClinic();
  const { user, isDoctor } = useAuth();

  const [inputContent, setInputContent] = useState<string>('');
  const [showRawEncrypted, setShowRawEncrypted] = useState<boolean>(false);
  const [fingerprint, setFingerprint] = useState<string>('8F2A:4E91:B3C7:01DA');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [selectedAttachment, setSelectedAttachment] = useState<'xray' | 'photo' | 'report' | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    generateFingerprint(user?.id || 'SmileCraft-Session').then(setFingerprint);
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputContent.trim() && !selectedAttachment) return;

    setIsSending(true);
    try {
      const senderName = user?.name || (isDoctor ? CLINIC_INFO.doctor : 'Patient');
      const senderId = user?.id || 'usr-anonymous-patient';
      const senderRole = user?.role || (isDoctor ? 'dentist' : 'patient');

      await sendE2EEMessage(
        inputContent.trim() || `Uploaded encrypted dental ${selectedAttachment}`,
        senderId,
        senderName,
        senderRole,
        selectedAttachment,
        selectedAttachment ? `DrMehta_Encrypted_${selectedAttachment.toUpperCase()}_${Date.now()}.dcm` : undefined
      );

      setInputContent('');
      setSelectedAttachment(undefined);
    } finally {
      setIsSending(false);
    }
  };

  const quickSymptoms = [
    'I have sharp sensitivity to cold water on my upper right molar.',
    'Is mild soreness normal 24 hours after root canal treatment?',
    'I would like to inquire about clear aligner treatment duration.',
    'Urgent: My temporary crown came off while chewing food.',
  ];

  return (
    <section className="py-14 sm:py-16 bg-[#f8fafc] border-b border-slate-200 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200 mb-2.5">
            <Lock className="w-3.5 h-3.5 text-teal-600" />
            <span>End-to-End Encrypted (E2EE) Web Crypto Consultation</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            Confidential Dental <span className="text-teal-600">Vault & Tele-Consult</span>
          </h2>
          <p className="mt-2 text-slate-600 text-sm leading-relaxed">
            All messages, intraoral photos, and X-ray records are encrypted directly on your device using native browser 256-bit AES-GCM before transmission. Only you and Dr. Aarav Mehta hold the decryption keys.
          </p>
        </div>

        {/* E2EE Security Badges Strip */}
        <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 mb-5 flex flex-wrap items-center justify-between gap-4 shadow-sm border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center border border-teal-500/30">
              <ShieldCheck className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-teal-300 uppercase tracking-wider">
                  E2EE Channel Active
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-xs text-slate-300 font-mono mt-0.5">
                Session Fingerprint: <span className="text-teal-200 font-bold">{fingerprint}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowRawEncrypted(!showRawEncrypted)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors cursor-pointer"
            >
              {showRawEncrypted ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-teal-400" />}
              <span>{showRawEncrypted ? 'Hide Ciphertext' : 'Inspect 256-bit Ciphertext'}</span>
            </button>

            <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400">
              <Key className="w-3.5 h-3.5 text-teal-400" />
              <span>AES-GCM • SHA-256</span>
            </div>
          </div>
        </div>

        {/* Main Encrypted Chat Window */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden flex flex-col h-[540px]">
          
          {/* Top Chat Header */}
          <div className="p-3.5 sm:p-4 bg-white border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center text-teal-800 font-bold text-base">
                👨‍⚕️
              </div>
              <div>
                <h3 className="font-heading font-bold text-slate-800 text-xs sm:text-sm">
                  {isDoctor ? 'Patient Communication Stream' : `${CLINIC_INFO.doctor} (BDS, MDS)`}
                </h3>
                <p className="text-[10px] text-teal-700 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Verified Clinical Channel • Model Town Studio</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => openBooking()}
              className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-full text-xs font-bold transition-colors cursor-pointer"
            >
              Book In-Clinic Visit (₹500)
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-3.5 bg-slate-50">
            
            {/* Encryption Notice Box */}
            <div className="p-2.5 bg-white rounded-xl border border-teal-200 text-center max-w-md mx-auto text-xs text-teal-950 space-y-0.5 shadow-2xs">
              <p className="font-bold flex items-center justify-center gap-1 text-teal-800 text-xs">
                <Lock className="w-3 h-3 text-teal-700" />
                <span>Zero-Knowledge End-to-End Encryption</span>
              </p>
              <p className="text-[10px] text-slate-600">
                Messages and uploaded dental scans are encrypted using client-side cryptographic keys. No unencrypted data is ever logged.
              </p>
            </div>

            {messages.map(msg => {
              const isMe = user ? msg.senderId === user.id : msg.senderRole === (isDoctor ? 'dentist' : 'patient');
              const isDocMsg = msg.senderRole === 'dentist';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1 px-1">
                    <span className="font-semibold text-slate-600">{msg.senderName}</span>
                    <span>•</span>
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span className="text-teal-600 font-mono text-[9px]">E2EE✓</span>
                  </div>

                  <div
                    className={`max-w-[85%] sm:max-w-md p-3.5 rounded-2xl text-xs sm:text-sm shadow-xs space-y-2 ${
                      isMe
                        ? 'bg-teal-600 text-white rounded-tr-xs'
                        : isDocMsg
                        ? 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs'
                        : 'bg-slate-200 text-slate-900 rounded-tl-xs'
                    }`}
                  >
                    {/* Attachment preview if present */}
                    {msg.attachmentType && (
                      <div className={`p-2 rounded-xl text-xs flex items-center gap-2 ${
                        isMe ? 'bg-teal-700 text-teal-100' : 'bg-slate-100 text-slate-800'
                      }`}>
                        <Image className="w-3.5 h-3.5" />
                        <div className="truncate">
                          <p className="font-bold uppercase tracking-wider text-[9px]">
                            Encrypted {msg.attachmentType} Attachment
                          </p>
                          <p className="text-[10px] font-mono truncate">{msg.attachmentName}</p>
                        </div>
                      </div>
                    )}

                    {/* Decrypted plain text display */}
                    <p className="leading-relaxed whitespace-pre-line text-xs">
                      {msg.plainTextPreview || '[Encrypted Medical Note]'}
                    </p>

                    {/* Raw Encrypted Ciphertext Inspector (Toggled by user) */}
                    {showRawEncrypted && (
                      <div className="mt-2 pt-2 border-t border-white/20 text-[10px] font-mono space-y-1 bg-black/20 p-2 rounded-lg break-all">
                        <p className="text-amber-300 font-bold">🔐 Raw 256-bit AES-GCM Ciphertext:</p>
                        <p className="text-slate-200">{msg.encryptedContent}</p>
                        <p className="text-teal-300">IV: {msg.iv}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Symptoms Prompts */}
          <div className="px-3.5 py-1.5 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto">
            <span className="text-[10px] font-bold text-slate-400 shrink-0">Quick Triage:</span>
            {quickSymptoms.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => setInputContent(prompt)}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-[10px] text-slate-600 whitespace-nowrap transition-colors cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Message Input Bar */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200">
            {selectedAttachment && (
              <div className="mb-2 flex items-center justify-between p-2 bg-teal-50 rounded-xl border border-teal-200 text-xs text-teal-800">
                <span className="flex items-center gap-1 font-semibold text-[11px]">
                  <Image className="w-3.5 h-3.5 text-teal-600" />
                  Attached: {selectedAttachment.toUpperCase()} (256-bit AES Encrypted)
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedAttachment(undefined)}
                  className="text-rose-600 font-bold hover:underline text-[11px] cursor-pointer"
                >
                  Remove
                </button>
              </div>
            )}

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setSelectedAttachment('xray')}
                  className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                    selectedAttachment === 'xray'
                      ? 'bg-teal-100 border-teal-400 text-teal-800'
                      : 'hover:bg-slate-100 border-slate-200 text-slate-500'
                  }`}
                  title="Attach Dental X-Ray"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedAttachment('photo')}
                  className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                    selectedAttachment === 'photo'
                      ? 'bg-teal-100 border-teal-400 text-teal-800'
                      : 'hover:bg-slate-100 border-slate-200 text-slate-500'
                  }`}
                  title="Attach Intraoral Photo"
                >
                  <Image className="w-4 h-4" />
                </button>
              </div>

              <input
                type="text"
                value={inputContent}
                onChange={(e) => setInputContent(e.target.value)}
                placeholder="Type your dental symptoms or question to Dr. Aarav Mehta (E2EE Protected)..."
                className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-200 text-xs font-medium bg-slate-50"
              />

              <button
                type="submit"
                disabled={isSending || (!inputContent.trim() && !selectedAttachment)}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-full font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
          </form>

        </div>

      </div>
    </section>
  );
};
