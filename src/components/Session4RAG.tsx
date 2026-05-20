import { useState } from 'react';
import { AnalogyGrid, DemoCard, RevealSection, SectionHeader, SubSection, ConceptBlock, KeyPoint, CodeExample, FlowDiagram, InfoBox, WarningBox, ComparisonTable } from './shared';

const AC = '#fb923c';

const RAG_STEPS = [
  { num: '01', icon: '📄', title: 'Load Documents', sub: 'PDFs, web pages, databases',
    detail: `Your knowledge base is loaded — PDFs, wikis, docs, databases.\n\nExample:\nloader = PyPDFLoader("policy.pdf")\ndocs = loader.load()\n\nThe raw text is still too long to pass directly to the LLM — we need to break it up first.` },
  { num: '02', icon: '✂️', title: 'Chunk Text', sub: 'Split into ~500 token pieces',
    detail: `Long documents are split into overlapping chunks so no important sentence gets cut in half.\n\nExample:\nsplitter = RecursiveCharacterTextSplitter(\n  chunk_size=500, chunk_overlap=50\n)\nchunks = splitter.split_documents(docs)\n\nOverlap ensures context isn't lost at chunk boundaries.` },
  { num: '03', icon: '🔢', title: 'Create Embeddings', sub: 'Turn text into vectors',
    detail: `Each chunk is converted to a dense vector of ~1536 numbers that captures its meaning. Similar chunks end up close together in this vector space.\n\nExample:\nembeddings = OpenAIEmbeddings()\nvectors = embeddings.embed_documents(\n  [c.page_content for c in chunks]\n)\n\nThis is what makes semantic search possible — "heart attack" finds "myocardial infarction".` },
  { num: '04', icon: '💾', title: 'Store in Vector DB', sub: 'Index for fast retrieval',
    detail: `Vectors are stored in a specialized database optimized for similarity search.\n\nExample:\nvectorstore = Chroma.from_documents(\n  chunks, embeddings\n)\n\nPopular options: Pinecone, Weaviate, pgvector, Chroma. Store millions of vectors, retrieve in milliseconds.` },
  { num: '05', icon: '🔍', title: 'Retrieve Relevant Chunks', sub: 'At query time',
    detail: `When a user asks a question, it's embedded and the most similar chunks are retrieved.\n\nExample:\nretriever = vectorstore.as_retriever(k=4)\nrelevant_docs = retriever.invoke(\n  "What is the refund policy?"\n)\n\nTop-k=4 means the 4 most relevant chunks come back.` },
  { num: '06', icon: '🤖', title: 'Generate Answer', sub: 'Grounded in retrieved facts',
    detail: `The retrieved chunks are injected into the prompt alongside the user's question.\n\nExample:\nprompt = f"Answer based on context:\\n{context}\\n\\nQuestion: {question}"\nanswer = llm.invoke(prompt)\n\nResult: factual, citable answers. Hallucination drops dramatically.` },
];

export default function Session4RAG() {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  return (
    <section id="s4" style={{ maxWidth: 900, margin: '0 auto', padding: '5rem 2rem' }}>
      <RevealSection>
        <SectionHeader num="04" tag="Session 4 · 1.5 hrs" title="RAG — Retrieval-Augmented Generation" accentColor={AC} borderColor="rgba(251,146,60,0.3)" />
        <p style={{ color: 'var(--muted)', maxWidth: 600, marginBottom: '2.5rem', fontSize: 15 }}>
          LLMs hallucinate because they predict — not recall. RAG fixes this by fetching real facts first,
          then generating answers <strong style={{ color: 'var(--text)' }}>grounded in retrieved evidence</strong>.
          It's the single most important pattern for production LLM applications.
        </p>
      </RevealSection>

      {/* ── Why RAG Exists ── */}
      <RevealSection>
        <SubSection title="Why RAG exists: the hallucination problem" accent={AC}>
          <ConceptBlock title="LLMs are lossy compressions of the internet" accent={AC}>
            An LLM doesn't have a database inside it. It has statistical patterns that sometimes produce correct facts
            and sometimes produce plausible-sounding nonsense. <strong style={{ color: 'var(--text)' }}>It cannot distinguish between the two.</strong>
            RAG solves this by giving the model actual documents to reference.
          </ConceptBlock>

          <AnalogyGrid items={[
            { emoji: '🔍', title: 'Open-book vs closed-book', desc: 'A base LLM is like a closed-book exam — it can only use what it memorized. RAG gives it an open book: real documents retrieved on-demand.' },
            { emoji: '🧲', title: 'Embeddings are semantic search', desc: '"Similar meaning" beats keyword matching. "cardiovascular event" and "heart attack" are close in vector space even though they share no words.' },
            { emoji: '📦', title: 'Chunk → Embed → Store → Retrieve', desc: 'Documents are split into chunks, each turned into a vector, stored in a vector DB. At query time, the most similar chunks are retrieved and stuffed into context.' },
            { emoji: '🆚', title: 'RAG vs Fine-tuning', desc: 'Fine-tuning changes the model\'s weights (expensive, slow, hard to update). RAG changes the context (cheap, fast, always fresh). Use RAG first, fine-tune for style/behavior.' },
          ]} />
        </SubSection>
      </RevealSection>

      {/* ── Embeddings Deep Dive ── */}
      <RevealSection>
        <SubSection title="Embeddings: how semantic search works" accent={AC}>
          <ConceptBlock title="From text to vectors" accent={AC}>
            An embedding model takes a piece of text and outputs a fixed-length vector of numbers (typically 768–3072 dimensions).
            These vectors are positioned in high-dimensional space such that <strong style={{ color: 'var(--text)' }}>texts with similar meanings
            are close together</strong>. This is what makes "heart attack" find "myocardial infarction" — they're nearby in vector space.
          </ConceptBlock>

          <KeyPoint num={1} title="Embedding models are small and fast" accent={AC}>
            Unlike LLMs, embedding models are small (~300M params) and run in milliseconds.
            They're trained specifically to produce good similarity scores — not to generate text.
            Popular options: OpenAI text-embedding-3-small, Cohere embed-v3, BGE, E5.
          </KeyPoint>

          <KeyPoint num={2} title="Similarity = cosine distance" accent={AC}>
            To find similar chunks, we compute the cosine similarity between the query embedding and all document embeddings.
            Cosine similarity measures the angle between two vectors — 1 means identical direction, 0 means orthogonal.
          </KeyPoint>

          <CodeExample accent={AC} code={`# Embedding and similarity search
query_embedding = embed("What is the refund policy?")  # [1536 floats]
doc_embeddings = embed_all(chunks)                       # [N, 1536]

# Cosine similarity
similarities = cosine_similarity(query_embedding, doc_embeddings)
top_k_indices = np.argsort(similarities)[-4:]            # Top 4 most similar
retrieved_chunks = [chunks[i] for i in top_k_indices]`} />
        </SubSection>
      </RevealSection>

      {/* ── Chunking Strategies ── */}
      <RevealSection>
        <SubSection title="Chunking: the hidden art" accent={AC}>
          <ConceptBlock title="How you split matters as much as what you split" accent={AC}>
            Bad chunking destroys context. A sentence that spans two chunks loses its meaning.
            Good chunking preserves semantic boundaries and adds overlap so nothing falls through the cracks.
          </ConceptBlock>

          <ComparisonTable accent={AC} headers={['Strategy', 'How it works', 'Best for']} rows={[
            { label: '', cells: ['Fixed size', 'Split every N characters with overlap', 'Generic use, simple setup'] },
            { label: '', cells: ['Recursive', 'Split on paragraphs, then sentences, then chars', 'Most use cases (recommended)'] },
            { label: '', cells: ['Semantic', 'Split when topic changes (using embeddings)', 'Long documents with distinct sections'] },
            { label: '', cells: ['Document-aware', 'Respect markdown headers, code blocks, tables', 'Structured documents'] },
          ]} />

          <KeyPoint num={1} title="Chunk size is a tuning parameter" accent={AC}>
            Too small (50 tokens): loses context, fragments meaning. Too large (2000 tokens): dilutes relevance,
            wastes context window. <strong style={{ color: 'var(--text)' }}>200-500 tokens with 50-token overlap is a good starting point.</strong>
          </KeyPoint>

          <KeyPoint num={2} title="Metadata is crucial" accent={AC}>
            Store source, page number, and section title with each chunk. This lets you cite sources in answers
            and filter by metadata (e.g., "only search in the HR policy document").
          </KeyPoint>
        </SubSection>
      </RevealSection>

      {/* ── RAG vs Fine-tuning ── */}
      <RevealSection>
        <SubSection title="When to use RAG vs fine-tuning" accent={AC}>
          <ComparisonTable accent={AC} headers={['Criterion', 'RAG', 'Fine-tuning']} rows={[
            { label: '', cells: ['Knowledge freshness', 'Always up-to-date (re-index anytime)', 'Frozen at training time'] },
            { label: '', cells: ['Cost', 'Low — pay per query', 'High — GPU hours for training'] },
            { label: '', cells: ['Setup time', 'Minutes to hours', 'Days to weeks'] },
            { label: '', cells: ['Best for', 'Factual accuracy, changing data', 'Style, format, domain behavior'] },
            { label: '', cells: ['Citations', 'Yes — link to source documents', 'No — model can\'t cite sources'] },
            { label: '', cells: ['Hallucination risk', 'Low — grounded in retrieved docs', 'Medium — still predicts from weights'] },
          ]} />

          <InfoBox accent={AC}>
            <strong style={{ color: 'var(--text)' }}>Rule of thumb:</strong> Use RAG when you need the model to know
            things it wasn't trained on (your company's data, recent events, specific documents).
            Use fine-tuning when you need the model to <em>behave</em> differently (write in a specific style,
            follow a specific format, adopt a persona). They complement each other — use both when needed.
          </InfoBox>
        </SubSection>
      </RevealSection>

      {/* ── RAG Pipeline Demo ── */}
      <RevealSection>
        <DemoCard label="Live Demo — RAG Pipeline Walkthrough" title="Click each step to see what happens">
          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', marginBottom: '1rem' }}>
            {RAG_STEPS.map((step, i) => (
              <div
                key={i}
                onClick={() => setActiveStep(activeStep === i ? null : i)}
                style={{
                  padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem',
                  cursor: 'pointer', transition: 'background .2s',
                  background: activeStep === i ? 'rgba(251,146,60,.06)' : 'var(--bg3)',
                  borderBottom: i < RAG_STEPS.length - 1 ? '1px solid var(--border)' : 'none',
                }}
                onMouseEnter={e => { if (activeStep !== i) (e.currentTarget as HTMLDivElement).style.background = 'var(--bg2)'; }}
                onMouseLeave={e => { if (activeStep !== i) (e.currentTarget as HTMLDivElement).style.background = 'var(--bg3)'; }}
              >
                <div style={{
                  width: 30, height: 30, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 500, flexShrink: 0,
                  background: activeStep === i ? 'rgba(251,146,60,.15)' : 'var(--bg2)',
                  border: activeStep === i ? '1px solid var(--accent4)' : '1px solid var(--border)',
                  color: activeStep === i ? 'var(--accent4)' : 'var(--muted)', transition: 'all .2s',
                }}>
                  {step.num}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 2, color: 'var(--text)' }}>{step.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>{step.sub}</div>
                </div>
                <div style={{ fontSize: 18, opacity: activeStep === i ? 1 : 0.4, transition: 'opacity .2s' }}>{step.icon}</div>
              </div>
            ))}
          </div>
          <div style={{
            padding: '1.25rem', borderRadius: 10,
            background: 'var(--bg3)', border: '1px solid var(--border)',
            fontSize: 14, minHeight: 80, lineHeight: 1.7, color: 'var(--muted)',
          }}>
            {activeStep === null ? (
              'Click any step above to see a detailed explanation with a code example.'
            ) : (
              <div style={{ animation: 'fadeUp .35s ease' }}>
                <strong style={{ color: 'var(--accent4)' }}>{RAG_STEPS[activeStep].icon} {RAG_STEPS[activeStep].title}</strong>
                <div style={{ marginTop: '0.75rem', whiteSpace: 'pre-wrap', color: 'var(--muted)' }}>
                  {RAG_STEPS[activeStep].detail}
                </div>
              </div>
            )}
          </div>
        </DemoCard>
      </RevealSection>
    </section>
  );
}
