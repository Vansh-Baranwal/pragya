import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { similaritySearch } from "@/lib/chunk-store";

export async function POST(req: NextRequest) {
    try {
        const { question, expertiseLevel } = await req.json();

        if (!question) {
            return NextResponse.json({ error: "Question is required" }, { status: 400 });
        }

        const apiKey = req.headers.get("x-api-key") || process.env.GROQ_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: "Groq API Key is not set" }, { status: 400 });
        }

        // Find relevant chunks
        const relevantChunks = similaritySearch(question, 4);

        if (relevantChunks.length === 0) {
            return NextResponse.json({
                error: "No document has been uploaded yet. Please upload a PDF first.",
            }, { status: 400 });
        }

        const context = relevantChunks.map(c => c.content).join("\n\n---\n\n");

        const levelInstructions: Record<string, string> = {
            beginner: "Explain in simple terms, avoid jargon, use analogies.",
            intermediate: "Use some technical terms but explain complex concepts.",
            advanced: "Use technical language freely, be precise and detailed.",
        };

        const levelGuide = levelInstructions[expertiseLevel] || levelInstructions.intermediate;

        const prompt = `You are Pragya, an intelligent AI study assistant. Answer the user's question based ONLY on the provided document context.

${levelGuide}

Context from the uploaded document:
---
${context}
---

User's Question: ${question}

Provide a clear, helpful answer based on the context. If the context doesn't contain enough information to answer, say so honestly.`;

        const groq = new Groq({ apiKey });

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "user", content: prompt },
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.5,
            max_tokens: 1024,
        });

        const answer = chatCompletion.choices[0]?.message?.content || "No response generated.";

        return NextResponse.json({
            answer,
            sources: relevantChunks.map(c => c.metadata.fileName),
        });

    } catch (error: any) {
        console.error("Chat error:", error);
        return NextResponse.json({
            error: error.message || "Internal server error",
        }, { status: 500 });
    }
}
