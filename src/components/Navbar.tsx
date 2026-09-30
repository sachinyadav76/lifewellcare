import React, { useState } from 'react';
import { 
  Heart, 
  Phone, 
  Clock, 
  User, 
  Calendar, 
  Menu, 
  X, 
  ChevronDown, 
  LogOut, 
  ShieldCheck, 
  FileText,
  Activity,
  Stethoscope,
  Lock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  onOpenBooking: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, setCurrentPage, onOpenBooking }) => {
  const { user, isAuthenticated, isAdmin, logout, openAuthModal } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'departments', label: 'Departments' },
    { id: 'doctors', label: 'Doctors' },
    { id: 'portal', label: 'Patient Portal' },
    { id: 'admin', label: 'Admin Portal', isAdminBadge: true },
  ];

  const handleNavClick = (pageId: string) => {
    setCurrentPage(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Emergency & Info Banner */}
      <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-teal-400 font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping inline-block" />
              24/7 EMERGENCY HOTLINE:
              <a href="tel:8005559355" className="text-white hover:text-teal-300 font-bold ml-1">
                (800) 555-WELL
              </a>
            </span>
            <span className="hidden md:flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-teal-400" />
              ER Avg Wait: <strong className="text-white ml-0.5">12 mins</strong>
            </span>
            <span className="hidden lg:flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              Level 1 Certified Trauma Center
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            {/* Admin Portal Quick Link */}
            <button
              onClick={() => handleNavClick('admin')}
              className={`flex items-center gap-1 font-bold px-2 py-0.5 rounded transition-colors ${
                currentPage === 'admin'
                  ? 'bg-teal-500 text-slate-950'
                  : 'text-teal-300 hover:text-white bg-slate-800 hover:bg-slate-700'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>Admin Portal</span>
            </button>

            <span className="text-slate-600">|</span>

            {isAuthenticated ? (
              <button
                onClick={() => handleNavClick(isAdmin ? 'admin' : 'portal')}
                className="flex items-center gap-1.5 text-teal-300 hover:text-white transition-colors font-medium"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>{isAdmin ? 'Admin: ' : 'Portal: '} {user?.name.split(' ')[0]}</span>
              </button>
            ) : (
              <button
                onClick={() => openAuthModal('portal')}
                className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
              >
                <User className="w-3.5 h-3.5 text-teal-400" />
                <span>Patient Login</span>
              </button>
            )}

            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-slate-400 hidden sm:inline">100 LifeWell Way</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <button 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left group focus:outline-hidden"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-600 to-cyan-600 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <Heart className="w-6 h-6 fill-white/20 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-heading">
                  Life<span className="text-teal-600">Well</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full border border-teal-200">
                  Medical Center
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium tracking-wide">
                Excellence in Clinical Care & Research
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-150 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-teal-50 text-teal-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  {link.id === 'portal' && (
                    <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                  )}
                  {link.id === 'admin' && (
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  )}
                  <span>{link.label}</span>
                  {link.isAdminBadge && (
                    <span className="text-[9px] bg-slate-900 text-teal-300 font-bold px-1.5 py-0.2 rounded">
                      Staff
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs: Book Appointment & User Auth */}
          <div className="hidden sm:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 rounded-full transition-colors text-slate-800 text-sm font-medium border border-slate-200"
                >
                  <div className="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
                    {user?.name.charAt(0)}
                  </div>
                  <span className="max-w-[110px] truncate text-xs font-semibold">{user?.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {userDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-400 font-medium">{isAdmin ? 'Hospital Administrator' : 'Signed in as patient'}</p>
                      <p className="text-sm font-bold text-slate-800 truncate">{user?.name}</p>
                      <p className="text-[11px] text-teal-600 font-mono">{user?.email}</p>
                    </div>

                    {isAdmin ? (
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          handleNavClick('admin');
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-teal-800 bg-teal-50 hover:bg-teal-100 flex items-center gap-2 font-bold"
                      >
                        <ShieldCheck className="w-4 h-4 text-teal-700" />
                        Admin Command Dashboard
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            handleNavClick('portal');
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                        >
                          <Activity className="w-4 h-4 text-teal-600" />
                          Patient Health Records & Vitals
                        </button>

                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            handleNavClick('portal');
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                        >
                          <FileText className="w-4 h-4 text-cyan-600" />
                          Prescriptions & Lab Reports
                        </button>
                      </>
                    )}

                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('portal')}
                className="text-xs font-semibold text-slate-700 hover:text-teal-700 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5 text-teal-600" />
                Patient Login
              </button>
            )}

            <button
              onClick={onOpenBooking}
              className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-teal-600/20 hover:shadow-lg hover:shadow-teal-600/30 transition-all flex items-center gap-2 active:scale-95"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenBooking}
              className="bg-teal-600 text-white p-2 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-xs"
              title="Book Appointment"
            >
              <Calendar className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 animate-in fade-in duration-200">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-between ${
                  currentPage === link.id
                    ? 'bg-teal-50 text-teal-700 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="flex items-center gap-2">
                  {link.id === 'admin' && <ShieldCheck className="w-4 h-4 text-teal-600" />}
                  {link.label}
                </span>
                {link.id === 'admin' ? (
                  <span className="text-[10px] bg-slate-900 text-teal-300 font-bold px-2 py-0.5 rounded-full">
                    Admin
                  </span>
                ) : link.id === 'portal' ? (
                  <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-full">
                    Secure
                  </span>
                ) : null}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            {isAuthenticated ? (
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">{isAdmin ? 'Admin' : 'Patient'}</p>
                  <p className="text-sm font-bold text-slate-800">{user?.name}</p>
                  <p className="text-xs text-teal-600 font-mono">{user?.email}</p>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold flex items-center gap-1"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal('portal');
                }}
                className="w-full text-center py-2.5 text-sm font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Patient Portal Sign In / Register
              </button>
            )}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 shadow-md"
            >
              <Calendar className="w-4 h-4" />
              Book Appointment Now
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
