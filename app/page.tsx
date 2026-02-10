"use client";

import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import PdfViewer from "@/components/PdfViewer";
import ChatInterface, { Message } from "@/components/ChatInterface";
import ApiKeyModal from "@/components/ApiKeyModal";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [expertiseLevel, setExpertiseLevel] = useState<"Novice" | "Intermediate" | "Expert">("Intermediate");

  // Load API Key from localStorage for client-side use if needed (passed in headers or used in fetch if server env allows)
  useEffect(() => {
    const key = localStorage.getItem("PRAGYA_API_KEY");
    if (key) {
      // We could set a global state or just ensure requests use it if we were doing client-side AI
      // But here we rely on the server having it or passing it in headers
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
          "X-API-KEY": localStorage.getItem("PRAGYA_API_KEY") || "",
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
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
      setFile(null);
    } finally {
      setIsUploading(false);
    }
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
          "X-API-KEY": localStorage.getItem("PRAGYA_API_KEY") || "",
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
        const text = await response.text();
        throw new Error(`Server returned non-JSON response (${response.status}): ${text.substring(0, 100)}...`);
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

      {/* Right Panel - Chat */}
      <div className="w-full md:w-1/2 h-1/2 md:h-full">
        <ChatInterface
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          expertiseLevel={expertiseLevel}
          onExpertiseChange={setExpertiseLevel}
        />
      </div>
    </main>
  );
}
