export interface ResearchPaper {
    id: string;
    title: string;
    authors: string[];
    abstract: string;
    tags: string[];
    year: number;
    journal: string;
    citations: number;
    category: string;
}

export const mockPapers: ResearchPaper[] = [
    {
        id: "1",
        title: "Attention Is All You Need",
        authors: ["A. Vaswani", "N. Shazeer", "N. Parmar", "J. Uszkoreit"],
        abstract: "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms.",
        tags: ["Deep Learning", "NLP", "Transformers"],
        year: 2017,
        journal: "NeurIPS",
        citations: 95000,
        category: "AI & Machine Learning",
    },
    {
        id: "2",
        title: "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding",
        authors: ["J. Devlin", "M. Chang", "K. Lee", "K. Toutanova"],
        abstract: "We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers. BERT is designed to pre-train deep bidirectional representations.",
        tags: ["NLP", "Pre-training", "Transformers"],
        year: 2019,
        journal: "NAACL",
        citations: 72000,
        category: "AI & Machine Learning",
    },
    {
        id: "3",
        title: "Generative Adversarial Networks",
        authors: ["I. Goodfellow", "J. Pouget-Abadie", "M. Mirza", "B. Xu"],
        abstract: "We propose a new framework for estimating generative models via an adversarial process, in which two models are simultaneously trained: a generative model G that captures the data distribution, and a discriminative model D.",
        tags: ["GANs", "Generative Models", "Deep Learning"],
        year: 2014,
        journal: "NeurIPS",
        citations: 56000,
        category: "AI & Machine Learning",
    },
    {
        id: "4",
        title: "Climate Change 2024: Impacts, Adaptation and Vulnerability",
        authors: ["IPCC Working Group II"],
        abstract: "This report assesses the impacts of climate change on natural and human systems, their vulnerabilities, and the capacity and limits of adaptation. It evaluates risks to ecosystems, biodiversity, and human communities.",
        tags: ["Climate", "Environment", "Policy"],
        year: 2024,
        journal: "IPCC Report",
        citations: 12000,
        category: "Environmental Science",
    },
    {
        id: "5",
        title: "CRISPR-Cas9: A Revolutionary Tool for Genome Editing",
        authors: ["J. Doudna", "E. Charpentier"],
        abstract: "The CRISPR-Cas9 system has emerged as a versatile tool for genome engineering. This review discusses the mechanism, applications, and ethical considerations of CRISPR-based genome editing technologies.",
        tags: ["Genetics", "CRISPR", "Biotechnology"],
        year: 2020,
        journal: "Science",
        citations: 28000,
        category: "Biology & Genetics",
    },
    {
        id: "6",
        title: "Quantum Computing: Progress and Prospects",
        authors: ["J. Preskill", "S. Aaronson", "M. Freedman"],
        abstract: "Quantum computing harnesses quantum mechanical phenomena to process information. This paper reviews the current state of quantum hardware, algorithms, and potential applications across medicine, cryptography, and materials science.",
        tags: ["Quantum", "Computing", "Physics"],
        year: 2023,
        journal: "Nature Reviews Physics",
        citations: 8500,
        category: "Physics & Computing",
    },
    {
        id: "7",
        title: "Large Language Models: A Survey",
        authors: ["W. Zhao", "K. Zhou", "J. Li", "T. Tang"],
        abstract: "Large language models have demonstrated remarkable capabilities in natural language understanding and generation. This survey provides a comprehensive review of recent advances in LLMs, including training strategies, alignment techniques, and evaluation.",
        tags: ["LLM", "NLP", "AI"],
        year: 2024,
        journal: "ACM Computing Surveys",
        citations: 3200,
        category: "AI & Machine Learning",
    },
    {
        id: "8",
        title: "The Psychology of Decision Making Under Uncertainty",
        authors: ["D. Kahneman", "A. Tversky"],
        abstract: "This paper presents a critique of expected utility theory as a descriptive model of decision making under risk, and develops an alternative model, called prospect theory. It distinguishes two phases in the choice process.",
        tags: ["Psychology", "Behavioral Economics", "Decision Theory"],
        year: 1979,
        journal: "Econometrica",
        citations: 68000,
        category: "Psychology & Economics",
    },
    {
        id: "9",
        title: "Blockchain Technology: Beyond Bitcoin",
        authors: ["V. Buterin", "G. Wood"],
        abstract: "While Bitcoin introduced blockchain as a decentralized ledger for financial transactions, the technology has far broader applications. This paper explores smart contracts, decentralized applications, and the potential of blockchain across industries.",
        tags: ["Blockchain", "Decentralization", "Smart Contracts"],
        year: 2021,
        journal: "IEEE Access",
        citations: 15000,
        category: "Computer Science",
    },
];

export const categories = [
    "All",
    "AI & Machine Learning",
    "Environmental Science",
    "Biology & Genetics",
    "Physics & Computing",
    "Psychology & Economics",
    "Computer Science",
];
