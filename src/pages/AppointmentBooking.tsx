import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  MapPin, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  ShieldCheck, 
  Video, 
  Building, 
  FileText, 
  AlertCircle,
  Download,
  CalendarPlus,
  ArrowRight,
  Stethoscope,
  Star,
  Check,
  Lock,
  Mail,
  KeyRound,
  Eye,
  EyeOff
} from 'lucide-react';
import { DEPARTMENTS, DOCTORS } from '../data/hospitalData';
import { Doctor, Appointment } from '../types/hospital';
import { useAuth } from '../context/AuthContext';
import { useAppointments } from '../context/AppointmentContext';

interface AppointmentBookingProps {
  onNavigateToPortal: () => void;
  preselectedDoctorId?: string | null;
  preselectedDeptId?: string | null;
}

export const AppointmentBooking: React.FC<AppointmentBookingProps> = ({
  onNavigateToPortal,
  preselectedDoctorId,
  preselectedDeptId
}) => {
  const { user, isAuthenticated, login, register, loginWithGoogle, loginAsDemo } = useAuth();
  const { bookAppointment, lastBookedAppointment, setLastBookedAppointment } = useAppointments();

  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form selections
  const [selectedDeptId, setSelectedDeptId] = useState<string>(preselectedDeptId || 'cardiology');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(preselectedDoctorId || '');
  const [visitType, setVisitType] = useState<'In-Person' | 'Video Consultation' | 'Follow-up' | 'Second Opinion'>('In-Person');
  
  // Date calculation: Next 14 days
  const upcomingDates = useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      // Skip Sundays
      if (d.getDay() !== 0) {
        dates.push({
          dateStr: d.toISOString().split('T')[0],
          dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
          monthDay: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          fullDay: d.toLocaleDateString('en-US', { weekday: 'long' })
        });
      }
    }
    return dates;
  }, []);

  const [selectedDate, setSelectedDate] = useState<string>(upcomingDates[0]?.dateStr || '');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('10:00 AM');

  // Patient Info
  const [patientName, setPatientName] = useState<string>(user?.name || '');
  const [patientEmail, setPatientEmail] = useState<string>(user?.email || '');
  const [patientPhone, setPatientPhone] = useState<string>(user?.phone || '');
  const [patientDob, setPatientDob] = useState<string>(user?.dob || '1990-01-01');
  const [reason, setReason] = useState<string>('');
  const [insuranceProvider, setInsuranceProvider] = useState<string>(user?.insuranceName || 'BlueCross BlueShield');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // In-line Sign In / Sign Up state for unauthenticated users before booking
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authDob, setAuthDob] = useState('1990-05-14');
  const [authBloodType, setAuthBloodType] = useState('O+');
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Confirmed booking state
  const [confirmedBooking, setConfirmedBooking] = useState<Appointment | null>(null);

  // Sync if preselected props change
  useEffect(() => {
    if (preselectedDeptId) setSelectedDeptId(preselectedDeptId);
    if (preselectedDoctorId) setSelectedDoctorId(preselectedDoctorId);
  }, [preselectedDeptId, preselectedDoctorId]);

  // Sync if auth user logs in
  useEffect(() => {
    if (user) {
      setPatientName(user.name);
      setPatientEmail(user.email);
      setPatientPhone(user.phone || '+1 (555) 010-8800');
      setPatientDob(user.dob || '1990-01-01');
      setInsuranceProvider(user.insuranceName || 'BlueCross BlueShield Premier Choice');
    }
  }, [user]);

  // Filter doctors in chosen department
  const departmentDoctors = useMemo(() => {
    return DOCTORS.filter(d => d.departmentId === selectedDeptId);
  }, [selectedDeptId]);

  // Set default doctor when department changes if current doctor is not in department
  useEffect(() => {
    if (departmentDoctors.length > 0) {
      const exists = departmentDoctors.some(d => d.id === selectedDoctorId);
      if (!exists) {
        setSelectedDoctorId(departmentDoctors[0].id);
      }
    }
  }, [selectedDeptId, departmentDoctors, selectedDoctorId]);

  const selectedDoctor = DOCTORS.find(d => d.id === selectedDoctorId) || departmentDoctors[0];
  const selectedDepartment = DEPARTMENTS.find(d => d.id === selectedDeptId) || DEPARTMENTS[0];

  const timeSlots = [
    { label: 'Morning Slots', slots: ['08:30 AM', '09:15 AM', '10:00 AM', '11:15 AM', '11:45 AM'] },
    { label: 'Afternoon Slots', slots: ['01:30 PM', '02:15 PM', '03:00 PM', '03:45 PM', '04:30 PM'] }
  ];

  const handleProceedToStep2 = () => {
    if (!selectedDoctorId) {
      setFormError('Please select a physician to proceed.');
      return;
    }
    setFormError(null);
    setCurrentStep(2);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleProceedToStep3 = () => {
    if (!selectedDate || !selectedTimeSlot) {
      setFormError('Please select a preferred appointment date and time slot.');
      return;
    }
    setFormError(null);
    setCurrentStep(3);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // In-line Auth handlers for Step 3
  const handleInlineAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    try {
      if (authMode === 'signup') {
        if (!authName.trim()) {
          setAuthError('Please enter your legal full name.');
          setAuthLoading(false);
          return;
        }
        const res = await register(
          {
            name: authName.trim(),
            email: authEmail.trim(),
            phone: authPhone.trim() || '+1 (555) 010-8800',
            dob: authDob,
            bloodType: authBloodType
          },
          authPassword
        );
        if (!res.success) {
          setAuthError(res.error || 'Registration failed');
        } else {
          setPatientName(authName.trim());
          setPatientEmail(authEmail.trim());
          setPatientPhone(authPhone.trim() || '+1 (555) 010-8800');
          setPatientDob(authDob);
        }
      } else {
        const res = await login(authEmail, authPassword);
        if (!res.success) {
          setAuthError(res.error || 'Invalid credentials');
        }
      }
    } catch {
      setAuthError('An authentication error occurred. Please retry.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    setAuthLoading(true);
    const res = await loginWithGoogle(true);
    setAuthLoading(false);
    if (!res.success) {
      setAuthError(res.error || 'Google sign-in could not be completed.');
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setFormError('Please sign in or create an account to secure and confirm your appointment.');
      return;
    }

    if (!patientName.trim() || !patientEmail.trim() || !patientPhone.trim()) {
      setFormError('Please ensure your name, email, and contact number are filled in.');
      return;
    }

    setFormError(null);
    setIsSubmitting(true);

    try {
      const booking = await bookAppointment({
        patientId: user?.id,
        patientName: patientName.trim(),
        patientEmail: patientEmail.trim(),
        patientPhone: patientPhone.trim(),
        patientDob,
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        doctorTitle: selectedDoctor.title,
        departmentId: selectedDepartment.id,
        departmentName: selectedDepartment.name,
        visitType,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        reason: reason.trim() || 'General specialist consultation and health assessment',
        insuranceProvider: insuranceProvider || 'Self-Pay / In-Network Review',
        notes: `Location: ${selectedDoctor.officeLocation} (${selectedDepartment.floor}). Please arrive 15 minutes prior to scheduled slot.`
      });

      setConfirmedBooking(booking);
      setCurrentStep(4);
      window.scrollTo({ top: 80, behavior: 'smooth' });
    } catch (err: any) {
      setFormError('Failed to record appointment in database. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadCalendarFile = () => {
    if (!confirmedBooking) return;
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//LifeWell Medical Center//Appointment System//EN',
      'BEGIN:VEVENT',
      `SUMMARY:Medical Appointment with ${confirmedBooking.doctorName}`,
      `DESCRIPTION:${confirmedBooking.visitType} appointment at LifeWell Medical Center. Department: ${confirmedBooking.departmentName}. Reference: ${confirmedBooking.bookingRef}`,
      `LOCATION:LifeWell Medical Center - ${confirmedBooking.notes || 'Metro Campus'}`,
      `DTSTART:${confirmedBooking.date.replace(/-/g, '')}T100000Z`,
      `DTEND:${confirmedBooking.date.replace(/-/g, '')}T110000Z`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `LifeWell_Appointment_${confirmedBooking.bookingRef}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title & Step Indicator */}
      <div className="text-center space-y-2">
        <span className="text-xs uppercase tracking-wider font-bold text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full inline-block">
          Firebase Powered Patient Scheduling
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
          Schedule an Appointment
        </h1>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          Reserve your consultation with LifeWell specialists. Your account and bookings are securely stored in Firebase.
        </p>
      </div>

      {/* Progress Steps (Steps 1 to 4) */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          {[
            { step: 1, label: 'Department & Doctor' },
            { step: 2, label: 'Date & Time Slot' },
            { step: 3, label: 'Sign In & Patient Info' },
            { step: 4, label: 'Confirmed Pass' },
          ].map((item) => {
            const isCurrent = currentStep === item.step;
            const isCompleted = currentStep > item.step;
            return (
              <div key={item.step} className="flex flex-col items-center space-y-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    isCompleted
                      ? 'bg-emerald-500 text-white'
                      : isCurrent
                      ? 'bg-teal-600 text-white ring-4 ring-teal-100'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : item.step}
                </div>
                <span
                  className={`hidden sm:inline font-semibold ${
                    isCurrent ? 'text-teal-700' : isCompleted ? 'text-slate-700' : 'text-slate-400'
                  }`}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Error banner if validation fails */}
      {formError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* STEP 1: Department & Multiple Doctors Selection */}
      {currentStep === 1 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8 animate-in fade-in duration-200">
          <div>
            <h3 className="text-xl font-bold text-slate-900 font-heading">
              Step 1: Choose Department & Attending Specialist
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Select the appropriate clinical division. Each department has multiple specialists available.
            </p>
          </div>

          {/* Department Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
              1. Select Clinical Department:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {DEPARTMENTS.map((dept) => {
                const isSelected = selectedDeptId === dept.id;
                const count = DOCTORS.filter(d => d.departmentId === dept.id).length;
                return (
                  <button
                    key={dept.id}
                    type="button"
                    onClick={() => {
                      setSelectedDeptId(dept.id);
                      // Auto-select first doctor of that department
                      const firstDoc = DOCTORS.find(d => d.departmentId === dept.id);
                      if (firstDoc) setSelectedDoctorId(firstDoc.id);
                    }}
                    className={`text-left p-3.5 rounded-2xl border transition-all ${
                      isSelected
                        ? 'bg-teal-50 border-teal-500 shadow-sm ring-2 ring-teal-500/20'
                        : 'bg-slate-50 hover:bg-white border-slate-200'
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-900 block truncate">
                      {dept.name.split('&')[0]}
                    </span>
                    <span className="text-[11px] text-teal-700 font-medium block mt-1">
                      {count} Doctors Available
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Multiple Doctors in Selected Department */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                2. Select Your Physician in {selectedDepartment.name}:
              </label>
              <span className="text-xs text-teal-700 font-semibold">
                {departmentDoctors.length} Specialists on Staff
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {departmentDoctors.map((doc) => {
                const isDocSelected = selectedDoctorId === doc.id;
                return (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDoctorId(doc.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                      isDocSelected
                        ? 'bg-teal-50/90 border-teal-500 shadow-md ring-2 ring-teal-500/20'
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={doc.image}
                        alt={doc.name}
                        className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div className="space-y-0.5 flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-slate-900 truncate">
                            {doc.name}
                          </h4>
                          {isDocSelected && (
                            <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0">
                              <Check className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{doc.title}</p>
                        <div className="flex items-center gap-1.5 text-[11px] text-amber-500 font-bold">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{doc.rating}</span>
                          <span className="text-slate-400 font-normal">({doc.reviewCount})</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs text-slate-600 bg-white/70 p-2.5 rounded-xl border border-slate-200/60">
                      <p className="text-[11px] text-slate-500">
                        <strong>Specialties:</strong> {doc.specialties.slice(0, 2).join(', ')}
                      </p>
                      <div className="flex items-center justify-between pt-1 text-[11px]">
                        <span>Days: {doc.availableDays.slice(0, 2).join(', ')}</span>
                        <span className="font-bold text-teal-800">${doc.consultationFee}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Step 1 */}
          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="button"
              onClick={handleProceedToStep2}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-3 rounded-xl shadow-md flex items-center gap-2 text-sm transition-all"
            >
              <span>Continue to Date & Time</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Visit Type, Date & Time Slots */}
      {currentStep === 2 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8 animate-in fade-in duration-200">
          <div>
            <h3 className="text-xl font-bold text-slate-900 font-heading">
              Step 2: Choose Visit Format, Date & Time Slot
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Booking with <strong>{selectedDoctor.name}</strong> ({selectedDepartment.name})
            </p>
          </div>

          {/* Visit Type Picker */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
              1. Select Visit Format:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {[
                { type: 'In-Person', icon: Building, desc: 'At LifeWell Medical Pavilion' },
                { type: 'Video Consultation', icon: Video, desc: 'Secure HIPAA Video Call' },
                { type: 'Follow-up', icon: Clock, desc: 'Post-treatment evaluation' },
                { type: 'Second Opinion', icon: FileText, desc: 'In-depth diagnostic review' },
              ].map((item) => {
                const isSelected = visitType === item.type;
                const Icon = item.icon;
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => setVisitType(item.type as any)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-teal-50 border-teal-500 shadow-sm ring-2 ring-teal-500/20'
                        : 'bg-slate-50 hover:bg-white border-slate-200'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-teal-600' : 'text-slate-500'}`} />
                    <p className="text-xs font-bold text-slate-900">{item.type}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Picker (Horizontal slider of upcoming clinic dates) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
              2. Select Appointment Date:
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-7 gap-2">
              {upcomingDates.slice(0, 12).map((item) => {
                const isSelected = selectedDate === item.dateStr;
                return (
                  <button
                    key={item.dateStr}
                    type="button"
                    onClick={() => setSelectedDate(item.dateStr)}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      isSelected
                        ? 'bg-teal-600 text-white border-teal-600 shadow-md ring-2 ring-teal-500/30'
                        : 'bg-slate-50 hover:bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <span className="text-[11px] font-semibold uppercase block opacity-80">
                      {item.dayName}
                    </span>
                    <span className="text-base font-extrabold block my-0.5">
                      {item.monthDay.split(' ')[1]}
                    </span>
                    <span className="text-[10px] block opacity-90">
                      {item.monthDay.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Slots */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
              3. Select Available Time Slot:
            </label>
            <div className="space-y-4">
              {timeSlots.map((group, gi) => (
                <div key={gi} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <span className="text-xs font-bold text-slate-700 block mb-2">{group.label}</span>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {group.slots.map((slot) => {
                      const isSelected = selectedTimeSlot === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedTimeSlot(slot)}
                          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                            isSelected
                              ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                              : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Step 2 */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-4 py-2 rounded-xl flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Doctors</span>
            </button>

            <button
              type="button"
              onClick={handleProceedToStep3}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-3 rounded-xl shadow-md flex items-center gap-2 text-sm transition-all"
            >
              <span>Continue to Patient Details</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Sign In / Sign Up Before Booking + Patient Information */}
      {currentStep === 3 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div>
            <h3 className="text-xl font-bold text-slate-900 font-heading">
              Step 3: Patient Account & Clinical Intake Details
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Sign in or create an account to reserve your specialist appointment and store your medical records securely in Firebase.
            </p>
          </div>

          {/* Appointment Summary Preview Strip */}
          <div className="bg-teal-50 border border-teal-200/80 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <img
                src={selectedDoctor.image}
                alt={selectedDoctor.name}
                className="w-12 h-12 rounded-xl object-cover border border-teal-200"
              />
              <div>
                <p className="font-bold text-slate-900">{selectedDoctor.name}</p>
                <p className="text-teal-800 font-medium">{selectedDepartment.name}</p>
                <p className="text-slate-500 text-[11px]">{selectedDoctor.officeLocation}</p>
              </div>
            </div>

            <div className="sm:text-right space-y-0.5">
              <span className="bg-teal-200/70 text-teal-900 font-bold px-2 py-0.5 rounded text-[11px] inline-block">
                {visitType}
              </span>
              <p className="font-bold text-slate-800 text-sm">{selectedDate} at {selectedTimeSlot}</p>
            </div>
          </div>

          {/* 1. GATED SECTION: Sign In / Sign Up required before booking */}
          {!isAuthenticated ? (
            <div className="bg-gradient-to-br from-slate-50 to-teal-50/40 p-6 rounded-2xl border-2 border-teal-200/90 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 font-heading">
                      Sign In or Sign Up Before Booking
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Creates your digital health profile and links this appointment directly to your Firebase records.
                    </p>
                  </div>
                </div>

                {/* Switch between Sign In and Sign Up */}
                <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-2xs text-xs">
                  <button
                    type="button"
                    onClick={() => { setAuthMode('signup'); setAuthError(null); }}
                    className={`px-3 py-1 rounded-lg font-bold transition-all ${
                      authMode === 'signup' ? 'bg-teal-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    New Patient (Sign Up)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAuthMode('signin'); setAuthError(null); }}
                    className={`px-3 py-1 rounded-lg font-bold transition-all ${
                      authMode === 'signin' ? 'bg-teal-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Existing Patient (Sign In)
                  </button>
                </div>
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-700">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {/* Quick Demo Login Option */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-teal-600" />
                  Want to test booking immediately without typing?
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => loginAsDemo('elena@lifewell.demo')}
                    className="bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-bold px-2.5 py-1 rounded-lg text-[11px] transition-colors"
                  >
                    Use Elena Vance
                  </button>
                  <button
                    type="button"
                    onClick={() => loginAsDemo('marcus@lifewell.demo')}
                    className="bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 font-bold px-2.5 py-1 rounded-lg text-[11px] transition-colors"
                  >
                    Use Marcus Brody
                  </button>
                </div>
              </div>

              {/* Form fields for auth */}
              <form onSubmit={handleInlineAuth} className="space-y-4">
                {authMode === 'signup' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Legal Full Name *</label>
                      <input
                        type="text"
                        required
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
                        placeholder="e.g. Rachel Jenkins"
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Mobile Phone (for SMS updates) *</label>
                      <input
                        type="tel"
                        required
                        value={authPhone}
                        onChange={(e) => setAuthPhone(e.target.value)}
                        placeholder="+1 (555) 010-8800"
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Date of Birth</label>
                      <input
                        type="date"
                        value={authDob}
                        onChange={(e) => setAuthDob(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Blood Group</label>
                      <select
                        value={authBloodType}
                        onChange={(e) => setAuthBloodType(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 text-slate-900"
                      >
                        <option value="O+">O Positive (O+)</option>
                        <option value="O-">O Negative (O-)</option>
                        <option value="A+">A Positive (A+)</option>
                        <option value="A-">A Negative (A-)</option>
                        <option value="B+">B Positive (B+)</option>
                        <option value="B-">B Negative (B-)</option>
                        <option value="AB+">AB Positive (AB+)</option>
                        <option value="AB-">AB Negative (AB-)</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="patient@example.com"
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Account Password *</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        placeholder="Minimum 6 characters"
                        className="w-full p-2.5 pr-10 bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 text-slate-900"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  <button
                    type="submit"
                    disabled={authLoading}
                    className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-md text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <span>{authLoading ? 'Verifying with Firebase...' : authMode === 'signup' ? 'Create Account & Continue Booking' : 'Sign In & Continue Booking'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={authLoading}
                    className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold py-2.5 px-4 rounded-xl shadow-xs transition-colors text-xs flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Sign in with Google</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* User is Authenticated: Show Verified Status */
            <div className="bg-emerald-50 border border-emerald-200/90 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{user?.name}</span>
                    <span className="bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded text-[10px]">
                      Authenticated
                    </span>
                  </div>
                  <p className="text-slate-500 mt-0.5">{user?.email} • Patient ID: <strong className="font-mono text-emerald-800">{user?.id}</strong></p>
                </div>
              </div>
              <span className="text-[11px] text-emerald-800 font-medium">
                Your profile & appointment will be stored in Firebase Firestore.
              </span>
            </div>
          )}

          {/* 2. Patient Clinical Intake Form (Activated when authenticated) */}
          <form onSubmit={handleFinalSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Legal Full Name *</label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Elena Vance"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 text-slate-900 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 text-slate-900 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mobile Phone (for SMS Reminders) *</label>
                <input
                  type="tel"
                  required
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 text-slate-900 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={patientDob}
                  onChange={(e) => setPatientDob(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 text-slate-900 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 text-xs">Primary Health Insurance Provider</label>
              <input
                type="text"
                value={insuranceProvider}
                onChange={(e) => setInsuranceProvider(e.target.value)}
                placeholder="e.g. BlueCross BlueShield / Aetna / UnitedHealthcare / Self-Pay"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 text-slate-900 text-sm"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 text-xs">Reason for Visit / Symptoms Description</label>
              <textarea
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Briefly describe your symptoms, concern, or reason for this specialist consultation..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 text-slate-900 text-sm"
              />
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
              <span>All records and appointment requests are securely encrypted and stored in Firebase Firestore under HIPAA guidelines.</span>
            </div>

            {/* Form Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-4 py-2 rounded-xl flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back to Slot Picker</span>
              </button>

              <button
                type="submit"
                disabled={!isAuthenticated || isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-emerald-600/20 flex items-center gap-2 text-sm transition-all disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSubmitting ? 'Saving to Firebase...' : !isAuthenticated ? 'Sign In / Register Above to Confirm' : 'Confirm & Save Booking to Firebase'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* STEP 4: Confirmed Digital Pass */}
      {currentStep === 4 && confirmedBooking && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-8 animate-in fade-in zoom-in-95 duration-200 text-center sm:text-left">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Appointment Saved in Firebase
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 font-heading">
                  You are all scheduled!
                </h2>
              </div>
            </div>

            <div className="text-center sm:text-right bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Booking Reference</span>
              <span className="text-base font-mono font-bold text-teal-700">
                {confirmedBooking.bookingRef}
              </span>
            </div>
          </div>

          {/* Ticket Body */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Doctor Details */}
              <div className="flex items-start gap-4">
                <img
                  src={selectedDoctor.image}
                  alt={selectedDoctor.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-sm shrink-0"
                />
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full">
                    {confirmedBooking.departmentName}
                  </span>
                  <h4 className="text-base font-bold text-slate-900">{confirmedBooking.doctorName}</h4>
                  <p className="text-xs text-slate-500 font-medium">{confirmedBooking.doctorTitle}</p>
                  <p className="text-xs text-teal-800 font-medium flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {confirmedBooking.notes}
                  </p>
                </div>
              </div>

              {/* Patient & Time Details */}
              <div className="space-y-2 text-xs text-slate-600 bg-white p-4 rounded-xl border border-slate-200/60">
                <div className="flex justify-between pb-1 border-b border-slate-100">
                  <span className="text-slate-400">Date & Time:</span>
                  <span className="font-bold text-slate-900">{confirmedBooking.date} at {confirmedBooking.timeSlot}</span>
                </div>
                <div className="flex justify-between pb-1 border-b border-slate-100">
                  <span className="text-slate-400">Visit Format:</span>
                  <span className="font-bold text-teal-700">{confirmedBooking.visitType}</span>
                </div>
                <div className="flex justify-between pb-1 border-b border-slate-100">
                  <span className="text-slate-400">Patient:</span>
                  <span className="font-bold text-slate-900">{confirmedBooking.patientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Stored in Firestore:</span>
                  <span className="font-medium text-emerald-700">appointments/{confirmedBooking.id}</span>
                </div>
              </div>

            </div>

            <div className="p-3 bg-teal-50 rounded-xl border border-teal-200/60 text-xs text-teal-900">
              <p className="font-bold mb-0.5">Firebase Synced Confirmation:</p>
              <p className="text-teal-800/90 text-[11px]">
                Your booking is permanently preserved in Firestore. You can manage or reschedule this appointment anytime by logging into the Patient Portal.
              </p>
            </div>
          </div>

          {/* Action Buttons for Confirmed Pass */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={downloadCalendarFile}
                className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <CalendarPlus className="w-4 h-4 text-teal-600" />
                <span>Add to Calendar (.ics)</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <Download className="w-4 h-4 text-slate-500" />
                <span>Print Appointment Pass</span>
              </button>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  setCurrentStep(1);
                  setConfirmedBooking(null);
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200"
              >
                Book Another Visit
              </button>

              <button
                type="button"
                onClick={onNavigateToPortal}
                className="flex-1 sm:flex-none bg-teal-600 hover:bg-teal-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md transition-colors"
              >
                <span>View in Patient Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
