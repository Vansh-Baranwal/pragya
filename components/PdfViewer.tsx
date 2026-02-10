"use client";

import { useDropzone } from "react-dropzone";
import { FileUp, FileText, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PdfViewerProps {
    isUploading: boolean;
    file: File | null;
    onUpload: (file: File) => void;
}

export default function PdfViewer({ isUploading, file, onUpload }: PdfViewerProps) {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: (acceptedFiles) => {
            if (acceptedFiles[0]) {
                onUpload(acceptedFiles[0]);
            }
        },
        accept: { "application/pdf": [".pdf"] },
        multiple: false,
        disabled: isUploading,
    });

    if (!file && !isUploading) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-900/50">
                <div
                    {...getRootProps()}
                    className={cn(
                        "w-full max-w-xl aspect-[3/4] border-2 border-dashed rounded-3xl flex flex-col items-center justify-center space-y-4 transition-all duration-300 cursor-pointer",
                        isDragActive
                            ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 scale-105"
                            : "border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-700 bg-white dark:bg-slate-900 shadow-sm"
                    )}
                >
                    <input {...getInputProps()} />
                    <div className="p-5 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 animate-pulse">
                        <FileUp className="w-12 h-12" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Upload Research Paper</h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">
                            Drag and drop your PDF here, or click to browse
                        </p>
                    </div>
                    <div className="pt-4 flex gap-2">
                        <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs text-slate-500">MAX 10MB</span>
                        <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs text-slate-500">PDF ONLY</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col p-6 bg-slate-100 dark:bg-slate-900 overflow-hidden">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg h-full overflow-y-auto custom-scrollbar">
                {/* Mock PDF Toolbar */}
                <div className="sticky top-0 z-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-b flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                            <FileText className="w-5 h-5 text-red-600" />
                        </div>
                        <span className="font-semibold truncate max-w-[200px]">{file?.name || "Processing paper..."}</span>
                    </div>
                    <div className="flex gap-2">
                        <div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-700 animate-pulse" />
                        <div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-700 animate-pulse" />
                    </div>
                </div>

                {/* Mock PDF Content (Skeleton) */}
                <div className="p-8 space-y-6">
                    {isUploading ? (
                        <div className="flex flex-col items-center justify-center py-20 space-y-4">
                            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                            <p className="text-slate-500 font-medium">Extracting knowledge from PDF...</p>
                        </div>
                    ) : (
                        <>
                            {/* Fake PDF rendering with skeletons */}
                            <div className="space-y-4">
                                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-md w-3/4 mb-8" />
                                <div className="space-y-3">
                                    {[...Array(15)].map((_, i) => (
                                        <div
                                            key={i}
                                            className={cn(
                                                "h-4 bg-slate-100 dark:bg-slate-800 rounded",
                                                i % 3 === 0 ? "w-full" : i % 3 === 1 ? "w-5/6" : "w-4/5"
                                            )}
                                        />
                                    ))}
                                </div>
                                <div className="h-40 bg-slate-100 dark:bg-slate-800 rounded-xl w-full my-8 flex items-center justify-center">
                                    <div className="text-slate-400 flex flex-col items-center gap-2">
                                        <FileText className="w-8 h-8 opacity-20" />
                                        <span className="text-xs uppercase tracking-widest opacity-30 font-bold">Figure 1.1 - Data Visualization</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    {[...Array(10)].map((_, i) => (
                                        <div
                                            key={i}
                                            className={cn(
                                                "h-4 bg-slate-100 dark:bg-slate-800 rounded",
                                                i % 4 === 0 ? "w-full" : "w-11/12"
                                            )}
                                        />
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
