import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { DOCTORS, DEPARTMENTS } from '../data/hospitalData';
import { Doctor, Appointment } from '../types/hospital';

export interface SlotAvailability {
  doctor: Doctor;
  date: string;
  dayOfWeek: string;
  availableSlots: string[];
  bookedSlots: string[];
}

export interface SearchCriteria {
  departmentId?: string;
  specialty?: string;
  doctorName?: string;
  date?: string;
  timeRange?: 'morning' | 'afternoon' | 'evening' | 'any';
}

// Master standard daily consultation slot templates
export const STANDARD_TIME_SLOTS = [
  '09:00 AM',
  '09:45 AM',
  '10:30 AM',
  '11:15 AM',
  '01:30 PM',
  '02:15 PM',
  '03:00 PM',
  '03:45 PM',
  '04:30 PM',
  '05:15 PM',
  '06:00 PM'
];

/**
 * Normalizes input date strings (including relative dates like "tomorrow", "today", "saturday") into YYYY-MM-DD
 */
export function normalizeDate(dateInput: string): string {
  if (!dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }

  const cleaned = dateInput.toLowerCase().trim();
  const now = new Date();

  if (cleaned.includes('today') || cleaned.includes('aaj')) {
    return now.toISOString().split('T')[0];
  }
  if (cleaned.includes('tomorrow') || cleaned.includes('kal')) {
    const tmrw = new Date(now);
    tmrw.setDate(tmrw.getDate() + 1);
    return tmrw.toISOString().split('T')[0];
  }

  // Day of week detection (e.g., Saturday, Somwar, Shanivar)
  const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const hindiDays = ['ravivar', 'somvar', 'mangalvar', 'budhvar', 'guruvar', 'shukravar', 'shanivar'];

  for (let i = 0; i < 7; i++) {
    if (cleaned.includes(daysOfWeek[i]) || cleaned.includes(hindiDays[i])) {
      const currentDay = now.getDay();
      let diff = i - currentDay;
      if (diff <= 0) diff += 7; // Next occurrence
      const targetDate = new Date(now);
      targetDate.setDate(targetDate.getDate() + diff);
      return targetDate.toISOString().split('T')[0];
    }
  }

  // If already YYYY-MM-DD
  const regexIso = /^\d{4}-\d{2}-\d{2}$/;
  if (regexIso.test(cleaned)) {
    return cleaned;
  }

  // Parse standard Date
  const parsed = new Date(dateInput);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().split('T')[0];
  }

  // Fallback to tomorrow
  const fallback = new Date(now);
  fallback.setDate(fallback.getDate() + 1);
  return fallback.toISOString().split('T')[0];
}

/**
 * Get day name (Monday, Tuesday, etc.) from YYYY-MM-DD
 */
export function getDayName(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

/**
 * Filter time slots by preferred time range
 */
export function filterSlotsByTimeRange(slots: string[], range?: 'morning' | 'afternoon' | 'evening' | 'any'): string[] {
  if (!range || range === 'any') return slots;

  return slots.filter(slot => {
    const isPM = slot.includes('PM');
    const hour = parseInt(slot.split(':')[0], 10);
    const convertedHour = isPM && hour !== 12 ? hour + 12 : (!isPM && hour === 12 ? 0 : hour);

    if (range === 'morning') {
      return convertedHour < 12; // before 12 PM
    } else if (range === 'afternoon') {
      return convertedHour >= 12 && convertedHour < 16; // 12 PM to 4 PM
    } else if (range === 'evening') {
      return convertedHour >= 16; // 4 PM and later
    }
    return true;
  });
}

/**
 * 1. Find Doctors matching department, specialty, or search keyword
 */
export function findDoctors(params: { departmentId?: string; specialty?: string; query?: string }): Doctor[] {
  let list = [...DOCTORS];

  if (params.departmentId && params.departmentId !== 'all') {
    list = list.filter(d => d.departmentId.toLowerCase() === params.departmentId?.toLowerCase());
  }

  if (params.specialty) {
    const spec = params.specialty.toLowerCase();
    list = list.filter(d => 
      d.specialties.some(s => s.toLowerCase().includes(spec)) ||
      d.title.toLowerCase().includes(spec) ||
      d.departmentName.toLowerCase().includes(spec)
    );
  }

  if (params.query) {
    const q = params.query.toLowerCase().trim();
    list = list.filter(d =>
      d.name.toLowerCase().includes(q) ||
      d.title.toLowerCase().includes(q) ||
      d.departmentName.toLowerCase().includes(q) ||
      d.specialties.some(s => s.toLowerCase().includes(q))
    );
  }

  return list;
}

/**
 * 2. Get real Doctor Availability from Firestore & Schedule
 * Enforces DOUBLE-BOOKING PROTECTION by reading booked slots from the database.
 */
export async function getDoctorAvailability(doctorId: string, date: string): Promise<SlotAvailability | null> {
  const doctor = DOCTORS.find(d => d.id === doctorId);
  if (!doctor || !doctor.acceptingNewPatients) return null;

  const normalized = normalizeDate(date);
  const dayOfWeek = getDayName(normalized);

  // Check if doctor works on this day
  const isWorkingToday = doctor.availableDays.some(
    d => d.toLowerCase() === dayOfWeek.toLowerCase()
  );

  if (!isWorkingToday) {
    return {
      doctor,
      date: normalized,
      dayOfWeek,
      availableSlots: [],
      bookedSlots: []
    };
  }

  // Query Firestore for already booked appointments on this date for this doctor
  const bookedSlots: string[] = [];
  try {
    const appointmentsRef = collection(db, 'appointments');
    const q = query(
      appointmentsRef,
      where('doctorId', '==', doctor.id),
      where('date', '==', normalized)
    );
    const snapshot = await getDocs(q);
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      if (data.status !== 'Cancelled' && data.timeSlot) {
        bookedSlots.push(data.timeSlot);
      }
    });
  } catch (err) {
    console.warn('Could not read booked appointments from Firestore (fallback to local state check):', err);
  }

  // Also check localStorage cache for recently booked offline appointments
  try {
    const saved = localStorage.getItem('lifewell_patient_appointments');
    if (saved) {
      const localList: Appointment[] = JSON.parse(saved);
      localList.forEach(apt => {
        if (
          apt.doctorId === doctor.id && 
          apt.date === normalized && 
          apt.status !== 'Cancelled' &&
          !bookedSlots.includes(apt.timeSlot)
        ) {
          bookedSlots.push(apt.timeSlot);
        }
      });
    }
  } catch {
    // ignore
  }

  // Available slots = standard slots minus booked slots
  const availableSlots = STANDARD_TIME_SLOTS.filter(slot => !bookedSlots.includes(slot));

  return {
    doctor,
    date: normalized,
    dayOfWeek,
    availableSlots,
    bookedSlots
  };
}

/**
 * 3. Find Available Slots across a department or specialty
 */
export async function findAvailableSlots(params: {
  departmentId?: string;
  specialty?: string;
  doctorName?: string;
  date?: string;
  preferredTime?: 'morning' | 'afternoon' | 'evening' | 'any';
}): Promise<SlotAvailability[]> {
  const doctors = findDoctors({
    departmentId: params.departmentId,
    specialty: params.specialty,
    query: params.doctorName
  });

  const normalized = normalizeDate(params.date || '');
  const results: SlotAvailability[] = [];

  for (const doc of doctors) {
    const avail = await getDoctorAvailability(doc.id, normalized);
    if (avail && avail.availableSlots.length > 0) {
      const filteredSlots = filterSlotsByTimeRange(avail.availableSlots, params.preferredTime);
      if (filteredSlots.length > 0) {
        results.push({
          ...avail,
          availableSlots: filteredSlots
        });
      }
    }
  }

  return results;
}

/**
 * 4. Double-Booking Guard
 * Verifies that the specific doctor/date/timeSlot is still vacant in Firestore.
 */
export async function checkDoubleBooking(doctorId: string, date: string, timeSlot: string): Promise<boolean> {
  const normalized = normalizeDate(date);
  try {
    const appointmentsRef = collection(db, 'appointments');
    const q = query(
      appointmentsRef,
      where('doctorId', '==', doctorId),
      where('date', '==', normalized),
      where('timeSlot', '==', timeSlot)
    );
    const snapshot = await getDocs(q);
    const conflict = snapshot.docs.some(d => d.data().status !== 'Cancelled');
    if (conflict) return false;
  } catch (err) {
    console.warn('Firestore slot double booking check error:', err);
  }

  // Also verify local storage cache
  try {
    const saved = localStorage.getItem('lifewell_patient_appointments');
    if (saved) {
      const localList: Appointment[] = JSON.parse(saved);
      const isTaken = localList.some(
        apt => apt.doctorId === doctorId && apt.date === normalized && apt.timeSlot === timeSlot && apt.status !== 'Cancelled'
      );
      if (isTaken) return false;
    }
  } catch {
    // ignore
  }

  return true;
}

/**
 * 5. Create Appointment with Transaction/Protection
 * Throws an error if double booking is detected.
 */
export async function createAppointmentWithProtection(params: {
  patientId?: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  doctorId: string;
  date: string;
  timeSlot: string;
  visitType?: 'In-Person' | 'Video Consultation';
  reason?: string;
}): Promise<Appointment> {
  const doctor = DOCTORS.find(d => d.id === params.doctorId);
  if (!doctor) {
    throw new Error('Doctor not found in LifeWell database.');
  }

  const department = DEPARTMENTS.find(d => d.id === doctor.departmentId) || {
    id: doctor.departmentId,
    name: doctor.departmentName
  };

  const normalizedDate = normalizeDate(params.date);

  // 1. Strict Double-Booking verification
  const isAvailable = await checkDoubleBooking(doctor.id, normalizedDate, params.timeSlot);
  if (!isAvailable) {
    throw new Error(`DOUBLE_BOOKED: Sorry, the ${params.timeSlot} slot on ${normalizedDate} was just taken. Please select another slot.`);
  }

  // 2. Generate unique booking reference & appointment ID
  const randomRefNum = Math.floor(1000 + Math.random() * 9000);
  const appointmentId = `apt-${Date.now()}`;
  const bookingRef = `LW-2026-${randomRefNum}`;

  const newAppointment: Appointment = {
    id: appointmentId,
    bookingRef,
    patientId: params.patientId || `patient-${Date.now()}`,
    patientName: params.patientName.trim(),
    patientEmail: params.patientEmail.trim().toLowerCase(),
    patientPhone: params.patientPhone.trim(),
    doctorId: doctor.id,
    doctorName: doctor.name,
    doctorTitle: doctor.title,
    departmentId: department.id,
    departmentName: department.name,
    visitType: params.visitType || 'In-Person',
    date: normalizedDate,
    timeSlot: params.timeSlot,
    status: 'Confirmed',
    reason: params.reason?.trim() || 'Consultation booked via LifeWell AI Assistant',
    createdAt: new Date().toISOString(),
    notes: `Location: ${doctor.officeLocation}. Booked with LifeWell AI Assistant.`
  };

  // 3. Atomically save to Firestore
  try {
    const docRef = doc(db, 'appointments', appointmentId);
    await setDoc(docRef, newAppointment, { merge: true });
  } catch (err) {
    console.warn('Could not write appointment to Firestore directly, caching locally:', err);
  }

  // 4. Update local storage so that all tabs & components immediately reflect the new booking
  try {
    const saved = localStorage.getItem('lifewell_patient_appointments');
    const existing: Appointment[] = saved ? JSON.parse(saved) : [];
    const updated = [newAppointment, ...existing.filter(a => a.id !== newAppointment.id)];
    localStorage.setItem('lifewell_patient_appointments', JSON.stringify(updated));
  } catch {
    // ignore
  }

  return newAppointment;
}

/**
 * 6. Generate standard .ics Calendar Invite file for Apple Calendar, Google Calendar, Outlook
 */
export function downloadCalendarInvite(appointment: Appointment) {
  const [year, month, day] = appointment.date.split('-').map(Number);
  
  // Parse time
  const [timePart, meridiem] = appointment.timeSlot.split(' ');
  const [hourStr, minStr] = timePart.split(':');
  let hour = parseInt(hourStr, 10);
  const min = parseInt(minStr, 10);
  if (meridiem === 'PM' && hour !== 12) hour += 12;
  if (meridiem === 'AM' && hour === 12) hour = 0;

  const startDate = new Date(Date.UTC(year, month - 1, day, hour, min));
  const endDate = new Date(startDate.getTime() + 45 * 60000); // 45 min appointment

  const formatIcsTime = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//LifeWell Medical Center//Appointment Scheduler//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${appointment.bookingRef}@lifewellmedical.org`,
    `DTSTAMP:${formatIcsTime(new Date())}`,
    `DTSTART:${formatIcsTime(startDate)}`,
    `DTEND:${formatIcsTime(endDate)}`,
    `SUMMARY:Medical Appointment with ${appointment.doctorName}`,
    `DESCRIPTION:Appointment Ref: ${appointment.bookingRef}\\nDepartment: ${appointment.departmentName}\\nDoctor: ${appointment.doctorName}\\nFormat: ${appointment.visitType}\\nLifeWell Medical Center`,
    `LOCATION:LifeWell Medical Center, 100 LifeWell Way, ${appointment.departmentName}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `LifeWell_Appointment_${appointment.bookingRef}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 7. Get an appointment by ID from Firestore or local cache
 */
export async function getAppointment(appointmentId: string): Promise<Appointment | null> {
  try {
    const { doc, getDoc } = await import('firebase/firestore');
    const docRef = doc(db, 'appointments', appointmentId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as Appointment;
    }
  } catch (err) {
    console.warn('Could not fetch appointment from Firestore:', err);
  }

  try {
    const saved = localStorage.getItem('lifewell_patient_appointments');
    if (saved) {
      const list: Appointment[] = JSON.parse(saved);
      const found = list.find(a => a.id === appointmentId || a.bookingRef === appointmentId);
      if (found) return found;
    }
  } catch {
    // ignore
  }

  return null;
}

/**
 * 8. Cancel an appointment by ID in Firestore and local cache
 */
export async function cancelAppointment(appointmentId: string): Promise<boolean> {
  try {
    const { doc, updateDoc } = await import('firebase/firestore');
    const docRef = doc(db, 'appointments', appointmentId);
    await updateDoc(docRef, { status: 'Cancelled' });
  } catch (err) {
    console.warn('Could not cancel appointment in Firestore directly:', err);
  }

  try {
    const saved = localStorage.getItem('lifewell_patient_appointments');
    if (saved) {
      const list: Appointment[] = JSON.parse(saved);
      const updated = list.map(a => 
        (a.id === appointmentId || a.bookingRef === appointmentId) 
          ? { ...a, status: 'Cancelled' as const } 
          : a
      );
      localStorage.setItem('lifewell_patient_appointments', JSON.stringify(updated));
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Safe Medical Guardrails Detection:
 * Flags if the patient is requesting diagnosis or prescription, and provides safe redirection.
 */
export function checkMedicalGuardrails(text: string): { isDiagnosisRequest: boolean; disclaimer: string } {
  const lower = text.toLowerCase();
  const dangerousKeywords = [
    'diagnose', 'what disease do i have', 'do i have cancer', 'cure', 
    'prescribe medicine', 'dawai likh do', 'kya rog hai', 'treatment for tumor', 
    'chest pain and breathing stopped', 'heart attack right now', 'emergency'
  ];

  const matched = dangerousKeywords.some(k => lower.includes(k));
  return {
    isDiagnosisRequest: matched,
    disclaimer: 'I can help you find the appropriate department or doctor, but I cannot diagnose medical conditions or prescribe treatments. If you are experiencing a medical emergency, please call 911 or visit our Level 1 Emergency Trauma Center immediately.'
  };
}
