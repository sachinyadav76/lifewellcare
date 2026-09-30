import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc,
  getDocs, 
  query, 
  where 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestoreErrors';
import { Appointment } from '../types/hospital';
import { INITIAL_SAMPLE_APPOINTMENTS } from '../data/hospitalData';
import { useAuth } from './AuthContext';
import confetti from 'canvas-confetti';

interface AppointmentContextType {
  appointments: Appointment[];
  bookAppointment: (data: Omit<Appointment, 'id' | 'createdAt' | 'bookingRef' | 'status'>) => Promise<Appointment>;
  cancelAppointment: (id: string) => Promise<void>;
  rescheduleAppointment: (id: string, newDate: string, newTime: string) => Promise<void>;
  updateAppointmentStatus: (id: string, status: 'Confirmed' | 'Completed' | 'Rescheduled' | 'Cancelled') => Promise<void>;
  updateAppointmentNotes: (id: string, notes: string) => Promise<void>;
  updateAppointmentFull: (id: string, updatedFields: Partial<Appointment>) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
  loadAllAppointments: () => Promise<void>;
  selectedDoctorId: string | null;
  selectedDeptId: string | null;
  setSelectedDoctor: (doctorId: string | null, deptId?: string | null) => void;
  lastBookedAppointment: Appointment | null;
  setLastBookedAppointment: (apt: Appointment | null) => void;
  isLoadingAppointments: boolean;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

const APPOINTMENTS_STORAGE_KEY = 'lifewell_patient_appointments';

export const AppointmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAdmin } = useAuth();

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_SAMPLE_APPOINTMENTS;
  });

  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);
  const [lastBookedAppointment, setLastBookedAppointment] = useState<Appointment | null>(null);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(false);

  // Sync to localStorage as local cache
  useEffect(() => {
    localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(appointments));
  }, [appointments]);

  const loadAllAppointments = async () => {
    setIsLoadingAppointments(true);
    try {
      const aptsRef = collection(db, 'appointments');
      const querySnapshot = await getDocs(aptsRef);

      const loaded: Appointment[] = [];
      querySnapshot.forEach((docSnap) => {
        loaded.push(docSnap.data() as Appointment);
      });

      if (loaded.length > 0) {
        setAppointments(prev => {
          const combined = [...loaded];
          prev.forEach(p => {
            if (!combined.some(c => c.id === p.id || c.bookingRef === p.bookingRef)) {
              combined.push(p);
            }
          });
          return combined;
        });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'appointments');
    } finally {
      setIsLoadingAppointments(false);
    }
  };

  // Load appointments from Firestore when user changes (if admin, load all; else load user's)
  useEffect(() => {
    if (!user) return;

    if (isAdmin) {
      loadAllAppointments();
      return;
    }

    const loadFirestoreAppointments = async () => {
      setIsLoadingAppointments(true);
      try {
        const userEmail = (user.email || '').trim().toLowerCase();
        const aptsRef = collection(db, 'appointments');
        const q = query(aptsRef, where('patientEmail', '==', userEmail));
        const querySnapshot = await getDocs(q);

        const loaded: Appointment[] = [];
        querySnapshot.forEach((docSnap) => {
          loaded.push(docSnap.data() as Appointment);
        });

        if (loaded.length > 0) {
          setAppointments(prev => {
            const combined = [...loaded];
            prev.forEach(p => {
              if (!combined.some(c => c.id === p.id || c.bookingRef === p.bookingRef)) {
                combined.push(p);
              }
            });
            return combined;
          });
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, 'appointments');
      } finally {
        setIsLoadingAppointments(false);
      }
    };

    loadFirestoreAppointments();
  }, [user, isAdmin]);

  const setSelectedDoctor = (doctorId: string | null, deptId?: string | null) => {
    setSelectedDoctorId(doctorId);
    if (deptId) setSelectedDeptId(deptId);
  };

  const bookAppointment = async (data: Omit<Appointment, 'id' | 'createdAt' | 'bookingRef' | 'status'>): Promise<Appointment> => {
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const newAppointmentId = `apt-${Date.now()}`;
    const newAppointment: Appointment = {
      ...data,
      patientEmail: data.patientEmail.trim().toLowerCase(),
      id: newAppointmentId,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
      bookingRef: `LW-2026-${randomCode}`
    };

    // 1. Update local state immediately for instant feedback
    setAppointments(prev => [newAppointment, ...prev]);
    setLastBookedAppointment(newAppointment);

    // 2. Persist directly to Firebase Firestore
    try {
      const aptDocRef = doc(db, 'appointments', newAppointmentId);
      await setDoc(aptDocRef, newAppointment, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `appointments/${newAppointmentId}`);
    }

    // 3. Fire celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0d9488', '#06b6d4', '#10b981', '#3b82f6']
      });
    } catch {
      // ignore
    }

    return newAppointment;
  };

  const updateAppointmentStatus = async (id: string, status: 'Confirmed' | 'Completed' | 'Rescheduled' | 'Cancelled') => {
    setAppointments(prev =>
      prev.map(apt => (apt.id === id ? { ...apt, status } : apt))
    );

    try {
      const aptDocRef = doc(db, 'appointments', id);
      const targetApt = appointments.find(a => a.id === id);
      const dataToSave = targetApt ? { ...targetApt, status } : { status };
      await setDoc(aptDocRef, dataToSave, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `appointments/${id}`);
    }
  };

  const updateAppointmentNotes = async (id: string, notes: string) => {
    setAppointments(prev =>
      prev.map(apt => (apt.id === id ? { ...apt, notes } : apt))
    );

    try {
      const aptDocRef = doc(db, 'appointments', id);
      const targetApt = appointments.find(a => a.id === id);
      const dataToSave = targetApt ? { ...targetApt, notes } : { notes };
      await setDoc(aptDocRef, dataToSave, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `appointments/${id}`);
    }
  };

  const updateAppointmentFull = async (id: string, updatedFields: Partial<Appointment>) => {
    setAppointments(prev =>
      prev.map(apt => (apt.id === id ? { ...apt, ...updatedFields } : apt))
    );

    try {
      const aptDocRef = doc(db, 'appointments', id);
      const targetApt = appointments.find(a => a.id === id);
      const dataToSave = targetApt ? { ...targetApt, ...updatedFields } : updatedFields;
      await setDoc(aptDocRef, dataToSave, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `appointments/${id}`);
    }
  };

  const deleteAppointment = async (id: string) => {
    setAppointments(prev => prev.filter(apt => apt.id !== id));

    try {
      const aptDocRef = doc(db, 'appointments', id);
      await deleteDoc(aptDocRef);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `appointments/${id}`);
    }
  };

  const cancelAppointment = async (id: string) => {
    await updateAppointmentStatus(id, 'Cancelled');
  };

  const rescheduleAppointment = async (id: string, newDate: string, newTime: string) => {
    setAppointments(prev =>
      prev.map(apt =>
        apt.id === id
          ? {
              ...apt,
              date: newDate,
              timeSlot: newTime,
              status: 'Rescheduled' as const
            }
          : apt
      )
    );

    try {
      const aptDocRef = doc(db, 'appointments', id);
      const targetApt = appointments.find(a => a.id === id);
      const dataToSave = targetApt
        ? { ...targetApt, date: newDate, timeSlot: newTime, status: 'Rescheduled' }
        : { date: newDate, timeSlot: newTime, status: 'Rescheduled' };
      await setDoc(aptDocRef, dataToSave, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `appointments/${id}`);
    }
  };

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        bookAppointment,
        cancelAppointment,
        rescheduleAppointment,
        updateAppointmentStatus,
        updateAppointmentNotes,
        updateAppointmentFull,
        deleteAppointment,
        loadAllAppointments,
        selectedDoctorId,
        selectedDeptId,
        setSelectedDoctor,
        lastBookedAppointment,
        setLastBookedAppointment,
        isLoadingAppointments
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (!context) throw new Error('useAppointments must be used within an AppointmentProvider');
  return context;
};
