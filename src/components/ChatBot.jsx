
import { useState, useRef, useEffect } from "react";
import { X, Send, Loader2, MessageSquare, ChevronDown } from "lucide-react";
import LightProfile from "@/assets/bg-light.png";
import DarkProfile  from "@/assets/bg-black.png";

// Groq retired llama-3.3-70b-versatile on 2026-08-16. Override with VITE_GROQ_MODEL in .env if needed.
const MODEL = import.meta.env.VITE_GROQ_MODEL || "openai/gpt-oss-120b";

const SYSTEM_PROMPT = `You are a friendly AI assistant embedded in Mark Quitaleg's personal portfolio website. Your job is to help visitors learn about Mark and his work.

Here is everything you know about Mark:

PERSONAL INFO:
- Full name: Mark Quitaleg
- Location: Dasmariñas, Cavite, Philippines
- Age: 22 years old, Filipino
- Role: Video Editor & Graphics Designer

EDUCATION:
- Kolehiyo ng Lungsod ng Dasmariñas — BS Information Systems (2022–Present), Dean's Lister
- Dasmarinas Integrated High School — HUMSS strand (2016–2022), Graduated with honors

EXPERIENCE:
- Freelance Video Editor (WFH, 2023–Present)
- Head of Video Editing Team (Organization, 2023–2024)
- Vice President of Multimedia Org (2024–2025)

SKILLS:
- Film Editing (Premiere Pro, Capcut, Color Grading)
- Commercial & Advertising videos
- Social Media & Short-Form content
- Trailer & Promo Videos
- Graphics Design (Photoshop, Canva, Illustrator)

TOOLS: Premiere Pro, After Effects, Capcut, Freepik, Canva, Adobe Illustrator, Figma, Adobe Lightroom, Photoshop, ChatGPT, Pixabay, Pexels, KineMaster

PROJECTS:
1. UNEP — awareness video
2. Mr and Ms Nursing 2025 Trailer
3. Unicharm Logo Animation
4. Car Montage — client work
5. NOVUS Logo Animation
6. Wooden Horse Steakhouse — promo video
7. Mobile Legends & Call of Duty Teaser
8. Sining Malaya — arts festival promo
9. Pre-debut 18th Birthday — client video

CONTACT: quitalegmj24@gmail.com

Keep answers short, warm, and conversational. If someone wants to hire Mark, encourage them to use the Contact button or email him. Never make up information not listed above.`;

const ChatBot = ({ darkMode }) => {
  const [isOpen,    setIsOpen]    = useState(false);
  const [input,     setInput]     = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages,  setMessages]  = useState([
    { role: "assistant", content: "Hey! I'm Mark's assistant. Ask me anything about his work or how to get in touch." },
  ]);

  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isOpen]);
  useEffect(() => { if (isOpen) setTimeout(() => inputRef.current?.focus(), 200); }, [isOpen]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;
    if (!import.meta.env.VITE_GROQ_API_KEY) {
      console.error("[ChatBot] VITE_GROQ_API_KEY is missing. Add it to .env and restart the dev server.");
      setMessages(prev => [...prev, { role: "user", content: text }, { role: "assistant", content: import.meta.env.DEV ? "Chat error: VITE_GROQ_API_KEY is missing. Add it to a .env file and restart npm run dev." : "Sorry, the assistant is unavailable right now. Please email Mark directly." }]);
      setInput("");
      return;
    }
    const history = [...messages, { role: "user", content: text }];
    setMessages(history);
    setInput("");
    setIsLoading(true);
    try {
      const res  = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}` },
        body: JSON.stringify({
          model: MODEL, max_tokens: 1500, temperature: 0.7,
          ...(MODEL.startsWith("openai/gpt-oss") ? { reasoning_effort: "low" } : {}),
          messages: [{ role: "system", content: SYSTEM_PROMPT }, ...history.map(m => ({ role: m.role, content: m.content }))],
        }),
      });
      const data  = await res.json();
      let reply = data.choices?.[0]?.message?.content;
      if (!reply) {
        const detail = data.error?.message || `HTTP ${res.status}`;
        console.error("[ChatBot] Groq error:", detail, data);
        reply = import.meta.env.DEV ? `Chat error: ${detail}` : "Sorry, the assistant is unavailable right now. Please email Mark directly.";
      }
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Network error — please try again." }]);
    } finally { setIsLoading(false); }
  };

  const onKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

  const avatar = darkMode ? DarkProfile : LightProfile;

  // â”€â”€ tokens mirroring mk() from Profile.jsx â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const g = {
    panel: "bg-bg border border-line", header: "border-b border-line",
    aiBubble: "bg-surface border border-line text-fg", userBubble: "bg-accent text-onaccent",
    inputBar: "border-t border-line",
    inputField: "bg-surface border border-line text-fg placeholder:text-muted focus:border-muted",
    sendBtn: "bg-accent text-onaccent hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed",
    nameColor: "text-fg", subColor: "text-muted", brand: "text-muted",
    closeBtn: "text-muted hover:text-fg border border-line", dot: "bg-accent",
    fab: "bg-surface border border-line text-fg shadow-lg hover:border-muted",
    fabIcon: "currentColor", scrollThumb: "rgba(128,128,128,0.3)", typingDot: "bg-muted",
    shadow: "shadow-2xl",
  };

  return (
    <>
      <style>{`
        .chatscroll::-webkit-scrollbar { width: 2px; }
        .chatscroll::-webkit-scrollbar-track { background: transparent; }
        .chatscroll::-webkit-scrollbar-thumb { background: ${g.scrollThumb}; border-radius: 99px; }
        .chatscroll { scrollbar-width: thin; scrollbar-color: ${g.scrollThumb} transparent; }
      `}</style>

      {/* â”€â”€ Panel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div
        className={`
          fixed right-4 sm:right-6 z-50
          w-[calc(100vw-2rem)] sm:w-[320px]
          rounded-md overflow-hidden
          ${g.panel} ${g.shadow}
          transition-all duration-300 ease-out
          ${isOpen
            ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
            : "opacity-0 translate-y-4 scale-[0.97] pointer-events-none"}
        `}
        style={{ bottom: "76px", maxHeight: "min(520px, calc(100vh - 80px))", display: "flex", flexDirection: "column" }}
      >

        {/* Header */}
        <div className={`flex items-center justify-between px-3.5 py-2.5 ${g.header}`}>
          <div className="flex items-center gap-2.5">
            <div className="relative flex-shrink-0">
              <img src={avatar} alt="Mark" className="w-9 h-9 rounded-md object-cover" />
              <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full ${g.dot}`} />
            </div>
            <div>
              <p className={`text-[13px] font-semibold tracking-tight leading-tight ${g.nameColor}`}>
                Mark's Assistant
              </p>
              <p className={`text-[10px] tracking-[0.1em] uppercase ${g.subColor}`}>AI · Online</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className={`p-1 rounded-md transition-all ${g.closeBtn}`}
            aria-label="Close"
          >
            <ChevronDown size={11} />
          </button>
        </div>

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto px-3.5 py-3 space-y-2.5 chatscroll"
          style={{ minHeight: 0 }}
        >
          {messages.map((msg, i) => (
            <div key={i} className={`flex items-end gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>

              {msg.role === "assistant" && (
                <img src={avatar} alt="Mark" className="w-5 h-5 rounded-md object-cover flex-shrink-0 mb-0.5" />
              )}

              <div
                className={`
                  max-w-[80%] px-3 py-2 text-[13px] leading-relaxed rounded-md
                  ${msg.role === "user" ? g.userBubble : g.aiBubble}
                `}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isLoading && (
            <div className="flex items-end gap-2">
              <img src={avatar} alt="Mark" className="w-5 h-5 rounded-md object-cover flex-shrink-0" />
              <div className={`px-3 py-2.5 rounded-md ${g.aiBubble}`}>
                <div className="flex items-center gap-1">
                  {[0, 150, 300].map(delay => (
                    <span
                      key={delay}
                      className={`w-1 h-1 rounded-full animate-bounce ${g.typingDot}`}
                      style={{ animationDelay: `${delay}ms` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className={`px-3 pb-3 pt-2.5 ${g.inputBar}`}>
          <div className="flex items-center gap-1.5">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder="Ask something…"
              disabled={isLoading}
              className={`
                flex-1 px-2.5 py-1.5 rounded-md text-[13px] outline-none
                transition-all duration-150
                ${g.inputField}
              `}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className={`w-9 h-9 rounded-md flex items-center justify-center flex-shrink-0 transition-all duration-150 ${g.sendBtn}`}
            >
              {isLoading ? <Loader2 size={11} className="animate-spin" /> : <Send size={11} />}
            </button>
          </div>
          <p className={`text-[10px] text-center mt-2 tracking-[0.2em] uppercase ${g.brand}`}>
            Powered by Mark AI
          </p>
        </div>
      </div>

      {/* â”€â”€ FAB â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <button
        onClick={() => setIsOpen(v => !v)}
        aria-label="Toggle chat"
        className={`
          fixed bottom-5 right-4 sm:right-6 z-50
          flex items-center gap-1.5
          px-4 py-2.5 rounded-full
          text-[13px] font-medium
          transition-all duration-200
          ${g.fab}
        `}
      >
        {isOpen ? (
          <>
            <X size={11} />
            <span>Close</span>
          </>
        ) : (
          <>
            <MessageSquare size={11} color={g.fabIcon} />
            <span>Ask about Mark</span>
          </>
        )}
      </button>
    </>
  );
};

export default ChatBot;
