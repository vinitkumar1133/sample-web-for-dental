import React, { useState } from 'react';
import { CLINIC_INFO } from '../data/clinicData';
import { useAuth } from '../context/AuthContext';
import { useClinic } from '../context/ClinicContext';
import {
  Phone,
  ShieldCheck,
  Calendar,
  MessageCircle,
  Star,
  Lock,
  UserCheck,
  LogOut,
  Menu,
  X,
  Stethoscope,
  Send,
  User as UserIcon,
  Sparkles,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { user, isDoctor, logout, switchDemoRole, openAuthModal } = useAuth();
  const { openBooking, openChat, appointments } = useClinic();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const pendingAppointmentsCount = appointments.filter(a => a.status === 'confirmed').length;

  const navItems = [
    { id: 'home', label: 'Overview', icon: Stethoscope },
    { id: 'services', label: 'Treatments', icon: Sparkles },
    { id: 'reviews', label: 'Reviews', icon: Star, badge: `${CLINIC_INFO.rating}★` },
    { id: 'followups', label: 'Follow-Ups', icon: Send },
    { id: 'e2ee-chat', label: 'E2EE Chat', icon: Lock, badge: 'AES-256' },
    ...(isDoctor
      ? [{ id: 'doctor-portal', label: 'Doctor Portal', icon: UserCheck, count: pendingAppointmentsCount }]
      : [{ id: 'patient-portal', label: 'My Portal', icon: UserIcon }]),
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Mini Alert Bar */}
      <div className="bg-slate-900 text-slate-300 text-[11px] font-medium py-1.5 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-teal-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Mon–Sat: 9:00 AM – 7:00 PM
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="hidden sm:inline text-slate-300">
              📍 Model Town, Ludhiana (2nd Floor, Green Avenue)
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <a
              href={`tel:${CLINIC_INFO.emergencyPhone}`}
              className="flex items-center gap-1.5 hover:text-teal-300 transition-colors font-bold text-emerald-400"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Emergency: {CLINIC_INFO.emergencyPhone}</span>
            </a>
            <span className="text-slate-700 hidden md:inline">|</span>
            <div className="hidden md:flex items-center gap-1.5 text-slate-400 text-[11px] uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>E2EE AES-256 Protected</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Clinic Title */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left cursor-pointer focus:outline-hidden group"
          >
            <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center text-white shadow-sm group-hover:bg-teal-700 transition-colors">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 leading-none group-hover:text-teal-600 transition-colors">
                SmileCraft
              </h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">
                Dental Studio
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer py-1 ${
                    isActive
                      ? 'text-teal-600 font-bold border-b-2 border-teal-600'
                      : 'text-slate-600 hover:text-teal-600'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 bg-teal-50 text-teal-700 border border-teal-200 rounded-full">
                      {item.badge}
                    </span>
                  )}
                  {typeof item.count === 'number' && item.count > 0 && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 bg-amber-500 text-white rounded-full">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Vertical Divider */}
            <div className="h-8 w-[1px] bg-slate-200 mx-1"></div>

            {/* WhatsApp Icon */}
            <a
              href={`https://wa.me/${CLINIC_INFO.rawPhone}?text=${encodeURIComponent(
                'Hello Dr. Aarav Mehta! I would like to book a dental consultation at SmileCraft Dental Studio in Model Town, Ludhiana.'
              )}`}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-full text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-5 h-5" />
            </a>

            {/* Book Appointment CTA */}
            <button
              onClick={() => openBooking()}
              className="bg-teal-600 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-sm hover:bg-teal-700 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment (₹500)</span>
            </button>

            {/* User Auth or Profile Switcher */}
            <div className="relative">
              {user ? (
                <div className="flex items-center">
                  <button
                    onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 hover:border-teal-300 bg-slate-50 hover:bg-white text-left transition-all cursor-pointer"
                  >
                    <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 font-bold flex items-center justify-center text-xs">
                      {user.role === 'dentist' ? '👨‍⚕️' : '👤'}
                    </div>
                    <span className="text-xs font-semibold text-slate-800 truncate max-w-[90px]">
                      {user.name.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {isRoleDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in">
                      <div className="px-3 py-2 border-b border-slate-100">
                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Signed in as</p>
                        <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      </div>

                      <div className="py-1">
                        <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Switch Role Demo
                        </div>
                        <button
                          onClick={() => {
                            switchDemoRole('dentist');
                            setActiveTab('doctor-portal');
                            setIsRoleDropdownOpen(false);
                          }}
                          className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                            user.role === 'dentist'
                              ? 'bg-teal-50 text-teal-700 font-bold'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <Stethoscope className="w-4 h-4 text-teal-600" />
                          <span>Dr. Aarav Mehta (Dentist)</span>
                        </button>
                        <button
                          onClick={() => {
                            switchDemoRole('patient');
                            setActiveTab('patient-portal');
                            setIsRoleDropdownOpen(false);
                          }}
                          className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                            user.role === 'patient'
                              ? 'bg-teal-50 text-teal-700 font-bold'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <UserIcon className="w-4 h-4 text-slate-500" />
                          <span>Priya Sharma (Patient)</span>
                        </button>
                      </div>

                      <div className="border-t border-slate-100 pt-1">
                        <button
                          onClick={() => {
                            logout();
                            setIsRoleDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl transition-colors font-semibold"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => openAuthModal()}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-teal-700 border border-slate-200 hover:border-teal-300 rounded-full transition-all cursor-pointer"
                >
                  Login / Signup
                </button>
              )}
            </div>
          </nav>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => openBooking()}
              className="px-3.5 py-1.5 rounded-full bg-teal-600 text-white text-xs font-semibold shadow-xs"
            >
              Book (₹500)
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-hidden"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-4 duration-200">
          <div className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                    isActive ? 'bg-teal-50 text-teal-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-xs bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                  {typeof item.count === 'number' && item.count > 0 && (
                    <span className="text-xs bg-amber-500 text-white font-bold px-2 py-0.5 rounded-full">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <div className="flex gap-2">
              <a
                href={`https://wa.me/${CLINIC_INFO.rawPhone}?text=${encodeURIComponent(
                  'Hello Dr. Aarav Mehta! I want to book an appointment at SmileCraft Dental Studio.'
                )}`}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-semibold"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp</span>
              </a>
              <a
                href={`tel:${CLINIC_INFO.emergencyPhone}`}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-100 text-slate-800 rounded-xl text-xs font-semibold"
              >
                <Phone className="w-4 h-4 text-slate-600" />
                <span>Call Clinic</span>
              </a>
            </div>

            {user ? (
              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800">{user.name}</p>
                  <p className="text-[11px] text-teal-600 capitalize">{user.role}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      switchDemoRole(user.role === 'dentist' ? 'patient' : 'dentist');
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-xs font-medium text-teal-700 bg-white border border-slate-200 px-2 py-1 rounded-lg"
                  >
                    Switch to {user.role === 'dentist' ? 'Patient' : 'Doctor'}
                  </button>
                  <button
                    onClick={logout}
                    className="p-1 text-slate-400 hover:text-rose-600"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  openAuthModal();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2.5 bg-teal-600 text-white rounded-xl text-xs font-semibold text-center"
              >
                Login / Signup
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

