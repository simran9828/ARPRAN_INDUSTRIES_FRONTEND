import React from 'react';
import { Sparkles, CheckCircle2, HelpCircle } from 'lucide-react';

export default function FormattedArticleContent({ content }) {
  if (!content) return null;

  const blocks = content.split(/\n\s*\n/).map(b => b.trim()).filter(Boolean);

  return (
    <div className="space-y-4 text-slate-800">
      {blocks.map((block, bidx) => {
        // H2 Heading: starts with "## " (not "### ")
        if (block.startsWith('## ') && !block.startsWith('### ')) {
          return (
            <h2 key={bidx} className="text-lg sm:text-xl font-serif font-bold text-slate-900 mt-6 mb-2 border-b border-slate-100 pb-1.5 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0A4E9B] shrink-0"></span>
              <span>{block.replace(/^##\s+/, '')}</span>
            </h2>
          );
        }

        // H3 Subheading: starts with "### "
        if (block.startsWith('### ')) {
          return (
            <h3 key={bidx} className="text-sm sm:text-base font-bold text-[#0A4E9B] mt-4 mb-1.5 flex items-center gap-1.5">
              <span>{block.replace(/^###\s+/, '')}</span>
            </h3>
          );
        }

        // Quote: starts with "> "
        if (block.startsWith('> ')) {
          return (
            <blockquote key={bidx} className="font-serif italic text-sm text-slate-800 border-l-3 border-[#0A4E9B] pl-4 py-2 bg-blue-50/40 rounded-r-xl my-3">
              {block.replace(/^>\s*/, '')}
            </blockquote>
          );
        }

        // Bullet points: lines starting with •, -, or *
        const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
        const isBulletList = lines.length > 0 && lines.every(l => /^[•\-\*]\s/.test(l));

        if (isBulletList) {
          return (
            <div key={bidx} className="my-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-slate-900">
                <Sparkles className="w-3.5 h-3.5 text-[#0A4E9B]" />
                <span>Key Specification Points & Takeaways</span>
              </div>
              <ul className="space-y-2">
                {lines.map((line, lidx) => (
                  <li key={lidx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-[#0A4E9B] shrink-0 mt-0.5" />
                    <span>{line.replace(/^[•\-\*]\s*/, '')}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        }

        // FAQ block: contains Q: or **Q:**
        if (block.includes('Q:') || block.includes('**Q:')) {
          const faqLines = block.split('\n').map(l => l.trim()).filter(Boolean);
          let currentQ = '';
          let currentA = '';
          const parsedFaqs = [];

          for (const line of faqLines) {
            if (/^(\*\*Q:|\*Q:|Q:)/i.test(line)) {
              if (currentQ) parsedFaqs.push({ q: currentQ, a: currentA });
              currentQ = line.replace(/^\*\*Q:\s*|\*Q:\s*|Q:\s*/i, '').replace(/\*\*$/, '').trim();
              currentA = '';
            } else if (/^(\*\*A:|\*A:|A:)/i.test(line)) {
              currentA = line.replace(/^\*\*A:\s*|\*A:\s*|A:\s*/i, '').replace(/\*\*$/, '').trim();
            } else if (currentQ) {
              currentA += (currentA ? ' ' : '') + line;
            }
          }
          if (currentQ) parsedFaqs.push({ q: currentQ, a: currentA });

          if (parsedFaqs.length > 0) {
            return (
              <div key={bidx} className="my-4 p-4 bg-slate-50/90 border border-slate-200 rounded-xl space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0A4E9B]">
                  <HelpCircle className="w-4 h-4" />
                  <span>Frequently Asked Questions</span>
                </div>
                {parsedFaqs.map((faq, fidx) => (
                  <div key={fidx} className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs space-y-1">
                    <div className="text-xs sm:text-sm font-bold text-slate-900">
                      {faq.q}
                    </div>
                    {faq.a && (
                      <div className="text-xs text-slate-600 leading-relaxed pt-1 border-t border-slate-100">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            );
          }
        }

        // Regular paragraph
        return (
          <p key={bidx} className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {block}
          </p>
        );
      })}
    </div>
  );
}
