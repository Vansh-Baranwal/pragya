"use client";

import { useState } from "react";
import { Search, BookOpen, Star, ArrowRight, Filter } from "lucide-react";
import { mockPapers, categories, ResearchPaper } from "@/lib/mock-papers";
import { cn } from "@/lib/utils";

interface ResearchLibraryProps {
    onSelectPaper: (paper: ResearchPaper) => void;
}

export default function ResearchLibrary({ onSelectPaper }: ResearchLibraryProps) {
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");

    const filtered = mockPapers.filter((paper) => {
        const matchesSearch =
            search === "" ||
            paper.title.toLowerCase().includes(search.toLowerCase()) ||
            paper.authors.some((a) => a.toLowerCase().includes(search.toLowerCase())) ||
            paper.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

        const matchesCategory =
            activeCategory === "All" || paper.category === activeCategory;

        return matchesSearch && matchesCategory;
    });

    const formatCitations = (n: number) => {
        if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
        return n.toString();
    };

    return (
        <div className="h-full flex flex-col bg-white dark:bg-slate-950">
            {/* Header */}
            <div className="p-6 border-b dark:border-slate-800">
                <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                        Research Library
                    </h2>
                    <span className="ml-auto px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 text-xs font-bold rounded-full">
                        {mockPapers.length} Papers
                    </span>
                </div>

                {/* Search */}
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search papers, authors, or topics..."
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-900 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-800 dark:text-white"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Category Filter */}
                <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={cn(
                                "px-3 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition-all",
                                activeCategory === cat
                                    ? "bg-blue-600 text-white"
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Paper Cards */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {filtered.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-50 space-y-2">
                        <Filter className="w-8 h-8 text-slate-400" />
                        <p className="text-sm text-slate-500">No papers match your search</p>
                    </div>
                )}

                {filtered.map((paper) => (
                    <div
                        key={paper.id}
                        onClick={() => onSelectPaper(paper)}
                        className="group p-4 bg-slate-50 dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-xl cursor-pointer transition-all duration-200 border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sm text-slate-900 dark:text-white leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                                    {paper.title}
                                </h3>
                                <p className="text-xs text-slate-500 mt-1 truncate">
                                    {paper.authors.join(", ")}
                                </p>
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                                    {paper.abstract}
                                </p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 shrink-0 mt-1 transition-colors" />
                        </div>

                        <div className="flex items-center gap-2 mt-3 flex-wrap">
                            {paper.tags.slice(0, 3).map((tag) => (
                                <span
                                    key={tag}
                                    className="px-2 py-0.5 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold uppercase rounded"
                                >
                                    {tag}
                                </span>
                            ))}
                            <span className="ml-auto flex items-center gap-1 text-[10px] text-slate-400 font-semibold">
                                <Star className="w-3 h-3" />
                                {formatCitations(paper.citations)}
                            </span>
                            <span className="text-[10px] text-slate-400 font-semibold">
                                {paper.year} · {paper.journal}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
