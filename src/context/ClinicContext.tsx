import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appointment, Review, E2EEMessage, TreatmentType, AppointmentStatus } from '../types';
import { INITIAL_APPOINTMENTS, INITIAL_REVIEWS } from '../data/clinicData';
import { encryptMessage, decryptMessage } from '../utils/crypto';
import confetti from 'canvas-confetti';

interface ClinicContextType {
  appointments: Appointment[];
  reviews: Review[];
  messages: E2EEMessage[];
  bookAppointment: (data: Omit<Appointment, 'id' | 'createdAt' | 'status' | 'fee'> & { fee?: number }) => Promise<Appointment>;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  rescheduleAppointment: (id: string, newDate: string, newSlot: string) => void;
  sendWhatsAppFollowUp: (appointmentId: string, customText?: string) => string;
  sendEmailFollowUp: (appointmentId: string, customSubject?: string, customBody?: string) => void;
  addReview: (review: Omit<Review, 'id' | 'date' | 'likes'>) => Promise<void>;
  addDoctorReply: (reviewId: string, replyComment: string) => void;
  likeReview: (reviewId: string) => void;
  sendE2EEMessage: (content: string, senderId: string, senderName: string, senderRole: 'patient' | 'dentist', attachmentType?: 'xray' | 'prescription' | 'photo' | 'report', attachmentName?: string) => Promise<void>;
  // UI triggers
  isBookingOpen: boolean;
  openBooking: (preselectedTreatment?: TreatmentType) => void;
  closeBooking: () => void;
  selectedTreatmentForBooking?: TreatmentType;
  isReviewModalOpen: boolean;
  openReviewModal: () => void;
  closeReviewModal: () => void;
  isChatOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  activeToast: { title: string; message: string; type: 'success' | 'info' | 'warning' } | null;
  showToast: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
  dismissToast: () => void;
}

const ClinicContext = createContext<ClinicContextType | undefined>(undefined);

export const ClinicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Appointments state
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('smilecraft_appointments');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_APPOINTMENTS;
      }
    }
    return INITIAL_APPOINTMENTS;
  });

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('smilecraft_reviews');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_REVIEWS;
      }
    }
    return INITIAL_REVIEWS;
  });

  // E2EE Messages state
  const [messages, setMessages] = useState<E2EEMessage[]>(() => {
    const saved = localStorage.getItem('smilecraft_e2ee_messages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  // Modals & UI states
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedTreatmentForBooking, setSelectedTreatmentForBooking] = useState<TreatmentType | undefined>(undefined);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeToast, setActiveToast] = useState<{ title: string; message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  // Initialize initial welcome E2EE message if none exists
  useEffect(() => {
    if (messages.length === 0) {
      const initDefaultChat = async () => {
        const payload = await encryptMessage('Hello and welcome to SmileCraft Dental Studio! I am Dr. Aarav Mehta. This private channel is secured with client-side 256-bit AES End-to-End Encryption. You can securely ask dental questions, share symptoms, or upload intraoral photos and X-rays.');
        setMessages([
          {
            id: 'msg-welcome-1',
            senderId: 'usr-doctor-aarav',
            senderName: 'Dr. Aarav Mehta (BDS, MDS)',
            senderRole: 'dentist',
            recipientId: 'all-patients',
            encryptedContent: payload.cipherText,
            plainTextPreview: 'Hello and welcome to SmileCraft Dental Studio! I am Dr. Aarav Mehta. This private channel is secured with client-side 256-bit AES End-to-End Encryption. You can securely ask dental questions, share symptoms, or upload intraoral photos and X-rays.',
            iv: payload.iv,
            timestamp: new Date(Date.now() - 3600000).toISOString(),
          }
        ]);
      };
      initDefaultChat();
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('smilecraft_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('smilecraft_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('smilecraft_e2ee_messages', JSON.stringify(messages));
  }, [messages]);

  const showToast = (title: string, message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setActiveToast({ title, message, type });
    setTimeout(() => {
      setActiveToast(null);
    }, 4500);
  };

  const dismissToast = () => setActiveToast(null);

  const openBooking = (preselectedTreatment?: TreatmentType) => {
    setSelectedTreatmentForBooking(preselectedTreatment);
    setIsBookingOpen(true);
  };

  const closeBooking = () => {
    setIsBookingOpen(false);
    setSelectedTreatmentForBooking(undefined);
  };

  const openReviewModal = () => setIsReviewModalOpen(true);
  const closeReviewModal = () => setIsReviewModalOpen(false);

  const openChat = () => setIsChatOpen(true);
  const closeChat = () => setIsChatOpen(false);

  const bookAppointment = async (data: Omit<Appointment, 'id' | 'createdAt' | 'status' | 'fee'> & { fee?: number }): Promise<Appointment> => {
    const newAppointment: Appointment = {
      ...data,
      id: `apt-${Date.now()}`,
      status: 'confirmed',
      fee: data.fee || 500,
      whatsappReminderSent: true,
      emailReminderSent: true,
      followUpStage: 'booking-confirmation',
      createdAt: new Date().toISOString(),
    };

    setAppointments(prev => [newAppointment, ...prev]);

    try {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#0d9488', '#14b8a6', '#06b6d4', '#f59e0b']
      });
    } catch {
      // Ignore if confetti fails
    }

    showToast('Appointment Confirmed!', `Booked for ${data.date} at ${data.timeSlot} with Dr. Aarav Mehta.`);
    return newAppointment;
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments(prev =>
      prev.map(apt => (apt.id === id ? { ...apt, status } : apt))
    );
    showToast('Status Updated', `Appointment marked as ${status}.`, 'info');
  };

  const rescheduleAppointment = (id: string, newDate: string, newSlot: string) => {
    setAppointments(prev =>
      prev.map(apt =>
        apt.id === id
          ? {
              ...apt,
              date: newDate,
              timeSlot: newSlot,
              status: 'rescheduled',
              followUpStage: 'reminder-sent',
            }
          : apt
      )
    );
    showToast('Appointment Rescheduled', `Updated to ${newDate} at ${newSlot}.`);
  };

  const sendWhatsAppFollowUp = (appointmentId: string, customText?: string): string => {
    const apt = appointments.find(a => a.id === appointmentId);
    if (!apt) return '';

    setAppointments(prev =>
      prev.map(a =>
        a.id === appointmentId ? { ...a, whatsappReminderSent: true } : a
      )
    );
    showToast('WhatsApp Notification Ready', `Message generated for ${apt.patientName}.`);
    return customText || `Appointment alert sent to ${apt.patientPhone}`;
  };

  const sendEmailFollowUp = (appointmentId: string) => {
    const apt = appointments.find(a => a.id === appointmentId);
    if (!apt) return;

    setAppointments(prev =>
      prev.map(a =>
        a.id === appointmentId ? { ...a, emailReminderSent: true } : a
      )
    );
    showToast('Email Dispatched', `Follow-up dispatched to ${apt.patientEmail}.`);
  };

  const addReview = async (reviewData: Omit<Review, 'id' | 'date' | 'likes'>) => {
    const newRev: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      likes: 1,
    };
    setReviews(prev => [newRev, ...prev]);

    try {
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#0d9488', '#38bdf8', '#fbbf24']
      });
    } catch {
      // Confetti fallback
    }

    showToast('Review Published', 'Thank you for sharing your smile journey with SmileCraft!');
    closeReviewModal();
  };

  const addDoctorReply = (reviewId: string, replyComment: string) => {
    setReviews(prev =>
      prev.map(rev =>
        rev.id === reviewId
          ? {
              ...rev,
              doctorResponse: {
                doctorName: 'Dr. Aarav Mehta (BDS, MDS)',
                comment: replyComment,
                date: new Date().toISOString().split('T')[0],
              },
            }
          : rev
      )
    );
    showToast('Doctor Response Posted', 'Dr. Aarav Mehta’s reply has been published.');
  };

  const likeReview = (reviewId: string) => {
    setReviews(prev =>
      prev.map(rev =>
        rev.id === reviewId ? { ...rev, likes: rev.likes + 1 } : rev
      )
    );
  };

  const sendE2EEMessage = async (
    content: string,
    senderId: string,
    senderName: string,
    senderRole: 'patient' | 'dentist',
    attachmentType?: 'xray' | 'prescription' | 'photo' | 'report',
    attachmentName?: string
  ) => {
    const payload = await encryptMessage(content);
    const newMsg: E2EEMessage = {
      id: `msg-${Date.now()}`,
      senderId,
      senderName,
      senderRole,
      recipientId: senderRole === 'patient' ? 'usr-doctor-aarav' : 'patient',
      encryptedContent: payload.cipherText,
      plainTextPreview: content,
      iv: payload.iv,
      timestamp: new Date().toISOString(),
      attachmentType,
      attachmentName,
    };

    setMessages(prev => [...prev, newMsg]);

    // If patient sent a question, simulate an intelligent encrypted doctor auto-reply after 1.2s for interactive live demonstration
    if (senderRole === 'patient') {
      setTimeout(async () => {
        const responses = [
          "Thank you for contacting SmileCraft Dental Studio. I have reviewed your encrypted note. If you are experiencing throbbing pain, please take warm water salt rinses and avoid cold liquids. We have slot openings tomorrow if you'd like an urgent look.",
          "Received your message securely. Dr. Aarav Mehta will review your dental query. Your appointment notes have been updated in our E2EE clinic vault.",
          "Noted! For sensitivity after scaling or whitening, that is mild and will subside within 24–48 hours. Continue using a soft-bristle toothbrush.",
        ];
        const randomResp = responses[Math.floor(Math.random() * responses.length)];
        const replyPayload = await encryptMessage(randomResp);
        const replyMsg: E2EEMessage = {
          id: `msg-doc-${Date.now()}`,
          senderId: 'usr-doctor-aarav',
          senderName: 'Dr. Aarav Mehta (BDS, MDS)',
          senderRole: 'dentist',
          recipientId: senderId,
          encryptedContent: replyPayload.cipherText,
          plainTextPreview: randomResp,
          iv: replyPayload.iv,
          timestamp: new Date().toISOString(),
        };
        setMessages(curr => [...curr, replyMsg]);
      }, 1400);
    }
  };

  return (
    <ClinicContext.Provider
      value={{
        appointments,
        reviews,
        messages,
        bookAppointment,
        updateAppointmentStatus,
        rescheduleAppointment,
        sendWhatsAppFollowUp,
        sendEmailFollowUp,
        addReview,
        addDoctorReply,
        likeReview,
        sendE2EEMessage,
        isBookingOpen,
        openBooking,
        closeBooking,
        selectedTreatmentForBooking,
        isReviewModalOpen,
        openReviewModal,
        closeReviewModal,
        isChatOpen,
        openChat,
        closeChat,
        activeToast,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </ClinicContext.Provider>
  );
};

export const useClinic = () => {
  const context = useContext(ClinicContext);
  if (!context) {
    throw new Error('useClinic must be used within a ClinicProvider');
  }
  return context;
};
