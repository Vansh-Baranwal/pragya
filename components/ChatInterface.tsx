"use client";

import { useState, useRef, useEffect } from "react";
import { Send, User, Bot, Sparkles, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import ExpertiseSlider from "./ExpertiseSlider";

export type Message = {
    id: string;
    role: "user" | "assistant";
    content: string;
    citations?: string[];
};

interface ChatInterfaceProps {
    messages: Message[];
    onSendMessage: (text: string) => void;
    isLoading: boolean;
    expertiseLevel: "Novice" | "Intermediate" | "Expert";
    onExpertiseChange: (level: "Novice" | "Intermediate" | "Expert") => void;
    error?: string | null;
}

export default function ChatInterface({
    messages,
    onSendMessage,
    isLoading,
    expertiseLevel,
    onExpertiseChange,
    error
}: ChatInterfaceProps) {
    const [input, setInput] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            onSendMessage(input.trim());
            setInput("");
        }
    };

    return (
        <div className="h-full flex flex-col bg-white dark:bg-slate-950">
            {/* Header */}
            <div className="p-6 border-b dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                        <h2 className="text-lg font-bold tracking-tight">AI Research Hub</h2>
                    </div>
                    <div className="flex gap-2">
                        <div className="px-3 py-1 bg-orange-50 dark:bg-orange-900/20 text-orange-600 text-xs font-bold rounded-full">PRAGYA</div>
                    </div>
                </div>
                <ExpertiseSlider level={expertiseLevel} onChange={onExpertiseChange} />
            </div>

            {/* Messages */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar"
            >
                {messages.length === 0 && !isLoading && (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                        <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-3xl">
                            <Sparkles className="w-10 h-10 text-blue-500" />
                        </div>
                        <div>
                            <p className="font-semibold text-slate-900 dark:text-white">Ask anything about the paper</p>
                            <p className="text-sm">I'll summarize, analyze, or explain terms for you.</p>
                        </div>
                    </div>
                )}

                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={cn(
                            "flex w-full animate-in fade-in slide-in-from-bottom-2 duration-300",
                            message.role === "user" ? "justify-end" : "justify-start"
                        )}
                    >
                        <div className={cn(
                            "flex gap-3 max-w-[85%]",
                            message.role === "user" ? "flex-row-reverse" : "flex-row"
                        )}>
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                message.role === "user" ? "bg-blue-600 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                            )}>
                                {message.role === "user" ? <User size={16} /> : <Bot size={16} />}
                            </div>
                            <div className={cn(
                                "p-4 rounded-2xl text-sm leading-relaxed",
                                message.role === "user"
                                    ? "bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-500/10"
                                    : "bg-slate-100 dark:bg-slate-800 rounded-tl-none text-slate-900 dark:text-white"
                            )}>
                                {message.content}

                                {message.citations && message.citations.length > 0 && (
                                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-2">
                                        {message.citations.map((cite, i) => (
                                            <span key={i} className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] uppercase font-bold rounded">
                                                {cite}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start animate-in fade-in duration-300">
                        <div className="flex gap-3 max-w-[85%]">
                            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 shrink-0 flex items-center justify-center">
                                <Bot size={16} />
                            </div>
                            <div className="glass-morphism p-4 rounded-2xl rounded-tl-none">
                                <div className="thinking-dots">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-xl flex gap-3 text-red-600 text-sm">
                        <AlertCircle size={18} className="shrink-0" />
                        <p>{error}</p>
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="p-6 bg-white dark:bg-slate-950 border-t dark:border-slate-800">
                <form onSubmit={handleSubmit} className="relative flex gap-2">
                    <input
                        type="text"
                        className="flex-1 bg-slate-100 dark:bg-slate-900 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-800 dark:text-white"
                        placeholder="Type your question..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="p-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white rounded-2xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center shrink-0"
                    >
                        <Send size={20} />
                    </button>
                </form>
                <p className="text-center text-[10px] text-slate-400 uppercase tracking-widest mt-4 font-bold">
                    Pragya AI can make mistakes. Verify technical details.
                </p>
            </div>
        </div>
    );
}
