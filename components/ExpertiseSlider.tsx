"use client";

import { cn } from "@/lib/utils";

type Level = "Novice" | "Intermediate" | "Expert";

interface ExpertiseSliderProps {
    level: Level;
    onChange: (level: Level) => void;
}

const levels: Level[] = ["Novice", "Intermediate", "Expert"];

export default function ExpertiseSlider({ level, onChange }: ExpertiseSliderProps) {
    return (
        <div className="relative flex p-1 bg-slate-100 dark:bg-slate-800 rounded-full w-full max-w-xs mx-auto mb-6">
            <div
                className={cn(
                    "absolute top-1 bottom-1 w-[calc(33.33%-4px)] bg-white dark:bg-slate-700 rounded-full shadow-sm transition-all duration-300 ease-in-out",
                    level === "Novice" && "translate-x-0",
                    level === "Intermediate" && "translate-x-full",
                    level === "Expert" && "translate-x-[200%]"
                )}
            />
            {levels.map((item) => (
                <button
                    key={item}
                    onClick={() => onChange(item)}
                    className={cn(
                        "relative z-10 flex-1 px-3 py-1.5 text-sm font-medium transition-colors duration-200",
                        level === item ? "text-blue-600 dark:text-blue-400" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                    )}
                >
                    {item}
                </button>
            ))}
        </div>
    );
}
