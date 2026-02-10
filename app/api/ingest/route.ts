import { NextRequest, NextResponse } from "next/server";
import { PDFParse } from "pdf-parse";
import { resetChunkStore, addChunks } from "@/lib/chunk-store";

export async function POST(req: NextRequest) {
    try {
        console.log("In /api/ingest - Received request");
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        if (!file.name.endsWith(".pdf")) {
            return NextResponse.json({ error: "Only PDF files are supported" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // Extract text from PDF
        console.log(`Extracting text from: ${file.name}`);
        const parser = new PDFParse({ data: buffer });
        const result = await parser.getText();
        const text = result.text;
        console.log(`Text extracted, length: ${text?.length || 0}`);

        if (!text || text.trim().length === 0) {
            return NextResponse.json({ error: "Could not extract text from PDF" }, { status: 400 });
        }

        // Split text into chunks (~1000 chars with 200 overlap)
        console.log("Splitting text into chunks...");
        const chunkSize = 1000;
        const chunkOverlap = 200;
        const chunks: { content: string; metadata: { fileName: string } }[] = [];

        for (let i = 0; i < text.length; i += chunkSize - chunkOverlap) {
            const chunkText = text.slice(i, i + chunkSize).trim();
            if (chunkText.length > 0) {
                chunks.push({
                    content: chunkText,
                    metadata: { fileName: file.name },
                });
            }
        }
        console.log(`Chunks created: ${chunks.length}`);

        // Reset and store chunks
        console.log("Storing chunks...");
        resetChunkStore();
        addChunks(chunks);
        console.log("Stored successfully");

        return NextResponse.json({
            message: "File processed successfully",
            chunks: chunks.length,
        });
    } catch (error: any) {
        console.error("Ingestion error:", error);
        return NextResponse.json({
            error: error.message || "Internal server error",
        }, { status: 500 });
    }
}
