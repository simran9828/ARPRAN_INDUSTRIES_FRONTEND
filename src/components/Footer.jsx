import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Phone, Mail, MapPin, MessageSquare, Check, ShieldCheck,
  Award, Facebook, Instagram, Linkedin, Twitter, Send, ArrowRight,
  Navigation
} from 'lucide-react';
import { COMPANY_INFO } from '../data/stoneData';
import { useCMS } from '../context/CMSContext';
import { ArpranLogo } from './ArpranLogo';

export default function Footer() {
  const { settings, socialLinks, footerLinks } = useCMS();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  const defaultNavLinks = [
    { title: 'HOME', url: '/' },
    { title: 'ABOUT US', url: '/about' },
    { title: 'PRODUCTS', url: '/products' },
    { title: 'BLOG', url: '/blog' },
    { title: 'CONTACT US', url: '/contact' }
  ];

  const rawLinks = (footerLinks && footerLinks.length > 0) ? footerLinks : defaultNavLinks;
  const displayLinks = rawLinks.filter(l => l.url !== '/finishes' && l.title?.toUpperCase() !== 'FINISHES');

  const siteName = settings?.site_name || COMPANY_INFO.name;
  const addressJaipur = settings?.address_jaipur || COMPANY_INFO?.addresses?.jaipur || '143, Paschim Vihar, Vaishali Nagar, Jaipur - 302021, Rajasthan, (India)';
  const phone = settings?.phone || COMPANY_INFO?.contact?.phone || '+91-94140 68933';
  const whatsapp = settings?.whatsapp || COMPANY_INFO?.contact?.whatsapp || '+91-94140 68933';
  const email = settings?.email || COMPANY_INFO?.contact?.email || 'sales@arpranindustries.com';

  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(addressJaipur)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  const mapDirectUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressJaipur)}`;

  // Dynamic social links from CMS with reliable fallbacks
  const getSocialUrl = (platform) => {
    const found = socialLinks?.find(s => s.platform?.toLowerCase() === platform.toLowerCase());
    return found?.url;
  };

  const fbUrl = getSocialUrl('facebook') || 'https://facebook.com';
  const inUrl = getSocialUrl('linkedin') || 'https://linkedin.com';
  const instaUrl = getSocialUrl('instagram') || 'https://instagram.com';
  const twitterUrl = getSocialUrl('twitter') || getSocialUrl('x') || 'https://x.com';
  const pinterestUrl = getSocialUrl('pinterest') || 'https://pinterest.com';
  const waUrl = `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20Arpran%20Industries,%20I%20would%20like%20to%20inquire%20about%20natural%20stone%20exports.`;

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSuccess(true);
      setTimeout(() => setNewsletterSuccess(false), 5000);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="relative bg-gradient-to-b from-[#0B1528] via-[#081020] to-[#050B16] text-slate-300 overflow-hidden font-sans border-t border-amber-500/20">

      {/* Background Architectural Subtle Ambient Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-amber-500/5 blur-3xl rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8 relative z-10 space-y-6">

        {/* 1. TOP CENTERED LOGO LOCKUP (Compact & Crisp with light logo) */}
        <div className="flex flex-col items-center justify-center text-center space-y-1.5">
          <Link to="/" className="inline-flex items-center justify-center transition hover:opacity-90">
            <ArpranLogo light={true} className="h-9 sm:h-11" />
          </Link>
          <p className="text-[10px] sm:text-[11px] tracking-[0.25em] text-amber-400 uppercase font-semibold">
            {settings?.subtagline || settings?.footer_tagline || "Architectural Natural Stones & Container Exports"}
          </p>
        </div>

        {/* 2. HORIZONTAL NAVIGATION BAR WITH DIVIDERS */}
        <div className="flex justify-center">
          <nav className="inline-flex flex-wrap items-center justify-center gap-y-1 px-5 sm:px-7 py-2 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/80 shadow-lg text-[11px] font-semibold tracking-[0.16em] uppercase text-slate-300">
            {displayLinks.map((link, idx) => (
              <React.Fragment key={link.id || idx}>
                <Link
                  to={link.url}
                  className="px-2.5 sm:px-3 hover:text-amber-400 transition-colors"
                  target={link.is_external ? "_blank" : undefined}
                  rel={link.is_external ? "noopener noreferrer" : undefined}
                >
                  {link.title.toUpperCase()}
                </Link>
                {idx < displayLinks.length - 1 && (
                  <span className="text-amber-500/40 select-none">|</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>

        {/* 3. DIRECT CONTACT INFORMATION ROW */}
        <div className="flex flex-wrap items-center justify-center gap-y-2.5 gap-x-6 sm:gap-x-8 text-xs text-slate-300 text-center font-normal">
          {/* Address Jaipur */}
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{addressJaipur}</span>
          </div>

          {/* Email */}
          <div className="flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <a href={`mailto:${email}`} className="text-white hover:text-amber-300 hover:underline transition font-medium">
              {email}
            </a>
          </div>

          {/* Phone Numbers */}
          <div className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="text-white hover:text-amber-300 hover:underline transition font-semibold">
              {phone}
            </a>
          </div>
        </div>

        {/* 3.5 COMPACT LIVE GPS LOCATION MAP */}
        <div className="max-w-xl mx-auto w-full px-2">
          <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-700/80 p-3 sm:p-3.5 shadow-xl space-y-2">
            <div className="flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-amber-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-amber-400" />
                  <span>Live GPS Office Map</span>
                </span>
              </div>
              <a
                href={mapDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-amber-300 hover:text-white bg-amber-500/15 hover:bg-amber-500/30 px-2.5 py-1 rounded-full border border-amber-400/30 transition flex items-center gap-1 font-semibold"
                title="Open directions in Google Maps"
              >
                <span>Open in GPS</span>
                <ArrowRight className="w-2.5 h-2.5" />
              </a>
            </div>

            {/* Compact Live Interactive Map Frame */}
            <div className="relative w-full h-28 sm:h-32 rounded-xl overflow-hidden border border-slate-700/60 shadow-inner bg-slate-950">
              <iframe
                title="Arpran Industries GPS Map"
                src={mapEmbedUrl}
                className="w-full h-full border-0 filter contrast-[1.05]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 pt-0.5">
              <span className="truncate">{addressJaipur}</span>
              <span className="shrink-0 text-slate-500 ml-2 hidden sm:inline">Jaipur HQ • Rajasthan</span>
            </div>
          </div>
        </div>

        {/* 4. CIRCULAR SOCIAL MEDIA ICONS ROW */}
        <div className="flex items-center justify-center gap-2.5">
          {/* Facebook */}
          <a
            href={fbUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="w-8 h-8 rounded-full bg-white/5 text-slate-300 hover:text-amber-400 hover:border-amber-400/50 hover:bg-slate-800 border border-slate-700/80 shadow-xs flex items-center justify-center transition-all duration-200 hover:scale-105"
          >
            <Facebook className="w-3.5 h-3.5" />
          </a>

          {/* Instagram */}
          <a
            href={instaUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="w-8 h-8 rounded-full bg-white/5 text-slate-300 hover:text-amber-400 hover:border-amber-400/50 hover:bg-slate-800 border border-slate-700/80 shadow-xs flex items-center justify-center transition-all duration-200 hover:scale-105"
          >
            <Instagram className="w-3.5 h-3.5" />
          </a>

          {/* Pinterest */}
          <a
            href={pinterestUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Pinterest"
            className="w-8 h-8 rounded-full bg-white/5 text-slate-300 hover:text-amber-400 hover:border-amber-400/50 hover:bg-slate-800 border border-slate-700/80 shadow-xs flex items-center justify-center transition-all duration-200 hover:scale-105"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 0a12 12 0 0 0-4.37 23.18c-.06-.94-.12-2.39.02-3.42.14-.94.94-5.98.94-5.98s-.24-.48-.24-1.2c0-1.12.65-1.96 1.46-1.96.69 0 1.02.52 1.02 1.14 0 .7-.44 1.74-.68 2.7-.19.82.41 1.48 1.21 1.48 1.46 0 2.58-1.54 2.58-3.76 0-1.97-1.41-3.34-3.44-3.34-2.51 0-3.98 1.88-3.98 3.83 0 .76.29 1.57.66 2.02.07.09.08.17.06.26-.07.28-.22.9-.25 1.03-.04.17-.14.21-.32.13-1.2-.56-1.95-2.31-1.95-3.72 0-3.03 2.2-5.81 6.35-5.81 3.33 0 5.92 2.38 5.92 5.56 0 3.32-2.09 5.99-4.99 5.99-.98 0-1.9-.51-2.21-1.11l-.6 2.29c-.22.84-.81 1.89-1.21 2.53A12 12 0 1 0 12 0z" />
            </svg>
          </a>

          {/* Twitter / X */}
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter / X"
            className="w-8 h-8 rounded-full bg-white/5 text-slate-300 hover:text-amber-400 hover:border-amber-400/50 hover:bg-slate-800 border border-slate-700/80 shadow-xs flex items-center justify-center transition-all duration-200 hover:scale-105"
          >
            <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>

          {/* LinkedIn */}
          <a
            href={inUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="w-8 h-8 rounded-full bg-white/5 text-slate-300 hover:text-amber-400 hover:border-amber-400/50 hover:bg-slate-800 border border-slate-700/80 shadow-xs flex items-center justify-center transition-all duration-200 hover:scale-105"
          >
            <Linkedin className="w-3.5 h-3.5" />
          </a>

          {/* WhatsApp Direct */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="w-8 h-8 rounded-full bg-white/5 text-slate-300 hover:text-[#25D366] hover:border-[#25D366]/50 hover:bg-slate-800 border border-slate-700/80 shadow-xs flex items-center justify-center transition-all duration-200 hover:scale-105"
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 5. SUBTLE COMPACT NEWSLETTER BAR */}
        <div className="max-w-md mx-auto">
          <form onSubmit={handleNewsletterSubmit} className="flex items-center rounded-full bg-slate-900/90 border border-slate-700/80 p-1 shadow-inner focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/20 transition">
            <input
              type="email"
              placeholder="Enter work email for direct quarry updates..."
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="bg-transparent px-4 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none flex-1"
              required
            />
            <button
              type="submit"
              className="px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-bold text-[11px] uppercase tracking-wider transition shadow-sm shrink-0"
            >
              Subscribe
            </button>
          </form>
          {newsletterSuccess && (
            <p className="text-[11px] text-amber-300 text-center mt-1.5 font-medium">
              ✓ Subscribed successfully! Direct quarry updates will be sent to your email.
            </p>
          )}
        </div>

        {/* 6. BOTTOM DIVIDER & COPYRIGHT BAR */}
        <div className="pt-4 border-t border-slate-800/80 text-center text-xs text-slate-400 space-y-1">
          <p>
            {settings?.copyright_text || `© ${new Date().getFullYear()} · Copyright by ${siteName} · All Rights Reserved`}
          </p>
          <p className="text-[10px] text-amber-400/90 font-medium tracking-wider uppercase">
            "{settings?.motto || "Built by Nature. Perfected by Arpran. Delivered Worldwide."}"
          </p>
        </div>

      </div>
    </footer>
  );
}
