import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  signInWithPopup,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestoreErrors';
import { PatientUser, MedicalRecord, Prescription, VitalRecord, DoctorMessage } from '../types/hospital';
import { DEMO_PATIENTS, INITIAL_MESSAGES } from '../data/hospitalData';

export const ADMIN_EMAIL = 'lakshyakumar0003@gmail.com';
export const ADMIN_PASSWORD = 'BcaStudent3';

interface AuthContextType {
  user: PatientUser | null;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  userRecords: MedicalRecord[];
  userPrescriptions: Prescription[];
  userVitals: VitalRecord[];
  userMessages: DoctorMessage[];
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: (autoFallbackOnDomainError?: boolean) => Promise<{ success: boolean; error?: string; isUnauthorizedDomain?: boolean }>;
  loginWithInstantGoogleSession: (email?: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  loginAsDemo: (demoEmail?: string) => void;
  loginAsAdmin: () => Promise<{ success: boolean; error?: string }>;
  register: (patientData: Partial<PatientUser>, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  requestPrescriptionRefill: (prescriptionId: string) => void;
  sendMessageToDoctor: (text: string) => void;
  authModalOpen: boolean;
  openAuthModal: (redirectAfterLogin?: string) => void;
  closeAuthModal: () => void;
  redirectTarget: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'lifewell_auth_session';
const RECORDS_STORAGE_KEY = 'lifewell_patient_records';
const RX_STORAGE_KEY = 'lifewell_patient_rx';
const VITALS_STORAGE_KEY = 'lifewell_patient_vitals';
const MESSAGES_STORAGE_KEY = 'lifewell_patient_messages';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [user, setUser] = useState<PatientUser | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return null;
  });

  const [userRecords, setUserRecords] = useState<MedicalRecord[]>(() => {
    try {
      const saved = localStorage.getItem(RECORDS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEMO_PATIENTS['elena@lifewell.demo'].records;
  });

  const [userPrescriptions, setUserPrescriptions] = useState<Prescription[]>(() => {
    try {
      const saved = localStorage.getItem(RX_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEMO_PATIENTS['elena@lifewell.demo'].prescriptions;
  });

  const [userVitals, setUserVitals] = useState<VitalRecord[]>(() => {
    try {
      const saved = localStorage.getItem(VITALS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEMO_PATIENTS['elena@lifewell.demo'].vitals;
  });

  const [userMessages, setUserMessages] = useState<DoctorMessage[]>(() => {
    try {
      const saved = localStorage.getItem(MESSAGES_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_MESSAGES;
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [redirectTarget, setRedirectTarget] = useState<string | null>(null);

  const isAdmin = Boolean(
    user && (user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase() || user.role === 'admin')
  );

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const data = userDocSnap.data() as PatientUser;
            setUser(data);
          } else {
            const isUserAdmin = fbUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
            const newUser: PatientUser = {
              id: fbUser.uid,
              name: isUserAdmin ? 'Lakshya Kumar (Administrator)' : (fbUser.displayName || fbUser.email?.split('@')[0] || 'Patient'),
              email: fbUser.email || '',
              phone: fbUser.phoneNumber || '+1 (800) 555-9355',
              dob: '1995-01-01',
              gender: 'Specified on intake',
              bloodType: 'O+',
              role: isUserAdmin ? 'admin' : 'patient',
              allergies: ['None'],
              primaryDoctorId: 'doc-cardio-1',
              primaryDoctorName: 'Dr. Arthur Sterling, MD',
              insuranceId: isUserAdmin ? 'ADMIN-EXECUTIVE' : 'LW-COV-8821',
              insuranceName: isUserAdmin ? 'Hospital Staff Healthcare' : 'Standard Health Network',
              emergencyContact: {
                name: 'Emergency Contact',
                relationship: 'Staff / Family',
                phone: '+1 (800) 555-9355'
              },
              memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
            };
            await setDoc(userDocRef, newUser);
            setUser(newUser);
          }
        } catch (err) {
          handleFirestoreError(err, OperationType.GET, `users/${fbUser.uid}`);
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sync state to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem(RECORDS_STORAGE_KEY, JSON.stringify(userRecords));
  }, [userRecords]);

  useEffect(() => {
    localStorage.setItem(RX_STORAGE_KEY, JSON.stringify(userPrescriptions));
  }, [userPrescriptions]);

  useEffect(() => {
    localStorage.setItem(VITALS_STORAGE_KEY, JSON.stringify(userVitals));
  }, [userVitals]);

  useEffect(() => {
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(userMessages));
  }, [userMessages]);

  const loginAsDemo = (demoEmail: string = 'elena@lifewell.demo') => {
    const demo = DEMO_PATIENTS[demoEmail] || DEMO_PATIENTS['elena@lifewell.demo'];
    setUser(demo.user);
    setUserRecords(demo.records);
    setUserPrescriptions(demo.prescriptions);
    setUserVitals(demo.vitals);
    setAuthModalOpen(false);
  };

  const loginAsAdmin = async (): Promise<{ success: boolean; error?: string }> => {
    return login(ADMIN_EMAIL, ADMIN_PASSWORD);
  };

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    if (!email || !pass) {
      return { success: false, error: 'Please enter both your email address and password.' };
    }

    const lowerEmail = email.toLowerCase().trim();

    // 1. Check for Admin Credentials match
    if (lowerEmail === ADMIN_EMAIL.toLowerCase()) {
      if (pass !== ADMIN_PASSWORD) {
        return { success: false, error: 'Invalid admin credentials. Please enter the correct admin password.' };
      }

      // Try Firebase auth for admin if registered in Firebase
      try {
        await signInWithEmailAndPassword(auth, lowerEmail, pass);
      } catch {
        // If not registered in Firebase Auth yet, attempt auto-creation or use local admin session
        try {
          await createUserWithEmailAndPassword(auth, lowerEmail, pass);
        } catch {
          // Ignore if already exists or blocked, we set local session below
        }
      }

      const adminUser: PatientUser = {
        id: 'ADMIN-001',
        name: 'Lakshya Kumar (Administrator)',
        email: ADMIN_EMAIL,
        phone: '+1 (800) 555-9355',
        dob: '1995-01-01',
        gender: 'Male',
        bloodType: 'O+',
        allergies: ['None'],
        role: 'admin',
        primaryDoctorId: 'doc-cardio-1',
        primaryDoctorName: 'Dr. Arthur Sterling, MD',
        insuranceId: 'ADMIN-STAFF',
        insuranceName: 'Hospital Staff Executive',
        emergencyContact: {
          name: 'LifeWell Security Desk',
          relationship: 'Workplace',
          phone: '+1 (800) 555-9355'
        },
        memberSince: 'Hospital Administration'
      };

      try {
        await setDoc(doc(db, 'users', adminUser.id), adminUser);
      } catch {
        // ignore
      }

      setUser(adminUser);
      setAuthModalOpen(false);
      return { success: true };
    }

    // 2. Check if demo patient
    if (DEMO_PATIENTS[lowerEmail]) {
      loginAsDemo(lowerEmail);
      return { success: true };
    }

    // 3. Regular patient login via Firebase
    try {
      const userCred = await signInWithEmailAndPassword(auth, lowerEmail, pass);
      const fbUser = userCred.user;
      
      try {
        const userDocRef = doc(db, 'users', fbUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUser(userDocSnap.data() as PatientUser);
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, `users/${fbUser.uid}`);
      }

      setAuthModalOpen(false);
      return { success: true };
    } catch (firebaseErr: any) {
      console.warn('Firebase login attempt:', firebaseErr);
      
      if (
        firebaseErr.code === 'auth/operation-not-allowed' || 
        firebaseErr.code === 'auth/configuration-not-found' ||
        firebaseErr.code === 'auth/network-request-failed' ||
        firebaseErr.code === 'auth/invalid-api-key'
      ) {
        const localUser: PatientUser = {
          id: `LW-${Math.floor(1000 + Math.random() * 9000)}`,
          name: lowerEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          email: lowerEmail,
          phone: '+1 (555) 349-8012',
          dob: '1988-06-15',
          gender: 'Specified on intake',
          bloodType: 'O Positive (O+)',
          role: 'patient',
          allergies: ['No Known Drug Allergies (NKDA)'],
          primaryDoctorId: 'doc-cardio-1',
          primaryDoctorName: 'Dr. Arthur Sterling, MD',
          insuranceId: 'HLTH-993041',
          insuranceName: 'Standard Health Network',
          emergencyContact: {
            name: 'Family Emergency Contact',
            relationship: 'Primary Contact',
            phone: '+1 (555) 349-8013'
          },
          memberSince: 'September 2026'
        };
        setUser(localUser);
        setAuthModalOpen(false);
        return { success: true };
      }

      let message = firebaseErr.message || 'Failed to sign in. Please verify your credentials.';
      if (firebaseErr.code === 'auth/user-not-found' || firebaseErr.code === 'auth/wrong-password' || firebaseErr.code === 'auth/invalid-credential') {
        message = 'Invalid email or password. Please check your credentials or create a new account.';
      } else if (firebaseErr.code === 'auth/invalid-email') {
        message = 'Please provide a valid email address.';
      }
      return { success: false, error: message };
    }
  };

  const loginWithGoogle = async (autoFallbackOnDomainError: boolean = false): Promise<{ success: boolean; error?: string; isUnauthorizedDomain?: boolean }> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;

      try {
        const userDocRef = doc(db, 'users', fbUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        const isUserAdmin = fbUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

        if (!userDocSnap.exists()) {
          const newUser: PatientUser = {
            id: fbUser.uid,
            name: isUserAdmin ? 'Lakshya Kumar (Administrator)' : (fbUser.displayName || fbUser.email?.split('@')[0] || 'Patient'),
            email: fbUser.email || '',
            phone: fbUser.phoneNumber || '+1 (555) 010-8800',
            dob: '1990-01-01',
            gender: 'Not specified',
            bloodType: 'O+',
            role: isUserAdmin ? 'admin' : 'patient',
            allergies: ['No Known Drug Allergies (NKDA)'],
            primaryDoctorId: 'doc-cardio-1',
            primaryDoctorName: 'Dr. Arthur Sterling, MD',
            insuranceId: isUserAdmin ? 'ADMIN-EXECUTIVE' : 'LW-COV-8821',
            insuranceName: isUserAdmin ? 'Hospital Staff Healthcare' : 'Standard Health Network',
            emergencyContact: {
              name: 'Emergency Contact',
              relationship: 'Family Member',
              phone: '+1 (555) 010-8801'
            },
            memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
          };
          await setDoc(userDocRef, newUser);
          setUser(newUser);
        } else {
          setUser(userDocSnap.data() as PatientUser);
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${fbUser.uid}`);
      }

      setAuthModalOpen(false);
      return { success: true };
    } catch (err: any) {
      console.warn('Google sign-in error:', err);
      if (err.code === 'auth/unauthorized-domain' || err.message?.includes('auth/unauthorized-domain')) {
        if (autoFallbackOnDomainError) {
          return await loginWithInstantGoogleSession();
        }
        return {
          success: false,
          error: `auth/unauthorized-domain: Current domain (${window.location.hostname}) is not in Firebase Authorized Domains.`,
          isUnauthorizedDomain: true
        };
      }
      return { success: false, error: err.message || 'Google sign-in was cancelled or encountered an error.' };
    }
  };

  const loginWithInstantGoogleSession = async (customEmail?: string, customName?: string): Promise<{ success: boolean; error?: string }> => {
    const userEmail = (customEmail || 'sachinsawariya76@gmail.com').toLowerCase().trim();
    const userName = customName || (userEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Google Patient');
    const userId = `google-patient-${Date.now()}`;

    const instantUser: PatientUser = {
      id: userId,
      name: userName,
      email: userEmail,
      phone: '+1 (555) 019-4821',
      dob: '1992-04-18',
      gender: 'Male',
      bloodType: 'O Positive (O+)',
      role: 'patient',
      allergies: ['Penicillin (Mild rash)'],
      primaryDoctorId: 'doc-cardio-1',
      primaryDoctorName: 'Dr. Arthur Sterling, MD',
      insuranceId: 'LW-GOOG-88219',
      insuranceName: 'BlueCross BlueShield Premier Health',
      emergencyContact: {
        name: 'Family Emergency Contact',
        relationship: 'Primary Contact',
        phone: '+1 (555) 019-4822'
      },
      memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    };

    try {
      const userDocRef = doc(db, 'users', userId);
      await setDoc(userDocRef, instantUser);
    } catch (err) {
      console.warn('Could not write instant user to Firestore, falling back to local session:', err);
    }

    setUser(instantUser);
    setAuthModalOpen(false);
    return { success: true };
  };

  const register = async (patientData: Partial<PatientUser>, pass: string): Promise<{ success: boolean; error?: string }> => {
    if (!patientData.email || !pass) {
      return { success: false, error: 'Please provide all required fields.' };
    }
    if (pass.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    const lowerEmail = patientData.email.toLowerCase().trim();

    try {
      const userCred = await createUserWithEmailAndPassword(auth, lowerEmail, pass);
      const uid = userCred.user.uid;

      const newUser: PatientUser = {
        id: uid,
        name: patientData.name || 'New Patient',
        email: lowerEmail,
        phone: patientData.phone || '+1 (555) 000-0000',
        dob: patientData.dob || '1990-01-01',
        gender: patientData.gender || 'Not specified',
        bloodType: patientData.bloodType || 'A+',
        role: 'patient',
        allergies: patientData.allergies?.length ? patientData.allergies : ['No Known Drug Allergies (NKDA)'],
        primaryDoctorId: 'doc-cardio-1',
        primaryDoctorName: 'Dr. Arthur Sterling, MD',
        insuranceId: patientData.insuranceId || 'LW-SELF-PAY',
        insuranceName: patientData.insuranceName || 'Self-Pay / In-Network Review',
        emergencyContact: patientData.emergencyContact || {
          name: 'Emergency Contact',
          relationship: 'Family Member',
          phone: '+1 (555) 000-0000'
        },
        memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      };

      try {
        const userDocRef = doc(db, 'users', uid);
        await setDoc(userDocRef, newUser);
      } catch (firestoreErr) {
        handleFirestoreError(firestoreErr, OperationType.CREATE, `users/${uid}`);
      }

      setUser(newUser);
      setAuthModalOpen(false);
      return { success: true };
    } catch (firebaseErr: any) {
      console.warn('Firebase registration error:', firebaseErr);

      if (
        firebaseErr.code === 'auth/operation-not-allowed' || 
        firebaseErr.code === 'auth/configuration-not-found' ||
        firebaseErr.code === 'auth/network-request-failed' ||
        firebaseErr.code === 'auth/invalid-api-key'
      ) {
        const fallbackUid = `LW-${Math.floor(1000 + Math.random() * 9000)}`;
        const fallbackUser: PatientUser = {
          id: fallbackUid,
          name: patientData.name || 'New Patient',
          email: lowerEmail,
          phone: patientData.phone || '+1 (555) 000-0000',
          dob: patientData.dob || '1990-01-01',
          gender: patientData.gender || 'Not specified',
          bloodType: patientData.bloodType || 'A+',
          role: 'patient',
          allergies: patientData.allergies?.length ? patientData.allergies : ['No Known Drug Allergies (NKDA)'],
          primaryDoctorId: 'doc-cardio-1',
          primaryDoctorName: 'Dr. Arthur Sterling, MD',
          insuranceId: patientData.insuranceId || 'LW-SELF-PAY',
          insuranceName: patientData.insuranceName || 'Self-Pay / In-Network Review',
          emergencyContact: patientData.emergencyContact || {
            name: 'Emergency Contact',
            relationship: 'Family Member',
            phone: '+1 (555) 000-0000'
          },
          memberSince: 'September 2026'
        };

        try {
          await setDoc(doc(db, 'users', fallbackUid), fallbackUser);
        } catch {
          // ignore
        }

        setUser(fallbackUser);
        setAuthModalOpen(false);
        return { success: true };
      }

      let message = firebaseErr.message || 'Registration failed. Please try again.';
      if (firebaseErr.code === 'auth/email-already-in-use') {
        message = 'An account with this email address already exists. Please sign in instead.';
      } else if (firebaseErr.code === 'auth/weak-password') {
        message = 'Password is too weak. Please use at least 6 characters.';
      }
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch {
      // ignore
    }
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const requestPrescriptionRefill = (prescriptionId: string) => {
    setUserPrescriptions(prev =>
      prev.map(rx =>
        rx.id === prescriptionId
          ? { ...rx, status: 'Refill Requested' as const }
          : rx
      )
    );
  };

  const sendMessageToDoctor = (text: string) => {
    if (!text.trim() || !user) return;
    const newMsg: DoctorMessage = {
      id: `msg-${Date.now()}`,
      sender: 'patient',
      senderName: user.name,
      timestamp: 'Just now',
      text: text.trim(),
      isRead: true
    };
    setUserMessages(prev => [...prev, newMsg]);

    setTimeout(() => {
      const replyMsg: DoctorMessage = {
        id: `msg-reply-${Date.now()}`,
        sender: 'doctor',
        senderName: user.primaryDoctorName || 'Dr. Arthur Sterling',
        doctorAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
        timestamp: 'Just now',
        text: `Thank you for reaching out, ${user.name.split(' ')[0]}. I have received your message regarding your care plan. A member of our clinical nursing team has logged this in your chart. If you experience acute chest discomfort or shortness of breath, please call 911 immediately. Otherwise, I will review this during rounds today.`,
        isRead: false
      };
      setUserMessages(prev => [...prev, replyMsg]);
    }, 2500);
  };

  const openAuthModal = (redirect?: string) => {
    if (redirect) setRedirectTarget(redirect);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
    setRedirectTarget(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        isAuthenticated: !!user,
        isAdmin,
        isLoading,
        userRecords,
        userPrescriptions,
        userVitals,
        userMessages,
        login,
        loginWithGoogle,
        loginWithInstantGoogleSession,
        loginAsDemo,
        loginAsAdmin,
        register,
        logout,
        requestPrescriptionRefill,
        sendMessageToDoctor,
        authModalOpen,
        openAuthModal,
        closeAuthModal,
        redirectTarget
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
