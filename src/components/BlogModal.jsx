import React, { useState } from 'react';
import { X, Calendar, Clock, BookOpen, CheckCircle2, HelpCircle, ChevronDown, Sparkles } from 'lucide-react';
import FormattedArticleContent from './FormattedArticleContent';

export default function BlogModal({ blog, onClose }) {
  const [activeFaq, setActiveFaq] = useState(0);

  if (!blog) return null;

  const sections = Array.isArray(blog.sections) ? blog.sections : [];
  const keyPoints = Array.isArray(blog.key_points) ? blog.key_points.filter(Boolean) : [];
  const faqs = Array.isArray(blog.faqs) ? blog.faqs.filter(f => f.question || f.answer) : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-200 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:px-6 border-b border-slate-100 bg-slate-50 shrink-0">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-500">
            <span className="font-bold uppercase tracking-wider text-[#0A4E9B] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
              {blog.category || 'Architecture & Trends'}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" /> {blog.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" /> {blog.readTime || blog.read_time}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-8 overflow-y-auto space-y-6">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-slate-900 leading-snug">
            {blog.title}
          </h1>

          <div className="aspect-16/9 rounded-xl sm:rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm relative">
            <img
              src={blog.image}
              alt={blog.alt_text || blog.title}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = '/images/blog-granite.jpg'; }}
            />
          </div>

          <div className="prose prose-slate max-w-none text-sm sm:text-base text-slate-700 leading-relaxed space-y-6">
            
            {/* Excerpt Pull-Quote */}
            {blog.excerpt && (
              <div className="font-serif italic text-base text-slate-800 border-l-3 border-[#0A4E9B] pl-4 py-1 bg-blue-50/40 rounded-r-xl">
                {blog.excerpt}
              </div>
            )}

            {/* Formatted Article Body Content */}
            {blog.content ? (
              <FormattedArticleContent content={blog.content} />
            ) : (
              <p className="leading-relaxed">
                At Arpran Industries, every block is hand-selected from certified Rajasthan and South Indian quarries, cut with high-precision gangsaw blades, and surfaced according to strict international architectural specifications.
              </p>
            )}

            {/* Legacy Structured Key Points (if present) */}
            {keyPoints.length > 0 && !blog.content?.includes('• ') && (
              <div className="my-6 p-5 sm:p-6 bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-lg bg-blue-50 text-[#0A4E9B] flex items-center justify-center font-bold text-xs">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900">
                    Key Architectural Takeaways & Specification Points
                  </h4>
                </div>
                <ul className="space-y-2.5">
                  {keyPoints.map((point, pidx) => (
                    <li key={pidx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-[#0A4E9B] shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Legacy Structured Sections (if present) */}
            {sections.length > 0 && !blog.content?.includes('## ') && (
              <div className="space-y-6 pt-2">
                {sections.map((sec, sidx) => (
                  <div key={sidx} className="space-y-2 pt-2 border-t border-slate-100 first:border-none first:pt-0">
                    {sec.heading && (
                      <h2 className="text-lg sm:text-xl font-serif font-bold text-slate-900 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#0A4E9B] inline-block"></span>
                        <span>{sec.heading}</span>
                      </h2>
                    )}
                    {sec.subheading && (
                      <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#0A4E9B] pl-4">
                        {sec.subheading}
                      </h3>
                    )}
                    {sec.content && (
                      <p className="text-slate-700 leading-relaxed pl-4">
                        {sec.content}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Legacy Structured FAQs Section (if present) */}
            {faqs.length > 0 && !blog.content?.toLowerCase().includes('q:') && (
              <div className="pt-6 border-t border-slate-200 space-y-4">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-[#0A4E9B]" />
                  <h3 className="text-lg sm:text-xl font-bold font-serif text-slate-900">
                    Frequently Asked Questions
                  </h3>
                </div>

                <div className="space-y-3">
                  {faqs.map((faq, fidx) => (
                    <div 
                      key={fidx}
                      className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs transition"
                    >
                      <button
                        type="button"
                        onClick={() => setActiveFaq(activeFaq === fidx ? -1 : fidx)}
                        className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-slate-900 hover:text-[#0A4E9B] transition-colors cursor-pointer"
                      >
                        <span>{faq.question}</span>
                        <ChevronDown 
                          className={`w-4 h-4 text-[#0A4E9B] shrink-0 transition-transform duration-200 ${
                            activeFaq === fidx ? 'rotate-180' : ''
                          }`} 
                        />
                      </button>
                      {activeFaq === fidx && (
                        <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Brand Assurances Statement */}
            <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 text-xs text-slate-600 leading-relaxed mt-6">
              At Arpran Industries, every block is hand-selected from certified Rajasthan and South Indian quarries, cut with high-precision gangsaw blades, and surfaced according to strict international architectural specifications. Whether for expansive civic flooring or bespoke villa interiors, our material selection guarantees lasting aesthetic excellence.
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:px-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
          <span className="text-[11px] sm:text-xs text-slate-500">
            Published by Arpran Technical Research Division
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#0A4E9B] hover:bg-[#073b77] text-white text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Close Article
          </button>
        </div>

      </div>
    </div>
  );
}
