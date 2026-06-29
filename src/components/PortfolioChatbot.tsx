import React, { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { API_BASE } from "../config";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function PortfolioChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hey — ask me anything about this portfolio's owner: their projects, skills, or experience."
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [focused, setFocused] = useState(false);
  
  const logRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom of log when messages change or typing status updates
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Append user message
    const userMsg: Message = { role: "user", content: text };
    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setInputVal("");
    setIsTyping(true);

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: updatedHistory.slice(0, -1) // Send history excluding the latest user message
        })
      });

      const data = await res.json();
      
      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.error || "Sorry, I encountered an issue. Please try again." }
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply }
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I couldn't reach the server. Please check your network connection." }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputVal);
  };

  // Quick Action Prompt Chips
  const actionPrompts = [
    "What is your tech stack?",
    "Tell me about KavachAI",
    "Where did you study?",
    "How can I contact you?"
  ];

  return (
    <div id="pcb-root">
      {/* Launcher with ambient ping rings */}
      <div className="pcb-launcher-wrap">
        {!isOpen && (
          <>
            <span className="pcb-ping"></span>
            <span className="pcb-ping pcb-ping--delay"></span>
          </>
        )}
        <button
          id="pcb-launcher"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open chat assistant"
          aria-expanded={isOpen}
        >
          {!isOpen ? (
            <svg id="pcb-icon-chat" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4H20V16H10L5 20V16H4V4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg id="pcb-icon-close" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 5L19 19M19 5L5 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          )}
        </button>
      </div>

      {/* Chat Panel Box */}
      <div
        id="pcb-panel"
        className={isOpen ? "pcb-open" : "pcb-closed"}
        role="dialog"
        aria-label="Chat with portfolio assistant"
        aria-hidden={!isOpen}
      >
        <div className="pcb-glow-border"></div>

        {/* Header Panel */}
        <header className="pcb-header">
          <div className="pcb-header-left">
            <span className="pcb-status-dot"></span>
            <div>
              <p className="pcb-header-title">PORTFOLIO ASSISTANT</p>
              <p className="pcb-header-sub">ASK ABOUT PROJECTS · SKILLS · EXPERIENCE</p>
            </div>
          </div>
        </header>

        {/* Chat Messages Log */}
        <div id="pcb-log" className="pcb-log" ref={logRef}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`pcb-entry pcb-entry--${msg.role === "user" ? "user" : "bot"} pcb-msg-visible pcb-msg-glow`}
            >
              <span className={`pcb-tag ${msg.role === "user" ? "pcb-tag--user" : "pcb-tag--bot"}`}>
                {msg.role === "user" ? "YOU" : "ASSISTANT"}
              </span>
              <div className="pcb-bubble">
                {msg.content}
              </div>
            </div>
          ))}

          {/* Bot Typing indicator */}
          {isTyping && (
            <div className="pcb-entry pcb-entry--bot pcb-msg-visible">
              <span className="pcb-tag pcb-tag--bot">ASSISTANT</span>
              <div className="pcb-bubble">
                <span className="pcb-thinking">thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Action Prompt Chips */}
        {messages.length === 1 && !isTyping && (
          <div className="px-4 py-2 flex flex-wrap gap-2 justify-start border-t border-white/5 bg-black/20 z-10">
            {actionPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSendMessage(prompt)}
                className="text-[9px] font-sans text-neutral-400 hover:text-white border border-white/5 hover:border-[#D4AF37]/30 bg-white/1 hover:bg-[#D4AF37]/5 px-2.5 py-1.5 rounded-full transition-all duration-300 cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar Form */}
        <form
          id="pcb-form"
          onSubmit={handleFormSubmit}
          className={`pcb-input-row ${focused ? "pcb-focused" : ""}`}
        >
          <span className="pcb-prompt-glyph">&gt;</span>
          <input
            id="pcb-input"
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Ask a question..."
            aria-label="Type your message"
            autoComplete="off"
          />
          <button
            type="submit"
            id="pcb-send"
            disabled={!inputVal.trim() || isTyping}
            aria-label="Send message"
          >
            <Send size={14} />
          </button>
        </form>
      </div>
    </div>
  );
}
