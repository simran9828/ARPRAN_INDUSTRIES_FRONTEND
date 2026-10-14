import React, { useState } from 'react';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';
import { COMPANY_INFO } from '../data/stoneData';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Welcome to Arpran Industries! Looking for gangsaw granite slabs, Makrana white marble, or flexible stone veneers?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    const newMessages = [...messages, { sender: 'user', text: userText }];
    setMessages(newMessages);
    setInput('');

    // Automated smart assistant response
    setTimeout(() => {
      const lower = userText.toLowerCase();
      let reply = "Thank you for reaching out! Our stone export specialists will review your requirements. You can also chat directly on WhatsApp at +91 93140 10250.";

      if (lower.includes('price') || lower.includes('cost') || lower.includes('rate') || lower.includes('quote')) {
        reply = "Our pricing is customized based on block caliber, slab thickness (18mm/20mm/30mm), and port of delivery (FOB Mundra / CIF international ports). Please specify your square footage in our Contact form or on WhatsApp!";
      } else if (lower.includes('granite') || lower.includes('black galaxy') || lower.includes('viscon')) {
        reply = "We offer over 50 Indian granite varieties including Black Galaxy, Viscon White, Tan Brown, and Absolute Black in polished, flamed, and honed finishes.";
      } else if (lower.includes('marble') || lower.includes('makrana') || lower.includes('white')) {
        reply = "Our Makrana White Marble is quarried directly from Nagaur, Rajasthan. We supply 99% pure calcite marble slabs and tiles worldwide.";
      } else if (lower.includes('veneer') || lower.includes('thin') || lower.includes('flexible')) {
        reply = "Arpran natural stone veneer is ultra-thin (1.5mm - 2.0mm) with fiberglass backing, available in both opaque and translucent backlit sheets.";
      }

      setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[460px] animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-950 via-[#0A4E9B] to-slate-950 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center font-bold text-xs">
                AI
              </div>
              <div>
                <h4 className="text-sm font-bold">Arpran Stone Concierge</h4>
                <p className="text-[10px] text-cyan-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Online | Jaipur HQ
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-300 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-xl leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#0A4E9B] text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-xs'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* WhatsApp Direct Action */}
          <div className="p-2 bg-emerald-50 border-t border-emerald-100 flex items-center justify-between text-[11px] text-emerald-800">
            <span>Prefer WhatsApp?</span>
            <a
              href={`https://wa.me/${(COMPANY_INFO?.contact?.whatsapp || '919414068933').replace(/[^0-9]/g, '')}?text=Hello%20Arpran%20Industries,%20I%20have%20an%20architectural%20stone%20inquiry.`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold underline text-emerald-700 hover:text-emerald-900"
            >
              Chat on WhatsApp ›
            </a>
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSend} className="p-2.5 bg-white border-t border-slate-200 flex gap-2">
            <input
              type="text"
              placeholder="Ask about stones, finishes, exports..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A4E9B]"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-[#0A4E9B] hover:bg-[#073b77] text-white rounded-lg transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-3 bg-[#0A4E9B] hover:bg-[#073b77] text-white rounded-full shadow-2xl transition hover:scale-105 group border-2 border-white/40"
          title="Chat with Arpran Stone Concierge"
        >
          <MessageSquare className="w-5 h-5 text-cyan-300" />
          <span className="text-xs font-bold tracking-wider hidden sm:inline">Stone Inquiry</span>
        </button>
      )}
    </div>
  );
}
