import React from 'react';
import { 
  ShieldCheck, 
  Award, 
  Heart, 
  Users, 
  Building2, 
  Microscope, 
  CheckCircle, 
  ArrowRight,
  Clock,
  Sparkles,
  Stethoscope
} from 'lucide-react';

interface AboutProps {
  onNavigate: (page: string) => void;
  onOpenBooking: () => void;
}

export const About: React.FC<AboutProps> = ({ onNavigate, onOpenBooking }) => {
  const leadership = [
    {
      name: 'Dr. Alistair Sterling, MD, MBA',
      role: 'Chief Executive Officer',
      image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=500&q=80',
      bio: 'Former Professor of Surgery at Johns Hopkins with 28 years of healthcare leadership experience directing top-tier academic hospital networks.'
    },
    {
      name: 'Dr. Evelyn Morales, MD, PhD',
      role: 'Chief Medical Officer',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=500&q=80',
      bio: 'Leading neurosurgeon and clinical quality pioneer overseeing medical protocols, patient safety indices, and credentialing across all 8 departments.'
    },
    {
      name: 'Eleanor Vance-Greene, DNP, RN',
      role: 'Chief Nursing Officer',
      image: 'https://images.unsplash.com/photo-1594824813583-4a6f7b9cf41d?auto=format&fit=crop&w=500&q=80',
      bio: 'Spearheaded LifeWell’s achievement of the prestigious Magnet Recognition for Nursing Excellence, representing the top 2% of healthcare nursing worldwide.'
    },
    {
      name: 'Dr. Robert Hensley, MD, FACP',
      role: 'Director of Clinical Research & Precision Oncology',
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=500&q=80',
      bio: 'Leads our 40+ clinical trials in genomic therapies and next-generation immunotherapy, bridging lab discoveries to bedside patient care.'
    }
  ];

  const facilities = [
    {
      title: '12 Hybrid Robotic Operating Theaters',
      desc: 'Equipped with intraoperative 3D imaging, laminar airflow, and Mako and da Vinci robotic systems for unparalleled surgical precision.',
      image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80'
    },
    {
      title: '240 Private Patient Healing Suites',
      desc: 'Designed with acoustic dampening, family sleeping alcoves, circadian lighting, and direct HEPA filtration to support restorative recovery.',
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80'
    },
    {
      title: 'Advanced Diagnostic Imaging Pavilion',
      desc: 'Featuring twin 3T Ultra-High Field MRI, 512-slice Spectral CT scanner, and digital 3D tomosynthesis breast imaging.',
      image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80'
    },
    {
      title: 'Level III Neonatal & Pediatric ICU',
      desc: 'Child-friendly specialized intensive care unit providing round-the-clock neonatologist monitoring for our tiniest fighters.',
      image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80'
    }
  ];

  return (
    <div className="space-y-16 md:space-y-24 pb-16">
      
      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl">
          <span className="inline-block bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            Since 1989 • 35+ Years of Healing
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
            About LifeWell Medical Center
          </h1>
          <p className="text-base sm:text-lg text-slate-300 mt-4 leading-relaxed">
            Founded on the principle that medicine should be both technologically uncompromising and deeply humane, LifeWell Medical Center has grown from a regional clinic into an internationally recognized center of clinical excellence.
          </p>
        </div>
      </section>

      {/* Mission, Vision & Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <Heart className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-heading">Our Mission</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              To deliver compassionate, world-class healthcare through personalized medicine, clinical innovation, and unwavering respect for every patient and family entrusted to our care.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold">
              <Microscope className="w-6 h-6 text-cyan-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-heading">Our Vision</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              To be the premier destination for advanced medical interventions, pioneering preventative health paradigms and making life-saving treatments accessible to our diverse global community.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-heading">Our Core Values</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Clinical Integrity, Empathy in Practice, Transparent Communication, Relentless Scientific Curiosity, and Dignity for every individual regardless of background.
            </p>
          </div>
        </div>
      </section>

      {/* Story & Heritage */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-teal-700 font-bold uppercase tracking-wider text-xs">
              Our Journey
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 font-heading">
              A Legacy of Pioneering Medicine & Community Service
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              In 1989, a dedicated group of seven physicians opened the doors of LifeWell with 40 patient beds and an unwavering vision: that patients in our region should never have to travel across states to access state-of-the-art cardiovascular and neurosurgical care.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              Over the last three decades, LifeWell has expanded to an 8-department medical center with 180+ board-certified physicians, 12 robotic surgical suites, and an accredited Comprehensive Stroke and Level 1 Trauma Center. Yet our fundamental ethos remains unchanged: every patient is treated like family.
            </p>

            <div className="pt-2 grid grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-teal-600" />
                <span>Non-Profit Community Focus</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-teal-600" />
                <span>Zero Hospital-Acquired Infection Award</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-teal-600" />
                <span>100% Green Energy Hospital Wing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-teal-600" />
                <span>Active Global Telemedicine Network</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200">
              <img
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=80"
                alt="LifeWell Medical Center Campus"
                className="w-full h-80 object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/80 p-4 text-white text-xs">
                <p className="font-bold">LifeWell Metro Campus Main Pavilion</p>
                <p className="text-slate-300">Modern 500,000 sq. ft. healthcare facility featuring natural light architecture.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities & Technology */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-teal-700 font-bold uppercase tracking-wider text-xs">
            Infrastructure & Equipment
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 font-heading mt-1">
            World-Class Hospital Facilities
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Engineered from the ground up for infection control, surgical precision, and restorative patient comfort.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {facilities.map((fac, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-lg transition-all flex flex-col">
              <div className="h-44 overflow-hidden">
                <img src={fac.image} alt={fac.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-base font-bold text-slate-900 font-heading">{fac.title}</h4>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{fac.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Executive & Clinical Leadership */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-teal-700 font-bold uppercase tracking-wider text-xs">
            Guiding Vision
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 font-heading mt-1">
            Executive & Clinical Leadership
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Distinguished medical clinicians and administrators dedicated to setting the standard of care.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {leadership.map((leader, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs text-center space-y-3">
              <img
                src={leader.image}
                alt={leader.name}
                className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-teal-500 shadow-md"
              />
              <div>
                <h4 className="text-base font-bold text-slate-900 font-heading">{leader.name}</h4>
                <p className="text-xs text-teal-700 font-semibold">{leader.role}</p>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{leader.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Box */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-teal-700 text-white rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-xl">
          <h2 className="text-3xl font-extrabold font-heading">
            Experience the LifeWell Standard of Care
          </h2>
          <p className="text-teal-100 text-sm max-w-xl mx-auto">
            Whether you need a routine health checkup, a second opinion with a renowned specialist, or urgent care, our teams are here for you.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <button
              onClick={onOpenBooking}
              className="bg-white text-teal-900 font-bold px-6 py-3 rounded-xl shadow-md hover:bg-teal-50 transition-colors text-sm"
            >
              Book an Appointment
            </button>
            <button
              onClick={() => onNavigate('doctors')}
              className="border border-white/40 hover:bg-white/10 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
            >
              Browse Doctor Directory
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
