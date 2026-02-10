import { NextRequest, NextResponse } from "next/server";
import { getVectorStore } from "@/lib/vector-store";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
    try {
        const { question, expertiseLevel } = await req.json();

        if (!question) {
            return NextResponse.json({ error: "No question provided" }, { status: 400 });
        }

        const apiKey = req.headers.get("X-API-KEY") || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "Gemini API Key is missing. Please set it in the settings." }, { status: 401 });
        }

        const vectorStore = await getVectorStore(apiKey);

        // Similarity search
        const results = await vectorStore.similaritySearch(question, 4);
        const context = results.map(r => r.pageContent).join("\n\n");
        const citations = Array.from(new Set(results.map(r => r.metadata.fileName || "Unknown Source")));

        // Prompt construction based on expertise level
        let levelInstruction = "";
        switch (expertiseLevel) {
            case "Novice":
                levelInstruction = "Explain the concepts in simple, easy-to-understand terms. Avoid heavy jargon. Think like a friendly teacher explaining to a student.";
                break;
            case "Expert":
                levelInstruction = "Provide a highly technical and detailed analysis. Use professional terminology and cite specific sections or data where applicable. Assume a deep understanding of the subject matter.";
                break;
            case "Intermediate":
            default:
                levelInstruction = "Provide a balanced explanation. Use professional terms but explain complex concepts where necessary. Suitable for someone with some background in the field.";
                break;
        }

        const prompt = `
You are Pragya, a highly capable AI Research Assistant. Use the following pieces of context from a research paper to answer the user's question. 
If you don't know the answer based on the context, just say that you don't know, don't try to make up an answer.

Context:
${context}

User Question: ${question}

Target Audience Level: ${expertiseLevel}
Instructions for response: ${levelInstruction}

Please provide a clear and concise response. End your response with a "Sources" section listing the filenames provided in the context if applicable.
    `;

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({
            answer: text,
            citations: citations
        });
    } catch (error: any) {
        console.error("Chat error:", error);
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
    }
}
