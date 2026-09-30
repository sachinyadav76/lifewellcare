import React from 'react';
import { 
  Heart, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Award, 
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { DEPARTMENTS } from '../data/hospitalData';

interface FooterProps {
  onNavigate: (page: string) => void;
  onOpenBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenBooking }) => {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      {/* Quick Action Emergency Strip */}
      <div className="bg-teal-900/60 border-b border-teal-800/50 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-full bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300 shrink-0">
              <Phone className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h4 className="text-white font-bold text-lg">In Case of a Medical Emergency</h4>
              <p className="text-teal-200 text-sm">Call 911 immediately or reach our 24/7 Level 1 Trauma Center hotline at (800) 555-WELL</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenBooking}
              className="bg-white text-teal-950 hover:bg-teal-50 font-bold px-5 py-2.5 rounded-xl shadow-md text-sm transition-colors"
            >
              Schedule an Appointment
            </button>
            <button
              onClick={() => onNavigate('portal')}
              className="border border-teal-400/50 hover:bg-teal-800/40 text-teal-100 font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors"
            >
              Patient Portal
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1: About & Brand */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center text-white shadow-md">
                <Heart className="w-5 h-5 fill-white/20 stroke-[2.5]" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white font-heading">
                Life<span className="text-teal-400">Well</span> <span className="text-xs uppercase bg-teal-950 text-teal-300 border border-teal-800 px-2 py-0.5 rounded-full font-sans">Medical Center</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              LifeWell Medical Center is an internationally accredited academic healthcare facility dedicated to clinical excellence, compassionate patient outcomes, and innovative medical research.
            </p>

            <div className="space-y-2 pt-2 text-sm text-slate-300">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0" />
                <span>100 LifeWell Way, Metro Health District, NY 10024</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Main Operator: (800) 555-WELL / (555) 019-4800</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <span>care@lifewellmedical.org</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Emergency: 24/7/365 | Outpatient: Mon - Sat 7am - 8pm</span>
              </div>
            </div>

            {/* Accreditations badges */}
            <div className="pt-3">
              <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2">Accreditations & Honors</p>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-md text-slate-300 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-400" /> JCAHO Gold Seal
                </span>
                <span className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-md text-slate-300 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-400" /> Magnet Nursing Recognized
                </span>
                <span className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-md text-slate-300">
                  Level 1 Adult & Pediatric Trauma
                </span>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h5 className="text-white font-bold text-base mb-4 font-heading border-b border-slate-800 pb-2">
              Explore LifeWell
            </h5>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'Home Page', id: 'home' },
                { label: 'About LifeWell', id: 'about' },
                { label: 'Clinical Departments', id: 'departments' },
                { label: 'Our Medical Doctors', id: 'doctors' },
                { label: 'Patient Portal Login', id: 'portal' },
              ].map(link => (
                <li key={link.id}>
                  <button
                    onClick={() => {
                      onNavigate(link.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-teal-400 transition-colors flex items-center gap-1.5 text-slate-400"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Key Departments */}
          <div>
            <h5 className="text-white font-bold text-base mb-4 font-heading border-b border-slate-800 pb-2">
              Key Departments
            </h5>
            <ul className="space-y-2.5 text-sm text-slate-400">
              {DEPARTMENTS.slice(0, 6).map(dept => (
                <li key={dept.id}>
                  <button
                    onClick={() => {
                      onNavigate('departments');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-teal-400 transition-colors text-left flex items-center gap-1.5 truncate max-w-full"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    <span className="truncate">{dept.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Patient Services */}
          <div>
            <h5 className="text-white font-bold text-base mb-4 font-heading border-b border-slate-800 pb-2">
              Patient Services
            </h5>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <button onClick={onOpenBooking} className="hover:text-teal-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  Online Appointment Booking
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('portal')} className="hover:text-teal-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  Health Records & Labs
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('portal')} className="hover:text-teal-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  Prescription Refills
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('portal')} className="hover:text-teal-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  Message Your Care Team
                </button>
              </li>
              <li>
                <span className="text-slate-500 flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-700" />
                  Accepted Insurances & Billing
                </span>
              </li>
              <li>
                <span className="text-slate-500 flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-700" />
                  Visiting Hours & Parking Guide
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright and disclaimer */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 LifeWell Medical Center. All rights reserved. HIPAA Compliant & Secure.</p>
          <div className="flex flex-wrap gap-4">
            <span className="hover:underline cursor-pointer">Privacy Practices (HIPAA)</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">Patient Rights & Responsibilities</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">Non-Discrimination Notice</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">Accessibility</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
