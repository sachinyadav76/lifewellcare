import React, { useState, useMemo } from 'react';
import { DOCTORS, DEPARTMENTS } from '../data/hospitalData';
import { Doctor } from '../types/hospital';
import { 
  Search, 
  Filter, 
  Star, 
  Calendar, 
  Clock, 
  MapPin, 
  Languages, 
  GraduationCap, 
  Award, 
  CheckCircle,
  X,
  Stethoscope,
  ChevronRight
} from 'lucide-react';

interface DoctorsProps {
  onOpenBookingWithDoctor: (doctorId: string, deptId?: string) => void;
  onSelectDoctorDetail: (doctor: Doctor) => void;
}

export const Doctors: React.FC<DoctorsProps> = ({
  onOpenBookingWithDoctor,
  onSelectDoctorDetail
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedDay, setSelectedDay] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const languagesList = ['English', 'Spanish', 'Mandarin', 'Arabic', 'Russian', 'Hindi', 'French'];

  const filteredDoctors = useMemo(() => {
    return DOCTORS.filter((doc) => {
      // Search text match
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        doc.name.toLowerCase().includes(query) ||
        doc.title.toLowerCase().includes(query) ||
        doc.departmentName.toLowerCase().includes(query) ||
        doc.specialties.some(s => s.toLowerCase().includes(query)) ||
        doc.bio.toLowerCase().includes(query);

      // Dept match
      const matchesDept = selectedDept === 'all' || doc.departmentId === selectedDept;

      // Day match
      const matchesDay = selectedDay === 'all' || doc.availableDays.includes(selectedDay);

      // Language match
      const matchesLanguage = selectedLanguage === 'all' || doc.languages.includes(selectedLanguage);

      return matchesSearch && matchesDept && matchesDay && matchesLanguage;
    });
  }, [searchQuery, selectedDept, selectedDay, selectedLanguage]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedDept('all');
    setSelectedDay('all');
    setSelectedLanguage('all');
  };

  const hasActiveFilters = searchQuery !== '' || selectedDept !== 'all' || selectedDay !== 'all' || selectedLanguage !== 'all';

  return (
    <div className="space-y-12 pb-16">
      
      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-14 sm:py-18 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl">
          <span className="inline-block bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            Physician Directory • {DOCTORS.length} Attending Specialists
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
            Meet Our Medical Doctors
          </h1>
          <p className="text-base sm:text-lg text-slate-300 mt-3 leading-relaxed">
            Find the right specialist for your healthcare journey. Every doctor at LifeWell is board-certified, fellowship-trained, and dedicated to compassionate, personalized outcomes.
          </p>

          {/* Quick Search Bar */}
          <div className="mt-8 max-w-xl mx-auto relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by physician name, specialty, or condition (e.g. Heart, Dr. Sterling, Knee)..."
              className="w-full pl-11 pr-10 py-3 bg-white/10 hover:bg-white/15 focus:bg-white text-white focus:text-slate-900 placeholder:text-slate-400 border border-white/20 rounded-2xl focus:outline-hidden text-sm backdrop-blur-md transition-all shadow-lg"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Filter Toolbar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <Filter className="w-4 h-4 text-teal-600" />
              Filter Physicians ({filteredDoctors.length} found)
            </div>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                Clear All Filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {/* Department Filter */}
            <div>
              <label className="block text-slate-500 font-bold mb-1">Clinical Department</label>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 font-medium text-slate-800"
              >
                <option value="all">All Departments ({DEPARTMENTS.length})</option>
                {DEPARTMENTS.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
            </div>

            {/* Day of Week */}
            <div>
              <label className="block text-slate-500 font-bold mb-1">Available Clinic Day</label>
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 font-medium text-slate-800"
              >
                <option value="all">Any Day of the Week</option>
                {daysOfWeek.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>

            {/* Spoken Language */}
            <div>
              <label className="block text-slate-500 font-bold mb-1">Spoken Language</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 font-medium text-slate-800"
              >
                <option value="all">All Languages</option>
                {languagesList.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Doctors Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredDoctors.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
            <Stethoscope className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No doctors match your criteria</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Try adjusting your search terms or clearing department and day filters to see more available physicians.
            </p>
            <button
              onClick={resetFilters}
              className="mt-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-xs"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Doctor Headshot & Top Details */}
                <div className="p-5 pb-3">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <img
                        src={doc.image}
                        alt={doc.name}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-slate-200 shadow-xs group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 border-2 border-white" title="Accepting Patients">
                        <CheckCircle className="w-3.5 h-3.5" />
                      </span>
                    </div>

                    <div className="space-y-1 flex-1 min-w-0">
                      <span className="inline-block bg-teal-50 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-teal-200">
                        {doc.departmentName.split('&')[0]}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors truncate">
                        {doc.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium line-clamp-1">
                        {doc.title}
                      </p>

                      <div className="flex items-center gap-3 pt-1 text-xs">
                        <span className="flex items-center gap-1 text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          {doc.rating}
                        </span>
                        <span className="text-slate-400">({doc.reviewCount} reviews)</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-600 font-medium">{doc.experienceYears}+ yrs</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-4 line-clamp-2 leading-relaxed">
                    {doc.bio}
                  </p>

                  {/* Specialties Pills */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {doc.specialties.map((spec, i) => (
                      <span
                        key={i}
                        className="bg-slate-100 text-slate-700 text-[11px] font-medium px-2 py-0.5 rounded-md"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>

                  {/* Office & Days details */}
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-teal-600" />
                        {doc.officeLocation}
                      </span>
                      <span className="flex items-center gap-1">
                        <Languages className="w-3.5 h-3.5 text-teal-600" />
                        {doc.languages.join(', ')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span>Clinic: {doc.availableDays.join(', ')}</span>
                      <span className="font-bold text-teal-800 text-xs">${doc.consultationFee}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="p-4 pt-2 bg-slate-50/80 border-t border-slate-100 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onSelectDoctorDetail(doc)}
                    className="w-full text-center py-2 px-3 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition-colors"
                  >
                    View Full Bio
                  </button>

                  <button
                    onClick={() => onOpenBookingWithDoctor(doc.id, doc.departmentId)}
                    className="w-full py-2 px-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Visit</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Directory Guarantees */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-teal-900 text-white rounded-3xl p-8 sm:p-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-4">
            <GraduationCap className="w-8 h-8 text-teal-300 shrink-0" />
            <div>
              <h4 className="font-bold text-base font-heading">Fellowship & Board Verified</h4>
              <p className="text-teal-200 text-xs mt-1 leading-relaxed">
                100% of LifeWell physicians maintain rigorous American Board certifications and continuing medical education.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Clock className="w-8 h-8 text-cyan-300 shrink-0" />
            <div>
              <h4 className="font-bold text-base font-heading">Prompt Specialist Access</h4>
              <p className="text-teal-200 text-xs mt-1 leading-relaxed">
                Urgent and second-opinion consultations prioritized within 24 to 48 business hours across all specialties.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Award className="w-8 h-8 text-amber-300 shrink-0" />
            <div>
              <h4 className="font-bold text-base font-heading">Direct Physician Messaging</h4>
              <p className="text-teal-200 text-xs mt-1 leading-relaxed">
                Once registered, message your doctor directly through our secure Patient EHR Portal for follow-up questions.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
