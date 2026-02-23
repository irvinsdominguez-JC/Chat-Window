/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useDragControls } from "motion/react";
import { 
  SendHorizontal, 
  MessageCircle, 
  Minus, 
  X, 
  FileText, 
  Paperclip,
} from "lucide-react";
import Markdown from "react-markdown";
import { chatModel, Message } from "./services/geminiService";
import { cn } from "./utils";

export default function App() {
  const [isOpen, setIsOpen] = useState(true);
  const dragControls = useDragControls();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "model",
      text: "Hello, how can I help you?",
      timestamp: new Date(),
    },
    {
      id: "2",
      role: "model",
      text: "Thank you for chatting in today. My name is Joan S. How can I help you with Jonas Chorum's property management solutions today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current && isOpen) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      text: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await chatModel.sendMessage({ message: input });
      const modelMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "model",
        text: response.text || "I'm sorry, I couldn't process that.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, modelMessage]);
    } catch (error) {
      console.error("Chat Error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "model",
        text: "I encountered an error. Please try again later.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-50 font-sans">
      <AnimatePresence>
        {!isOpen ? (
          <motion.div
            key="ribbon"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-auto"
          >
            <button
              onClick={() => setIsOpen(true)}
              className="bg-[#4A5D8A] text-white px-8 py-2 rounded-b-xl shadow-lg flex items-center justify-center gap-2 hover:bg-[#3A4D7A] transition-all group min-w-[140px]"
            >
              <MessageCircle size={18} className="group-hover:scale-110 transition-transform" />
              <span className="font-medium tracking-wide">Joan S</span>
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="window"
            drag
            dragControls={dragControls}
            dragListener={false}
            dragMomentum={false}
            initial={{ y: 100, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.9 }}
            className="absolute bottom-6 right-6 w-[400px] h-[600px] bg-[#F8FAFC] rounded-xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 pointer-events-auto"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-5 pointer-events-none overflow-hidden">
              <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0 0 L100 0 L100 100 Z" fill="#4A5D8A" />
                <path d="M0 100 L100 0 L0 0 Z" fill="#DCE4F2" />
              </svg>
            </div>

            {/* Header */}
            <header 
              onPointerDown={(e) => dragControls.start(e)}
              className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-[#4A5D8A] text-white shadow-md cursor-grab active:cursor-grabbing touch-none"
            >
              <div className="flex items-center gap-3 select-none">
                <MessageCircle size={24} className="text-white" />
                <h1 className="text-lg font-medium">Joan S. - AI</h1>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-white/10 p-1 rounded transition-colors"
                >
                  <Minus size={20} />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-white/10 p-1 rounded transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </header>

            {/* Chat Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-6 py-8 space-y-8 scroll-smooth z-10"
            >
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex flex-col max-w-[85%]",
                      msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
                    )}
                  >
                    <div className="flex items-start gap-2">
                      {msg.role === "model" && (
                        <div className="w-10 h-10 shrink-0 mt-1">
                          <svg viewBox="0 0 100 100" className="w-full h-full">
                            <path d="M50 0 A50 50 0 0 1 100 50 L50 50 Z" fill="#004A8D" />
                            <path d="M100 50 A50 50 0 0 1 50 100 L50 50 Z" fill="#0072CE" />
                            <path d="M50 100 A50 50 0 0 1 0 50 L50 50 Z" fill="#00A3E0" />
                          </svg>
                        </div>
                      )}
                      <div
                        className={cn(
                          "px-5 py-3 rounded-2xl text-[15px] leading-relaxed shadow-sm",
                          msg.role === "user" 
                            ? "bg-[#DCE4F2] text-[#333] rounded-tr-none" 
                            : "bg-[#4A5D8A] text-white rounded-tl-none"
                        )}
                      >
                        <div className="markdown-body prose prose-sm max-w-none">
                          <Markdown>{msg.text}</Markdown>
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] text-gray-500 mt-1 px-1 font-medium">
                      {msg.role === "user" ? "Me" : "Joan S"}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-1.5 bg-[#4A5D8A] px-4 py-3 rounded-2xl w-16"
                >
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" />
                </motion.div>
              )}
            </div>

            {/* Input Area */}
            <footer className="p-6 bg-white border-t border-gray-100 z-10">
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-4">
                  <textarea
                    rows={2}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Type a message..."
                    className="flex-1 bg-white border border-gray-200 rounded-lg px-4 py-3 text-[15px] focus:outline-none focus:border-[#4A5D8A] resize-none min-h-[80px]"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                    className={cn(
                      "p-2 rounded-full transition-all duration-200",
                      input.trim() && !isTyping 
                        ? "text-[#00A3E0] scale-110" 
                        : "text-gray-300 scale-100"
                    )}
                  >
                    <SendHorizontal size={28} />
                  </button>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <div className="w-5 h-5">
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        <path d="M50 0 A50 50 0 0 1 100 50 L50 50 Z" fill="#004A8D" />
                        <path d="M100 50 A50 50 0 0 1 50 100 L50 50 Z" fill="#0072CE" />
                        <path d="M50 100 A50 50 0 0 1 0 50 L50 50 Z" fill="#00A3E0" />
                      </svg>
                    </div>
                    <span className="text-[10px] font-bold tracking-tight text-[#333]">CHORUM</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="text-[#00A3E0] hover:text-[#0072CE] transition-colors">
                      <FileText size={20} />
                    </button>
                    <button className="text-[#00A3E0] hover:text-[#0072CE] transition-colors">
                      <Paperclip size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
