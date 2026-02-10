// Simple in-memory chunk store with TF-IDF-like similarity search
// No external embedding API needed

interface Chunk {
    content: string;
    metadata: { fileName: string };
    terms: Map<string, number>; // term frequency
}

declare global {
    var chunkStore: Chunk[] | undefined;
}

function tokenize(text: string): string[] {
    return text.toLowerCase().replace(/[^\w\s]/g, " ").split(/\s+/).filter(t => t.length > 2);
}

function computeTermFrequency(tokens: string[]): Map<string, number> {
    const freq = new Map<string, number>();
    for (const token of tokens) {
        freq.set(token, (freq.get(token) || 0) + 1);
    }
    return freq;
}

function cosineSimilarity(a: Map<string, number>, b: Map<string, number>): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (const [term, freq] of a) {
        normA += freq * freq;
        if (b.has(term)) {
            dotProduct += freq * b.get(term)!;
        }
    }
    for (const [, freq] of b) {
        normB += freq * freq;
    }

    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export function resetChunkStore() {
    globalThis.chunkStore = [];
}

export function addChunks(chunks: { content: string; metadata: { fileName: string } }[]) {
    if (!globalThis.chunkStore) {
        globalThis.chunkStore = [];
    }
    for (const chunk of chunks) {
        const tokens = tokenize(chunk.content);
        globalThis.chunkStore.push({
            content: chunk.content,
            metadata: chunk.metadata,
            terms: computeTermFrequency(tokens),
        });
    }
}

export function similaritySearch(query: string, topK: number = 4): { content: string; metadata: { fileName: string } }[] {
    if (!globalThis.chunkStore || globalThis.chunkStore.length === 0) {
        return [];
    }

    const queryTerms = computeTermFrequency(tokenize(query));

    const scored = globalThis.chunkStore.map(chunk => ({
        chunk,
        score: cosineSimilarity(queryTerms, chunk.terms),
    }));

    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, topK).map(s => ({
        content: s.chunk.content,
        metadata: s.chunk.metadata,
    }));
}
