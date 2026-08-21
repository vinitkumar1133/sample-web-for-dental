export type UserRole = 'patient' | 'dentist';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  publicKey?: string;
  medicalHistory?: string;
  allergies?: string[];
  createdAt: string;
}

export type TreatmentType = 
  | 'General Consultation'
  | 'Teeth Whitening'
  | 'Root Canal Treatment (RCT)'
  | 'Clear Aligners & Braces'
  | 'Dental Implants'
  | 'Ceramic Veneers & Smile Makeover'
  | 'Scaling & Teeth Polishing'
  | 'Cavity Fillings & Restoration'
  | 'Wisdom Tooth Extraction'
  | 'Pediatric Dental Care';

export type AppointmentStatus = 'confirmed' | 'completed' | 'cancelled' | 'rescheduled' | 'pending';

export interface Appointment {
  id: string;
  patientId?: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  treatment: TreatmentType;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:30 AM"
  fee: number;
  status: AppointmentStatus;
  notes?: string;
  isEmergency?: boolean;
  whatsappReminderSent?: boolean;
  emailReminderSent?: boolean;
  followUpStage?: 'booking-confirmation' | 'pre-visit' | 'reminder-sent' | 'post-treatment-sent' | 'review-requested' | 'completed';
  createdAt: string;
  doctorNotesEncrypted?: string;
}

export interface Review {
  id: string;
  authorId?: string;
  authorName: string;
  authorRole: 'patient' | 'dentist';
  treatment: TreatmentType | 'General Care';
  rating: number; // 1 to 5
  title: string;
  comment: string;
  date: string;
  isVerifiedPatient: boolean;
  doctorResponse?: {
    doctorName: string;
    comment: string;
    date: string;
  };
  beforeAfterImage?: {
    beforeDesc?: string;
    afterDesc?: string;
    tag?: string;
  };
  likes: number;
}

export interface DentalService {
  id: string;
  title: TreatmentType;
  category: 'General Dentistry' | 'Cosmetic Dentistry' | 'Specialized Procedures';
  duration: string;
  price: string;
  description: string;
  highlights: string[];
  iconName: string;
  popular?: boolean;
}

export interface E2EEMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  recipientId: string;
  encryptedContent: string;
  plainTextPreview?: string; // Client-decrypted representation
  iv: string;
  timestamp: string;
  attachmentType?: 'xray' | 'prescription' | 'photo' | 'report';
  attachmentName?: string;
}

export interface FollowUpTemplate {
  id: string;
  title: string;
  type: 'whatsapp' | 'email';
  triggerStage: 'booking-confirmation' | '24h-reminder' | 'post-treatment-care' | 'review-request';
  treatment?: string;
  subject?: string;
  body: string;
}
