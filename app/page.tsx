"use client";

import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import PdfViewer from "@/components/PdfViewer";
import ChatInterface, { Message } from "@/components/ChatInterface";
import ApiKeyModal from "@/components/ApiKeyModal";
import ResearchLibrary from "@/components/ResearchLibrary";
import { ResearchPaper } from "@/lib/mock-papers";
import { BookOpen, MessageSquare } from "lucide-react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [expertiseLevel, setExpertiseLevel] = useState<"Novice" | "Intermediate" | "Expert">("Intermediate");
  const [activeTab, setActiveTab] = useState<"library" | "chat">("library");
  const [selectedPaper, setSelectedPaper] = useState<ResearchPaper | null>(null);

  useEffect(() => {
    const key = localStorage.getItem("PRAGYA_GROQ_KEY");
    if (key) {
      // Key exists
    }
  }, []);

  const handleUpload = async (uploadedFile: File) => {
    setIsUploading(true);
    setFile(uploadedFile);

    const formData = new FormData();
    formData.append("file", uploadedFile);

    try {
      const response = await fetch("/api/ingest", {
        method: "POST",
        headers: {
          "X-API-KEY": localStorage.getItem("PRAGYA_GROQ_KEY") || "",
        },
        body: formData,
      });

      const contentType = response.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Server returned non-JSON response (${response.status}): ${text.substring(0, 100)}...`);
      }

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload PDF");
      }

      toast.success("Paper analyzed successfully!");
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: `I've finished analyzing "${uploadedFile.name}". I'm ready to answer any questions you have. How can I help you today?`
        }
      ]);
      setActiveTab("chat");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
      setFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSelectPaper = (paper: ResearchPaper) => {
    setSelectedPaper(paper);
    setMessages([
      {
        id: "paper-welcome",
        role: "assistant",
        content: `📄 **${paper.title}**\n\n*${paper.authors.join(", ")}* — ${paper.journal}, ${paper.year}\n\n${paper.abstract}\n\nThis is a mock preview from the Pragya library. To chat with this paper's full content, upload the PDF using the panel on the left.`,
      },
    ]);
    setActiveTab("chat");
    toast.success(`Selected: ${paper.title}`);
  };

  const handleSendMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": localStorage.getItem("PRAGYA_GROQ_KEY") || "",
        },
        body: JSON.stringify({
          question: text,
          expertiseLevel,
        }),
      });

      const contentType = response.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const respText = await response.text();
        throw new Error(`Server returned non-JSON response (${response.status}): ${respText.substring(0, 100)}...`);
      }

      if (!response.ok) {
        throw new Error(data.error || "Failed to get AI response");
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.answer,
        citations: data.citations,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-slate-900 overflow-hidden font-sans">
      <Toaster position="top-right" />
      <ApiKeyModal />

      {/* Left Panel - PDF Viewer */}
      <div className="w-full md:w-1/2 h-1/2 md:h-full border-r dark:border-slate-800">
        <PdfViewer
          file={file}
          isUploading={isUploading}
          onUpload={handleUpload}
        />
      </div>

      {/* Right Panel - Tabbed: Library / Chat */}
      <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col">
        {/* Tab Bar */}
        <div className="flex border-b dark:border-slate-800 bg-white dark:bg-slate-950">
          <button
            onClick={() => setActiveTab("library")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-all ${activeTab === "library"
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50 dark:bg-blue-900/10"
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
          >
            <BookOpen size={16} />
            Library
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-all ${activeTab === "chat"
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50 dark:bg-blue-900/10"
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
          >
            <MessageSquare size={16} />
            Chat
            {messages.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-green-500" />
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === "library" ? (
            <ResearchLibrary onSelectPaper={handleSelectPaper} />
          ) : (
            <ChatInterface
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              expertiseLevel={expertiseLevel}
              onExpertiseChange={setExpertiseLevel}
            />
          )}
        </div>
      </div>
    </main>
  );
}
