import React, { useState } from 'react';
import {
  KeyRound, Lock, ShieldCheck, CheckCircle2, AlertCircle,
  Loader2, Mail, User, Eye, EyeOff, Save, Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminProfile() {
  const { admin, changePassword, updateEmail } = useAuth();

  // Email form state
  const [newEmail, setNewEmail] = useState('');
  const [isSavingEmail, setIsSavingEmail] = useState(false);
  const [emailMessage, setEmailMessage] = useState({ type: '', text: '' });

  // Password form state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

  const currentEmail = admin?.email || 'arpransales@gmail.com';

  // Handle Active Email Update
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setEmailMessage({ type: '', text: '' });

    if (!newEmail.trim()) {
      setEmailMessage({ type: 'error', text: 'Please enter a new email address.' });
      return;
    }

    if (newEmail.trim().toLowerCase() === currentEmail.toLowerCase()) {
      setEmailMessage({ type: 'error', text: 'New email must be different from current email.' });
      return;
    }

    setIsSavingEmail(true);
    const res = await updateEmail(newEmail.trim(), admin?.name || 'ARPRAN Admin');
    setIsSavingEmail(false);

    if (res.success) {
      setEmailMessage({
        type: 'success',
        text: `Admin email successfully updated to ${newEmail.trim()}!`
      });
      setNewEmail('');
    } else {
      setEmailMessage({ type: 'error', text: res.error || 'Failed to update email.' });
    }
  };

  // Handle Password Update
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!oldPassword.trim()) {
      setPasswordMessage({ type: 'error', text: 'Kripya apna current (old) password enter karein.' });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'New password must contain at least 6 characters.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New password and confirmation do not match.' });
      return;
    }

    setIsSavingPassword(true);
    const res = await changePassword(newPassword.trim(), oldPassword.trim());
    setIsSavingPassword(false);

    if (res.success) {
      setPasswordMessage({
        type: 'success',
        text: res.message || ''
      });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPasswordMessage({ type: 'error', text: res.error || 'Failed to update password.' });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">

      {/* Page Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
          Admin Email & Password Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your administrator login email address and access password.
        </p>
      </div>

      {/* Active Session Ribbon */}
      <div className="bg-gradient-to-r from-slate-950 via-[#0A4E9B] to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-blue-800/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-cyan-400/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base text-white">{admin?.name || 'ARPRAN Admin'}</span>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Active Admin
                </span>
              </div>
              <p className="text-xs text-blue-200 mt-0.5 font-mono">
                Current Mail: <span className="text-cyan-300 font-bold">{currentEmail}</span>
              </p>
            </div>
          </div>
          <div className="text-left sm:text-right text-xs">
            <span className="text-blue-200 block">Access Level</span>
            <span className="font-bold text-cyan-300">Super Administrator</span>
          </div>
        </div>
      </div>

      {/* TWO PRIMARY CARDS: CURRENT MAIL / NEW MAIL & CHANGE PASSWORD */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* CARD 1: CURRENT MAIL & NEW MAIL */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#0A4E9B]" />
              <span>Change Admin Email</span>
            </h2>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-[#0A4E9B]">
              Email Settings
            </span>
          </div>

          {/* Email Alert */}
          {emailMessage.text && (
            <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${emailMessage.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}>
              {emailMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              <span>{emailMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Current Mail
              </label>
              <div className="relative">
                <input
                  type="text"
                  disabled
                  value={currentEmail}
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-100 border border-slate-200 rounded-xl text-slate-700 font-mono font-medium cursor-not-allowed select-all"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                New Mail <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Enter new email address"
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-[#0A4E9B] focus:ring-2 focus:ring-blue-100 outline-none transition font-medium"
                />
                <Mail className="w-4 h-4 text-blue-600 absolute left-3 top-3 pointer-events-none" />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Aap is naye email se admin panel me login kar sakenge.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSavingEmail}
                className="w-full py-2.5 bg-[#0A4E9B] hover:bg-[#073b77] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSavingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Update Email</span>
              </button>
            </div>
          </form>
        </div>

        {/* CARD 2: CHANGE PASSWORD */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-[#0A4E9B]" />
              <span>Change Admin Password</span>
            </h2>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              Min 6 chars
            </span>
          </div>

          {/* Password Alert */}
          {passwordMessage.text && (
            <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${passwordMessage.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}>
              {passwordMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              <span>{passwordMessage.text}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            {/* Old Password Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Old Password (Current)
              </label>
              <div className="relative">
                <input
                  type={showOldPassword ? 'text' : 'password'}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Enter current / old password"
                  className="w-full pl-9 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-[#0A4E9B] focus:ring-2 focus:ring-blue-100 outline-none transition"
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                (Note: System will keep both your old password and new password active for login)
              </p>
            </div>

            {/* New Password Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                New Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new strong password"
                  className="w-full pl-9 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-[#0A4E9B] focus:ring-2 focus:ring-blue-100 outline-none transition"
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Confirm New Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password"
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-[#0A4E9B] focus:ring-2 focus:ring-blue-100 outline-none transition"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSavingPassword}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSavingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                <span>Update Password</span>
              </button>
            </div>
          </form>
        </div>

      </div>

    </div>
  );
}
