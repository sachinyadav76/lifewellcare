import React from 'react';
import { 
  X, 
  Star, 
  MapPin, 
  GraduationCap, 
  Clock, 
  Languages, 
  CheckCircle, 
  Calendar, 
  Award,
  Stethoscope
} from 'lucide-react';
import { Doctor } from '../types/hospital';

interface DoctorDetailModalProps {
  doctor: Doctor | null;
  onClose: () => void;
  onBookDoctor: (doctor: Doctor) => void;
}

export const DoctorDetailModal: React.FC<DoctorDetailModalProps> = ({
  doctor,
  onClose,
  onBookDoctor
}) => {
  if (!doctor) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
      >
        {/* Header with doctor image and essentials */}
        <div className="relative bg-gradient-to-r from-teal-900 to-slate-900 text-white p-6 sm:p-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close doctor details"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative">
              <img
                src={doctor.image}
                alt={doctor.name}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover border-4 border-white/20 shadow-xl"
              />
              <span className="absolute -bottom-2 -right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-slate-900 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                Available
              </span>
            </div>

            <div className="text-center sm:text-left space-y-1.5 flex-1">
              <span className="inline-block bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {doctor.departmentName}
              </span>
              <h3 className="text-2xl font-bold font-heading">{doctor.name}</h3>
              <p className="text-sm text-slate-300 font-medium">{doctor.title}</p>
              
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-slate-300">
                <span className="flex items-center gap-1 text-amber-300 font-bold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  {doctor.rating} ({doctor.reviewCount} verified reviews)
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-teal-400" />
                  {doctor.experienceYears}+ Years Clinical Practice
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-teal-400" />
                  {doctor.officeLocation}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Biography */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">
              Clinical Background & Philosophy
            </h4>
            <p className="text-slate-700 text-sm leading-relaxed">
              {doctor.bio}
            </p>
          </div>

          {/* Specialties Badges */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Areas of Specialization
            </h4>
            <div className="flex flex-wrap gap-2">
              {doctor.specialties.map((spec, i) => (
                <span
                  key={i}
                  className="bg-teal-50 text-teal-800 border border-teal-200/80 px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                  {spec}
                </span>
              ))}
            </div>
          </div>

          {/* Education & Fellowships */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/70">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-1">
                <GraduationCap className="w-4 h-4 text-teal-600" />
                Medical School & Fellowship
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {doctor.education}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-1">
                <Languages className="w-4 h-4 text-teal-600" />
                Spoken Languages
              </div>
              <p className="text-xs text-slate-600 font-medium">
                {doctor.languages.join(', ')}
              </p>
            </div>
          </div>

          {/* Available Clinic Days & Consultation Fee */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-teal-50/50 border border-teal-100 text-xs">
            <div>
              <span className="font-bold text-slate-800 block mb-1">Regular Clinic Days:</span>
              <div className="flex flex-wrap gap-1.5">
                {doctor.availableDays.map(day => (
                  <span key={day} className="bg-white px-2 py-0.5 rounded shadow-2xs border border-teal-200 text-teal-900 font-medium">
                    {day}
                  </span>
                ))}
              </div>
            </div>

            <div className="sm:text-right">
              <span className="text-slate-500 block">Standard Consultation Fee:</span>
              <span className="text-lg font-bold text-teal-800">${doctor.consultationFee}</span>
              <span className="text-[11px] text-slate-500 block">Covered by most major insurances</span>
            </div>
          </div>

          {/* Awards if any */}
          {doctor.awards && doctor.awards.length > 0 && (
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">
                Honors & Accolades
              </h4>
              <div className="space-y-1.5">
                {doctor.awards.map((award, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                    <Award className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>{award}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer / Action */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
          
          <button
            onClick={() => {
              onClose();
              onBookDoctor(doctor);
            }}
            className="flex-1 sm:flex-none bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Appointment with {doctor.name}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
