import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Calendar, 
  User, 
  Search, 
  Filter, 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  X, 
  AlertCircle, 
  Phone, 
  Mail, 
  Download, 
  FileText, 
  Trash2, 
  RefreshCw, 
  DollarSign, 
  Check, 
  Activity,
  ArrowRight,
  Stethoscope,
  ChevronDown,
  Building,
  KeyRound,
  Eye,
  EyeOff,
  Edit3,
  CalendarCheck,
  Video,
  FileCheck,
  Printer,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAppointments } from '../context/AppointmentContext';
import { DEPARTMENTS, DOCTORS } from '../data/hospitalData';
import { Appointment } from '../types/hospital';

export const AdminPortal: React.FC = () => {
  const { user, isAdmin, loginAdmin, logout, sendPasswordReset } = useAuth();
  const { 
    appointments, 
    bookAppointment, 
    updateAppointmentStatus, 
    updateAppointmentNotes, 
    updateAppointmentFull,
    deleteAppointment,
    loadAllAppointments,
    isLoadingAppointments 
  } = useAppointments();

  // Admin login credentials state (clean initial state, never hardcoded or pre-filled)
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Forgot password state
  const [isForgotPasswordView, setIsForgotPasswordView] = useState(false);
  const [resetEmailInput, setResetEmailInput] = useState('');
  const [resetStatus, setResetStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [resetLoading, setResetLoading] = useState(false);

  // Table filtering and search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  // Add Booking Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientEmail, setNewPatientEmail] = useState('');
  const [newPatientPhone, setNewPatientPhone] = useState('');
  const [newPatientDob, setNewPatientDob] = useState('1990-01-01');
  const [newDeptId, setNewDeptId] = useState('cardiology');
  const [newDoctorId, setNewDoctorId] = useState('');
  const [newVisitType, setNewVisitType] = useState<'In-Person' | 'Video Consultation' | 'Follow-up' | 'Second Opinion'>('In-Person');
  const [newDate, setNewDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [newTimeSlot, setNewTimeSlot] = useState('10:00 AM');
  const [newReason, setNewReason] = useState('Executive clinical referral & specialist examination');
  const [newInsurance, setNewInsurance] = useState('BlueCross BlueShield Premier');
  const [newNotes, setNewNotes] = useState('Booked via LifeWell Central Administration Desk.');
  const [addModalError, setAddModalError] = useState<string | null>(null);
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);

  // Full Details & Edit Modal
  const [editingApt, setEditingApt] = useState<Appointment | null>(null);
  const [editPatientName, setEditPatientName] = useState('');
  const [editPatientEmail, setEditPatientEmail] = useState('');
  const [editPatientPhone, setEditPatientPhone] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editTimeSlot, setEditTimeSlot] = useState('');
  const [editDeptId, setEditDeptId] = useState('');
  const [editDoctorId, setEditDoctorId] = useState('');
  const [editVisitType, setEditVisitType] = useState<'In-Person' | 'Video Consultation' | 'Follow-up' | 'Second Opinion'>('In-Person');
  const [editStatus, setEditStatus] = useState<'Confirmed' | 'Completed' | 'Rescheduled' | 'Cancelled'>('Confirmed');
  const [editReason, setEditReason] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Edit Notes modal
  const [editingNotesApt, setEditingNotesApt] = useState<Appointment | null>(null);
  const [notesDraft, setNotesDraft] = useState('');

  // Delete confirmation modal
  const [deletingAptId, setDeletingAptId] = useState<string | null>(null);

  // Success alert
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  // Doctors in selected department for the Add modal
  const modalDeptDoctors = useMemo(() => {
    return DOCTORS.filter(d => d.departmentId === newDeptId);
  }, [newDeptId]);

  // Set default doctor when department changes in Add modal
  React.useEffect(() => {
    if (modalDeptDoctors.length > 0) {
      const exists = modalDeptDoctors.some(d => d.id === newDoctorId);
      if (!exists) {
        setNewDoctorId(modalDeptDoctors[0].id);
      }
    }
  }, [newDeptId, modalDeptDoctors, newDoctorId]);

  // Doctors in selected department for the Edit modal
  const editModalDeptDoctors = useMemo(() => {
    return DOCTORS.filter(d => d.departmentId === editDeptId);
  }, [editDeptId]);

  // Handle opening the Edit & Manage modal
  const openEditDetailsModal = (apt: Appointment) => {
    setEditingApt(apt);
    setEditPatientName(apt.patientName);
    setEditPatientEmail(apt.patientEmail);
    setEditPatientPhone(apt.patientPhone);
    setEditDate(apt.date);
    setEditTimeSlot(apt.timeSlot);
    setEditDeptId(apt.departmentId);
    setEditDoctorId(apt.doctorId);
    setEditVisitType(apt.visitType);
    setEditStatus(apt.status);
    setEditReason(apt.reason);
    setEditNotes(apt.notes || '');
  };

  // Save changes from Edit Modal
  const handleSaveFullEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApt) return;

    setIsSavingEdit(true);
    const doctor = DOCTORS.find(d => d.id === editDoctorId) || DOCTORS[0];
    const department = DEPARTMENTS.find(d => d.id === editDeptId) || DEPARTMENTS[0];

    try {
      await updateAppointmentFull(editingApt.id, {
        patientName: editPatientName.trim(),
        patientEmail: editPatientEmail.trim().toLowerCase(),
        patientPhone: editPatientPhone.trim(),
        date: editDate,
        timeSlot: editTimeSlot,
        departmentId: department.id,
        departmentName: department.name,
        doctorId: doctor.id,
        doctorName: doctor.name,
        doctorTitle: doctor.title,
        visitType: editVisitType,
        status: editStatus,
        reason: editReason.trim(),
        notes: editNotes.trim()
      });

      setIsSavingEdit(false);
      setEditingApt(null);
      showToast(`Appointment ${editingApt.bookingRef} successfully updated & synced with Firebase.`);
    } catch {
      setIsSavingEdit(false);
      showToast('Error saving updates to Firebase.');
    }
  };

  // Handle Admin Login submission via real Firebase Authentication
  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    const res = await loginAdmin(emailInput, passwordInput);
    setAuthLoading(false);

    if (!res.success) {
      setAuthError(res.error || 'Authentication failed. Please verify your administrative credentials.');
    } else {
      setPasswordInput(''); // Zero out sensitive credentials from memory
    }
  };

  // Handle Password Reset submission via Firebase Authentication
  const handlePasswordResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetStatus(null);
    setResetLoading(true);

    const res = await sendPasswordReset(resetEmailInput);
    setResetLoading(false);

    if (res.success) {
      setResetStatus({
        type: 'success',
        message: `Password reset instructions have been sent to ${resetEmailInput}. Please check your email inbox.`
      });
      setResetEmailInput('');
    } else {
      setResetStatus({
        type: 'error',
        message: res.error || 'Failed to dispatch password reset email. Please verify the address.'
      });
    }
  };

  // Filtered Appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        apt.patientName.toLowerCase().includes(q) ||
        apt.bookingRef.toLowerCase().includes(q) ||
        apt.doctorName.toLowerCase().includes(q) ||
        apt.patientEmail.toLowerCase().includes(q) ||
        apt.departmentName.toLowerCase().includes(q);

      const matchesDept = selectedDept === 'all' || apt.departmentId === selectedDept;
      const matchesStatus = selectedStatus === 'all' || apt.status === selectedStatus;
      const matchesDate = !dateFilter || apt.date === dateFilter;

      return matchesSearch && matchesDept && matchesStatus && matchesDate;
    });
  }, [appointments, searchQuery, selectedDept, selectedStatus, dateFilter]);

  // Metrics
  const totalCount = appointments.length;
  const confirmedCount = appointments.filter(a => a.status === 'Confirmed').length;
  const completedCount = appointments.filter(a => a.status === 'Completed').length;
  const rescheduledCount = appointments.filter(a => a.status === 'Rescheduled').length;
  const cancelledCount = appointments.filter(a => a.status === 'Cancelled').length;

  // Add Booking Submission from Admin end
  const handleCreateAdminBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName.trim() || !newPatientEmail.trim() || !newPatientPhone.trim()) {
      setAddModalError('Please fill in patient name, email, and phone number.');
      return;
    }

    const doctor = DOCTORS.find(d => d.id === newDoctorId) || modalDeptDoctors[0];
    const department = DEPARTMENTS.find(d => d.id === newDeptId) || DEPARTMENTS[0];

    setAddModalError(null);
    setIsSubmittingBooking(true);

    try {
      const newApt = await bookAppointment({
        patientName: newPatientName.trim(),
        patientEmail: newPatientEmail.trim(),
        patientPhone: newPatientPhone.trim(),
        patientDob: newPatientDob,
        doctorId: doctor.id,
        doctorName: doctor.name,
        doctorTitle: doctor.title,
        departmentId: department.id,
        departmentName: department.name,
        visitType: newVisitType,
        date: newDate,
        timeSlot: newTimeSlot,
        reason: newReason.trim() || 'Executive clinical scheduling',
        insuranceProvider: newInsurance.trim() || 'Hospital Staff / Primary Network',
        notes: newNotes.trim()
      });

      setIsSubmittingBooking(false);
      setIsAddModalOpen(false);
      showToast(`Appointment created for ${newApt.patientName} (Ref: ${newApt.bookingRef}) and stored in Firebase.`);

      // Reset form
      setNewPatientName('');
      setNewPatientEmail('');
      setNewPatientPhone('');
    } catch {
      setAddModalError('Failed to save appointment to Firebase. Please try again.');
      setIsSubmittingBooking(false);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Booking Ref', 'Patient Name', 'Patient Email', 'Patient Phone', 'Doctor', 'Department', 'Date', 'Time Slot', 'Visit Type', 'Status', 'Notes'];
    const rows = filteredAppointments.map(a => [
      a.bookingRef,
      `"${a.patientName}"`,
      a.patientEmail,
      a.patientPhone,
      `"${a.doctorName}"`,
      `"${a.departmentName}"`,
      a.date,
      a.timeSlot,
      a.visitType,
      a.status,
      `"${(a.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `LifeWell_Appointments_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // IF SIGNED IN BUT NOT AN ADMIN: Show Access Denied Screen
  if (user && !isAdmin) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-rose-200 text-center space-y-5 animate-in fade-in duration-200">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200 shadow-xs">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider font-extrabold text-rose-700 bg-rose-100 px-3 py-1 rounded-full inline-block">
              Access Denied
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 font-heading mt-2">
              Administrator Privileges Required
            </h2>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Signed in as <strong className="text-slate-900">{user.email}</strong>. This account does not possess clinical administration authorization.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={logout}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-xs transition-colors shadow-xs"
            >
              Sign Out & Switch Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // IF NOT AUTHENTICATED AS ADMIN: Show Secure Admin Login Screen
  if (!isAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-200 space-y-6 animate-in fade-in duration-200">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 text-teal-400 flex items-center justify-center mx-auto shadow-md border border-slate-700">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <span className="text-[11px] uppercase tracking-wider font-extrabold text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full inline-block">
              Authorized staff only
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 font-heading">
              LifeWell Medical Center
            </h2>
            <p className="text-sm font-semibold text-teal-700">
              Admin Portal
            </p>
            <p className="text-xs text-slate-500">
              Secure clinical administration desk and patient management system.
            </p>
          </div>

          {authError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{authError}</span>
            </div>
          )}

          {resetStatus && (
            <div className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 ${
              resetStatus.type === 'success' 
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
                : 'bg-rose-50 border border-rose-200 text-rose-700'
            }`}>
              {resetStatus.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              )}
              <span>{resetStatus.message}</span>
            </div>
          )}

          {!isForgotPasswordView ? (
            /* Standard Admin Login Form */
            <form onSubmit={handleAdminLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="name@lifewellmedical.org"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 text-slate-900 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter security password"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 text-slate-900 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 mt-2"
              >
                <span>{authLoading ? 'Verifying with Firebase...' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4 text-teal-400" />
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPasswordView(true);
                    setAuthError(null);
                    setResetStatus(null);
                  }}
                  className="text-xs font-semibold text-teal-700 hover:text-teal-800 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            </form>
          ) : (
            /* Forgot Password Form */
            <form onSubmit={handlePasswordResetSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 text-sm">
                  Reset Administrator Password
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Enter your registered administrator email address and Firebase Authentication will dispatch a secure password reset link.
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Administrator Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={resetEmailInput}
                    onChange={(e) => setResetEmailInput(e.target.value)}
                    placeholder="admin@lifewellmedical.org"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 text-slate-900 text-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-1">
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 rounded-xl shadow-xs transition-colors text-xs flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>{resetLoading ? 'Sending Reset Email...' : 'Send Password Reset Link'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPasswordView(false);
                    setResetStatus(null);
                  }}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl transition-colors text-xs text-center"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          )}

          <div className="text-center pt-2 border-t border-slate-100">
            <span className="text-[10px] text-slate-400 font-medium">
              LifeWell Central Hospital Administration • Firebase Authentication Protected
            </span>
          </div>
        </div>
      </div>
    );
  }

  // IF AUTHENTICATED AS ADMIN: Render Full Operations Command Center
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-24 right-4 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-bold animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Top Admin Header Bar */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white flex items-center justify-center font-bold text-2xl shadow-lg border-2 border-white/20">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold font-heading">Hospital Administration Portal</h1>
                <span className="bg-teal-500/20 text-teal-300 border border-teal-400/40 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                  Master Admin
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Firebase Synced
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Admin: <strong>{user?.name}</strong> • Account: <strong className="text-teal-300">{user?.email}</strong>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 border-slate-800 pt-4 lg:pt-0">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add New Booking</span>
            </button>

            <button
              onClick={loadAllAppointments}
              disabled={isLoadingAppointments}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors border border-white/15"
              title="Refresh from Firebase"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingAppointments ? 'animate-spin' : ''}`} />
              <span>Sync Database</span>
            </button>

            <button
              onClick={logout}
              className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-semibold px-4 py-2.5 rounded-xl text-xs transition-colors border border-rose-500/30"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400">Total Bookings</span>
          <p className="text-3xl font-extrabold text-slate-900 font-heading">{totalCount}</p>
          <span className="text-[11px] text-teal-600 font-semibold">All Departments</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-600">Confirmed Slots</span>
          <p className="text-3xl font-extrabold text-emerald-700 font-heading">{confirmedCount}</p>
          <span className="text-[11px] text-slate-500">Upcoming Patient Visits</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] uppercase tracking-wider font-bold text-blue-600">Completed Visits</span>
          <p className="text-3xl font-extrabold text-blue-700 font-heading">{completedCount}</p>
          <span className="text-[11px] text-slate-500">Past Consultations</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] uppercase tracking-wider font-bold text-amber-600">Rescheduled</span>
          <p className="text-3xl font-extrabold text-amber-700 font-heading">{rescheduledCount}</p>
          <span className="text-[11px] text-slate-500">Adjusted Time Slots</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1 col-span-2 sm:col-span-1">
          <span className="text-[11px] uppercase tracking-wider font-bold text-rose-600">Cancelled</span>
          <p className="text-3xl font-extrabold text-rose-700 font-heading">{cancelledCount}</p>
          <span className="text-[11px] text-slate-500">Open For Rebooking</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
        
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by patient name, booking ref (#LW-2026-XXXX), doctor, or email..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 text-xs text-slate-900"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Dept Filter */}
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden"
            >
              <option value="all">All Departments ({DEPARTMENTS.length})</option>
              {DEPARTMENTS.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden"
            >
              <option value="all">All Statuses</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed</option>
              <option value="Rescheduled">Rescheduled</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            {/* Date Filter */}
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden"
              title="Filter by appointment date"
            />

            {(searchQuery || selectedDept !== 'all' || selectedStatus !== 'all' || dateFilter) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedDept('all');
                  setSelectedStatus('all');
                  setDateFilter('');
                }}
                className="text-xs text-rose-600 hover:text-rose-700 font-bold px-2 py-1"
              >
                Reset Filters
              </button>
            )}

            <button
              onClick={handleExportCSV}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors border border-slate-200"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Action Controls Guide Banner */}
        <div className="p-3 bg-teal-50/70 border border-teal-200/80 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs text-teal-900">
          <div className="flex items-center gap-2">
            <span className="font-bold uppercase tracking-wider text-[10px] bg-teal-200 text-teal-900 px-2 py-0.5 rounded font-mono">
              Action Controls
            </span>
            <span className="text-slate-700">
              <strong>Status Dropdown:</strong> update appointment progress • <strong>Manage:</strong> reassign doctor, reschedule date/time slot, or edit patient details • <strong>Notes:</strong> clinical directives • <strong>Delete:</strong> permanent removal.
            </span>
          </div>
          <span className="text-[11px] text-teal-800 font-semibold">
            {filteredAppointments.length} record(s) matching
          </span>
        </div>

        {/* Bookings Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Booking Ref</th>
                <th className="py-3 px-4">Patient Information</th>
                <th className="py-3 px-4">Physician & Dept</th>
                <th className="py-3 px-4">Date & Slot</th>
                <th className="py-3 px-4">Format</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Actions & Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No bookings found matching your search criteria.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50/90 transition-colors">
                    
                    {/* Booking Ref */}
                    <td className="py-3.5 px-4 font-mono font-bold text-teal-800 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-teal-500" />
                        <span>{apt.bookingRef}</span>
                      </div>
                      <span className="block text-[10px] text-slate-400 font-normal mt-0.5">
                        {apt.createdAt ? new Date(apt.createdAt).toLocaleDateString() : 'Active'}
                      </span>
                    </td>

                    {/* Patient */}
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{apt.patientName}</p>
                      <p className="text-[11px] text-slate-500">{apt.patientEmail}</p>
                      <p className="text-[11px] text-slate-500">{apt.patientPhone}</p>
                    </td>

                    {/* Physician */}
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-800">{apt.doctorName}</p>
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                        {apt.departmentName.split('&')[0]}
                      </span>
                    </td>

                    {/* Date & Slot */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <p className="font-bold text-slate-900">{apt.date}</p>
                      <p className="text-teal-700 font-semibold">{apt.timeSlot}</p>
                    </td>

                    {/* Format */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded text-[11px] font-medium inline-block">
                        {apt.visitType}
                      </span>
                    </td>

                    {/* Status with Live Selector */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <select
                        value={apt.status}
                        onChange={(e) => {
                          const newStatus = e.target.value as any;
                          updateAppointmentStatus(apt.id, newStatus);
                          showToast(`Updated ${apt.bookingRef} status to ${newStatus}`);
                        }}
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg border focus:outline-hidden cursor-pointer shadow-2xs ${
                          apt.status === 'Confirmed'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : apt.status === 'Completed'
                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                            : apt.status === 'Rescheduled'
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : 'bg-rose-50 text-rose-800 border-rose-300'
                        }`}
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Rescheduled">Rescheduled</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    {/* Explicit, Interactive Actions */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        
                        {/* 1. Manage & Edit Button */}
                        <button
                          onClick={() => openEditDetailsModal(apt)}
                          className="px-2.5 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 hover:text-teal-900 border border-teal-200/90 rounded-lg text-xs font-bold flex items-center gap-1 transition-all shadow-2xs"
                          title="Open full editor: reschedule date, time slot, reassign doctor, or edit patient details"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-teal-600" />
                          <span>Manage</span>
                        </button>

                        {/* 2. Clinical Notes Button */}
                        <button
                          onClick={() => {
                            setEditingNotesApt(apt);
                            setNotesDraft(apt.notes || '');
                          }}
                          className={`px-2 py-1.5 border rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                            apt.notes
                              ? 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
                              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                          }`}
                          title="View / Edit internal doctor instructions and clinical notes"
                        >
                          <FileText className="w-3.5 h-3.5 text-slate-600" />
                          <span className="hidden sm:inline">Notes</span>
                          {apt.notes && <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />}
                        </button>

                        {/* 3. Delete Action */}
                        <button
                          onClick={() => setDeletingAptId(apt.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200"
                          title="Permanently Delete Booking Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
          <span>Showing {filteredAppointments.length} of {appointments.length} total hospital bookings</span>
          <span>Firebase Firestore: <strong>lifewellcare-21ee1</strong></span>
        </div>
      </div>

      {/* MODAL: FULL APPOINTMENT DETAILS & EDIT (THE MANAGE ACTION) */}
      {editingApt && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 my-8 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-100 px-2.5 py-0.5 rounded-full">
                    Appointment Management
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-600">
                    Ref: {editingApt.bookingRef}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 font-heading mt-1">
                  Manage & Edit Booking Details
                </h3>
              </div>
              <button
                onClick={() => setEditingApt(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFullEdit} className="space-y-4 text-xs">
              
              {/* Patient Profile */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
                  Patient Contact Information
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Patient Name</label>
                    <input
                      type="text"
                      required
                      value={editPatientName}
                      onChange={(e) => setEditPatientName(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={editPatientEmail}
                      onChange={(e) => setEditPatientEmail(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Mobile Phone</label>
                    <input
                      type="tel"
                      required
                      value={editPatientPhone}
                      onChange={(e) => setEditPatientPhone(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Department & Doctor Assignment */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
                  Physician & Clinical Department Assignment
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Department</label>
                    <select
                      value={editDeptId}
                      onChange={(e) => {
                        const newDept = e.target.value;
                        setEditDeptId(newDept);
                        const docsInDept = DOCTORS.filter(d => d.departmentId === newDept);
                        if (docsInDept.length > 0) {
                          setEditDoctorId(docsInDept[0].id);
                        }
                      }}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium text-slate-900"
                    >
                      {DEPARTMENTS.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Attending Physician</label>
                    <select
                      value={editDoctorId}
                      onChange={(e) => setEditDoctorId(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium text-slate-900"
                    >
                      {editModalDeptDoctors.map(doc => (
                        <option key={doc.id} value={doc.id}>{doc.name} - {doc.title.split('-')[0]}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Schedule, Format, Status */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
                  Schedule, Format & Progress Status
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Scheduled Date</label>
                    <input
                      type="date"
                      required
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Time Slot</label>
                    <select
                      value={editTimeSlot}
                      onChange={(e) => setEditTimeSlot(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium text-slate-900"
                    >
                      <option value="08:30 AM">08:30 AM</option>
                      <option value="09:15 AM">09:15 AM</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:15 AM">11:15 AM</option>
                      <option value="01:30 PM">01:30 PM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="02:15 PM">02:15 PM</option>
                      <option value="03:00 PM">03:00 PM</option>
                      <option value="04:30 PM">04:30 PM</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Visit Format</label>
                    <select
                      value={editVisitType}
                      onChange={(e) => setEditVisitType(e.target.value as any)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium text-slate-900"
                    >
                      <option value="In-Person">In-Person Consultation</option>
                      <option value="Video Consultation">Video Telehealth</option>
                      <option value="Follow-up">Follow-up Visit</option>
                      <option value="Second Opinion">Second Opinion</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Appointment Status</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as any)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-900"
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Completed">Completed</option>
                      <option value="Rescheduled">Rescheduled</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Chief Reason for Consultation</label>
                  <input
                    type="text"
                    value={editReason}
                    onChange={(e) => setEditReason(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Clinical Directives & Office Notes</label>
                  <textarea
                    rows={2}
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Internal room routing, preparatory notes..."
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Slip</span>
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingApt(null)}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingEdit}
                    className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-5 py-2 rounded-xl shadow-md transition-all flex items-center gap-1.5"
                  >
                    <span>{isSavingEdit ? 'Saving to Firebase...' : 'Save & Sync to Firebase'}</span>
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* MODAL: ADD NEW BOOKING FROM ADMIN END */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 my-8 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full">
                  Admin Scheduling Module
                </span>
                <h3 className="text-xl font-bold text-slate-900 font-heading mt-1">
                  Create New Hospital Appointment
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {addModalError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{addModalError}</span>
              </div>
            )}

            <form onSubmit={handleCreateAdminBooking} className="space-y-4 text-xs">
              
              {/* Patient Details */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
                  1. Patient Information
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Patient Full Name *</label>
                    <input
                      type="text"
                      required
                      value={newPatientName}
                      onChange={(e) => setNewPatientName(e.target.value)}
                      placeholder="e.g. Jonathan Davis"
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Patient Email Address *</label>
                    <input
                      type="email"
                      required
                      value={newPatientEmail}
                      onChange={(e) => setNewPatientEmail(e.target.value)}
                      placeholder="patient@example.com"
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Mobile Phone *</label>
                    <input
                      type="tel"
                      required
                      value={newPatientPhone}
                      onChange={(e) => setNewPatientPhone(e.target.value)}
                      placeholder="+1 (555) 010-8800"
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={newPatientDob}
                      onChange={(e) => setNewPatientDob(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Department & Doctor */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
                  2. Specialist & Department
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Clinical Department</label>
                    <select
                      value={newDeptId}
                      onChange={(e) => setNewDeptId(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium text-slate-900 focus:outline-hidden"
                    >
                      {DEPARTMENTS.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Assigned Attending Physician</label>
                    <select
                      value={newDoctorId}
                      onChange={(e) => setNewDoctorId(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium text-slate-900 focus:outline-hidden"
                    >
                      {modalDeptDoctors.map(doc => (
                        <option key={doc.id} value={doc.id}>{doc.name} - {doc.title.split('-')[0]}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Schedule, Format, and Notes */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
                  3. Appointment Logistics
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Visit Format</label>
                    <select
                      value={newVisitType}
                      onChange={(e) => setNewVisitType(e.target.value as any)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium text-slate-900 focus:outline-hidden"
                    >
                      <option value="In-Person">In-Person Consultation</option>
                      <option value="Video Consultation">Video Telehealth</option>
                      <option value="Follow-up">Follow-up Visit</option>
                      <option value="Second Opinion">Second Opinion</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Scheduled Date</label>
                    <input
                      type="date"
                      required
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium text-slate-900 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Time Slot</label>
                    <select
                      value={newTimeSlot}
                      onChange={(e) => setNewTimeSlot(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium text-slate-900 focus:outline-hidden"
                    >
                      <option value="08:30 AM">08:30 AM</option>
                      <option value="09:15 AM">09:15 AM</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:15 AM">11:15 AM</option>
                      <option value="01:30 PM">01:30 PM</option>
                      <option value="02:15 PM">02:15 PM</option>
                      <option value="03:00 PM">03:00 PM</option>
                      <option value="04:30 PM">04:30 PM</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Primary Insurance Carrier</label>
                    <input
                      type="text"
                      value={newInsurance}
                      onChange={(e) => setNewInsurance(e.target.value)}
                      placeholder="e.g. Aetna, BlueCross, Self-Pay"
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Reason for Visit</label>
                    <input
                      type="text"
                      value={newReason}
                      onChange={(e) => setNewReason(e.target.value)}
                      placeholder="Primary condition or symptoms"
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Administrative / Clinical Notes</label>
                  <textarea
                    rows={2}
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    placeholder="Internal instructions or room routing..."
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingBooking}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <span>{isSubmittingBooking ? 'Saving to Firebase...' : 'Confirm & Create Booking'}</span>
                  <Check className="w-4 h-4" />
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* MODAL: EDIT CLINICAL NOTES */}
      {editingNotesApt && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h4 className="font-bold text-base text-slate-900">
                  Clinical Notes: {editingNotesApt.patientName}
                </h4>
                <p className="text-xs text-slate-500">Ref: {editingNotesApt.bookingRef}</p>
              </div>
              <button onClick={() => setEditingNotesApt(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <textarea
              rows={4}
              value={notesDraft}
              onChange={(e) => setNotesDraft(e.target.value)}
              placeholder="Enter internal doctor instructions, room assignments, pre-op tests..."
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/20"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingNotesApt(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await updateAppointmentNotes(editingNotesApt.id, notesDraft);
                  setEditingNotesApt(null);
                  showToast('Clinical notes updated in Firestore.');
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DELETE CONFIRMATION */}
      {deletingAptId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-base text-slate-900">Delete Appointment Record?</h4>
              <p className="text-xs text-slate-500 mt-1">
                This will permanently delete the booking from the database. This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-center gap-2 pt-2">
              <button
                onClick={() => setDeletingAptId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await deleteAppointment(deletingAptId);
                  setDeletingAptId(null);
                  showToast('Appointment permanently removed from Firebase.');
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
