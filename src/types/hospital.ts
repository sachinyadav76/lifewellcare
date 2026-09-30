export interface Doctor {
  id: string;
  name: string;
  title: string;
  departmentId: string;
  departmentName: string;
  specialties: string[];
  education: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  image: string;
  bio: string;
  availableDays: string[];
  languages: string[];
  consultationFee: number;
  acceptingNewPatients: boolean;
  officeLocation: string;
  awards?: string[];
}

export interface Department {
  id: string;
  name: string;
  tagline: string;
  description: string;
  iconName: string;
  headOfDepartment: string;
  floor: string;
  phoneExtension: string;
  image: string;
  keyServices: string[];
  commonConditions: string[];
  technologies: string[];
}

export interface Appointment {
  id: string;
  patientId?: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientDob?: string;
  doctorId: string;
  doctorName: string;
  doctorTitle: string;
  departmentId: string;
  departmentName: string;
  visitType: 'In-Person' | 'Video Consultation' | 'Follow-up' | 'Second Opinion';
  date: string;
  timeSlot: string;
  reason: string;
  insuranceProvider?: string;
  status: 'Confirmed' | 'Completed' | 'Rescheduled' | 'Cancelled';
  createdAt: string;
  bookingRef: string;
  notes?: string;
}

export interface MedicalRecord {
  id: string;
  date: string;
  type: 'Lab Test' | 'Imaging' | 'Clinical Summary' | 'Cardiology' | 'Pathology';
  title: string;
  doctorName: string;
  department: string;
  facility: string;
  status: 'Normal' | 'Follow-up Needed' | 'Critical Review' | 'Completed';
  summary: string;
  fileSize: string;
  keyValues?: { metric: string; value: string; standardRange: string; status: 'normal' | 'abnormal' | 'optimal' }[];
}

export interface Prescription {
  id: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  prescribedBy: string;
  prescribedDate: string;
  endDate: string;
  refillsRemaining: number;
  instructions: string;
  status: 'Active' | 'Completed' | 'Refill Requested';
}

export interface VitalRecord {
  id: string;
  date: string;
  bloodPressure: string; // e.g. "118/76"
  heartRate: number; // bpm
  temperature: string; // "98.6°F"
  oxygenSaturation: number; // %
  bloodGlucose: number; // mg/dL
  weightLbs: number;
}

export interface DoctorMessage {
  id: string;
  sender: 'patient' | 'doctor';
  senderName: string;
  doctorAvatar?: string;
  timestamp: string;
  text: string;
  isRead: boolean;
}

export interface PatientUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  bloodType: string;
  allergies: string[];
  primaryDoctorId: string;
  primaryDoctorName: string;
  insuranceId: string;
  insuranceName: string;
  role?: 'admin' | 'patient';
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  memberSince: string;
}
