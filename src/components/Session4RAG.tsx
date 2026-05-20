import { useState } from 'react';
import {
  DemoCard, RevealSection, SectionHeader, SubSection,
  ConceptBlock, KeyPoint, FlowDiagram, InfoBox,
  RecapBox, PracticeQuestions, QuickSummary, MentalModel, BeforeAfter,
  AnimatedPipeline, ToggleCompare,
} from './shared';

const AC = '#ea580c';

const RAG_STEPS = [
  { num: '01', icon: '📄', title: 'Load Documents', sub: 'PDFs, web pages, databases',
    detail: `You have documents — policy PDFs, wiki pages, customer emails.\n\nExample:\nloader = PyPDFLoader("policy.pdf")\ndocs = loader.load()\n\nThe raw text is too long to pass directly to the LLM. We need to break it into pieces first.` },
  { num: '02', icon: '✂️', title: 'Chunk Text', sub: 'Cut into ~500 token pieces',
    detail: `Long documents are split into chunks with overlap so no sentence gets cut in half.\n\nExample:\nsplitter = RecursiveCharacterTextSplitter(\n  chunk_size=500, chunk_overlap=50\n)\nchunks = splitter.split_documents(docs)\n\nLike cutting a long scroll into pages where each page keeps a bit of the previous one.` },
  { num: '03', icon: '🔢', title: 'Create Embeddings', sub: 'Turn chunks into number codes',
    detail: `Each chunk is converted to a vector — a list of ~1500 numbers that captures its meaning.\n\nExample:\nembeddings = OpenAIEmbeddings()\nvectors = embeddings.embed_documents(chunks)\n\nSimilar chunks get similar number patterns. "heart attack" and "cardiac arrest" end up with almost the same numbers.` },
  { num: '04', icon: '💾', title: 'Store in Vector DB', sub: 'Save for fast search',
    detail: `All the number-vectors are stored in a special database optimized for similarity search.\n\nvectorstore = Chroma.from_documents(chunks, embeddings)\n\nThink of a library where books are organized by topic, not title.` },
  { num: '05', icon: '🔍', title: 'Retrieve Relevant Chunks', sub: 'Find matches at query time',
    detail: `When a user asks a question, it's turned into numbers too. The database finds the closest-matching chunks.\n\nretriever = vectorstore.as_retriever(k=4)\nrelevant_docs = retriever.invoke("What is the refund policy?")\n\nTop-k=4 means "give me the 4 most relevant chunks."` },
  { num: '06', icon: '🤖', title: 'Generate Answer', sub: 'Answer based on retrieved facts',
    detail: `The retrieved chunks are injected into the prompt alongside the user's question.\n\nprompt = f"Answer based on this context:\\n{context}\\n\\nQuestion: {question}"\nanswer = llm.invoke(prompt)\n\nResult: factual answers with citations. Far fewer hallucinations.` },
];

/* ─── RAG vs No-RAG Demo ─── */

function RagComparison() {
  const [query, setQuery] = useState('What is the refund policy for electronics?');
  const [showRag, setShowRag] = useState(false);

  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', gap: '.5rem', marginBottom: '.75rem' }}>
        <button
          onClick={() => setShowRag(false)}
          style={{
            flex: 1, padding: '.5rem', borderRadius: 8, cursor: 'pointer',
            background: !showRag ? 'rgba(244,67,54,.1)' : 'var(--primary)',
            border: `1px solid ${!showRag ? 'rgba(244,67,54,.4)' : 'var(--border)'}`,
            color: !showRag ? '#f87171' : 'var(--muted)',
            fontSize: 'var(--font-caption)', fontFamily: 'var(--ff-mono)',
          }}
        >❌ Without RAG</button>
        <button
          onClick={() => setShowRag(true)}
          style={{
            flex: 1, padding: '.5rem', borderRadius: 8, cursor: 'pointer',
            background: showRag ? AC + '15' : 'var(--primary)',
            border: `1px solid ${showRag ? AC + '44' : 'var(--border)'}`,
            color: showRag ? AC : 'var(--muted)',
            fontSize: 'var(--font-caption)', fontFamily: 'var(--ff-mono)',
          }}
        >✅ With RAG</button>
      </div>

      <div style={{ background: 'var(--primary)', borderRadius: 8, padding: '.65rem .85rem', marginBottom: '.75rem', border: '1px solid var(--border)' }}>
        <span style={{ fontSize: 'var(--font-micro)', color: 'var(--muted)', fontFamily: 'var(--ff-mono)' }}>User asks: </span>
        <span style={{ fontSize: 'var(--font-caption)', color: 'var(--ink)', fontFamily: 'var(--ff-mono)' }}>"{query}"</span>
      </div>

      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        style={{
          width: '100%', padding: '.5rem .75rem', borderRadius: 8, marginBottom: '.75rem',
          background: 'var(--soft-stone)', border: '1px solid var(--hairline)',
          color: 'var(--ink)', fontFamily: 'var(--ff-mono)', fontSize: 'var(--font-caption)',
          outline: 'none',
        }}
        placeholder="Type a question..."
      />

      {!showRag ? (
        <div style={{
          padding: '1rem', borderRadius: 8,
          background: 'rgba(244,67,54,.05)', border: '1px solid rgba(244,67,54,.3)',
          animation: 'fadeIn .3s ease',
        }}>
          <div style={{ fontSize: 'var(--font-micro)', fontFamily: 'var(--ff-mono)', color: '#f87171', marginBottom: '.5rem' }}>LLM guesses from memory:</div>
          <div style={{ fontSize: 'var(--font-body)', color: 'var(--muted)', lineHeight: 'var(--lh-body)' }}>
            "Our refund policy allows returns within 30 days of purchase. Electronics can be returned within 30 days as well."<br /><br />
            <span style={{ color: '#f87171', fontSize: 'var(--font-caption)' }}>⚠️ This looks right — but is it? The model is guessing. If the actual policy says 14 days for electronics, this answer is WRONG.</span>
          </div>
        </div>
      ) : (
        <div style={{
          padding: '1rem', borderRadius: 8,
          background: AC + '0a', border: `1px solid ${AC}44`,
          animation: 'fadeIn .3s ease',
        }}>
          <div style={{ fontSize: 'var(--font-micro)', fontFamily: 'var(--ff-mono)', color: AC, marginBottom: '.5rem' }}>LLM reads from real documents:</div>

          <div style={{ fontSize: 'var(--font-micro)', color: 'var(--accent3)', fontFamily: 'var(--ff-mono)', marginBottom: '.5rem', padding: '.4rem .6rem', background: 'var(--soft-stone)', borderRadius: 6, border: '1px solid var(--border)' }}>
            📄 Retrieved from "policy.pdf" page 4:<br />
            "Electronics: Returns accepted within 14 days of purchase with original receipt."
          </div>

          <div style={{ fontSize: 'var(--font-body)', color: 'var(--ink)', lineHeight: 'var(--lh-body)' }}>
            "According to company policy (page 4), electronics can only be returned within <strong style={{ color: AC }}>14 days</strong> of purchase with the original receipt."<br /><br />
            <span style={{ color: 'var(--accent3)', fontSize: 'var(--font-caption)' }}>✅ Correct! The answer is grounded in an actual document.</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Similarity Visualizer ─── */

function SimilarityDemo() {
  const query = 'heart attack symptoms';
  const docs = [
    { text: 'Heart attack symptoms include chest pain', score: 0.92, color: AC },
    { text: 'Cardiac arrest requires immediate CPR', score: 0.85, color: '#7c3aed' },
    { text: 'Healthy diet prevents heart disease', score: 0.58, color: '#059669' },
    { text: 'Pizza recipe with fresh ingredients', score: 0.12, color: 'var(--muted)' },
    { text: 'How to change a car tire', score: 0.08, color: 'var(--muted)' },
  ];

  return (
    <div style={{ background: 'var(--primary)', border: '1px solid var(--border-dark)', color: 'var(--muted-dark-strong)', borderRadius: 12, padding: '1.25rem' }}>
      <div style={{ fontSize: 'var(--font-caption)', color: 'var(--muted)', fontFamily: 'var(--ff-mono)', marginBottom: '.5rem' }}>
        Semantic search in action:
      </div>
      <div style={{
        padding: '.5rem .75rem', borderRadius: 6, marginBottom: '1rem',
        background: 'var(--soft-stone)', border: '1px solid var(--accent)',
        fontFamily: 'var(--ff-mono)', fontSize: 'var(--font-body)', color: 'var(--accent)',
      }}>
        🔍 Query: "{query}"
      </div>

      {docs.map((doc, i) => (
        <div key={i} style={{
          marginBottom: '.5rem', padding: '.5rem .75rem', borderRadius: 6,
          background: `rgba(251,146,60,${doc.score * 0.15})`,
          border: `1px solid rgba(251,146,60,${doc.score * 0.3})`,
          animation: `fadeIn .3s ${i * 0.1}s ease both`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.25rem' }}>
            <span style={{ fontSize: 'var(--font-caption)', color: 'var(--ink)', fontFamily: 'var(--ff-mono)' }}>{doc.text}</span>
            <span style={{
              fontSize: 'var(--font-micro)', fontFamily: 'var(--ff-mono)', color: doc.score > 0.5 ? AC : 'var(--muted)',
              fontWeight: doc.score > 0.5 ? 600 : 400,
            }}>
              {(doc.score * 100).toFixed(0)}%
            </span>
          </div>
          <div style={{ height: 4, background: 'var(--soft-stone)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${doc.score * 100}%`,
              background: doc.score > 0.5 ? `linear-gradient(90deg, ${doc.color}, ${AC})` : 'var(--hairline)',
              borderRadius: 2, transition: 'width .6s ease',
            }} />
          </div>
        </div>
      ))}

      <div style={{ fontSize: 'var(--font-mono)', color: 'var(--muted)', marginTop: '.5rem' }}>
        Higher percentage = more similar meaning. "Cardiac arrest" (85%) is almost as close as "heart attack" itself.
      </div>
    </div>
  );
}

export default function Session4RAG() {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  return (
    <section id="s4" style={{ maxWidth: 900, margin: '0 auto', padding: '5rem 2rem' }}>
      <RevealSection>
        <SectionHeader num="04" tag="Session 4 · 1.5 hrs" title="RAG — Giving the Model Real Facts" accentColor={AC} borderColor="rgba(251,146,60,0.3)" />
        <p style={{ color: 'var(--muted)', maxWidth: 600, marginBottom: '2.5rem', fontSize: 'var(--font-body)' }}>
          LLMs don't "know" facts. They guess words that sound right. Sometimes they guess wrong (hallucination).
          <strong style={{ color: 'var(--ink)' }}>RAG</strong> fixes this by giving the model real documents to reference.
        </p>
      </RevealSection>

      {/* ── Analogy ── */}
      <RevealSection>
        <SubSection title="The Open-Book Exam" accent={AC}>
          <ConceptBlock title="Closed-book vs Open-book" accent={AC}>
            Normal LLM = student in a <strong style={{ color: 'var(--ink)' }}>closed-book exam</strong> — can only use what they remember.
            RAG = student with an <strong style={{ color: 'var(--ink)' }}>open book</strong> — the relevant pages are right there.
          </ConceptBlock>

          <BeforeAfter
            accent={AC}
            before="Without RAG: 'Our refund policy is 30 days.' (Just guessed — might be wrong)"
            after="With RAG: 'Per policy document page 4: refunds accepted within 14 days for electronics.' (Based on real docs!)"
          />

          <AnimatedPipeline accent={AC} stages={[
            { icon: '📚', label: 'Your Documents', desc: 'PDFs, wikis, policies' },
            { icon: '✂️', label: 'Chunk & Embed', desc: 'Cut into pieces, turn to numbers' },
            { icon: '💾', label: 'Store', desc: 'Save in vector database' },
            { icon: '🔍', label: 'User Asks', desc: 'Find relevant chunks' },
            { icon: '🤖', label: 'Answer', desc: 'Grounded in facts' },
          ]} />
        </SubSection>
      </RevealSection>

      {/* ── Hands-On ── */}
      <RevealSection>
        <SubSection title="Hands-On: See RAG in Action" accent={AC}>
          <DemoCard
            label="Interactive Demo 1"
            title="RAG vs No RAG"
            desc="Type a question and toggle between 'Without RAG' (model guesses) and 'With RAG' (model reads facts)."
          >
            <RagComparison />
          </DemoCard>

          <DemoCard
            label="Interactive Demo 2"
            title="Semantic Search"
            desc="See how similar meanings get similar scores — even without matching keywords."
          >
            <SimilarityDemo />
          </DemoCard>
        </SubSection>
      </RevealSection>

      {/* ── The Pipeline ── */}
      <RevealSection>
        <SubSection title="The RAG Pipeline: 6 Steps" accent={AC}>
          <FlowDiagram accent={AC} steps={[
            { label: 'Load', sub: 'Get documents' },
            { label: 'Chunk', sub: 'Cut into pieces' },
            { label: 'Embed', sub: 'Turn into numbers' },
            { label: 'Store', sub: 'Save in DB' },
            { label: 'Retrieve', sub: 'Find matches' },
            { label: 'Generate', sub: 'Answer with context' },
          ]} />

          <InfoBox accent={AC}>
            <strong style={{ color: 'var(--ink)' }}>Steps 1-4 happen once</strong> (setup). 
            <strong style={{ color: 'var(--ink)' }}>Steps 5-6 happen every time</strong> someone asks.
            That's why RAG is fast — most work is done upfront.
          </InfoBox>

          {/* Step explorer */}
          <div style={{ background: 'var(--primary)', border: '1px solid var(--border-dark)', color: 'var(--muted-dark-strong)', borderRadius: 12, overflow: 'hidden', marginBottom: '1rem' }}>
            {RAG_STEPS.map((step, i) => (
              <div
                key={i}
                onClick={() => setActiveStep(activeStep === i ? null : i)}
                style={{
                  padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem',
                  cursor: 'pointer', transition: 'background .2s',
                  background: activeStep === i ? 'rgba(251,146,60,.06)' : 'var(--primary)',
                  borderBottom: i < RAG_STEPS.length - 1 ? '1px solid var(--border)' : 'none',
                }}
              >
                <div style={{
                  width: 30, height: 30, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--ff-mono)', fontSize: 'var(--font-caption)', fontWeight: 500, flexShrink: 0,
                  background: activeStep === i ? 'rgba(251,146,60,.15)' : 'var(--soft-stone)',
                  border: activeStep === i ? '1px solid var(--accent4)' : '1px solid var(--border)',
                  color: activeStep === i ? 'var(--accent4)' : 'var(--muted)', transition: 'all .2s',
                }}>
                  {step.num}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 'var(--font-body)', fontWeight: 500, marginBottom: 2, color: 'var(--ink)' }}>{step.title}</div>
                  <div style={{ fontSize: 'var(--font-caption)', color: 'var(--muted)' }}>{step.sub}</div>
                </div>
                <div style={{ fontSize: 'var(--font-body-lg)', opacity: activeStep === i ? 1 : 0.4 }}>{step.icon}</div>
              </div>
            ))}
          </div>
          {activeStep !== null && (
            <div style={{
              padding: '1.25rem', borderRadius: 10, minHeight: 60,
              background: 'var(--primary)', border: '1px solid var(--border-dark)', color: 'var(--muted-dark)',
              fontSize: 'var(--font-body)', lineHeight: 'var(--lh-body)',
              animation: 'fadeUp .35s ease',
            }}>
              <strong style={{ color: 'var(--accent4)' }}>{RAG_STEPS[activeStep].icon} {RAG_STEPS[activeStep].title}</strong>
              <div style={{ marginTop: '0.75rem', whiteSpace: 'pre-wrap', color: 'var(--muted)' }}>
                {RAG_STEPS[activeStep].detail}
              </div>
            </div>
          )}
        </SubSection>
      </RevealSection>

      {/* ── Chunking ── */}
      <RevealSection>
        <SubSection title="Chunking: The Hidden Art" accent={AC}>
          <ConceptBlock title="How you cut matters" accent={AC}>
            Bad chunking cuts a sentence in half, losing meaning.
            Good chunking cuts at paragraph boundaries with overlap.
          </ConceptBlock>

          <ToggleCompare
            accent={AC}
            labelA="❌ Bad Chunking"
            labelB="✅ Good Chunking"
            renderA={
              <div style={{ padding: '1rem', borderRadius: 8, background: 'rgba(244,67,54,.05)', border: '1px solid rgba(244,67,54,.3)' }}>
                <div style={{ fontSize: 'var(--font-caption)', fontFamily: 'var(--ff-mono)', color: '#f87171', lineHeight: 1.8 }}>
                  Chunk 1: "The refund policy allows returns within 30 days of"<br /><br />
                  Chunk 2: "purchase. Electronics have a 14-day window."
                </div>
                <div style={{ fontSize: 'var(--font-micro)', color: 'var(--muted)', marginTop: '.5rem' }}>
                  ❌ "30 days of" is disconnected from "purchase" — the model loses the context!
                </div>
              </div>
            }
            renderB={
              <div style={{ padding: '1rem', borderRadius: 8, background: AC + '0a', border: `1px solid ${AC}44` }}>
                <div style={{ fontSize: 'var(--font-caption)', fontFamily: 'var(--ff-mono)', color: 'var(--accent3)', lineHeight: 1.8 }}>
                  Chunk 1: "The refund policy allows returns within 30 days of purchase."<br /><br />
                  Chunk 2: "within 30 days of purchase. Electronics have a 14-day window."
                </div>
                <div style={{ fontSize: 'var(--font-micro)', color: 'var(--muted)', marginTop: '.5rem' }}>
                  ✅ "purchase" appears in both chunks (overlap). No lost context!
                </div>
              </div>
            }
          />

          <KeyPoint num={1} title="Goldilocks chunk size" accent={AC}>
            Too small (50 tokens): loses context. Too large (2000 tokens): dilutes relevance.
            <strong style={{ color: 'var(--ink)' }}>200-500 tokens with 50-token overlap is the sweet spot.</strong>
          </KeyPoint>
        </SubSection>
      </RevealSection>

      {/* ── RAG vs Fine-tuning ── */}
      <RevealSection>
        <SubSection title="RAG vs Fine-tuning" accent={AC}>
          <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid var(--border)', marginBottom: '1rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-body)' }}>
              <thead>
                <tr>
                  <th style={{ padding: '.75rem 1rem', textAlign: 'left', borderBottom: '1px solid var(--border-dark)', background: 'var(--primary)', color: 'var(--on-dark)', fontFamily: 'var(--ff-mono)', fontSize: 'var(--font-micro)' }}>Need</th>
                  <th style={{ padding: '.75rem 1rem', textAlign: 'left', borderBottom: '1px solid var(--border)', background: 'var(--primary)', color: AC, fontFamily: 'var(--ff-mono)', fontSize: 'var(--font-micro)' }}>Use RAG</th>
                  <th style={{ padding: '.75rem 1rem', textAlign: 'left', borderBottom: '1px solid var(--border)', background: 'var(--primary)', color: 'var(--accent2)', fontFamily: 'var(--ff-mono)', fontSize: 'var(--font-micro)' }}>Use Fine-tuning</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { need: 'Fresh data', rag: '✅ Always up to date', ft: '❌ Frozen at training' },
                  { need: 'Company docs', rag: '✅ Just re-index', ft: '❌ Must retrain' },
                  { need: 'Writing style', rag: '❌ Hard to enforce', ft: '✅ Learns the style' },
                  { need: 'Cost', rag: '✅ Pay per query', ft: '💰 Expensive training' },
                  { need: 'Citations', rag: '✅ Can show sources', ft: '❌ No citations' },
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: i < 4 ? '1px solid var(--border)' : 'none' }}>
                    <td style={{ padding: '.65rem 1rem', color: 'var(--ink)', fontWeight: 500 }}>{row.need}</td>
                    <td style={{ padding: '.65rem 1rem', color: 'var(--muted)' }}>{row.rag}</td>
                    <td style={{ padding: '.65rem 1rem', color: 'var(--muted)' }}>{row.ft}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <InfoBox accent={AC}>
            <strong style={{ color: 'var(--ink)' }}>Rule of thumb:</strong> Use RAG when the model needs to <em>know</em> things (your data, recent events).
            Use fine-tuning when the model needs to <em>behave</em> differently (specific style, format, persona).
            They work great together!
          </InfoBox>
        </SubSection>
      </RevealSection>

      {/* ── Recap ── */}
      <RevealSection>
        <RecapBox accent={AC} items={[
          'RAG = give the model real documents before it answers (open-book exam).',
          'Documents are chunked, turned into numbers (embeddings), and stored.',
          'At query time, the most relevant chunks are found by number similarity.',
          'The model reads the chunks and answers based on them — not guesses.',
          'RAG is fast, cheap, and always up-to-date. Use it for factual accuracy.',
          'Good chunking: 200-500 tokens with overlap. Bad chunks = bad answers.',
        ]} />
      </RevealSection>

      {/* ── Mental Model ── */}
      <RevealSection>
        <MentalModel
          emoji="📖"
          title="Your Mental Model"
          desc="Think of RAG as giving the LLM an open book. Without RAG, the model guesses from memory and makes things up. With RAG, you hand it the relevant pages and say 'read this, then answer.' The answer is based on facts, not guesses."
          accent={AC}
        />
      </RevealSection>

      {/* ── Summary ── */}
      <RevealSection>
        <QuickSummary
          accent={AC}
          summary="RAG solves hallucination by giving the LLM real documents to reference. Chunk documents, turn them into number-vectors, store them, and retrieve the most relevant at query time. The LLM answers based on those documents — like an open-book exam."
        />
      </RevealSection>

      {/* ── Practice Questions ── */}
      <RevealSection>
        <PracticeQuestions accent={AC} questions={[
          'What problem does RAG solve?',
          'What does an "embedding" do?',
          'Why is chunking important? What happens if chunks are too large?',
          'What are the 6 steps of the RAG pipeline?',
          'When would you use RAG vs fine-tuning?',
        ]} />
      </RevealSection>

      {/* ── Next ── */}
      <RevealSection>
        <div style={{
          padding: '1rem 1.25rem', borderRadius: 12,
          background: 'var(--primary)', border: '1px solid var(--border-dark)', color: 'var(--muted-dark-strong)', marginBottom: '1rem',
        }}>
          <div style={{ fontSize: 'var(--font-micro)', fontFamily: 'var(--ff-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 'var(--ls-wide)', marginBottom: '.5rem' }}>What's Next</div>
          <div style={{ fontSize: 'var(--font-body)', color: 'var(--muted)', lineHeight: 'var(--lh-body)' }}>
            Now you can give the model facts. But <strong style={{ color: 'var(--ink)' }}>how you ask</strong> matters just as much.
            Next: the art of <strong style={{ color: 'var(--accent5)' }}>prompting</strong>.
          </div>
        </div>
      </RevealSection>
    </section>
  );
}
