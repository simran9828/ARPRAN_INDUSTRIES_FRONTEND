import React from 'react';
import { Sparkles, CheckCircle2, HelpCircle } from 'lucide-react';

/**
 * Tokenize and render inline markdown and HTML formatting (bold, italic, links).
 * Strips any leftover asterisk markers so raw stars never appear in the UI.
 */
export function renderInline(text) {
  if (!text) return null;
  const parts = [];
  // Match links [text](url), bold (**text** or __text__ or <b>/<strong>), italic (*text* or _text_ or <i>/<em>)
  const regex = /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|__([^_]+)__|<(?:strong|b)>([\s\S]*?)<\/(?:strong|b)>|\*([^*]+)\*|_([^_]+)_|<(?:em|i)>([\s\S]*?)<\/(?:em|i)>)/gi;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      // Strip any stray lone asterisks from surrounding plain text
      const cleanPlain = text.substring(lastIndex, match.index).replace(/\*\*/g, '');
      if (cleanPlain) parts.push(cleanPlain);
    }

    if (match[2] && match[3]) {
      // Link [text](url)
      parts.push(
        <a 
          key={match.index} 
          href={match[3]} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[#0A4E9B] underline hover:text-[#073b77] font-semibold"
        >
          {match[2]}
        </a>
      );
    } else if (match[4] || match[5] || match[6]) {
      // Bold: **text** or __text__ or <b>text</b> or <strong>text</strong>
      const boldText = (match[4] || match[5] || match[6]).trim();
      parts.push(
        <strong key={match.index} className="font-bold text-slate-900">
          {boldText}
        </strong>
      );
    } else if (match[7] || match[8] || match[9]) {
      // Italic: *text* or _text_ or <i>text</i> or <em>text</em>
      const italicText = (match[7] || match[8] || match[9]).trim();
      parts.push(
        <em key={match.index} className="italic text-slate-800">
          {italicText}
        </em>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    const remainder = text.substring(lastIndex).replace(/\*\*/g, '');
    if (remainder) parts.push(remainder);
  }

  return parts.length > 0 ? parts : text;
}

/**
 * Parse markdown article content into structured blocks (H1, H2, H3, H4, Quotes, Bullets, FAQs, Paragraphs).
 */
function parseContentToNodes(content) {
  if (!content) return [];
  const normalized = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const rawLines = normalized.split('\n');
  const nodes = [];

  let i = 0;
  while (i < rawLines.length) {
    const rawLine = rawLines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    // 1. Headings (check ### before ## and ## before # to avoid prefix clash)
    if (/^####\s+/.test(trimmed)) {
      nodes.push({ type: 'h4', text: trimmed.replace(/^####\s+/, '').replace(/\s+#*$/, '') });
      i++;
      continue;
    }
    if (/^###\s+/.test(trimmed)) {
      nodes.push({ type: 'h3', text: trimmed.replace(/^###\s+/, '').replace(/\s+#*$/, '') });
      i++;
      continue;
    }
    if (/^##\s+/.test(trimmed)) {
      nodes.push({ type: 'h2', text: trimmed.replace(/^##\s+/, '').replace(/\s+#*$/, '') });
      i++;
      continue;
    }
    if (/^#\s+/.test(trimmed)) {
      nodes.push({ type: 'h1', text: trimmed.replace(/^#\s+/, '').replace(/\s+#*$/, '') });
      i++;
      continue;
    }

    // 2. Blockquote: starts with ">"
    if (/^>\s*/.test(trimmed)) {
      const quoteLines = [];
      while (i < rawLines.length && /^>\s*/.test(rawLines[i].trim())) {
        quoteLines.push(rawLines[i].trim().replace(/^>\s*/, ''));
        i++;
      }
      nodes.push({ type: 'blockquote', text: quoteLines.join(' ') });
      continue;
    }

    // 3. Bullet points: starts with "• ", "- ", "* ", or numbered "1. "
    if (/^[•\-\*]\s+|^\d+\.\s+/.test(trimmed)) {
      const items = [];
      while (i < rawLines.length && (/^[•\-\*]\s+/.test(rawLines[i].trim()) || /^\d+\.\s+/.test(rawLines[i].trim()))) {
        const itemLine = rawLines[i].trim().replace(/^[•\-\*]\s+|^\d+\.\s+/, '');
        if (itemLine) items.push(itemLine);
        i++;
      }
      if (items.length > 0) {
        nodes.push({ type: 'bullets', items });
        continue;
      }
    }

    // 4. FAQ pattern: starts with Q: or **Q:
    if (/^(\*\*Q:|\*Q:|Q:)/i.test(trimmed)) {
      const faqs = [];
      let currentQ = '';
      let currentA = '';

      while (i < rawLines.length) {
        const line = rawLines[i].trim();
        if (!line) {
          const nextLine = rawLines[i + 1]?.trim() || '';
          if (/^(\*\*Q:|\*Q:|Q:)/i.test(nextLine)) {
            i++;
            continue;
          }
          if (!nextLine || /^#{1,4}\s+/.test(nextLine) || /^[•\-\*]\s+/.test(nextLine) || /^>\s*/.test(nextLine)) {
            break;
          }
        }

        if (/^(\*\*Q:|\*Q:|Q:)/i.test(line)) {
          if (currentQ) {
            faqs.push({ q: currentQ, a: currentA.trim() });
          }
          currentQ = line.replace(/^\*\*Q:\s*|\*Q:\s*|Q:\s*/i, '').replace(/\*\*$/, '').trim();
          currentA = '';
          i++;
        } else if (/^(\*\*A:|\*A:|A:)/i.test(line)) {
          currentA = line.replace(/^\*\*A:\s*|\*A:\s*|A:\s*/i, '').replace(/\*\*$/, '').trim();
          i++;
        } else if (currentQ && !line.startsWith('#') && !/^[•\-\*]/.test(line)) {
          currentA += (currentA ? ' ' : '') + line;
          i++;
        } else {
          break;
        }
      }

      if (currentQ) {
        faqs.push({ q: currentQ, a: currentA.trim() });
      }

      if (faqs.length > 0) {
        nodes.push({ type: 'faqs', faqs });
        continue;
      }
    }

    // 5. Regular paragraph: gather consecutive text lines until a header, bullet, quote, or empty line
    const paraLines = [];
    while (i < rawLines.length) {
      const line = rawLines[i].trim();
      if (!line) {
        i++;
        break; // End paragraph on blank line
      }
      if (
        /^#{1,4}\s+/.test(line) || 
        /^>\s*/.test(line) || 
        /^[•\-\*]\s+|^\d+\.\s+/.test(line) || 
        /^(\*\*Q:|\*Q:|Q:)/i.test(line)
      ) {
        break;
      }
      paraLines.push(line);
      i++;
    }

    if (paraLines.length > 0) {
      nodes.push({ type: 'paragraph', text: paraLines.join(' ') });
    }
  }

  return nodes;
}

export default function FormattedArticleContent({ content }) {
  if (!content) return null;

  const nodes = parseContentToNodes(content);

  return (
    <div className="space-y-4 text-slate-800 font-sans">
      {nodes.map((node, idx) => {
        // H1 Heading
        if (node.type === 'h1') {
          return (
            <h1 key={idx} className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-7 mb-3 pb-2 border-b-2 border-slate-200">
              {renderInline(node.text)}
            </h1>
          );
        }

        // H2 Section Heading
        if (node.type === 'h2') {
          return (
            <h2 key={idx} className="text-lg sm:text-xl font-serif font-bold text-slate-900 mt-6 mb-2 border-b border-slate-200 pb-1.5 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0A4E9B] shrink-0"></span>
              <span>{renderInline(node.text)}</span>
            </h2>
          );
        }

        // H3 Subheading
        if (node.type === 'h3') {
          return (
            <h3 key={idx} className="text-sm sm:text-base font-bold text-[#0A4E9B] mt-4 mb-1.5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-xs bg-[#0A4E9B]/70 shrink-0"></span>
              <span>{renderInline(node.text)}</span>
            </h3>
          );
        }

        // H4 Minor Heading
        if (node.type === 'h4') {
          return (
            <h4 key={idx} className="text-xs sm:text-sm font-bold text-slate-800 mt-3 mb-1">
              {renderInline(node.text)}
            </h4>
          );
        }

        // Quote
        if (node.type === 'blockquote') {
          return (
            <blockquote key={idx} className="font-serif italic text-sm sm:text-base text-slate-800 border-l-4 border-[#0A4E9B] pl-4 py-2 bg-blue-50/40 rounded-r-xl my-4 leading-relaxed">
              {renderInline(node.text)}
            </blockquote>
          );
        }

        // Bullet Points
        if (node.type === 'bullets') {
          return (
            <div key={idx} className="my-3.5 p-4 bg-slate-50 border border-slate-200 rounded-xl shadow-2xs">
              <div className="flex items-center gap-2 mb-2.5 text-xs font-bold uppercase tracking-wider text-slate-900">
                <Sparkles className="w-3.5 h-3.5 text-[#0A4E9B]" />
                <span>Key Specification Points & Takeaways</span>
              </div>
              <ul className="space-y-2">
                {node.items.map((item, lidx) => (
                  <li key={lidx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-[#0A4E9B] shrink-0 mt-0.5" />
                    <span>{renderInline(item)}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        }

        // FAQs
        if (node.type === 'faqs') {
          return (
            <div key={idx} className="my-4 p-4 sm:p-5 bg-slate-50/90 border border-slate-200 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0A4E9B]">
                <HelpCircle className="w-4 h-4" />
                <span>Frequently Asked Questions</span>
              </div>
              <div className="space-y-2.5">
                {node.faqs.map((faq, fidx) => (
                  <div key={fidx} className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs space-y-1.5">
                    <div className="text-xs sm:text-sm font-bold text-slate-900 flex items-start gap-2">
                      <span className="text-[#0A4E9B] font-mono text-xs shrink-0">Q:</span>
                      <span>{renderInline(faq.q)}</span>
                    </div>
                    {faq.a && (
                      <div className="text-xs text-slate-600 leading-relaxed pt-1.5 border-t border-slate-100 pl-5">
                        {renderInline(faq.a)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        }

        // Paragraph
        return (
          <p key={idx} className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {renderInline(node.text)}
          </p>
        );
      })}
    </div>
  );
}
