import React, { useState } from 'react';
import { 
  Heart, 
  Calendar, 
  UserCheck, 
  Activity, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  Award, 
  CheckCircle2, 
  PhoneCall, 
  Search, 
  Star, 
  ChevronRight,
  Stethoscope,
  Brain,
  Baby,
  ShieldAlert,
  Siren,
  Flower2,
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import { DEPARTMENTS, DOCTORS, HOSPITAL_STATS, FAQS } from '../data/hospitalData';
import { Doctor } from '../types/hospital';

interface HomeProps {
  onNavigate: (page: string) => void;
  onOpenBookingWithDoctor: (doctorId: string, deptId?: string) => void;
  onSelectDoctorDetail: (doctor: Doctor) => void;
}

export const Home: React.FC<HomeProps> = ({
  onNavigate,
  onOpenBookingWithDoctor,
  onSelectDoctorDetail
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('all');

  // Featured doctors for the home preview
  const featuredDoctors = DOCTORS.slice(0, 4);

  return (
    <div className="space-y-16 md:space-y-24 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-12 pb-20 lg:py-28">
        {/* Subtle background glow & medical grid pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold backdrop-blur-xs">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                Ranked #1 Regional Hospital in Patient Safety & Clinical Outcomes
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight font-heading text-white">
                Compassionate Care. <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-cyan-300 to-teal-400">
                  Advanced Medicine.
                </span> <br />
                Human Touch.
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Welcome to <strong>LifeWell Medical Center</strong>, where leading board-certified physicians, state-of-the-art robotic surgery, and personalized digital health records converge to deliver healthcare without boundaries.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => onNavigate('booking')}
                  className="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-teal-500/25 transition-all flex items-center justify-center gap-2 group active:scale-95"
                >
                  <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Book an Appointment</span>
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigate('doctors')}
                  className="w-full sm:w-auto bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold px-6 py-3.5 rounded-xl backdrop-blur-xs transition-all flex items-center justify-center gap-2"
                >
                  <Stethoscope className="w-5 h-5 text-teal-300" />
                  <span>Meet Our Doctors</span>
                </button>

                <button
                  onClick={() => onNavigate('portal')}
                  className="w-full sm:w-auto text-slate-300 hover:text-white font-medium px-4 py-3 flex items-center justify-center gap-1.5 text-sm transition-colors"
                >
                  <Activity className="w-4 h-4 text-teal-400" />
                  <span>Patient Portal Login</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  Same-Day Specialist Slots
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-400" />
                  HIPAA-Protected Health Records
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-teal-400" />
                  24/7 Level 1 Trauma Center
                </span>
              </div>
            </div>

            {/* Right Interactive Card / Visual */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-slate-800/50 backdrop-blur-md">
                  <img
                    src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=80"
                    alt="LifeWell Medical Center Doctors and Patient Care"
                    className="w-full h-80 sm:h-96 object-cover opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                  {/* Floating Notification Cards on Hero */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-4 text-slate-900 shadow-xl border border-white/40">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                          Live Hospital Status
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-slate-500">Updated just now</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-left pt-1">
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                        <p className="text-[11px] text-slate-500">ER Wait Time</p>
                        <p className="text-lg font-bold text-teal-800">12 mins</p>
                        <p className="text-[10px] text-slate-400">Immediate Triage</p>
                      </div>

                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                        <p className="text-[11px] text-slate-500">Specialists on Duty</p>
                        <p className="text-lg font-bold text-slate-800">28 Active</p>
                        <p className="text-[10px] text-slate-400">Across 8 Departments</p>
                      </div>
                    </div>

                    <button
                      onClick={() => onNavigate('booking')}
                      className="mt-3 w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>Check Open Appointments Today</span>
                      <ChevronRight className="w-3.5 h-3.5 text-teal-400" />
                    </button>
                  </div>
                </div>

                {/* Decorative floating badge */}
                <div className="hidden sm:flex absolute -top-4 -left-4 bg-teal-600 text-white p-3 rounded-2xl shadow-xl items-center gap-3 border border-teal-400/40">
                  <Award className="w-6 h-6 text-amber-300" />
                  <div>
                    <p className="text-xs font-bold leading-tight">Magnet Recognized</p>
                    <p className="text-[10px] text-teal-100">Excellence in Nursing</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Hospital Key Metrics Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 md:-mt-16 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80">
          {HOSPITAL_STATS.map((stat, i) => (
            <div key={i} className="text-center sm:text-left space-y-1 sm:border-r last:border-0 border-slate-100 sm:pr-4">
              <p className="text-3xl sm:text-4xl font-extrabold text-teal-700 font-heading">
                {stat.value}
              </p>
              <p className="text-xs sm:text-sm font-semibold text-slate-700">
                {stat.label}
              </p>
              <p className="text-[11px] text-slate-400">
                Audited clinical metric
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Services Navigation Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div 
            onClick={() => onNavigate('booking')}
            className="p-6 rounded-2xl bg-gradient-to-br from-teal-50 to-white border border-teal-200/80 hover:shadow-lg transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center mb-4 shadow-md group-hover:scale-105 transition-transform">
              <Calendar className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 font-heading group-hover:text-teal-700">
              Online Appointment Booking
            </h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Select your department, choose your preferred physician, and reserve in-person or video consultations in seconds.
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 mt-3 group-hover:translate-x-1 transition-transform">
              Book online <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div 
            onClick={() => onNavigate('doctors')}
            className="p-6 rounded-2xl bg-gradient-to-br from-cyan-50 to-white border border-cyan-200/80 hover:shadow-lg transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-cyan-600 text-white flex items-center justify-center mb-4 shadow-md group-hover:scale-105 transition-transform">
              <UserCheck className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 font-heading group-hover:text-cyan-700">
              Find a Doctor Directory
            </h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Explore 18+ board-certified medical specialists across 8 departments, view verified bios, and check availability.
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-cyan-700 mt-3 group-hover:translate-x-1 transition-transform">
              Search physicians <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div 
            onClick={() => onNavigate('portal')}
            className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-white border border-blue-200/80 hover:shadow-lg transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-4 shadow-md group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 font-heading group-hover:text-blue-700">
              Patient EHR Portal
            </h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Securely access lab findings, echocardiograms, blood panels, medication refills, and direct doctor messaging.
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 mt-3 group-hover:translate-x-1 transition-transform">
              Sign in to records <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div 
            onClick={() => onNavigate('about')}
            className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-200/80 hover:shadow-lg transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-4 shadow-md group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 font-heading group-hover:text-emerald-700">
              About LifeWell Center
            </h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Learn about our 35-year medical heritage, robotic surgical facilities, leadership team, and community care.
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 mt-3 group-hover:translate-x-1 transition-transform">
              Discover our story <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </section>

      {/* Departments Showcase Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-teal-700 font-bold uppercase tracking-wider text-xs">
              Specialized Clinical Excellence
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading mt-1">
              Our Medical Departments
            </h2>
            <p className="text-slate-600 text-sm max-w-xl mt-1.5">
              Each clinical department at LifeWell is staffed by multiple board-certified specialists, equipped with cutting-edge diagnostics.
            </p>
          </div>

          <button
            onClick={() => onNavigate('departments')}
            className="inline-flex items-center gap-2 text-sm font-bold text-teal-700 hover:text-teal-800 group"
          >
            <span>View All {DEPARTMENTS.length} Departments</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Departments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {DEPARTMENTS.map((dept) => {
            const deptDoctors = DOCTORS.filter(d => d.departmentId === dept.id);
            return (
              <div
                key={dept.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={dept.image}
                    alt={dept.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                  <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs text-slate-900 font-bold text-xs px-2.5 py-1 rounded-md shadow-xs flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-teal-600" />
                    {deptDoctors.length} Specialists On-Staff
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 font-heading group-hover:text-teal-700 transition-colors">
                      {dept.name}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                      {dept.tagline}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <button
                      onClick={() => onNavigate('departments')}
                      className="text-teal-700 font-bold hover:underline flex items-center gap-1"
                    >
                      Details & Services
                    </button>
                    <button
                      onClick={() => onOpenBookingWithDoctor('', dept.id)}
                      className="bg-slate-100 hover:bg-teal-50 text-slate-800 hover:text-teal-700 font-semibold px-2.5 py-1 rounded-lg transition-colors"
                    >
                      Book Dept
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Doctors Showcase */}
      <section className="bg-slate-100/70 py-16 sm:py-20 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-teal-700 font-bold uppercase tracking-wider text-xs">
                Compassionate Specialists
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading mt-1">
                Meet Our Leading Physicians
              </h2>
              <p className="text-slate-600 text-sm max-w-xl mt-1.5">
                Every department features multiple accomplished physicians dedicated to personalized treatment plans.
              </p>
            </div>

            <button
              onClick={() => onNavigate('doctors')}
              className="inline-flex items-center gap-2 text-sm font-bold text-teal-700 hover:text-teal-800 group"
            >
              <span>View Full Directory ({DOCTORS.length} Doctors)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDoctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                <div className="relative h-64 overflow-hidden bg-slate-200">
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-slate-800 text-[11px] font-bold px-2 py-0.5 rounded-full shadow-2xs">
                    {doc.departmentName.split('&')[0]}
                  </span>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="flex items-center gap-1 text-xs text-amber-300 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {doc.rating} ({doc.reviewCount} reviews)
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                      {doc.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5 line-clamp-1">
                      {doc.title}
                    </p>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                      {doc.bio}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                    <button
                      onClick={() => onSelectDoctorDetail(doc)}
                      className="text-xs text-slate-600 hover:text-teal-700 font-semibold text-center py-1 transition-colors"
                    >
                      View Full Clinical Bio
                    </button>
                    <button
                      onClick={() => onOpenBookingWithDoctor(doc.id, doc.departmentId)}
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book with {doc.name.split(' ')[1]}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose LifeWell Feature Matrix */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-teal-700 font-bold uppercase tracking-wider text-xs">
            The LifeWell Advantage
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading mt-1">
            Setting the Benchmark in Patient-Centered Healthcare
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Combining academic medical rigor with human-centered empathy to provide exceptional care at every touchpoint.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-lg transition-all space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center">
              <Award className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-heading">
              Robotic & Minimally Invasive Precision
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Featuring Mako SmartRobotics for joint reconstruction and da Vinci Xi for thoracic and gynecologic surgery, delivering sub-millimeter surgical accuracy and cutting recovery times by 50%.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-lg transition-all space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center">
              <Clock className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-heading">
              12-Minute Average Emergency Triage
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Our Level 1 Trauma Center is staffed 24/7 by trauma surgeons, neurosurgeons, and interventional cardiologists ready within minutes. Rapid door-to-balloon heart attack time under 45 minutes.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-lg transition-all space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-heading">
              Connected Digital Health Records
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Our secure LifeWell Patient Portal gives patients real-time ownership over lab tests, echocardiograms, prescription refill requests, and direct encrypted chat with their care team.
            </p>
          </div>
        </div>
      </section>

      {/* Patient Portal CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl border border-teal-500/20">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-teal-500/10 blur-3xl pointer-events-none" />
          
          <div className="max-w-2xl space-y-4 relative z-10">
            <span className="inline-block bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs font-semibold px-3 py-1 rounded-full">
              Digital Health Dashboard
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white">
              Manage Your Health Records Seamlessly Online
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              LifeWell's Patient Portal empowers you with 24/7 access to your personal medical records, diagnostic imaging, doctor notes, vital trend charts, and hassle-free prescription refills.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-3">
              <button
                onClick={() => onNavigate('portal')}
                className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-6 py-3 rounded-xl transition-all shadow-lg text-sm flex items-center gap-2"
              >
                <Activity className="w-4 h-4" />
                <span>Open Patient Portal</span>
              </button>

              <button
                onClick={() => onNavigate('booking')}
                className="border border-white/30 hover:bg-white/10 text-white font-semibold px-6 py-3 rounded-xl transition-all text-sm flex items-center gap-2"
              >
                <Calendar className="w-4 h-4 text-teal-300" />
                <span>Book Appointment</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-teal-700 font-bold uppercase tracking-wider text-xs">
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 font-heading mt-1">
            Patient Support & Booking Inquiries
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-slate-800 hover:text-teal-700 transition-colors text-sm sm:text-base"
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle className="w-4 h-4 text-teal-600 shrink-0" />
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-teal-600' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-slate-600 text-sm leading-relaxed border-t border-slate-100">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
