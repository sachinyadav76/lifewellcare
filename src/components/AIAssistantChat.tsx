import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  CalendarPlus, 
  ExternalLink, 
  ChevronRight, 
  Phone, 
  Mail, 
  UserCheck, 
  ShieldCheck, 
  MapPin, 
  Star,
  ArrowRight,
  Maximize2,
  Minimize2,
  HelpCircle,
  Stethoscope
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAppointments } from '../context/AppointmentContext';
import { DOCTORS, DEPARTMENTS } from '../data/hospitalData';
import { Doctor, Appointment } from '../types/hospital';
import { 
  findDoctors, 
  findAvailableSlots, 
  getDoctorAvailability, 
  createAppointmentWithProtection, 
  downloadCalendarInvite,
  checkMedicalGuardrails,
  normalizeDate,
  getDayName,
  SlotAvailability
} from '../services/aiAppointmentService';
import confetti from 'canvas-confetti';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isDisclaimer?: boolean;
  recommendations?: Doctor[];
  availabilityResults?: SlotAvailability[];
  bookingSummary?: {
    doctor: Doctor;
    date: string;
    dayOfWeek: string;
    timeSlot: string;
  };
  confirmedAppointment?: Appointment;
  isDoubleBookedError?: boolean;
}

interface AIAssistantChatProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onNavigateToPortal: () => void;
  onNavigateToBooking?: (doctorId?: string, deptId?: string) => void;
}

export const AIAssistantChat: React.FC<AIAssistantChatProps> = ({
  isOpen,
  onToggle,
  onClose,
  onNavigateToPortal,
  onNavigateToBooking
}) => {
  const { user } = useAuth();
  const { addAppointment } = useAppointments();

  const [inputMessage, setInputMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // Active Draft state during conversational booking
  const [draftDoctor, setDraftDoctor] = useState<Doctor | null>(null);
  const [draftDate, setDraftDate] = useState<string>('');
  const [draftSlot, setDraftSlot] = useState<string>('');
  
  // Guest Patient Details state (if user is not authenticated)
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [detailsError, setDetailsError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isProcessing]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  // Pre-fill user profile if logged in
  useEffect(() => {
    if (user) {
      setGuestName(user.name || '');
      setGuestEmail(user.email || '');
      setGuestPhone(user.phone || '');
    }
  }, [user]);

  // Initial greeting
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome-1',
          sender: 'assistant',
          text: `Namaste & Welcome to LifeWell Medical Center! ✨ I am LifeWell AI, your personal appointment assistant.

I can understand English, Hindi, and Hinglish. How can I assist you with scheduling a specialist today?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, []);

  const quickPrompts = [
    'Mujhe skin doctor se appointment chahiye',
    'I need a cardiologist tomorrow evening',
    'Can I book Dr Sharma for Saturday?',
    'Show me available doctors for dental'
  ];

  // Call server-side /api/ai-assistant or execute client fallback
  const queryAIAssistant = async (userPrompt: string) => {
    try {
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userPrompt,
          conversationHistory: messages.slice(-5).map(m => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text
          })),
          patientContext: {
            name: user?.name || guestName || undefined,
            email: user?.email || guestEmail || undefined
          }
        })
      });

      if (!response.ok) {
        throw new Error('API server returned error');
      }

      const data = await response.json();
      return data;
    } catch {
      // Local natural language fallback parser
      const lower = userPrompt.toLowerCase();
      let dept: string | undefined = undefined;
      let docName: string | undefined = undefined;
      let dateStr: string | undefined = undefined;
      let timeRange: 'morning' | 'afternoon' | 'evening' | 'any' = 'any';

      if (lower.includes('skin') || lower.includes('chamdi') || lower.includes('derma') || lower.includes('acne') || lower.includes('pimple')) {
        dept = 'dermatology';
      } else if (lower.includes('heart') || lower.includes('cardio') || lower.includes('dil') || lower.includes('chest')) {
        dept = 'cardiology';
      } else if (lower.includes('dental') || lower.includes('teeth') || lower.includes('tooth') || lower.includes('daant') || lower.includes('dentist')) {
        dept = 'dental';
      } else if (lower.includes('brain') || lower.includes('neuro') || lower.includes('headache')) {
        dept = 'neurology';
      } else if (lower.includes('bone') || lower.includes('ortho') || lower.includes('knee') || lower.includes('joint')) {
        dept = 'orthopedics';
      }

      if (lower.includes('sharma')) docName = 'Sharma';
      if (lower.includes('sterling')) docName = 'Sterling';

      if (lower.includes('tomorrow') || lower.includes('kal')) {
        const tmrw = new Date();
        tmrw.setDate(tmrw.getDate() + 1);
        dateStr = tmrw.toISOString().split('T')[0];
      } else if (lower.includes('saturday') || lower.includes('shanivar')) {
        const now = new Date();
        let diff = 6 - now.getDay();
        if (diff <= 0) diff += 7;
        const sat = new Date(now);
        sat.setDate(sat.getDate() + diff);
        dateStr = sat.toISOString().split('T')[0];
      }

      if (lower.includes('evening') || lower.includes('shaam') || lower.includes('5 pm') || lower.includes('6 pm')) {
        timeRange = 'evening';
      } else if (lower.includes('morning') || lower.includes('subah')) {
        timeRange = 'morning';
      }

      const isHinglish = lower.includes('mujhe') || lower.includes('chahiye') || lower.includes('kal') || lower.includes('shaam') || lower.includes('hai');

      let reply = '';
      if (isHinglish) {
        reply = dept 
          ? `Main aapke liye ${dept} department ke real available doctors aur time slots search kar raha hoon.`
          : `Main LifeWell hospital me aapka doctor book karne me madad kar sakta hoon. Kripya department ya doctor ka naam batayein.`;
      } else {
        reply = dept
          ? `Searching real-time physician schedules for ${dept}...`
          : `I would be happy to help you find a doctor and schedule an appointment. What department or symptoms are you looking for?`;
      }

      return {
        reply,
        departmentId: dept,
        doctorName: docName,
        date: dateStr,
        timeRange
      };
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isProcessing) return;

    setInputMessage('');
    const userMsgId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsProcessing(true);

    try {
      // 1. Safety Guardrails Check
      const guardrail = checkMedicalGuardrails(text);

      // 2. Query AI Assistant Backend / NLP
      const aiResponse = await queryAIAssistant(text);

      // 3. Evaluate matching doctors and REAL doctor availability from Firestore
      const targetDept = aiResponse.departmentId || undefined;
      const targetDocName = aiResponse.doctorName || undefined;
      const targetDate = normalizeDate(aiResponse.date || draftDate || '');
      const targetTimeRange = aiResponse.timeRange || 'any';

      let matchingDoctors = findDoctors({
        departmentId: targetDept,
        specialty: aiResponse.specialty,
        query: targetDocName
      });

      // If user specifically asked for Dr Sharma and department wasn't isolated yet
      if (targetDocName?.toLowerCase().includes('sharma') && (!targetDept || targetDept === 'all')) {
        matchingDoctors = DOCTORS.filter(d => d.name.toLowerCase().includes('sharma'));
      }

      // Check Real Slot Availability
      let availabilityResults: SlotAvailability[] = [];
      if (matchingDoctors.length > 0) {
        const slotsPromises = matchingDoctors.slice(0, 3).map(doc => 
          getDoctorAvailability(doc.id, targetDate)
        );
        const resolved = await Promise.all(slotsPromises);
        availabilityResults = resolved.filter((r): r is SlotAvailability => r !== null);
      }

      // Prepare assistant reply message
      let replyText = aiResponse.reply || "Here are our available doctors and time slots matching your request:";
      if (guardrail.isDiagnosisRequest) {
        replyText = `${guardrail.disclaimer}\n\n${replyText}`;
      }

      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isDisclaimer: guardrail.isDiagnosisRequest,
        recommendations: matchingDoctors.length > 0 ? matchingDoctors.slice(0, 3) : undefined,
        availabilityResults: availabilityResults.length > 0 ? availabilityResults : undefined
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'assistant',
          text: "I encountered a minor connection glitch. Please select one of our clinical departments or ask again!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  // User selects a specific doctor and slot
  const handleSelectSlot = (doctor: Doctor, date: string, timeSlot: string) => {
    setDraftDoctor(doctor);
    setDraftDate(date);
    setDraftSlot(timeSlot);

    const dayName = getDayName(date);

    const summaryMsg: ChatMessage = {
      id: `summary-${Date.now()}`,
      sender: 'assistant',
      text: `Excellent choice! I have reserved this slot for review. Please verify your appointment details below and click **Confirm Appointment** to finalize your booking:`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      bookingSummary: {
        doctor,
        date,
        dayOfWeek: dayName,
        timeSlot
      }
    };

    setMessages(prev => [...prev, summaryMsg]);
  };

  // User clicks "Confirm Appointment"
  const handleConfirmBooking = async (summary: NonNullable<ChatMessage['bookingSummary']>) => {
    // Validate patient contact info
    const patientName = (user?.name || guestName).trim();
    const patientEmail = (user?.email || guestEmail).trim().toLowerCase();
    const patientPhone = (user?.phone || guestPhone).trim();

    if (!patientName) {
      setDetailsError('Please enter your full patient name.');
      return;
    }
    if (!patientEmail || !patientEmail.includes('@')) {
      setDetailsError('Please enter a valid email address for confirmation.');
      return;
    }
    if (!patientPhone || patientPhone.length < 7) {
      setDetailsError('Please enter a contact phone number.');
      return;
    }

    setDetailsError(null);
    setIsProcessing(true);

    try {
      // Execute Atomic Double-Booking Protection & Creation
      const confirmedApt = await createAppointmentWithProtection({
        patientId: user?.id || `guest-${Date.now()}`,
        patientName,
        patientEmail,
        patientPhone,
        doctorId: summary.doctor.id,
        date: summary.date,
        timeSlot: summary.timeSlot,
        visitType: 'In-Person',
        reason: 'Booked with LifeWell AI Appointment Assistant'
      });

      // Synchronize in AppointmentContext so it appears instantly across the entire app
      addAppointment(confirmedApt);

      // Celebrate with confetti
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#0d9488', '#06b6d4', '#10b981', '#3b82f6', '#f59e0b']
        });
      } catch {
        // ignore
      }

      // Add success confirmation message card
      const confirmCardMsg: ChatMessage = {
        id: `confirm-card-${Date.now()}`,
        sender: 'assistant',
        text: `🎉 Your appointment has been successfully scheduled and secured in our clinical database!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        confirmedAppointment: confirmedApt
      };

      setMessages(prev => [...prev, confirmCardMsg]);

      // Reset active draft
      setDraftDoctor(null);
      setDraftDate('');
      setDraftSlot('');

    } catch (err: any) {
      const isConflict = err?.message?.includes('DOUBLE_BOOKED');
      
      // Fetch fresh availability for this doctor
      const freshAvail = await getDoctorAvailability(summary.doctor.id, summary.date);

      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: isConflict 
          ? `Sorry, that time was just booked by another patient! Double-booking protection prevented a conflict. Here are the remaining available slots:`
          : `We could not complete this booking: ${err?.message || 'Database connection error'}. Please choose an alternative slot:`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isDoubleBookedError: true,
        availabilityResults: freshAvail ? [freshAvail] : undefined
      };

      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'assistant',
        text: `Namaste! Chat reset. How can I help you schedule an appointment today? You can type in English, Hindi, or Hinglish.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setDraftDoctor(null);
    setDraftDate('');
    setDraftSlot('');
    setDetailsError(null);
  };

  return (
    <>
      {/* Floating Trigger Button (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2 print:hidden">
        {!isOpen && (
          <button
            onClick={onToggle}
            className="group relative flex items-center gap-2.5 px-5 py-3.5 bg-gradient-to-r from-teal-600 via-teal-700 to-cyan-700 hover:from-teal-500 hover:to-cyan-600 text-white rounded-full shadow-2xl shadow-teal-900/30 hover:shadow-teal-600/40 border border-teal-400/40 transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-hidden focus:ring-4 focus:ring-teal-400/30"
            aria-label="Book with LifeWell AI"
          >
            {/* Pulsing beacon ping */}
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-200"></span>
            </span>

            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            <span className="font-bold text-sm tracking-wide">
              Book with LifeWell AI
            </span>
          </button>
        )}
      </div>

      {/* Modern Chat Panel */}
      {isOpen && (
        <div 
          className={`fixed z-50 transition-all duration-300 flex flex-col bg-white border border-slate-200/90 shadow-2xl overflow-hidden print:hidden
            ${isExpanded 
              ? 'inset-4 sm:inset-10 rounded-3xl' 
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-full sm:w-[440px] h-[92vh] sm:h-[640px] max-h-[92vh] rounded-3xl'
            }
          `}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-4 sm:p-5 relative border-b border-teal-800/40 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-teal-500/30">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-extrabold text-base tracking-tight text-white">
                      LifeWell AI
                    </h3>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30">
                      Live
                    </span>
                  </div>
                  <p className="text-xs text-teal-200 font-medium">
                    Your appointment assistant
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-slate-300">
                <button
                  onClick={resetChat}
                  title="Reset Conversation"
                  className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-xs flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  title={isExpanded ? 'Restore' : 'Expand'}
                  className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors hidden sm:block"
                >
                  {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={onClose}
                  title="Close Assistant"
                  className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Subtitle & Multilingual badge */}
            <div className="mt-2.5 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
              <span className="truncate pr-2">
                I can help you find a doctor and book an appointment.
              </span>
              <span className="shrink-0 bg-white/10 px-2 py-0.5 rounded-md text-[10px] text-teal-200 font-medium">
                English • हिंदी • Hinglish
              </span>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/60">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-2`}
              >
                {/* Text Bubble */}
                <div
                  className={`max-w-[88%] sm:max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-teal-600 text-white rounded-br-xs'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                  }`}
                >
                  {msg.isDisclaimer && (
                    <div className="mb-2 p-2 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>Clinical Notice:</strong> I can help you find the appropriate department or doctor, but I cannot diagnose medical conditions or prescribe treatments.
                      </span>
                    </div>
                  )}

                  <div className="whitespace-pre-line">{msg.text}</div>

                  <span className={`block text-[10px] mt-1.5 ${msg.sender === 'user' ? 'text-teal-100' : 'text-slate-400'} text-right`}>
                    {msg.timestamp}
                  </span>
                </div>

                {/* Doctor Recommendations Cards */}
                {msg.recommendations && msg.recommendations.length > 0 && !msg.bookingSummary && !msg.confirmedAppointment && (
                  <div className="w-full space-y-2.5 mt-1">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-1">
                      Matched Medical Specialists ({msg.recommendations.length})
                    </div>
                    {msg.recommendations.map(doc => (
                      <div
                        key={doc.id}
                        className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs hover:border-teal-300 transition-all text-xs"
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={doc.image}
                            alt={doc.name}
                            className="w-14 h-14 rounded-xl object-cover border border-slate-200"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="inline-block bg-teal-50 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-teal-200">
                              {doc.departmentName.split('&')[0]}
                            </span>
                            <h4 className="font-bold text-slate-900 text-sm mt-0.5 truncate">
                              {doc.name}
                            </h4>
                            <p className="text-[11px] text-slate-500 truncate">
                              {doc.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1 text-[11px]">
                              <span className="flex items-center gap-1 text-amber-500 font-bold">
                                <Star className="w-3 h-3 fill-amber-400" />
                                {doc.rating}
                              </span>
                              <span className="text-slate-400">•</span>
                              <span className="text-slate-600">Days: {doc.availableDays.join(', ')}</span>
                            </div>
                          </div>
                        </div>

                        {/* Real Slots for this doctor if provided */}
                        {msg.availabilityResults && (
                          <div className="mt-2.5 pt-2.5 border-t border-slate-100">
                            {(() => {
                              const avail = msg.availabilityResults?.find(a => a.doctor.id === doc.id);
                              if (!avail || avail.availableSlots.length === 0) {
                                return (
                                  <p className="text-[11px] text-slate-400 italic">
                                    No slots on this specific day ({doc.availableDays.join(', ')})
                                  </p>
                                );
                              }
                              return (
                                <div>
                                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 mb-1.5">
                                    <span>Available on {avail.dayOfWeek} ({avail.date}):</span>
                                    <span className="text-teal-700 font-bold">${doc.consultationFee}</span>
                                  </div>
                                  <div className="flex flex-wrap gap-1.5">
                                    {avail.availableSlots.slice(0, 6).map(slot => (
                                      <button
                                        key={slot}
                                        onClick={() => handleSelectSlot(doc, avail.date, slot)}
                                        className="px-2.5 py-1 bg-teal-50 hover:bg-teal-600 hover:text-white text-teal-800 font-semibold rounded-lg text-xs border border-teal-200 transition-colors"
                                      >
                                        {slot}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Explicit Booking Summary Card (Steps 8 & 9) */}
                {msg.bookingSummary && (
                  <div className="w-full bg-white border-2 border-teal-500/80 rounded-2xl p-4 shadow-lg text-xs space-y-3.5">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-1.5 font-bold text-teal-900 text-sm">
                        <Calendar className="w-4 h-4 text-teal-600" />
                        <span>Appointment Summary</span>
                      </div>
                      <span className="bg-teal-100 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Pending Confirmation
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-slate-700">
                      <div>
                        <span className="block text-[10px] text-slate-400 font-semibold uppercase">Doctor</span>
                        <span className="font-bold text-slate-900 text-xs">{msg.bookingSummary.doctor.name}</span>
                        <span className="block text-[11px] text-slate-500">{msg.bookingSummary.doctor.title}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-400 font-semibold uppercase">Department</span>
                        <span className="font-bold text-slate-900 text-xs">{msg.bookingSummary.doctor.departmentName}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-400 font-semibold uppercase">Date</span>
                        <span className="font-bold text-teal-800">{msg.bookingSummary.dayOfWeek}, {msg.bookingSummary.date}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-400 font-semibold uppercase">Time Slot</span>
                        <span className="font-bold text-teal-800">{msg.bookingSummary.timeSlot}</span>
                      </div>
                    </div>

                    {/* Patient Contact Inputs (Auto-filled if logged in, editable for guest) */}
                    <div className="pt-2 border-t border-slate-100 space-y-2">
                      <div className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                        <span>Patient Information:</span>
                        {user ? (
                          <span className="text-[10px] text-emerald-600 flex items-center gap-1 font-semibold">
                            <CheckCircle2 className="w-3 h-3" /> Signed in as {user.name}
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400">Guest Patient</span>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <input
                          type="text"
                          value={user?.name || guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          placeholder="Full Patient Name *"
                          disabled={!!user?.name}
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-teal-500"
                        />
                        <div className="grid grid-cols-2 gap-1.5">
                          <input
                            type="email"
                            value={user?.email || guestEmail}
                            onChange={(e) => setGuestEmail(e.target.value)}
                            placeholder="Email Address *"
                            disabled={!!user?.email}
                            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-teal-500"
                          />
                          <input
                            type="tel"
                            value={user?.phone || guestPhone}
                            onChange={(e) => setGuestPhone(e.target.value)}
                            placeholder="Phone Number *"
                            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-teal-500"
                          />
                        </div>
                      </div>

                      {detailsError && (
                        <p className="text-[11px] text-rose-600 font-semibold flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {detailsError}
                        </p>
                      )}
                    </div>

                    {/* Action Buttons: Confirm vs Change Selection */}
                    <div className="pt-2 flex items-center gap-2">
                      <button
                        onClick={() => handleConfirmBooking(msg.bookingSummary!)}
                        disabled={isProcessing}
                        className="flex-1 py-2.5 px-4 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
                      >
                        {isProcessing ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Securing Slot...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Confirm Appointment</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          setDraftDoctor(null);
                          setDraftSlot('');
                          handleSendMessage("Show me alternative doctors or time slots");
                        }}
                        disabled={isProcessing}
                        className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
                      >
                        Change Selection
                      </button>
                    </div>
                  </div>
                )}

                {/* Confirmed Appointment Card (Requirement 7) */}
                {msg.confirmedAppointment && (
                  <div className="w-full bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-900 text-white rounded-3xl p-5 shadow-2xl border border-teal-400/40 text-xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-teal-700/40">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-emerald-400/20 text-emerald-300 flex items-center justify-center border border-emerald-400/40">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-heading font-extrabold text-sm text-white">
                            ✓ Appointment Confirmed
                          </h4>
                          <p className="text-[10px] text-teal-200">
                            LifeWell Medical Center
                          </p>
                        </div>
                      </div>

                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-lg bg-teal-500/20 border border-teal-400/30 text-teal-300">
                        {msg.confirmedAppointment.bookingRef}
                      </span>
                    </div>

                    <div className="space-y-2 text-slate-200">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="block text-[10px] text-teal-300 uppercase font-semibold">Doctor:</span>
                          <span className="font-bold text-white text-xs">{msg.confirmedAppointment.doctorName}</span>
                          <span className="block text-[10px] text-slate-300">{msg.confirmedAppointment.doctorTitle}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-teal-300 uppercase font-semibold">Department:</span>
                          <span className="font-bold text-white text-xs">{msg.confirmedAppointment.departmentName}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div>
                          <span className="block text-[10px] text-teal-300 uppercase font-semibold">Date:</span>
                          <span className="font-bold text-white">{msg.confirmedAppointment.date}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-teal-300 uppercase font-semibold">Time:</span>
                          <span className="font-bold text-white">{msg.confirmedAppointment.timeSlot}</span>
                        </div>
                      </div>

                      <div className="pt-1">
                        <span className="block text-[10px] text-teal-300 uppercase font-semibold">Patient:</span>
                        <span className="font-bold text-white">{msg.confirmedAppointment.patientName}</span>
                        <span className="block text-[10px] text-slate-300">Confirmation sent to: {msg.confirmedAppointment.patientEmail}</span>
                      </div>
                    </div>

                    {/* Action Buttons for Confirmation Card */}
                    <div className="pt-2 border-t border-teal-700/40 grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <button
                        onClick={() => {
                          onClose();
                          onNavigateToPortal();
                        }}
                        className="py-2 px-2.5 bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold rounded-xl text-center transition-colors flex items-center justify-center gap-1 active:scale-95"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>View Visit</span>
                      </button>

                      <button
                        onClick={() => downloadCalendarInvite(msg.confirmedAppointment!)}
                        className="py-2 px-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-center transition-colors flex items-center justify-center gap-1 active:scale-95"
                      >
                        <CalendarPlus className="w-3.5 h-3.5 text-teal-300" />
                        <span>Add to Calendar</span>
                      </button>

                      <button
                        onClick={() => {
                          onClose();
                          onNavigateToPortal();
                        }}
                        className="py-2 px-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-center transition-colors flex items-center justify-center gap-1 active:scale-95"
                      >
                        <span>Patient Portal</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isProcessing && (
              <div className="flex items-center gap-2 text-slate-500 text-xs bg-white p-3 rounded-2xl w-fit border border-slate-200">
                <Sparkles className="w-4 h-4 text-teal-600 animate-spin" />
                <span>LifeWell AI is verifying real physician schedules...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Chips */}
          <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px] shrink-0 no-scrollbar">
            <span className="text-slate-400 font-bold text-[10px] uppercase shrink-0">Try:</span>
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                disabled={isProcessing}
                className="shrink-0 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-700 border border-slate-200 transition-colors truncate max-w-[210px]"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 sm:p-4 bg-white border-t border-slate-200 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask in English, Hindi, or Hinglish (e.g. 'Skin doctor chahiye')..."
                disabled={isProcessing}
                className="flex-1 px-4 py-2.5 bg-slate-100 focus:bg-white text-slate-900 placeholder:text-slate-400 rounded-2xl text-xs sm:text-sm border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 transition-all"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isProcessing}
                className="p-2.5 sm:px-4 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white rounded-2xl transition-all shadow-md active:scale-95 flex items-center gap-1 text-xs font-bold"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
