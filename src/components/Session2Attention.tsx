import { useEffect, useRef, useState } from 'react';
import {
  AnalogyGrid, DemoCard, RevealSection, SectionHeader, SubSection,
  ConceptBlock, InfoBox,
  RecapBox, PracticeQuestions, QuickSummary, MentalModel, BeforeAfter,
  StepBuilder, AnimatedPipeline,
} from './shared';

const SENTENCE = ['The', 'cat', 'sat', 'on', 'the', 'mat'];
const ATTENTION: Record<number, number[]> = {
  0: [0.1, 0.4, 0.1, 0.05, 0.3, 0.05],
  1: [0.2, 0.1, 0.5, 0.05, 0.05, 0.1],
  2: [0.05, 0.4, 0.1, 0.15, 0.05, 0.25],
  3: [0.05, 0.1, 0.2, 0.05, 0.1, 0.5],
  4: [0.3, 0.1, 0.1, 0.05, 0.1, 0.35],
  5: [0.05, 0.1, 0.2, 0.35, 0.15, 0.15],
};

const AC = '#7c3aed';

function drawAttention(canvas: HTMLCanvasElement, fromIdx: number) {
  const dpr = window.devicePixelRatio || 1;
  const parent = canvas.parentElement!;
  const W = parent.clientWidth;
  const H = 200;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  canvas.style.height = H + 'px';
  const ctx = canvas.getContext('2d')!;
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, W, H);
  const weights = ATTENTION[fromIdx] || [];
  const cols = SENTENCE.length;
  const colW = W / cols;

  weights.forEach((weight, i) => {
    if (weight < 0.03) return;
    const x1 = colW * fromIdx + colW / 2;
    const x2 = colW * i + colW / 2;
    ctx.beginPath();
    ctx.moveTo(x1, 30);
    ctx.quadraticCurveTo((x1 + x2) / 2, 30 + (160 - 30) * 0.4 - 40, x2, 160);
    ctx.strokeStyle = `rgba(124,58,237,${weight * 2.5})`;
    ctx.lineWidth = weight * 10;
    ctx.stroke();
  });

  const sx = colW * fromIdx + colW / 2;
  ctx.fillStyle = 'rgba(124,58,237,0.15)';
  ctx.beginPath(); ctx.roundRect(sx - 30, 10, 60, 28, 6); ctx.fill();
  ctx.strokeStyle = 'rgba(124,58,237,0.6)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.roundRect(sx - 30, 10, 60, 28, 6); ctx.stroke();
  ctx.fillStyle = '#7c3aed'; ctx.font = '14px SF Mono, Fira Code, monospace'; ctx.textAlign = 'center';
  ctx.fillText(SENTENCE[fromIdx], sx, 29);

  SENTENCE.forEach((w, i) => {
    const x = colW * i + colW / 2;
    const weight = weights[i] || 0;
    ctx.fillStyle = `rgba(255,255,255,${0.3 + weight * 2})`;
    ctx.font = weight > 0.2 ? '500 14px SF Mono, Fira Code, monospace' : '14px SF Mono, Fira Code, monospace';
    ctx.fillText(w, x, 175);
    if (weight > 0.05) {
      ctx.fillStyle = `rgba(124,58,237,${weight * 3})`;
      ctx.font = '12px SF Mono, Fira Code, monospace';
      ctx.fillText((weight * 100).toFixed(0) + '%', x, 195);
    }
  });
}

/* ─── Attention Heat Map ─── */

function AttentionHeatMap() {
  const [hoverCol, setHoverCol] = useState<number | null>(null);

  return (
    <div style={{ background: 'var(--primary)', border: '1px solid var(--border-dark)', color: 'var(--muted-dark-strong)', borderRadius: 12, padding: '1.25rem', marginBottom: '1rem' }}>
      <div style={{ fontSize: 'var(--font-caption)', color: 'var(--muted)', fontFamily: 'var(--ff-mono)', marginBottom: '.75rem' }}>
        Hover a cell to see attention strength (darker = stronger)
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: '.5rem' }}>
        <div style={{ width: 50, fontSize: 'var(--font-mono)', color: 'var(--muted)', fontFamily: 'var(--ff-mono)' }} />
        {SENTENCE.map((w, j) => (
          <div key={j} style={{
            width: 60, textAlign: 'center', fontSize: 'var(--font-micro)', fontFamily: 'var(--ff-mono)',
            color: hoverCol === j ? AC : 'var(--muted)', transition: 'color .2s',
          }}>{w}</div>
        ))}
      </div>
      {SENTENCE.map((rowWord, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 2 }}>
          <div style={{
            width: 50, fontSize: 'var(--font-micro)', fontFamily: 'var(--ff-mono)', color: 'var(--ink)',
            textAlign: 'right', paddingRight: 8,
          }}>{rowWord}</div>
          {SENTENCE.map((_, j) => {
            const w = ATTENTION[i][j];
            return (
              <div
                key={j}
                onMouseEnter={() => setHoverCol(j)}
                onMouseLeave={() => setHoverCol(null)}
                style={{
                  width: 60, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: `rgba(124,58,237,${w * 1.5})`,
                  border: hoverCol === j ? '1px solid rgba(124,58,237,0.8)' : '1px solid var(--border)',
                  fontFamily: 'var(--ff-mono)', fontSize: 'var(--font-micro)',
                  color: w > 0.3 ? '#fff' : 'var(--muted)',
                  cursor: 'pointer', transition: 'all .2s',
                  transform: hoverCol === j ? 'scale(1.08)' : 'scale(1)',
                }}
              >
                {(w * 100).toFixed(0)}%
              </div>
            );
          })}
        </div>
      ))}
      <div style={{ fontSize: 'var(--font-mono)', color: 'var(--muted)', marginTop: '.5rem' }}>
        Each cell shows how much the row word "attends to" the column word
      </div>
    </div>
  );
}

/* ─── QKV Interactive Demo ─── */

function QKVDemo() {
  const [word, setWord] = useState('cat');
  const words = ['The', 'cat', 'sat', 'on', 'the', 'mat'];
  const qkvData: Record<string, { q: number[]; k: number[]; v: number[] }> = {
    'The': { q: [0.2, 0.5], k: [0.8, 0.1], v: [0.3, 0.7] },
    'cat': { q: [0.9, 0.3], k: [0.4, 0.8], v: [0.6, 0.5] },
    'sat': { q: [0.5, 0.9], k: [0.3, 0.6], v: [0.8, 0.2] },
    'on': { q: [0.3, 0.4], k: [0.7, 0.3], v: [0.2, 0.4] },
    'the': { q: [0.2, 0.5], k: [0.8, 0.1], v: [0.3, 0.7] },
    'mat': { q: [0.7, 0.6], k: [0.5, 0.9], v: [0.9, 0.3] },
  };

  const d = qkvData[word];

  const dotWith = (otherWord: string) => {
    const o = qkvData[otherWord];
    if (!d || !o) return 0;
    return d.q[0] * o.k[0] + d.q[1] * o.k[1];
  };

  return (
    <div style={{ background: 'var(--primary)', border: '1px solid var(--border-dark)', color: 'var(--muted-dark-strong)', borderRadius: 12, padding: '1.25rem' }}>
      <div style={{ fontSize: 'var(--font-caption)', color: 'var(--muted)', fontFamily: 'var(--ff-mono)', marginBottom: '.75rem' }}>
        Click a word to see its Q, K, V and what it matches with:
      </div>
      <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {words.map((w) => (
          <button
            key={w}
            onClick={() => setWord(w)}
            style={{
              padding: '.35rem .75rem', borderRadius: 6, fontSize: 'var(--font-caption)',
              background: word === w ? AC + '1e' : 'var(--soft-stone)',
              border: `1px solid ${word === w ? AC + '55' : 'var(--border)'}`,
              color: word === w ? AC : 'var(--muted)',
              cursor: 'pointer', fontFamily: 'var(--ff-mono)', fontWeight: word === w ? 600 : 400,
            }}
          >
            {w}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '.5rem', marginBottom: '1rem' }}>
        <div style={{ padding: '.65rem', borderRadius: 8, background: 'rgba(24,99,220,.1)', border: '1px solid rgba(24,99,220,.3)', textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--font-mono)', color: 'var(--accent)', fontFamily: 'var(--ff-mono)', marginBottom: '.25rem' }}>Query (Q)</div>
          <div style={{ fontSize: 'var(--font-caption)', color: 'var(--ink)', fontFamily: 'var(--ff-mono)' }}>
            [{d.q.map((v, i) => <span key={i} style={{ color: 'var(--accent)' }}>{v.toFixed(1)}{i < d.q.length - 1 ? ', ' : ''}</span>)}]
          </div>
          <div style={{ fontSize: 'var(--font-mono)', color: 'var(--muted)', marginTop: '.25rem' }}>"What am I looking for?"</div>
        </div>
        <div style={{ padding: '.65rem', borderRadius: 8, background: 'rgba(124,58,237,.1)', border: '1px solid rgba(124,58,237,.3)', textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--font-mono)', color: 'var(--accent2)', fontFamily: 'var(--ff-mono)', marginBottom: '.25rem' }}>Key (K)</div>
          <div style={{ fontSize: 'var(--font-caption)', color: 'var(--ink)', fontFamily: 'var(--ff-mono)' }}>
            [{d.k.map((v, i) => <span key={i} style={{ color: 'var(--accent2)' }}>{v.toFixed(1)}{i < d.k.length - 1 ? ', ' : ''}</span>)}]
          </div>
          <div style={{ fontSize: 'var(--font-mono)', color: 'var(--muted)', marginTop: '.25rem' }}>"What do I contain?"</div>
        </div>
        <div style={{ padding: '.65rem', borderRadius: 8, background: 'rgba(5,150,105,.1)', border: '1px solid rgba(5,150,105,.3)', textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--font-mono)', color: 'var(--accent3)', fontFamily: 'var(--ff-mono)', marginBottom: '.25rem' }}>Value (V)</div>
          <div style={{ fontSize: 'var(--font-caption)', color: 'var(--ink)', fontFamily: 'var(--ff-mono)' }}>
            [{d.v.map((v, i) => <span key={i} style={{ color: 'var(--accent3)' }}>{v.toFixed(1)}{i < d.v.length - 1 ? ', ' : ''}</span>)}]
          </div>
          <div style={{ fontSize: 'var(--font-mono)', color: 'var(--muted)', marginTop: '.25rem' }}>"What info do I carry?"</div>
        </div>
      </div>

      <div style={{ fontSize: 'var(--font-caption)', color: 'var(--muted)', fontFamily: 'var(--ff-mono)', marginBottom: '.5rem' }}>
        "{word}" attention scores (Q × K):
      </div>
      <div style={{ display: 'flex', gap: '.35rem', flexWrap: 'wrap' }}>
        {words.map((w) => {
          const score = dotWith(w);
          const maxScore = Math.max(...words.map(dotWith));
          return (
            <div key={w} style={{
              padding: '.4rem .65rem', borderRadius: 6, textAlign: 'center', flex: 1, minWidth: 60,
              background: `rgba(124,58,237,${(score / maxScore) * 0.4})`,
              border: `1px solid rgba(124,58,237,${(score / maxScore) * 0.6})`,
              fontFamily: 'var(--ff-mono)', fontSize: 'var(--font-caption)',
            }}>
              <div style={{ color: 'var(--ink)' }}>{w}</div>
              <div style={{ color: score > 0.3 ? AC : 'var(--muted)', fontSize: 'var(--font-micro)' }}>{(score * 100).toFixed(0)}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Session2Attention() {
  const [selected, setSelected] = useState(2);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) drawAttention(canvasRef.current, selected);
  }, [selected]);

  useEffect(() => {
    const handleResize = () => { if (canvasRef.current) drawAttention(canvasRef.current, selected); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [selected]);

  return (
    <section id="s2" style={{ maxWidth: 900, margin: '0 auto', padding: '5rem 2rem' }}>
      <RevealSection>
        <SectionHeader num="02" tag="Session 2 · 1.5 hrs" title="How LLMs Understand Words" accentColor={AC} borderColor="rgba(124,58,237,0.3)" />
        <p style={{ color: 'var(--muted)', maxWidth: 600, marginBottom: '2.5rem', fontSize: 'var(--font-body)' }}>
          How does the model know "it" refers to "the cat" and not "the mat"? The answer is <strong style={{ color: 'var(--ink)' }}>attention</strong> —
          the mechanism that lets every word look at every other word.
        </p>
      </RevealSection>

      {/* ── Real-World Analogy ── */}
      <RevealSection>
        <SubSection title="The Spotlight Analogy" accent={AC}>
          <ConceptBlock title="Attention = a Spotlight" accent={AC}>
            Imagine you're in a dark room full of people. Someone says "The cat sat on the mat."
            Your brain connects "cat" with "sat" (the cat is doing the action).
            <strong style={{ color: 'var(--ink)' }}>Attention is the model's spotlight</strong> — it shines brighter on important connections.
          </ConceptBlock>

          <AnimatedPipeline accent={AC} stages={[
            { icon: '📝', label: 'Input Words', desc: 'The cat sat on the mat' },
            { icon: '🔦', label: 'Check All Pairs', desc: 'Every word x every word' },
            { icon: '📊', label: 'Score Relevance', desc: 'How important is this pair?' },
            { icon: '🎯', label: 'Blend Info', desc: 'Borrow info from relevant words' },
          ]} />
        </SubSection>
      </RevealSection>

      {/* ── The Problem Before ── */}
      <RevealSection>
        <SubSection title="The Old Way: RNNs (Bad Memory)" accent={AC}>
          <ConceptBlock title="Before transformers, models forgot early words" accent={AC}>
            Old models (RNNs) read text left-to-right, one word at a time. They had a tiny memory that got passed along.
            By the end of a paragraph, they'd <strong style={{ color: 'var(--ink)' }}>forgotten the beginning</strong>.
          </ConceptBlock>

          <BeforeAfter
            accent={AC}
            before="RNN: The → cat → sat → on → the → mat → (forgets 'cat' by now)"
            after="Transformer: ALL words at once, connected directly — no forgetting!"
          />
        </SubSection>
      </RevealSection>

      {/* ── Self-Attention ── */}
      <RevealSection>
        <SubSection title="Self-Attention: Every Word Checks Every Word" accent={AC}>
          <ConceptBlock title="Q, K, V = The Library System" accent={AC}>
            Every word creates 3 things:
            <br /><br />
            <strong style={{ color: 'var(--ink)' }}>Query (Q)</strong> = "What am I looking for?"<br />
            <strong style={{ color: 'var(--ink)' }}>Key (K)</strong> = "What do I contain?"<br />
            <strong style={{ color: 'var(--ink)' }}>Value (V)</strong> = "What info do I carry?"
            <br /><br />
            "cat" creates a Query for "things that sit." "mat" has a Key that matches. Result: cat pays attention to mat.
          </ConceptBlock>

          <DemoCard label="Interactive Demo" title="Click Words to See Q, K, V in Action" desc="See how Query matches with Keys to produce attention scores.">
            <QKVDemo />
          </DemoCard>

          <StepBuilder accent={AC} steps={[
            { label: 'Step 1: Each word gets embedded as a number vector', detail: 'Every word is converted from text to a list of numbers (its embedding). Similar words have similar number patterns.' },
            { label: 'Step 2: Create Query, Key, Value vectors', detail: 'The embedding is multiplied by 3 different matrices (Wq, Wk, Wv) to produce Q, K, V. These are learned during training.' },
            { label: 'Step 3: Compute attention scores (Q × K)', detail: 'Every word\'s Query is dotted with every other word\'s Key. Higher dot product = more relevant. This is where "cat" finds "mat."' },
            { label: 'Step 4: Softmax turns scores into percentages', detail: 'Raw scores can be any number. Softmax converts them to probabilities that sum to 100%. Now we have "attention weights."' },
            { label: 'Step 5: Blend Values using attention weights', detail: 'Each word\'s output is a weighted blend of all Value vectors. "cat" ends up carrying info from "sat" and "mat" too.' },
          ]} />

          <InfoBox accent={AC}>
            <strong style={{ color: 'var(--ink)' }}>The key insight:</strong> Every word gets a "personalized blend" of every other word's information.
            "Cat" knows it's connected to "sat" (the action) and "mat" (the location).
            All computed in one parallel step.
          </InfoBox>
        </SubSection>
      </RevealSection>

      {/* ── Multi-Head Attention ── */}
      <RevealSection>
        <SubSection title="Multi-Head Attention: Many Spotlights at Once" accent={AC}>
          <AnalogyGrid items={[
            { emoji: '🔦', title: 'One spotlight is not enough', desc: 'A single attention head learns one relationship type. But language has many: grammar, meaning, position, coreference.' },
            { emoji: '🔭🔬🔍', title: 'Multiple heads = multiple perspectives', desc: 'Head 1 tracks grammar. Head 2 tracks meaning. Head 3 tracks position. They run in parallel, then combine.' },
            { emoji: '🧅', title: 'Layers build depth', desc: 'Layer 1: simple word patterns. Layer 5: sentence structure. Layer 20: meaning. Layer 96: abstract reasoning.' },
          ]} />
        </SubSection>
      </RevealSection>

      {/* ── Positional Encoding ── */}
      <RevealSection>
        <SubSection title="Wait — Order Matters!" accent={AC}>
          <ConceptBlock title='"The dog bit the man" ≠ "The man bit the dog"' accent={AC}>
            Attention treats input as a <strong style={{ color: 'var(--ink)' }}>bag of words</strong> — it has no built-in sense of order.
            These two sentences look identical to pure attention: [The, dog, bit, the, man].
            <br /><br />
            <strong style={{ color: 'var(--ink)' }}>Positional encoding</strong> tags each word with its position so "dog" before "bit" is different from "dog" after.
          </ConceptBlock>

          <BeforeAfter
            accent={AC}
            before="Without position: 'dog bit man' = 'man bit dog' → BAD!"
            after="With position: 'dog(1) bit(2) man(3)' ≠ 'man(1) bit(2) dog(3)' → CORRECT!"
          />
        </SubSection>
      </RevealSection>

      {/* ── Heat Map Demo ── */}
      <RevealSection>
        <DemoCard
          label="Interactive Demo"
          title="Attention Heat Map"
          desc="Hover over the grid to see how strongly each word connects to every other word."
        >
          <AttentionHeatMap />
        </DemoCard>
      </RevealSection>

      {/* ── Canvas Demo ── */}
      <RevealSection>
        <DemoCard
          label="Interactive Demo"
          title="Click a Word — See Attention Lines"
          desc="Each curve connects the selected word to others. Thicker = stronger attention."
        >
          <div style={{ background: 'var(--primary)', border: '1px solid var(--border-dark)', color: 'var(--muted-dark-strong)', borderRadius: 12, padding: '1rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem', marginBottom: '1rem' }}>
              {SENTENCE.map((word, i) => (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  style={{
                    padding: '.4rem .9rem', borderRadius: 8,
                    background: selected === i ? 'rgba(124,58,237,.15)' : 'var(--soft-stone)',
                    border: selected === i ? '1px solid var(--accent2)' : '1px solid var(--border)',
                    color: selected === i ? 'var(--accent2)' : 'var(--ink)',
                    fontFamily: 'var(--ff-mono)', fontSize: 'var(--font-body)',
                    cursor: 'pointer', transition: 'all .2s',
                  }}
                >
                  {word}
                </button>
              ))}
            </div>
            <div style={{ borderRadius: 12, background: 'var(--soft-stone)', border: '1px solid var(--border)', overflow: 'hidden' }}>
              <canvas ref={canvasRef} style={{ display: 'block', width: '100%' }} />
            </div>
          </div>
        </DemoCard>
      </RevealSection>

      {/* ── Recap ── */}
      <RevealSection>
        <RecapBox accent={AC} items={[
          'Attention lets every word look at every other word.',
          'Old models (RNNs) forgot early words — transformers don\'t.',
          'Q (Query), K (Key), V (Value) = library search system.',
          'Multiple heads = multiple relationship types in parallel.',
          'Positional encoding ensures word order is preserved.',
          'Transformers process all words in parallel — faster and better.',
        ]} />
      </RevealSection>

      {/* ── Mental Model ── */}
      <RevealSection>
        <MentalModel
          emoji="🔦"
          title="Your Mental Model"
          desc="Think of attention as a spotlight system. Every word shines a spotlight on every other word. 'Cat' shines bright on 'sat' (who's doing what?) and 'mat' (where?). The brighter the light, the more information gets shared between those words."
          accent={AC}
        />
      </RevealSection>

      {/* ── 30-Second Summary ── */}
      <RevealSection>
        <QuickSummary
          accent={AC}
          summary="Attention is how every word asks 'are you important to me?' and blends the answer into its own meaning. It runs in parallel for all words, uses multiple 'heads' for different relationship types, and adds position info so word order matters. This is the core innovation that made modern LLMs possible."
        />
      </RevealSection>

      {/* ── Practice Questions ── */}
      <RevealSection>
        <PracticeQuestions accent={AC} questions={[
          'What problem did transformers solve that RNNs had?',
          'In the library analogy, what do Query, Key, and Value represent?',
          'Why do we need multiple attention heads instead of just one?',
          'Why is positional encoding necessary? Give an example.',
          'What does the percentage in the attention heat map mean?',
        ]} />
      </RevealSection>

      {/* ── What to Learn Next ── */}
      <RevealSection>
        <div style={{
          padding: '1rem 1.25rem', borderRadius: 12,
          background: 'var(--primary)', border: '1px solid var(--border-dark)', color: 'var(--muted-dark-strong)', marginBottom: '1rem',
        }}>
          <div style={{ fontSize: 'var(--font-micro)', fontFamily: 'var(--ff-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 'var(--ls-wide)', marginBottom: '.5rem' }}>What's Next</div>
          <div style={{ fontSize: 'var(--font-body)', color: 'var(--muted)', lineHeight: 'var(--lh-body)' }}>
            You now know how LLMs connect words. But they can only "see" what's in their <strong style={{ color: 'var(--ink)' }}>context window</strong> —
            next we'll explore this critical limitation.
          </div>
        </div>
      </RevealSection>
    </section>
  );
}
