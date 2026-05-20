import { useState } from 'react';
import {
  RevealSection, SectionHeader, SubSection,
  ConceptBlock, KeyPoint, FlowDiagram, InfoBox,
  RecapBox, PracticeQuestions, QuickSummary, MentalModel, BeforeAfter,
  AnimatedPipeline, ToggleCompare, StepBuilder,
} from './shared';

const AC = '#ea580c';

const RAG_STEPS = [
  { num: '01', icon: '📄', title: 'Load Documents', sub: 'PDFs, web pages, databases',
    detail: `loader = PyPDFLoader("policy.pdf")\ndocs = loader.load()\n\nRaw text is too long to pass to the LLM. We need to break it into pieces first.` },
  { num: '02', icon: '✂️', title: 'Chunk Text', sub: 'Cut into ~500 token pieces',
    detail: `splitter = RecursiveCharacterTextSplitter(\n  chunk_size=500, chunk_overlap=50\n)\nchunks = splitter.split_documents(docs)\n\nLike cutting a scroll into pages with overlap.` },
  { num: '03', icon: '🔢', title: 'Create Embeddings', sub: 'Turn chunks into number codes',
    detail: `embeddings = OpenAIEmbeddings()\nvectors = embeddings.embed_documents(chunks)\n\nSimilar chunks get similar number patterns. "heart attack" and "cardiac arrest" end up with almost the same numbers.` },
  { num: '04', icon: '💾', title: 'Store in Vector DB', sub: 'Save for fast search',
    detail: `vectorstore = Chroma.from_documents(chunks, embeddings)\n\nThink of a library organized by topic, not title.` },
  { num: '05', icon: '🔍', title: 'Retrieve Relevant Chunks', sub: 'Find matches at query time',
    detail: `retriever = vectorstore.as_retriever(k=4)\nrelevant_docs = retriever.invoke("What is the refund policy?")\n\nTop-k=4 means "give me the 4 most relevant chunks."` },
  { num: '06', icon: '🤖', title: 'Generate Answer', sub: 'Answer based on retrieved facts',
    detail: `prompt = f"Answer based on this context:\n{context}\n\nQuestion: {question}"\nanswer = llm.invoke(prompt)\n\nResult: factual answers with citations.` },
];

/* ─── RAG vs No-RAG Demo (inline) ─── */

function RagComparison() {
  const [query, setQuery] = useState('What is the refund policy for electronics?');
  const [showRag, setShowRag] = useState(false);

  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <div style={{ fontSize: 'var(--font-caption)', color: 'var(--muted)', fontFamily: 'var(--font-mono)', marginBottom: '1rem' }}>
        Toggle between approaches to see the difference:
      </div>
      <div style={{
        background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14,
        padding: '1.25rem',
      }}>
        <div style={{ display: 'flex', gap: '.5rem', marginBottom: '.75rem' }}>
          <button
            onClick={() => setShowRag(false)}
            style={{
              flex: 1, padding: '.5rem', borderRadius: 8, cursor: 'pointer',
              background: !showRag ? 'rgba(244,67,54,.1)' : 'var(--bg3)',
              border: `1px solid ${!showRag ? 'rgba(244,67,54,.4)' : 'var(--border)'}`,
              color: !showRag ? '#f87171' : 'var(--muted)',
              fontSize: 'var(--font-caption)', fontFamily: 'var(--font-mono)',
            }}
          >❌ Without RAG</button>
          <button
            onClick={() => setShowRag(true)}
            style={{
              flex: 1, padding: '.5rem', borderRadius: 8, cursor: 'pointer',
              background: showRag ? AC + '15' : 'var(--bg3)',
              border: `1px solid ${showRag ? AC + '44' : 'var(--border)'}`,
              color: showRag ? AC : 'var(--muted)',
              fontSize: 'var(--font-caption)', fontFamily: 'var(--font-mono)',
            }}
          >✅ With RAG</button>
        </div>

        <div style={{ background: 'var(--bg3)', borderRadius: 8, padding: '.65rem .85rem', marginBottom: '.75rem', border: '1px solid var(--border)' }}>
          <span style={{ fontSize: 'var(--font-micro)', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>User asks: </span>
          <span style={{ fontSize: 'var(--font-caption)', color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>&ldquo;{query}&rdquo;</span>
        </div>

        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{
            width: '100%', padding: '.5rem .75rem', borderRadius: 8, marginBottom: '.75rem',
            background: 'var(--bg3)', border: '1px solid var(--border)',
            color: 'var(--text)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-caption)',
            outline: 'none', boxSizing: 'border-box',
          }}
          placeholder="Type a question..."
        />

        {!showRag ? (
          <div style={{
            padding: '1rem', borderRadius: 8,
            background: 'rgba(244,67,54,.05)', border: '1px solid rgba(244,67,54,.3)',
            animation: 'fadeIn .3s ease',
          }}>
            <div style={{ fontSize: 'var(--font-micro)', fontFamily: 'var(--font-mono)', color: '#f87171', marginBottom: '.5rem' }}>LLM guesses from memory:</div>
            <div style={{ fontSize: 'var(--font-caption)', color: 'var(--muted)', lineHeight: 'var(--lh-snug)' }}>
              &ldquo;Most electronics stores have a 15-30 day return window. You should check your receipt or contact customer service for the exact policy. Some items like opened software may not be returnable.&rdquo;
            </div>
            <div style={{ fontSize: 'var(--font-micro)', color: '#f87171', fontFamily: 'var(--font-mono)', marginTop: '.5rem' }}>
              ⚠️ Generic guess — could be wrong for YOUR company
            </div>
          </div>
        ) : (
          <div style={{
            padding: '1rem', borderRadius: 8,
            background: 'rgba(5,150,105,.05)', border: '1px solid rgba(5,150,105,.3)',
            animation: 'fadeIn .3s ease',
          }}>
            <div style={{ fontSize: 'var(--font-micro)', fontFamily: 'var(--font-mono)', color: 'var(--accent3)', marginBottom: '.35rem' }}>Retrieved from policy.pdf:</div>
            <div style={{ fontSize: 'var(--font-caption)', color: 'var(--muted)', fontStyle: 'italic', marginBottom: '.5rem', lineHeight: 'var(--lh-snug)' }}>
              &ldquo;Electronics returns: 14-day window, original packaging required. Refund issued within 5-7 business days. No returns on clearance electronics.&rdquo;
            </div>
            <div style={{ fontSize: 'var(--font-micro)', fontFamily: 'var(--font-mono)', color: 'var(--accent3)', marginBottom: '.5rem' }}>LLM answers with facts:</div>
            <div style={{ fontSize: 'var(--font-caption)', color: 'var(--muted)', lineHeight: 'var(--lh-snug)' }}>
              &ldquo;Per our policy, electronics can be returned within 14 days in original packaging. Refunds process in 5-7 business days. Note: clearance electronics are non-returnable.&rdquo;
            </div>
            <div style={{ fontSize: 'var(--font-micro)', color: 'var(--accent3)', fontFamily: 'var(--font-mono)', marginTop: '.5rem' }}>
              ✅ Factual, specific, grounded in YOUR documents
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Session4RAG() {
  return (
    <section id="s4" style={{ maxWidth: 960, margin: '0 auto', padding: '4rem 2rem 6rem' }}>
      {/* ── Header + Intro ── */}
      <RevealSection>
        <SectionHeader num="04" tag="Session 4 · 1.5 hrs" title="Giving LLMs a Memory" accentColor={AC} borderColor={`${AC}44`} />
        <p style={{ color: 'var(--muted)', maxWidth: 640, fontSize: 'var(--font-body-lg)', lineHeight: 'var(--lh-relaxed)' }}>
          The context window is limited. <strong style={{ color: 'var(--text)' }}>RAG (Retrieval-Augmented Generation)</strong> is the trick
          that lets LLMs answer questions about YOUR data without memorizing it all.
        </p>
      </RevealSection>

      {/* ── The Problem ── */}
      <RevealSection style={{ marginBottom: '4rem' }}>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--font-heading)', color: 'var(--text)', marginBottom: '1rem', marginTop: 0 }}>
          The Problem: LLMs Don&apos;t Know Your Company
        </p>
        <p style={{ color: 'var(--muted)', fontSize: 'var(--font-body-lg)', lineHeight: 'var(--lh-relaxed)', maxWidth: 640, marginBottom: '2rem' }}>
          Ask an LLM &ldquo;What is our refund policy?&rdquo; and it will guess — convincingly, but wrong.
          It was trained on the internet, not your internal docs. <strong style={{ color: 'var(--text)' }}>RAG fixes this</strong> by finding the right information first, then letting the LLM answer.
        </p>
        <BeforeAfter
          accent={AC}
          before="LLM alone: 'I think refunds are 30 days?' → WRONG"
          after="LLM + RAG: 'Per policy.pdf, refunds are 14 days for electronics.' → CORRECT"
        />
      </RevealSection>

      {/* ── Playground ── */}
      <RevealSection>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--font-heading)', color: 'var(--text)', marginBottom: '.5rem', marginTop: 0 }}>
          The Playground
        </p>
        <p style={{ color: 'var(--muted)', fontSize: 'var(--font-caption)', fontFamily: 'var(--font-mono)', marginBottom: '2rem', letterSpacing: 'var(--ls-wide)', textTransform: 'uppercase' }}>
          Compare answers with and without RAG
        </p>

        <RagComparison />
      </RevealSection>

      {/* ── RAG Pipeline ── */}
      <RevealSection style={{ marginBottom: '4rem' }}>
        <SubSection title="How RAG Works: The 6-Step Pipeline" accent={AC}>
          <AnimatedPipeline accent={AC} stages={[
            { icon: '...', label: 'Load Docs', desc: 'PDFs, web pages, databases' },
            { icon: '...', label: 'Chunk', desc: 'Cut into ~500 token pieces' },
            { icon: '...', label: 'Embed', desc: 'Convert to number vectors' },
            { icon: '...', label: 'Store', desc: 'Save in vector database' },
            { icon: '...', label: 'Retrieve', desc: 'Find relevant chunks' },
            { icon: '...', label: 'Generate', desc: 'Answer from retrieved facts' },
          ]} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
            {RAG_STEPS.map((step) => (
              <div key={step.num} style={{
                padding: '1rem 1.25rem', borderRadius: 10, background: 'var(--bg2)',
                border: '1px solid var(--border)', display: 'flex', gap: '1rem', alignItems: 'flex-start',
              }}>
                <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>{step.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 'var(--font-body)', fontWeight: 500, color: 'var(--text)', marginBottom: '.15rem' }}>
                    {step.num}. {step.title}
                  </div>
                  <div style={{ fontSize: 'var(--font-caption)', color: 'var(--muted)', marginBottom: '.35rem' }}>{step.sub}</div>
                  <pre style={{
                    fontSize: 'var(--font-micro)', fontFamily: 'var(--font-mono)', color: 'var(--muted)',
                    background: 'var(--bg3)', padding: '.5rem .75rem', borderRadius: 6,
                    overflowX: 'auto', whiteSpace: 'pre-wrap', margin: 0,
                  }}>{step.detail}</pre>
                </div>
              </div>
            ))}
          </div>
        </SubSection>
      </RevealSection>

      {/* ── Embeddings Explained ── */}
      <RevealSection style={{ marginBottom: '4rem' }}>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--font-heading)', color: 'var(--text)', marginBottom: '1rem', marginTop: 0 }}>
          Embeddings: Meaning as Numbers
        </p>
        <p style={{ color: 'var(--muted)', fontSize: 'var(--font-body-lg)', lineHeight: 'var(--lh-relaxed)', maxWidth: 640, marginBottom: '2rem' }}>
          An embedding converts text into a list of ~1,500 numbers. Texts with <strong style={{ color: 'var(--text)' }}>similar meaning</strong> get
          <strong style={{ color: 'var(--text)' }}> similar numbers</strong>. This is how the vector database finds relevant chunks.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          {[
            { title: '"heart attack"', desc: '[0.82, 0.14, 0.91, ...]', note: 'High medical scores' },
            { title: '"cardiac arrest"', desc: '[0.79, 0.16, 0.88, ...]', note: 'Almost identical vector' },
            { title: '"car repair"', desc: '[0.12, 0.85, 0.23, ...]', note: 'Very different vector' },
          ].map((ex, i) => (
            <div key={i} style={{
              padding: '1.25rem', borderRadius: 12, background: 'var(--bg2)',
              border: `1px solid ${i < 2 ? 'rgba(5,150,105,.25)' : 'var(--border)'}`,
            }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--font-body)', color: i < 2 ? 'var(--accent3)' : 'var(--muted)', marginBottom: '.35rem' }}>{ex.title}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--font-micro)', color: 'var(--muted)', marginBottom: '.25rem' }}>{ex.desc}</div>
              <div style={{ fontSize: 'var(--font-micro)', color: i < 2 ? 'var(--accent3)' : 'var(--muted)' }}>{ex.note}</div>
            </div>
          ))}
        </div>
      </RevealSection>

      {/* ── Why RAG Matters ── */}
      <RevealSection style={{ marginBottom: '4rem' }}>
        <SubSection title="Why RAG Beats Fine-Tuning for Facts" accent={AC}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            {[
              { title: 'No retraining needed', desc: 'Fine-tuning costs thousands per run. RAG just updates the database. New policy doc? Drop it in, done.' },
              { title: 'Citable answers', desc: 'You know exactly which document the answer came from. Fine-tuning gives no citations — information is baked in.' },
              { title: 'Real-time updates', desc: 'Share price changed? RAG retrieves the latest. Fine-tuned models are frozen in time until retrained.' },
            ].map((card, i) => (
              <div key={i} style={{
                padding: '1.25rem', borderRadius: 12, background: 'var(--bg2)',
                border: `1px solid ${AC}22`,
              }}>
                <h4 style={{ fontSize: 'var(--font-body-lg)', fontWeight: 500, color: 'var(--text)', margin: '0 0 .35rem 0' }}>{card.title}</h4>
                <div style={{ fontSize: 'var(--font-caption)', color: 'var(--muted)', lineHeight: 'var(--lh-snug)' }}>{card.desc}</div>
              </div>
            ))}
          </div>
        </SubSection>
      </RevealSection>

      {/* ── Recap + Mental Model ── */}
      <RevealSection>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 300px' }}>
            <RecapBox accent={AC} items={[
              'RAG = find relevant info first, then let the LLM answer.',
              '6 steps: Load → Chunk → Embed → Store → Retrieve → Generate.',
              'Embeddings turn meaning into numbers so similar texts cluster together.',
              'Vector databases enable fast similarity search across millions of chunks.',
              'RAG beats fine-tuning for factual, updatable knowledge.',
              'Always cite sources so users know where the answer came from.',
            ]} />
          </div>
          <div style={{ flex: '1 1 300px' }}>
            <MentalModel
              emoji="📎"
              title="Your Mental Model"
              desc="RAG is like giving the LLM an open-book exam. Instead of guessing from memory, it looks up the answer in your documents first, then formulates a response grounded in facts."
              accent={AC}
            />
          </div>
        </div>
      </RevealSection>

      {/* ── Quick Summary ── */}
      <RevealSection>
        <QuickSummary
          accent={AC}
          summary="RAG solves the 'LLM doesn't know your data' problem by retrieving relevant documents before generating an answer. The pipeline: load docs, chunk them, convert to embeddings, store in a vector DB, retrieve at query time, and generate grounded answers. It's cheaper than fine-tuning, always up-to-date, and provides citations."
        />
      </RevealSection>

      {/* ── Practice Questions ── */}
      <RevealSection>
        <PracticeQuestions accent={AC} questions={[
          'Why can\'t an LLM answer questions about your internal documents without RAG?',
          'What are the 6 steps in a RAG pipeline?',
          'What is an embedding? Why do similar texts have similar embeddings?',
          'Why is RAG better than fine-tuning for factual knowledge?',
          'What happens if you retrieve irrelevant chunks in RAG?',
        ]} />
      </RevealSection>

      {/* ── What to Learn Next ── */}
      <RevealSection>
        <div style={{
          padding: '1.25rem', borderRadius: 12,
          background: 'var(--bg2)', border: '1px solid var(--border)', marginBottom: '1rem',
        }}>
          <div style={{ fontSize: 'var(--font-micro)', fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 'var(--ls-wide)', marginBottom: '.5rem' }}>What's Next</div>
          <div style={{ fontSize: 'var(--font-body)', color: 'var(--muted)', lineHeight: 'var(--lh-normal)' }}>
            Now you know how to give LLMs knowledge. Next we&apos;ll learn <strong style={{ color: 'var(--accent5)' }}>how to talk to them</strong> —
            the art and science of <strong style={{ color: 'var(--accent5)' }}>prompt engineering</strong>.
          </div>
        </div>
      </RevealSection>
    </section>
  );
}
