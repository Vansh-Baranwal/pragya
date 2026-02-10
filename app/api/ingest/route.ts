import { NextRequest, NextResponse } from "next/server";
import { PDFParse } from "pdf-parse";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { resetVectorStore } from "@/lib/vector-store";
import { Document } from "@langchain/core/documents";

export async function POST(req: NextRequest) {
    try {
        console.log("In /api/ingest - Received request");
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const apiKey = req.headers.get("X-API-KEY") || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: "Gemini API Key is missing. Please set it in the settings." }, { status: 401 });
        }

        // Extract text from PDF
        console.log(`Extracting text from: ${file.name}`);
        const parser = new PDFParse({ data: buffer });
        const result = await parser.getText();
        const text = result.text;
        console.log(`Text extracted, length: ${text?.length || 0}`);

        if (!text || text.trim().length === 0) {
            return NextResponse.json({ error: "Could not extract text from PDF" }, { status: 400 });
        }

        // Split text into chunks
        console.log("Splitting text into chunks...");
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });

        const docs = await splitter.splitDocuments([
            new Document({
                pageContent: text,
                metadata: { fileName: file.name },
            }),
        ]);
        console.log(`Chunks created: ${docs.length}`);

        // Initialize/Reset and store in vector store
        console.log("Storing in vector store...");
        const vectorStore = await resetVectorStore(apiKey);
        await vectorStore.addDocuments(docs);
        console.log("Stored successfully");

        return NextResponse.json({
            message: "File processed successfully",
            chunks: docs.length
        });
    } catch (error: any) {
        console.error("Ingestion error full details:", error);
        return NextResponse.json({
            error: error.message || "Internal server error",
            details: error.stack || null
        }, { status: 500 });
    }
}
