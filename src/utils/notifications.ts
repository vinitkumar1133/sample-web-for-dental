import { CLINIC_INFO } from '../data/clinicData';
import { Appointment, TreatmentType } from '../types';

/**
 * Generate formatted WhatsApp click-to-chat link
 */
export function generateWhatsAppLink(
  phoneNumber: string = CLINIC_INFO.rawPhone,
  message: string
): string {
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

/**
 * Generate WhatsApp message for a newly booked appointment
 */
export function createBookingWhatsAppMessage(appointment: {
  patientName: string;
  treatment: TreatmentType;
  date: string;
  timeSlot: string;
  isEmergency?: boolean;
}): string {
  const emergencyTag = appointment.isEmergency ? '🚨 URGENT EMERGENCY APPOINTMENT\n\n' : '';
  return `${emergencyTag}Hello ${appointment.patientName}! 👋

Your dental appointment at *${CLINIC_INFO.name}* is booked with *${CLINIC_INFO.doctor}*.

📅 *Date:* ${appointment.date}
⏰ *Time:* ${appointment.timeSlot}
🦷 *Treatment:* ${appointment.treatment}
💰 *Consultation Fee:* ₹${CLINIC_INFO.consultationFee}
📍 *Clinic Address:* ${CLINIC_INFO.address}

*Pre-Visit Instructions:*
• Please arrive 10 minutes prior to your time slot.
• Bring any previous dental X-rays or prescription history.
• If you need to reschedule or have questions, reply directly to this chat or call ${CLINIC_INFO.emergencyPhone}.

*${CLINIC_INFO.name}*
_${CLINIC_INFO.tagline}_`;
}

/**
 * Generate WhatsApp message for 24-hour appointment reminder
 */
export function createReminderWhatsAppMessage(appointment: Appointment): string {
  return `🔔 *Dental Appointment Reminder — Tomorrow*

Hello ${appointment.patientName}, this is a gentle reminder for your scheduled visit at *${CLINIC_INFO.name}*.

👨‍⚕️ *Doctor:* ${CLINIC_INFO.doctor}
📅 *Date:* ${appointment.date}
⏰ *Time:* ${appointment.timeSlot}
🦷 *Service:* ${appointment.treatment}
📍 *Location:* ${CLINIC_INFO.address}

💡 *Quick Tip:* Brush and floss before visiting. Need directions or running late? Call us at ${CLINIC_INFO.phone}.`;
}

/**
 * Generate post-treatment WhatsApp follow-up care guide
 */
export function createPostTreatmentWhatsAppMessage(
  patientName: string,
  treatment: TreatmentType
): string {
  return `🏥 *Post-Treatment Care Instructions from Dr. Aarav Mehta*

Dear ${patientName}, thank you for visiting *${CLINIC_INFO.name}* today for *${treatment}*!

✨ *Essential Recovery Tips:*
1. Avoid chewing hard or sticky foods on the treated side for 24 hours.
2. Avoid very hot or very cold beverages if local anesthesia was administered.
3. Take all prescribed medications as scheduled.
4. Continue gentle brushing, avoiding vigorous spitting.

📞 *Emergency Helpline:* ${CLINIC_INFO.emergencyPhone}
Feel free to text us if you have any questions or mild discomfort!`;
}

/**
 * Generate Email mailto link
 */
export function generateMailtoLink(
  toEmail: string,
  subject: string,
  body: string
): string {
  return `mailto:${encodeURIComponent(toEmail)}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
}

/**
 * Generate .ics calendar download for Apple/Google Calendar
 */
export function downloadCalendarEvent(appointment: {
  patientName: string;
  treatment: string;
  date: string;
  timeSlot: string;
}) {
  const [year, month, day] = appointment.date.split('-').map(Number);
  
  // Format time slot e.g. "10:30 AM"
  let hours = 10;
  let minutes = 0;
  const timeMatch = appointment.timeSlot.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (timeMatch) {
    hours = parseInt(timeMatch[1], 10);
    minutes = parseInt(timeMatch[2], 10);
    if (timeMatch[3].toUpperCase() === 'PM' && hours !== 12) hours += 12;
    if (timeMatch[3].toUpperCase() === 'AM' && hours === 12) hours = 0;
  }

  const startDate = new Date(year, month - 1, day, hours, minutes);
  const endDate = new Date(startDate.getTime() + 45 * 60000); // 45 min duration

  const formatIcsDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SmileCraft Dental Studio//Appointment//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:smilecraft-${Date.now()}@smilecraft.example`,
    `DTSTAMP:${formatIcsDate(new Date())}`,
    `DTSTART:${formatIcsDate(startDate)}`,
    `DTEND:${formatIcsDate(endDate)}`,
    `SUMMARY:Dental Appointment: ${appointment.treatment} - ${CLINIC_INFO.name}`,
    `DESCRIPTION:Appointment with ${CLINIC_INFO.doctor} for ${appointment.treatment}. Consultation fee: ₹${CLINIC_INFO.consultationFee}. Phone: ${CLINIC_INFO.phone}`,
    `LOCATION:${CLINIC_INFO.address}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT2H',
    'ACTION:DISPLAY',
    'DESCRIPTION:SmileCraft Dental Studio Appointment in 2 Hours',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', `SmileCraft_Appointment_${appointment.date}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
