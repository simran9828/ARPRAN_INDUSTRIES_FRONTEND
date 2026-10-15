import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  UserPlus, Mail, Lock, Eye, EyeOff, CheckCircle2,
  AlertCircle, ArrowRight, Loader2, Sparkles, User, ShieldCheck,
  Phone, Building2, KeyRound, Shield
} from 'lucide-react';
import { ArpranLogo } from '../components/ArpranLogo';
import SEO from '../components/SEO';

export default function SignupPage() {
  const [role, setRole] = useState('user'); // 'user' | 'admin'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [adminSecret, setAdminSecret] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { signup, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // If already authenticated, redirect to appropriate destination
  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'admin' || user?.role === 'superadmin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const cleanEmail = email.trim();
    const cleanPass = password.trim();
    const cleanConfirm = confirmPassword.trim();
    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const cleanCompany = company.trim();
    const cleanSecret = adminSecret.trim();

    // 1. Basic validation
    if (!cleanEmail || !cleanPass || !cleanConfirm) {
      setError('Please fill out all required fields marked with *.');
      return;
    }

    // 2. Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setError('Please enter a valid email address (e.g. name@domain.com).');
      return;
    }

    // 3. Password minimum requirements
    if (cleanPass.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    // 4. Confirm password match
    if (cleanPass !== cleanConfirm) {
      setError('Passwords do not match. Please verify both password entries.');
      return;
    }

    setLoading(true);
    const result = await signup({
      email: cleanEmail,
      password: cleanPass,
      confirmPassword: cleanConfirm,
      name: cleanName,
      phone: cleanPhone,
      company: cleanCompany,
      role,
      adminSecret: cleanSecret
    });
    setLoading(false);

    if (result.success) {
      const isRegisteredAdmin = role === 'admin' || result.user?.role === 'admin';
      setSuccess(
        isRegisteredAdmin
          ? 'Admin account created and saved in database! Redirecting to CMS...'
          : 'Account created successfully in database! Redirecting to your dashboard...'
      );
      setTimeout(() => {
        if (isRegisteredAdmin) {
          navigate('/admin', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      }, 1000);
    } else {
      setError(result.error || 'Failed to create account. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-[#041738] to-slate-900 px-4 py-12 relative overflow-hidden">
      <SEO
        title="Sign Up & Account Registration | ARPRAN Industries"
        description="Register an account directly with ARPRAN Industries for client project inquiries or CMS administration."
      />

      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg relative z-10">

        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex justify-center mb-3 transition hover:opacity-90">
            <ArpranLogo light={true} className="h-11 sm:h-12" />
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-semibold tracking-wider uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Create New Database Account</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
            Register with ARPRAN
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Accounts are saved securely in the SQLite database with bcrypt encryption
          </p>
        </div>

        {/* Signup Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6 sm:p-8">

          {/* Account Role Selector */}
          <div className="mb-5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Select Account Type
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setRole('user')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
                  role === 'user'
                    ? 'bg-[#0A4E9B] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Client / Architect</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
                  role === 'admin'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Administrator (CMS)</span>
              </button>
            </div>
          </div>

          {/* Error Notice */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <div className="font-medium leading-relaxed">{error}</div>
            </div>
          )}

          {/* Success Notice */}
          {success && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <div className="font-medium leading-relaxed">{success}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full Name Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rajesh Sharma"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0A4E9B] focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0A4E9B] focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Two-Column: Phone & Company */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Phone / WhatsApp
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0A4E9B] focus:border-transparent transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Company / Firm <span className="text-slate-400 font-normal lowercase">(optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Apex Architects"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0A4E9B] focus:border-transparent transition"
                  />
                </div>
              </div>
            </div>

            {/* Admin Security Key (Only shown when Administrator role is selected) */}
            {role === 'admin' && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-900 mb-1">
                  Administrator Access Key
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-600">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={adminSecret}
                    onChange={(e) => setAdminSecret(e.target.value)}
                    placeholder="Enter admin key (default: ARPRAN2026)"
                    className="w-full pl-10 pr-4 py-2 bg-white border border-amber-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <p className="text-[11px] text-amber-700 mt-1">
                  Protects administrative CMS privileges. Default key: <span className="font-mono font-bold">ARPRAN2026</span>
                </p>
              </div>
            )}

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Password <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] text-slate-400 font-medium">Min. 6 characters</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0A4E9B] focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition"
                  tabIndex={-1}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Confirm Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0A4E9B] focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition"
                  tabIndex={-1}
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Security checklist reminder */}
            <div className="text-[11px] text-slate-500 bg-slate-50 rounded-xl p-3 border border-slate-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Passwords are saved in SQLite with bcrypt hashing (10 salt rounds).</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer ${
                role === 'admin'
                  ? 'bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-slate-950 shadow-amber-500/20 hover:from-amber-400 hover:to-amber-600'
                  : 'bg-gradient-to-r from-[#0A4E9B] via-[#083E7A] to-[#041738] text-white shadow-blue-900/20 hover:from-[#083E7A] hover:to-[#020D20]'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving to Database...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Register {role === 'admin' ? 'Admin Account' : 'Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Links to Login & Return */}
          <div className="mt-6 pt-5 border-t border-slate-200 text-center space-y-2">
            <p className="text-xs text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-[#0A4E9B] hover:text-[#073B75] hover:underline">
                Sign In here
              </Link>
              {role === 'admin' && (
                <>
                  {' '}or{' '}
                  <Link to="/admin/login" className="font-bold text-amber-600 hover:text-amber-700 hover:underline">
                    Admin CMS Login
                  </Link>
                </>
              )}
            </p>
            <p className="text-[11px] text-slate-400">
              <Link to="/" className="hover:text-slate-600 transition">
                ← Return to Public Website
              </Link>
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
