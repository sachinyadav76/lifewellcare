import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { AppointmentProvider } from './context/AppointmentContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { DoctorDetailModal } from './components/DoctorDetailModal';
import { AIAssistantChat } from './components/AIAssistantChat';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Departments } from './pages/Departments';
import { Doctors } from './pages/Doctors';
import { AppointmentBooking } from './pages/AppointmentBooking';
import { PatientPortal } from './pages/PatientPortal';
import { AdminPortal } from './pages/AdminPortal';
import { Doctor } from './types/hospital';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [preselectedDoctorId, setPreselectedDoctorId] = useState<string | null>(null);
  const [preselectedDeptId, setPreselectedDeptId] = useState<string | null>(null);
  const [selectedDoctorDetail, setSelectedDoctorDetail] = useState<Doctor | null>(null);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);

  const handleOpenBooking = () => {
    setPreselectedDoctorId(null);
    setPreselectedDeptId(null);
    setCurrentPage('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBookingWithDoctor = (doctorId: string, deptId?: string) => {
    setPreselectedDoctorId(doctorId || null);
    if (deptId) setPreselectedDeptId(deptId);
    setCurrentPage('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectDoctorDetail = (doctor: Doctor) => {
    setSelectedDoctorDetail(doctor);
  };

  return (
    <AuthProvider>
      <AppointmentProvider>
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-teal-600 selection:text-white">
          
          {/* Main Navigation */}
          <Navbar
            currentPage={currentPage}
            setCurrentPage={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenBooking={handleOpenBooking}
          />

          {/* Page Routing */}
          <main className="flex-1">
            {currentPage === 'home' && (
              <Home
                onNavigate={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenBookingWithDoctor={handleOpenBookingWithDoctor}
                onSelectDoctorDetail={handleSelectDoctorDetail}
              />
            )}

            {currentPage === 'about' && (
              <About
                onNavigate={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenBooking={handleOpenBooking}
              />
            )}

            {currentPage === 'departments' && (
              <Departments
                onOpenBookingWithDoctor={handleOpenBookingWithDoctor}
                onSelectDoctorDetail={handleSelectDoctorDetail}
              />
            )}

            {currentPage === 'doctors' && (
              <Doctors
                onOpenBookingWithDoctor={handleOpenBookingWithDoctor}
                onSelectDoctorDetail={handleSelectDoctorDetail}
              />
            )}

            {currentPage === 'booking' && (
              <AppointmentBooking
                onNavigateToPortal={() => {
                  setCurrentPage('portal');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                preselectedDoctorId={preselectedDoctorId}
                preselectedDeptId={preselectedDeptId}
              />
            )}

            {currentPage === 'portal' && (
              <PatientPortal
                onOpenBooking={handleOpenBooking}
              />
            )}

            {currentPage === 'admin' && (
              <AdminPortal />
            )}
          </main>

          {/* Hospital Footer */}
          <Footer
            onNavigate={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenBooking={handleOpenBooking}
          />

          {/* Secure Patient Auth Modal */}
          <AuthModal
            onSuccess={() => {
              setCurrentPage('portal');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />

          {/* Doctor Profile Modal */}
          <DoctorDetailModal
            doctor={selectedDoctorDetail}
            onClose={() => setSelectedDoctorDetail(null)}
            onBookDoctor={(doc) => {
              handleOpenBookingWithDoctor(doc.id, doc.departmentId);
            }}
          />

          {/* AI-Powered Doctor Appointment Assistant */}
          <AIAssistantChat
            isOpen={isAIAssistantOpen}
            onToggle={() => setIsAIAssistantOpen(!isAIAssistantOpen)}
            onClose={() => setIsAIAssistantOpen(false)}
            onNavigateToPortal={() => {
              setCurrentPage('portal');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToBooking={(docId, deptId) => {
              handleOpenBookingWithDoctor(docId || '', deptId);
            }}
          />

        </div>
      </AppointmentProvider>
    </AuthProvider>
  );
}
