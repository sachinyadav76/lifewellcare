import React, { useState } from 'react';
import { 
  User, 
  Activity, 
  FileText, 
  Pill, 
  MessageSquare, 
  Calendar, 
  ShieldCheck, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  Download, 
  Send, 
  RefreshCw, 
  Lock, 
  LogOut, 
  PlusCircle, 
  Phone, 
  MapPin, 
  Heart,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  FileCheck,
  Stethoscope,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAppointments } from '../context/AppointmentContext';
import { MedicalRecord, Prescription } from '../types/hospital';

interface PatientPortalProps {
  onOpenBooking: () => void;
}

export const PatientPortal: React.FC<PatientPortalProps> = ({ onOpenBooking }) => {
  const { 
    user, 
    isAuthenticated, 
    logout, 
    openAuthModal, 
    userRecords, 
    userPrescriptions, 
    userVitals, 
    userMessages, 
    requestPrescriptionRefill, 
    sendMessageToDoctor 
  } = useAuth();

  const { appointments, cancelAppointment, rescheduleAppointment } = useAppointments();

  const [activeTab, setActiveTab] = useState<'overview' | 'records' | 'appointments' | 'prescriptions' | 'messages' | 'profile'>('overview');
  const [selectedRecordModal, setSelectedRecordModal] = useState<MedicalRecord | null>(null);
  const [newMessageText, setNewMessageText] = useState('');
  const [refillSuccessMsg, setRefillSuccessMsg] = useState<string | null>(null);

  // Reschedule state
  const [reschedulingAptId, setReschedulingAptId] = useState<string | null>(null);
  const [newRescheduleDate, setNewRescheduleDate] = useState('2026-10-20');
  const [newRescheduleTime, setNewRescheduleTime] = useState('02:00 PM');

  // Filter appointments for this user
  const userAppointments = appointments.filter(
    apt => !apt.patientId || (user && apt.patientId === user.id) || (user && apt.patientEmail.toLowerCase() === user.email.toLowerCase())
  );

  const upcomingAppointments = userAppointments.filter(apt => apt.status === 'Confirmed' || apt.status === 'Rescheduled');
  const pastAppointments = userAppointments.filter(apt => apt.status === 'Completed' || apt.status === 'Cancelled');

  const latestVitals = userVitals[0] || {
    bloodPressure: '118/76',
    heartRate: 68,
    temperature: '98.6°F',
    oxygenSaturation: 99,
    bloodGlucose: 92,
    weightLbs: 138,
    date: 'Recent'
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;
    sendMessageToDoctor(newMessageText);
    setNewMessageText('');
  };

  const handleRequestRefill = (rxId: string, rxName: string) => {
    requestPrescriptionRefill(rxId);
    setRefillSuccessMsg(`Refill request submitted to LifeWell Outpatient Pharmacy for ${rxName}. Your care team has been notified.`);
    setTimeout(() => setRefillSuccessMsg(null), 5000);
  };

  const handleConfirmReschedule = () => {
    if (!reschedulingAptId) return;
    rescheduleAppointment(reschedulingAptId, newRescheduleDate, newRescheduleTime);
    setReschedulingAptId(null);
  };

  // If not logged in, show secure login prompt with 1-click access
  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-8 h-8" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <span className="text-xs uppercase tracking-wider font-bold text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
              HIPAA Protected Access
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              LifeWell Patient EHR Portal
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Sign in to view your complete clinical health history, diagnostic lab results, active prescriptions, and communicate securely with your doctors.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => openAuthModal()}
              className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white font-bold px-8 py-3 rounded-xl shadow-md transition-all text-sm flex items-center justify-center gap-2"
            >
              <User className="w-4 h-4" />
              <span>Sign In to Patient Portal</span>
            </button>
            <button
              onClick={onOpenBooking}
              className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-6 py-3 rounded-xl transition-all text-sm flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4 text-teal-600" />
              <span>Book Appointment First</span>
            </button>
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>256-bit Bank Grade Health Encryption • Audit-Trail Verified</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Patient Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-teal-500/20">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold text-2xl shadow-lg border-2 border-white/20">
              {user.name.charAt(0)}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold font-heading">{user.name}</h1>
                <span className="bg-teal-500/20 text-teal-300 border border-teal-400/40 text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full">
                  ID: {user.id}
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                  Active Patient
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 pt-1">
                <span>DOB: <strong>{user.dob}</strong></span>
                <span>•</span>
                <span>Blood: <strong className="text-teal-300">{user.bloodType}</strong></span>
                <span>•</span>
                <span>PCP: <strong>{user.primaryDoctorName}</strong></span>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[11px] text-rose-300 bg-rose-950/60 border border-rose-800/80 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-rose-400" />
                  Allergies: {user.allergies.join(', ')}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-stretch lg:self-auto justify-between lg:justify-end border-t lg:border-t-0 border-white/10 pt-4 lg:pt-0">
            <button
              onClick={onOpenBooking}
              className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-colors"
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule Visit</span>
            </button>

            <button
              onClick={logout}
              className="bg-white/10 hover:bg-white/20 text-white font-medium px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors border border-white/15"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>

        </div>
      </div>

      {/* Refill Success Alert Banner */}
      {refillSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-center justify-between shadow-xs animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{refillSuccessMsg}</span>
          </div>
          <button onClick={() => setRefillSuccessMsg(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Portal Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200">
        {[
          { id: 'overview', label: 'Overview & Vitals', icon: Activity },
          { id: 'records', label: `Lab & Diagnostics (${userRecords.length})`, icon: FileText },
          { id: 'appointments', label: `Appointments (${upcomingAppointments.length} Active)`, icon: Calendar },
          { id: 'prescriptions', label: `Prescriptions (${userPrescriptions.length})`, icon: Pill },
          { id: 'messages', label: `Doctor Messages (${userMessages.length})`, icon: MessageSquare },
          { id: 'profile', label: 'Patient Demographics', icon: User },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Overview & Vitals */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Vitals Summary Cards */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
                <Activity className="w-5 h-5 text-teal-600" />
                Latest Vital Signs (Recorded on {latestVitals.date})
              </h3>
              <span className="text-xs text-slate-500">Auto-synced from outpatient check-in</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Blood Pressure</span>
                <p className="text-xl font-extrabold text-teal-800">{latestVitals.bloodPressure}</p>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold inline-block">
                  Optimal
                </span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Heart Rate</span>
                <p className="text-xl font-extrabold text-slate-800">{latestVitals.heartRate} <span className="text-xs font-normal text-slate-500">bpm</span></p>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold inline-block">
                  Normal Sinus
                </span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Oxygen Saturation</span>
                <p className="text-xl font-extrabold text-teal-800">{latestVitals.oxygenSaturation}%</p>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold inline-block">
                  Excellent
                </span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Blood Glucose</span>
                <p className="text-xl font-extrabold text-slate-800">{latestVitals.bloodGlucose} <span className="text-xs font-normal text-slate-500">mg/dL</span></p>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold inline-block">
                  Fasting Norm
                </span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Body Temp</span>
                <p className="text-xl font-extrabold text-slate-800">{latestVitals.temperature}</p>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold inline-block">
                  Afebrile
                </span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Weight</span>
                <p className="text-xl font-extrabold text-slate-800">{latestVitals.weightLbs} <span className="text-xs font-normal text-slate-500">lbs</span></p>
                <span className="text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded font-bold inline-block">
                  BMI 22.4 Normal
                </span>
              </div>
            </div>
          </div>

          {/* Quick Hub Grid: Next Appointment + Recent Prescription Refills + Recent Message */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Next Appointment Card */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-bold text-teal-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-teal-600" />
                    Next Scheduled Visit
                  </span>
                  <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-full">
                    Confirmed
                  </span>
                </div>

                {upcomingAppointments.length > 0 ? (
                  <div className="pt-3 space-y-2">
                    <h4 className="text-base font-bold text-slate-900">{upcomingAppointments[0].doctorName}</h4>
                    <p className="text-xs text-teal-700 font-semibold">{upcomingAppointments[0].departmentName}</p>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 text-xs text-slate-700 space-y-1">
                      <p><strong>Date:</strong> {upcomingAppointments[0].date} at {upcomingAppointments[0].timeSlot}</p>
                      <p><strong>Format:</strong> {upcomingAppointments[0].visitType}</p>
                      <p className="text-[11px] text-slate-500">{upcomingAppointments[0].notes}</p>
                    </div>
                  </div>
                ) : (
                  <div className="py-6 text-center text-xs text-slate-500">
                    No upcoming appointments.
                  </div>
                )}
              </div>

              <button
                onClick={() => setActiveTab('appointments')}
                className="w-full text-center py-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs font-bold text-teal-700 transition-colors"
              >
                Manage All Appointments
              </button>
            </div>

            {/* Prescriptions Quick Card */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Pill className="w-4 h-4 text-cyan-600" />
                    Active Medications
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {userPrescriptions.length} Active
                  </span>
                </div>

                <div className="pt-3 space-y-2.5">
                  {userPrescriptions.slice(0, 2).map(rx => (
                    <div key={rx.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-900">{rx.medicationName}</p>
                        <p className="text-[11px] text-slate-500">{rx.dosage} • {rx.frequency}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        rx.status === 'Refill Requested'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {rx.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setActiveTab('prescriptions')}
                className="w-full text-center py-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs font-bold text-cyan-700 transition-colors"
              >
                View Medication Refill Center
              </button>
            </div>

            {/* Direct Doctor Care Messenger */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-teal-600" />
                    Care Team Chat
                  </span>
                  <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-full">
                    Encrypted
                  </span>
                </div>

                <div className="pt-3 space-y-2">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Have non-emergency questions regarding current medication or recent diagnostic results? Send a secure message directly to <strong>{user.primaryDoctorName}</strong>.
                  </p>
                  <div className="p-2.5 bg-teal-50 rounded-xl text-xs text-teal-900 font-medium">
                    Typical response window: Under 4 business hours.
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('messages')}
                className="w-full text-center py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
              >
                Open Message Thread
              </button>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: Medical Records & Lab Reports (EHR) */}
      {activeTab === 'records' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 font-heading">
                Clinical Reports & Diagnostic Results
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Official electronic health records published by LifeWell laboratories and imaging suites.
              </p>
            </div>

            <button
              onClick={() => window.print()}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Export Full EHR Summary</span>
            </button>
          </div>

          <div className="space-y-4">
            {userRecords.map((record) => (
              <div
                key={record.id}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 hover:border-teal-300 hover:bg-white transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{record.title}</h4>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                          {record.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {record.department} • Ordered by {record.doctorName} • {record.facility}
                      </p>
                    </div>
                  </div>

                  <div className="text-right text-xs text-slate-500">
                    <span className="font-bold text-slate-700 block">{record.date}</span>
                    <span className="text-[11px] text-slate-400">{record.fileSize} PDF</span>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200/60 text-xs text-slate-700">
                  <p className="font-semibold text-slate-900 mb-1">Physician Interpretation Summary:</p>
                  <p className="leading-relaxed">{record.summary}</p>
                </div>

                {record.keyValues && record.keyValues.length > 0 && (
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                      Key Test Metrics & Normal Reference Ranges:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {record.keyValues.map((kv, ki) => (
                        <div key={ki} className="bg-white p-2.5 rounded-xl border border-slate-200/60 text-xs">
                          <span className="text-slate-500 text-[11px] block">{kv.metric}</span>
                          <div className="flex items-baseline justify-between mt-1">
                            <span className="text-base font-extrabold text-teal-900">{kv.value}</span>
                            <span className="text-[10px] text-slate-400">Ref: {kv.standardRange}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-1 border-t border-slate-200/60">
                  <button
                    onClick={() => setSelectedRecordModal(record)}
                    className="text-xs text-teal-700 font-bold hover:underline px-3 py-1.5"
                  >
                    View Official Lab Document
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Appointments */}
      {activeTab === 'appointments' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-heading">
                  Upcoming & Active Appointments ({upcomingAppointments.length})
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Manage your specialist appointments, reschedule slots, or add sessions to your calendar.
                </p>
              </div>

              <button
                onClick={onOpenBooking}
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Book New Appointment</span>
              </button>
            </div>

            {upcomingAppointments.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200/80 p-6 space-y-2">
                <Calendar className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-sm font-bold text-slate-700">No active upcoming appointments</p>
                <p className="text-xs text-slate-500">Need to see a specialist? Schedule an appointment anytime online.</p>
                <button
                  onClick={onOpenBooking}
                  className="mt-2 text-xs font-bold text-teal-700 bg-teal-50 px-4 py-2 rounded-xl hover:bg-teal-100"
                >
                  Book Specialist Now
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-teal-300 transition-all space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-teal-800 bg-teal-100 px-2.5 py-0.5 rounded-full">
                            {apt.departmentName}
                          </span>
                          <span className="text-xs font-mono font-bold text-slate-500">
                            Ref: {apt.bookingRef}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-slate-900 mt-1">{apt.doctorName}</h4>
                        <p className="text-xs text-slate-500 font-medium">{apt.doctorTitle}</p>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full inline-block ${
                          apt.status === 'Rescheduled' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {apt.status}
                        </span>
                        <p className="text-sm font-extrabold text-slate-900 mt-1">{apt.date}</p>
                        <p className="text-xs text-teal-800 font-bold">{apt.timeSlot} • {apt.visitType}</p>
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200/60 text-xs text-slate-700 space-y-1">
                      <p><strong>Chief Complaint / Reason:</strong> {apt.reason}</p>
                      {apt.notes && <p className="text-slate-500">{apt.notes}</p>}
                    </div>

                    <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-200/80">
                      <button
                        onClick={() => {
                          setReschedulingAptId(apt.id);
                          setNewRescheduleDate(apt.date);
                        }}
                        className="text-xs font-semibold text-slate-700 hover:text-teal-700 bg-white hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl transition-colors"
                      >
                        Reschedule Slot
                      </button>

                      <button
                        onClick={() => cancelAppointment(apt.id)}
                        className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-xl transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Past Appointments History */}
          {pastAppointments.length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-slate-900 font-heading">
                Past Consultations & Visits
              </h3>
              <div className="space-y-3">
                {pastAppointments.map(apt => (
                  <div key={apt.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-900">{apt.doctorName} • {apt.departmentName}</p>
                      <p className="text-slate-500">{apt.date} at {apt.timeSlot} • {apt.reason}</p>
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                      {apt.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Prescriptions & Refills */}
      {activeTab === 'prescriptions' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 font-heading">
                Active Medications & Pharmacy Refills
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Refill requests are routed electronically to LifeWell Outpatient Pharmacy and your primary doctor.
              </p>
            </div>

            <div className="text-xs text-slate-500">
              Preferred Pharmacy: <strong>LifeWell Central Pharmacy (100 LifeWell Way)</strong>
            </div>
          </div>

          <div className="space-y-4">
            {userPrescriptions.map((rx) => (
              <div
                key={rx.id}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 hover:border-teal-300 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center shrink-0">
                      <Pill className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900">{rx.medicationName}</h4>
                      <p className="text-xs font-semibold text-teal-800">{rx.dosage} • {rx.frequency}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Prescribed by {rx.prescribedBy} on {rx.prescribedDate}</p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full inline-block ${
                      rx.status === 'Refill Requested'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {rx.status}
                    </span>
                    <p className="text-xs text-slate-600 mt-1 font-medium">Refills Left: <strong>{rx.refillsRemaining}</strong></p>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200/60 text-xs text-slate-700">
                  <p className="font-semibold text-slate-900 mb-0.5">Instructions & Warnings:</p>
                  <p>{rx.instructions}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
                  <span className="text-[11px] text-slate-500">Valid through: {rx.endDate}</span>
                  
                  {rx.status === 'Active' ? (
                    <button
                      onClick={() => handleRequestRefill(rx.id, rx.medicationName)}
                      className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Request 30-Day Refill</span>
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                      Refill Pending Doctor Approval
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Doctor Messages */}
      {activeTab === 'messages' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 font-heading">
                Direct Care Team Messages
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Messaging with: <strong>{user.primaryDoctorName}</strong> (Chief of Cardiovascular Sciences)
              </p>
            </div>
            <span className="text-xs bg-teal-50 text-teal-800 border border-teal-200 font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              Physician Online
            </span>
          </div>

          {/* Message Thread */}
          <div className="space-y-4 max-h-[450px] overflow-y-auto p-4 bg-slate-50 rounded-2xl border border-slate-200">
            {userMessages.map((msg) => {
              const isPatient = msg.sender === 'patient';
              return (
                <div
                  key={msg.id}
                  className={`flex ${isPatient ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-md p-4 rounded-2xl text-xs space-y-1 shadow-2xs ${
                      isPatient
                        ? 'bg-teal-600 text-white rounded-br-xs'
                        : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 text-[10px] opacity-80 mb-1">
                      <span className="font-bold">{msg.senderName}</span>
                      <span>{msg.timestamp}</span>
                    </div>
                    <p className="leading-relaxed text-sm">{msg.text}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input Box */}
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={newMessageText}
              onChange={(e) => setNewMessageText(e.target.value)}
              placeholder="Ask a non-urgent question to your physician regarding medications or test results..."
              className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 text-sm text-slate-900"
            />
            <button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-3 rounded-xl shadow-md transition-colors flex items-center gap-2 text-sm"
            >
              <span>Send</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-[11px] text-slate-400 text-center">
            For medical emergencies, please do not use messaging. Dial 911 or visit our Emergency Department immediately.
          </p>
        </div>
      )}

      {/* TAB 6: Patient Demographics & Profile */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 font-heading">
              Patient Identification & Insurance Demographics
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Registered medical identification details on file at LifeWell Medical Center.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs">Patient Profile</h4>
              <div className="space-y-2">
                <div className="flex justify-between pb-1 border-b border-slate-200">
                  <span className="text-slate-500">Legal Name:</span>
                  <span className="font-bold text-slate-900">{user.name}</span>
                </div>
                <div className="flex justify-between pb-1 border-b border-slate-200">
                  <span className="text-slate-500">Patient EHR ID:</span>
                  <span className="font-mono font-bold text-teal-800">{user.id}</span>
                </div>
                <div className="flex justify-between pb-1 border-b border-slate-200">
                  <span className="text-slate-500">Date of Birth:</span>
                  <span className="font-bold text-slate-900">{user.dob}</span>
                </div>
                <div className="flex justify-between pb-1 border-b border-slate-200">
                  <span className="text-slate-500">Blood Group:</span>
                  <span className="font-bold text-teal-800">{user.bloodType}</span>
                </div>
                <div className="flex justify-between pb-1 border-b border-slate-200">
                  <span className="text-slate-500">Mobile Contact:</span>
                  <span className="font-bold text-slate-900">{user.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Email:</span>
                  <span className="font-bold text-slate-900">{user.email}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs">Insurance & Emergency</h4>
              <div className="space-y-2">
                <div className="flex justify-between pb-1 border-b border-slate-200">
                  <span className="text-slate-500">Insurance Plan:</span>
                  <span className="font-bold text-slate-900">{user.insuranceName}</span>
                </div>
                <div className="flex justify-between pb-1 border-b border-slate-200">
                  <span className="text-slate-500">Policy Member ID:</span>
                  <span className="font-mono font-bold text-slate-900">{user.insuranceId}</span>
                </div>
                <div className="flex justify-between pb-1 border-b border-slate-200">
                  <span className="text-slate-500">Emergency Contact:</span>
                  <span className="font-bold text-slate-900">{user.emergencyContact.name} ({user.emergencyContact.relationship})</span>
                </div>
                <div className="flex justify-between pb-1 border-b border-slate-200">
                  <span className="text-slate-500">Emergency Phone:</span>
                  <span className="font-bold text-slate-900">{user.emergencyContact.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Primary Physician:</span>
                  <span className="font-bold text-teal-800">{user.primaryDoctorName}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {reschedulingAptId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 font-heading">
              Reschedule Appointment
            </h3>
            <p className="text-xs text-slate-500">
              Select a new date and time for your specialist consultation.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">New Date</label>
                <input
                  type="date"
                  value={newRescheduleDate}
                  onChange={(e) => setNewRescheduleDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">New Time Slot</label>
                <select
                  value={newRescheduleTime}
                  onChange={(e) => setNewRescheduleTime(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="10:30 AM">10:30 AM</option>
                  <option value="11:45 AM">11:45 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="03:30 PM">03:30 PM</option>
                  <option value="04:45 PM">04:45 PM</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setReschedulingAptId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReschedule}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs"
              >
                Save New Time
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Record Document Modal View */}
      {selectedRecordModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                  {selectedRecordModal.type} Document
                </span>
                <h3 className="text-xl font-bold text-slate-900 font-heading mt-1">
                  {selectedRecordModal.title}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedRecordModal.department} • {selectedRecordModal.facility}
                </p>
              </div>
              <button
                onClick={() => setSelectedRecordModal(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-700 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span>Attending Specialist: <strong>{selectedRecordModal.doctorName}</strong></span>
                <span>Date: <strong>{selectedRecordModal.date}</strong></span>
              </div>
              <div>
                <p className="font-bold text-slate-900 mb-1">Clinical Evaluation:</p>
                <p className="leading-relaxed">{selectedRecordModal.summary}</p>
              </div>

              {selectedRecordModal.keyValues && (
                <div className="pt-2">
                  <p className="font-bold text-slate-900 mb-2">Metrics Summary:</p>
                  <div className="space-y-1.5">
                    {selectedRecordModal.keyValues.map((kv, i) => (
                      <div key={i} className="flex justify-between bg-white p-2 rounded-lg border border-slate-200/60">
                        <span>{kv.metric}</span>
                        <span className="font-bold text-teal-800">{kv.value} (Normal: {kv.standardRange})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 text-xs font-bold text-slate-700 border border-slate-300 rounded-xl hover:bg-slate-50 flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                Print / Save Document
              </button>
              <button
                onClick={() => setSelectedRecordModal(null)}
                className="px-5 py-2 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-xs"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
