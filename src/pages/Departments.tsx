import React, { useState } from 'react';
import { 
  DEPARTMENTS, 
  DOCTORS 
} from '../data/hospitalData';
import { Doctor, Department } from '../types/hospital';
import { 
  HeartPulse, 
  Brain, 
  Activity, 
  Baby, 
  ShieldAlert, 
  Siren, 
  Flower2, 
  Stethoscope, 
  CheckCircle2, 
  Star, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  UserCheck, 
  ChevronRight,
  Filter,
  Search
} from 'lucide-react';

interface DepartmentsProps {
  onOpenBookingWithDoctor: (doctorId: string, deptId?: string) => void;
  onSelectDoctorDetail: (doctor: Doctor) => void;
}

export const Departments: React.FC<DepartmentsProps> = ({
  onOpenBookingWithDoctor,
  onSelectDoctorDetail
}) => {
  const [selectedDeptId, setSelectedDeptId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDepartments = DEPARTMENTS.filter(dept => {
    const matchesSearch = 
      dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.keyServices.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      dept.commonConditions.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDept = selectedDeptId === 'all' || dept.id === selectedDeptId;

    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-12 pb-16">
      
      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-14 sm:py-18 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl">
          <span className="inline-block bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            Centers of Clinical Excellence
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
            Our Medical Departments
          </h1>
          <p className="text-base sm:text-lg text-slate-300 mt-3 leading-relaxed">
            LifeWell houses 8 specialized medical divisions. Each department is equipped with dedicated inpatient suites, modern diagnostics, and multiple board-certified specialists.
          </p>

          {/* Quick Search */}
          <div className="mt-8 max-w-lg mx-auto relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conditions, treatments (e.g. Heart, Knee, Asthma, MRI)..."
              className="w-full pl-11 pr-4 py-3 bg-white/10 hover:bg-white/15 focus:bg-white text-white focus:text-slate-900 placeholder:text-slate-400 border border-white/20 rounded-2xl focus:outline-hidden text-sm backdrop-blur-md transition-colors shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Department Quick Filter Buttons */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedDeptId('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
              selectedDeptId === 'all'
                ? 'bg-teal-600 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Departments ({DEPARTMENTS.length})
          </button>
          {DEPARTMENTS.map(dept => (
            <button
              key={dept.id}
              onClick={() => setSelectedDeptId(dept.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                selectedDeptId === dept.id
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {dept.name.split('&')[0]}
            </button>
          ))}
        </div>
      </section>

      {/* Main Department List with Multiple Doctors per Department */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {filteredDepartments.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
            <p className="text-slate-500 font-semibold text-base">No departments match your query.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedDeptId('all'); }}
              className="mt-3 text-sm text-teal-600 font-bold hover:underline"
            >
              Reset filters
            </button>
          </div>
        ) : (
          filteredDepartments.map((dept) => {
            const deptDoctors = DOCTORS.filter(doc => doc.departmentId === dept.id);

            return (
              <div
                key={dept.id}
                id={dept.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden"
              >
                {/* Department Header banner */}
                <div className="grid grid-cols-1 lg:grid-cols-12 bg-slate-50 border-b border-slate-200">
                  <div className="lg:col-span-8 p-6 sm:p-8 space-y-4">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="text-xs uppercase tracking-wider bg-teal-100 text-teal-800 font-bold px-3 py-1 rounded-full">
                        Clinical Division
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-teal-600" />
                        {dept.floor}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-teal-600" />
                        {dept.phoneExtension}
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
                      {dept.name}
                    </h2>
                    <p className="text-teal-800 font-medium text-sm">
                      {dept.tagline}
                    </p>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {dept.description}
                    </p>

                    <div className="pt-2 text-xs text-slate-700">
                      <span className="font-bold text-slate-900">Head of Department:</span>{' '}
                      <span className="text-teal-800 font-semibold">{dept.headOfDepartment}</span>
                    </div>
                  </div>

                  <div className="lg:col-span-4 h-48 lg:h-auto relative overflow-hidden">
                    <img
                      src={dept.image}
                      alt={dept.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent lg:hidden" />
                  </div>
                </div>

                {/* Key Services & Common Conditions Strip */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8 bg-slate-50/50 border-b border-slate-200/80 text-xs">
                  <div>
                    <h4 className="font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-teal-600" />
                      Key Clinical Services & Procedures
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {dept.keyServices.map((service, i) => (
                        <div key={i} className="flex items-center gap-2 text-slate-700 bg-white p-2 rounded-lg border border-slate-200/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
                          <span className="truncate">{service}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-cyan-600" />
                      Common Conditions Treated
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {dept.commonConditions.map((condition, i) => (
                        <span key={i} className="bg-cyan-50/80 text-cyan-900 border border-cyan-200/60 px-2.5 py-1 rounded-md font-medium">
                          {condition}
                        </span>
                      ))}
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-200">
                      <span className="font-bold text-slate-700 block mb-1">Advanced Technology on Unit:</span>
                      <p className="text-slate-500 text-[11px]">{dept.technologies.join(' • ')}</p>
                    </div>
                  </div>
                </div>

                {/* Assigned Doctors in this Department (Multiple per department!) */}
                <div className="p-6 sm:p-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
                        <UserCheck className="w-5 h-5 text-teal-600" />
                        Department Specialists ({deptDoctors.length} Doctors Available)
                      </h3>
                      <p className="text-xs text-slate-500">
                        Board-certified attending physicians accepting new patient appointments in {dept.name}.
                      </p>
                    </div>

                    <button
                      onClick={() => onOpenBookingWithDoctor('', dept.id)}
                      className="hidden sm:flex text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-3 py-1.5 rounded-lg transition-colors items-center gap-1"
                    >
                      <span>Book Any Specialist in {dept.name.split(' ')[0]}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
                    {deptDoctors.map((doc) => (
                      <div
                        key={doc.id}
                        className="bg-slate-50/70 hover:bg-white rounded-2xl p-4 border border-slate-200 hover:border-teal-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
                      >
                        <div className="flex items-start gap-4">
                          <img
                            src={doc.image}
                            alt={doc.name}
                            className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200 group-hover:scale-105 transition-transform"
                          />
                          <div className="space-y-1 flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-teal-700 transition-colors">
                              {doc.name}
                            </h4>
                            <p className="text-[11px] text-slate-500 line-clamp-1 font-medium">
                              {doc.title}
                            </p>
                            <div className="flex items-center gap-2 text-[11px] text-amber-500 font-bold">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              <span>{doc.rating} ({doc.reviewCount})</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 text-xs">
                          <div className="flex flex-wrap gap-1">
                            {doc.specialties.slice(0, 2).map((s, i) => (
                              <span key={i} className="bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded text-[10px] font-medium">
                                {s}
                              </span>
                            ))}
                          </div>
                          
                          <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                            <span>Days: {doc.availableDays.slice(0, 3).join(', ')}</span>
                            <span className="font-bold text-slate-700">${doc.consultationFee}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/80">
                          <button
                            onClick={() => onSelectDoctorDetail(doc)}
                            className="text-center py-1.5 px-2 bg-white hover:bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 border border-slate-200 transition-colors"
                          >
                            View Bio
                          </button>
                          <button
                            onClick={() => onOpenBookingWithDoctor(doc.id, dept.id)}
                            className="text-center py-1.5 px-2 bg-teal-600 hover:bg-teal-700 rounded-lg text-xs font-bold text-white shadow-xs transition-colors flex items-center justify-center gap-1"
                          >
                            <Calendar className="w-3 h-3" />
                            Book Slot
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </section>

    </div>
  );
};
