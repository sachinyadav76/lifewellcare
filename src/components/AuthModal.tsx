import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  ShieldCheck, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  KeyRound,
  Copy,
  Zap,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onSuccess }) => {
  const { 
    authModalOpen, 
    closeAuthModal, 
    login, 
    loginWithGoogle, 
    loginWithInstantGoogleSession, 
    loginAsDemo, 
    register 
  } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [domainError, setDomainError] = useState<{ isUnauthorized: boolean; domain: string } | null>(null);
  const [copiedDomain, setCopiedDomain] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('1990-05-14');
  const [bloodType, setBloodType] = useState('O+');

  if (!authModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setDomainError(null);
    setLoading(true);

    try {
      if (isRegisterMode) {
        if (!name.trim()) {
          setError('Please provide your legal full name.');
          setLoading(false);
          return;
        }
        const res = await register(
          {
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim() || '+1 (555) 010-2200',
            dob,
            bloodType
          },
          password
        );
        if (!res.success) {
          setError(res.error || 'Registration failed');
        } else {
          closeAuthModal();
          if (onSuccess) onSuccess();
        }
      } else {
        const res = await login(email, password);
        if (!res.success) {
          setError(res.error || 'Invalid email or password');
        } else {
          closeAuthModal();
          if (onSuccess) onSuccess();
        }
      }
    } catch {
      setError('An error occurred during authentication. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setDomainError(null);
    setLoading(true);
    const res = await loginWithGoogle();
    setLoading(false);
    if (res.success) {
      closeAuthModal();
      if (onSuccess) onSuccess();
    } else {
      if (res.isUnauthorizedDomain || res.error?.includes('auth/unauthorized-domain')) {
        setDomainError({ isUnauthorized: true, domain: window.location.hostname });
      } else {
        setError(res.error || 'Google sign-in failed');
      }
    }
  };

  const handleInstantGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    const res = await loginWithInstantGoogleSession();
    setLoading(false);
    if (res.success) {
      closeAuthModal();
      if (onSuccess) onSuccess();
    } else {
      setError(res.error || 'Failed to start instant session');
    }
  };

  const handleSelectDemo = (demoEmail: string) => {
    loginAsDemo(demoEmail);
    if (onSuccess) onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-cyan-800 px-6 py-5 text-white flex items-center justify-between relative">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-white/10 rounded-lg backdrop-blur-xs">
                <Lock className="w-4 h-4 text-teal-200" />
              </span>
              <span className="text-xs uppercase tracking-wider font-bold text-teal-200">
                LifeWell Firebase EHR
              </span>
            </div>
            <h3 className="text-xl font-bold font-heading">
              {isRegisterMode ? 'Create Patient Account' : 'Patient Portal Sign In'}
            </h3>
            <p className="text-xs text-teal-100/90">
              Access your medical records, appointment bookings, and specialist care plans safely.
            </p>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors self-start"
            aria-label="Close authentication modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1-Click Fast Demo Patient Selector */}
        <div className="bg-slate-50 border-b border-slate-200/80 px-6 py-3.5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-teal-600" />
              Quick Demo Patient Profiles (Instant Testing)
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleSelectDemo('elena@lifewell.demo')}
              className="text-left bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 p-2.5 rounded-xl transition-all shadow-xs group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 group-hover:text-teal-700">
                  Elena Vance
                </span>
                <span className="text-[10px] bg-teal-100 text-teal-800 font-semibold px-1.5 py-0.5 rounded">
                  Cardiology
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">3 active rx, echocardiogram, 2 visits</p>
            </button>

            <button
              type="button"
              onClick={() => handleSelectDemo('marcus@lifewell.demo')}
              className="text-left bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 p-2.5 rounded-xl transition-all shadow-xs group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 group-hover:text-teal-700">
                  Marcus Brody
                </span>
                <span className="text-[10px] bg-cyan-100 text-cyan-800 font-semibold px-1.5 py-0.5 rounded">
                  Orthopedics
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">Knee robotic post-op, X-Ray report</p>
            </button>
          </div>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {domainError && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-3">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-amber-950">Domain Not Authorized in Firebase</p>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Google OAuth popup requires this preview domain to be in Firebase Console under <strong>Authentication &gt; Settings &gt; Authorized domains</strong>.
                  </p>
                </div>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-amber-200 flex items-center justify-between gap-2">
                <code className="text-[11px] font-mono font-semibold text-slate-800 break-all select-all">
                  {domainError.domain}
                </code>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(domainError.domain);
                    setCopiedDomain(true);
                    setTimeout(() => setCopiedDomain(false), 3000);
                  }}
                  className="shrink-0 px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded-lg text-[10px] flex items-center gap-1 transition-colors"
                >
                  {copiedDomain ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedDomain ? 'Copied!' : 'Copy Domain'}</span>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleInstantGoogleLogin}
                  disabled={loading}
                  className="flex-1 py-2 px-3 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-center shadow-xs transition-colors flex items-center justify-center gap-1.5 text-xs"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-300" />
                  <span>⚡ Continue in Instant Google Mode</span>
                </button>
              </div>

              <p className="text-[10px] text-amber-700 leading-normal">
                <strong>Or:</strong> Sign in with Email & Password below (no domain restriction needed).
              </p>
            </div>
          )}

          {/* Google Sign-in Button */}
          <div>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold py-2.5 px-4 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-3 text-xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center my-3">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-xs text-slate-400 uppercase font-semibold tracking-wider">
              Or with email
            </span>
          </div>

          {isRegisterMode && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Legal Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rachel Jenkins"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Blood Type
                  </label>
                  <select
                    value={bloodType}
                    onChange={(e) => setBloodType(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600"
                  >
                    <option value="O+">O Positive (O+)</option>
                    <option value="O-">O Negative (O-)</option>
                    <option value="A+">A Positive (A+)</option>
                    <option value="A-">A Negative (A-)</option>
                    <option value="B+">B Positive (B+)</option>
                    <option value="B-">B Negative (B-)</option>
                    <option value="AB+">AB Positive (AB+)</option>
                    <option value="AB-">AB Negative (AB-)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mobile Phone (for Appointment SMS Alerts)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">
                Password *
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full pl-9 pr-10 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
            >
              <span>{loading ? 'Authenticating with Firebase...' : isRegisterMode ? 'Create Patient Account & Store in Firebase' : 'Sign In to Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Toggle between Login and Register */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setError(null);
              }}
              className="text-xs text-slate-600 hover:text-teal-700 font-semibold"
            >
              {isRegisterMode
                ? 'Already have an account? Sign In here'
                : "New patient at LifeWell? Register to save medical records"}
            </button>
          </div>

          {/* Security footnote */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Firebase Auth & Firestore Encrypted • Project: lifewellcare-21ee1</span>
          </div>
        </form>
      </div>
    </div>
  );
};
