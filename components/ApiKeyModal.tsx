"use client";

import { useState, useEffect } from "react";
import { Key, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ApiKeyModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [apiKey, setApiKey] = useState("");

    useEffect(() => {
        const storedKey = process.env.GROQ_API_KEY || localStorage.getItem("PRAGYA_GROQ_KEY");
        if (!storedKey) {
            setIsOpen(true);
        }
    }, []);

    const handleSave = () => {
        if (apiKey.trim()) {
            localStorage.setItem("PRAGYA_GROQ_KEY", apiKey);
            // In a real app we might want to reload or update global state
            window.location.reload();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md p-8 glass-morphism rounded-2xl mx-4 animate-in fade-in zoom-in duration-300">
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                        <Key className="w-8 h-8 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Activate Pragya</h2>
                    <p className="text-slate-500 dark:text-slate-400">
                        Enter your Groq API Key to start researching papers with AI assistance.
                    </p>

                    <div className="w-full space-y-4 pt-4">
                        <div className="relative">
                            <input
                                type="password"
                                placeholder="Enter your API Key..."
                                className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={handleSave}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 group"
                        >
                            <span>Get Started</span>
                            <ShieldCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </button>
                        <p className="text-xs text-slate-400">
                            Your key is stored locally and never sent to our servers.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
