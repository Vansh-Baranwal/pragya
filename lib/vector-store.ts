import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";

declare global {
    var vectorStore: MemoryVectorStore | undefined;
}

export async function getVectorStore(apiKey?: string) {
    if (!globalThis.vectorStore) {
        const finalApiKey = apiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        if (!finalApiKey) {
            throw new Error("Gemini API Key is not set");
        }

        const embeddings = new GoogleGenerativeAIEmbeddings({
            apiKey: finalApiKey,
            modelName: "embedding-001",
            taskType: TaskType.RETRIEVAL_DOCUMENT,
        });

        globalThis.vectorStore = new MemoryVectorStore(embeddings);
    }
    return globalThis.vectorStore;
}

export async function resetVectorStore(apiKey?: string) {
    const finalApiKey = apiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!finalApiKey) {
        throw new Error("Gemini API Key is not set");
    }

    const embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: finalApiKey,
        modelName: "embedding-001",
        taskType: TaskType.RETRIEVAL_DOCUMENT,
    });

    globalThis.vectorStore = new MemoryVectorStore(embeddings);
    return globalThis.vectorStore;
}
