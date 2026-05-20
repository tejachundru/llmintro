import { useEffect, useRef, useState } from 'react';
import {
  RevealSection, SectionHeader, SubSection, WarningBox,
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

/* ─── Attention Heat Map (inline demo) ─── */

function AttentionHeatMap() {
  const [hoverCol, setHoverCol] = useState<number | null>(null);

  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <div style={{ fontSize: 'var(--font-caption)', color: 'var(--muted)', fontFamily: 'var(--font-mono)', marginBottom: '1rem' }}>
        Hover a cell to see attention strength (darker = stronger)
      </div>
      <div style={{
        background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14,
        padding: '1.25rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: '.5rem' }}>
          <div style={{ width: 50, fontSize: 'var(--font-mono)', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }} />
          {SENTENCE.map((w, j) => (
            <div key={j} style={{
              width: 60, textAlign: 'center', fontSize: 'var(--font-micro)', fontFamily: 'var(--font-mono)',
              color: hoverCol === j ? AC : 'var(--muted)', transition: 'color .2s',
            }}>{w}</div>
          ))}
        </div>
        {SENTENCE.map((rowWord, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 2 }}>
            <div style={{
              width: 50, fontSize: 'var(--font-micro)', fontFamily: 'var(--font-mono)', color: 'var(--text)',
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
                    fontFamily: 'var(--font-mono)', fontSize: 'var(--font-micro)',
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
          Each cell shows how much the row word &ldquo;attends to&rdquo; the column word
        </div>
      </div>
    </div>
  );
}

/* ─── QKV Interactive Demo (inline) ─── */

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
    <div style={{ marginBottom: '2.5rem' }}>
      <div style={{ fontSize: 'var(--font-caption)', color: 'var(--muted)', fontFamily: 'var(--font-mono)', marginBottom: '1rem' }}>
        Click a word to see its Query, Key, Value vectors and attention scores:
      </div>
      <div style={{
        background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14,
        padding: '1.25rem',
      }}>
        <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {words.map((w) => (
            <button
              key={w}
              onClick={() => setWord(w)}
              style={{
                padding: '.35rem .75rem', borderRadius: 6, fontSize: 'var(--font-caption)',
                background: word === w ? AC + '1e' : 'var(--bg3)',
                border: `1px solid ${word === w ? AC + '55' : 'var(--border)'}`,
                color: word === w ? AC : 'var(--muted)',
                cursor: 'pointer', fontFamily: 'var(--font-mono)', fontWeight: word === w ? 600 : 400,
              }}
            >
              {w}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '.5rem', marginBottom: '1rem' }}>
          <div style={{ padding: '.65rem', borderRadius: 8, background: 'rgba(24,99,220,.1)', border: '1px solid rgba(24,99,220,.3)', textAlign: 'center' }}>
            <div style={{ fontSize: 'var(--font-mono)', color: 'var(--accent)', fontFamily: 'var(--font-mono)', marginBottom: '.25rem' }}>Query (Q)</div>
            <div style={{ fontSize: 'var(--font-caption)', color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
              [{d.q.map((v, i) => <span key={i} style={{ color: 'var(--accent)' }}>{v.toFixed(1)}{i < d.q.length - 1 ? ', ' : ''}</span>)}]
            </div>
            <div style={{ fontSize: 'var(--font-mono)', color: 'var(--muted)', marginTop: '.25rem' }}>&ldquo;What am I looking for?&rdquo;</div>
          </div>
          <div style={{ padding: '.65rem', borderRadius: 8, background: 'rgba(124,58,237,.1)', border: '1px solid rgba(124,58,237,.3)', textAlign: 'center' }}>
            <div style={{ fontSize: 'var(--font-mono)', color: 'var(--accent2)', fontFamily: 'var(--font-mono)', marginBottom: '.25rem' }}>Key (K)</div>
            <div style={{ fontSize: 'var(--font-caption)', color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
              [{d.k.map((v, i) => <span key={i} style={{ color: 'var(--accent2)' }}>{v.toFixed(1)}{i < d.k.length - 1 ? ', ' : ''}</span>)}]
            </div>
            <div style={{ fontSize: 'var(--font-mono)', color: 'var(--muted)', marginTop: '.25rem' }}>&ldquo;What do I contain?&rdquo;</div>
          </div>
          <div style={{ padding: '.65rem', borderRadius: 8, background: 'rgba(5,150,105,.1)', border: '1px solid rgba(5,150,105,.3)', textAlign: 'center' }}>
            <div style={{ fontSize: 'var(--font-mono)', color: 'var(--accent3)', fontFamily: 'var(--font-mono)', marginBottom: '.25rem' }}>Value (V)</div>
            <div style={{ fontSize: 'var(--font-caption)', color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
              [{d.v.map((v, i) => <span key={i} style={{ color: 'var(--accent3)' }}>{v.toFixed(1)}{i < d.v.length - 1 ? ', ' : ''}</span>)}]
            </div>
            <div style={{ fontSize: 'var(--font-mono)', color: 'var(--muted)', marginTop: '.25rem' }}>&ldquo;What info do I carry?&rdquo;</div>
          </div>
        </div>

        <div style={{ fontSize: 'var(--font-caption)', color: 'var(--muted)', fontFamily: 'var(--font-mono)', marginBottom: '.5rem' }}>
          &ldquo;{word}&rdquo; attention scores (Q &times; K):
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
                fontFamily: 'var(--font-mono)', fontSize: 'var(--font-caption)',
              }}>
                <div style={{ color: 'var(--text)' }}>{w}</div>
                <div style={{ color: score > 0.3 ? AC : 'var(--muted)', fontSize: 'var(--font-micro)' }}>{(score * 100).toFixed(0)}%</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── Attention Explorer — click words to see what they "look at" ─── */

function AttentionExplorer() {
  const sentences = [
    { text: 'The dog chased the cat', links: ['The→dog', 'dog→chased', 'chased→cat'] },
    { text: 'She gave him her book', links: ['She→gave', 'gave→book', 'her→book'] },
    { text: 'The pizza was really tasty', links: ['The→pizza', 'pizza→tasty', 'really→tasty'] },
  ];
  const [activeSentence, setActiveSentence] = useState(0);
  const [selectedWord, setSelectedWord] = useState<number | null>(null);
  const sentence = sentences[activeSentence];
  const words = sentence.text.split(' ');

  const linkMap: Record<string, number[]> = {};
  words.forEach((w, i) => {
    linkMap[i] = [];
    sentence.links.forEach(link => {
      const [from, to] = link.split('→');
      if (from === w) {
        const targetIdx = words.indexOf(to);
        if (targetIdx >= 0) linkMap[i].push(targetIdx);
      }
      if (to === w) {
        const sourceIdx = words.indexOf(from);
        if (sourceIdx >= 0) linkMap[i].push(sourceIdx);
      }
    });
  });

  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <div style={{ fontSize: 'var(--font-caption)', color: 'var(--muted)', fontFamily: 'var(--font-mono)', marginBottom: '1rem' }}>
        Click a word — see which other words it &ldquo;attends to&rdquo;:
      </div>
      <div style={{
        background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14,
        padding: '1.5rem',
      }}>
        <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          {sentences.map((s, i) => (
            <button
              key={i}
              onClick={() => { setActiveSentence(i); setSelectedWord(null); }}
              style={{
                padding: '.3rem .7rem', borderRadius: 6, cursor: 'pointer', fontFamily: 'var(--font-mono)',
                fontSize: 'var(--font-micro)', border: '1px solid',
                background: activeSentence === i ? AC + '1e' : 'var(--bg3)',
                borderColor: activeSentence === i ? AC + '55' : 'var(--border)',
                color: activeSentence === i ? AC : 'var(--muted)',
                transition: 'all .2s',
              }}
            >
              &ldquo;{s.text}&rdquo;
            </button>
          ))}
        </div>

        <div style={{
          display: 'flex', justifyContent: 'center', gap: '.5rem',
          padding: '1.5rem 0', position: 'relative', flexWrap: 'wrap',
        }}>
          {words.map((w, i) => {
            const isSelected = selectedWord === i;
            const connected = selectedWord !== null ? linkMap[selectedWord] : [];
            const isConnected = connected.includes(i) && i !== selectedWord;
            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <button
                  onClick={() => setSelectedWord(isSelected ? null : i)}
                  style={{
                    padding: '.5rem .85rem', borderRadius: 8, cursor: 'pointer',
                    fontFamily: 'var(--font-mono)', fontSize: 'var(--font-body)',
                    border: '1px solid',
                    background: isSelected ? AC + '1e' : isConnected ? 'rgba(52,211,153,.15)' : 'var(--bg3)',
                    borderColor: isSelected ? AC + '66' : isConnected ? 'rgba(52,211,153,.4)' : 'var(--border)',
                    color: isSelected ? AC : isConnected ? '#34d399' : 'var(--text)',
                    transform: isSelected ? 'scale(1.1)' : isConnected ? 'scale(1.05)' : 'scale(1)',
                    transition: 'all .3s',
                    fontWeight: isSelected || isConnected ? 600 : 400,
                  }}
                >
                  {w}
                </button>
                {isSelected && (
                  <span style={{
                    marginTop: 4, fontSize: 'var(--font-micro)', color: AC,
                    fontFamily: 'var(--font-mono)',
                  }}>
                    🔍 looking
                  </span>
                )}
                {isConnected && (
                  <span style={{
                    marginTop: 4, fontSize: 'var(--font-micro)', color: '#34d399',
                    fontFamily: 'var(--font-mono)',
                  }}>
                    ← connected
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {selectedWord !== null && (
          <div style={{
            padding: '.65rem .85rem', borderRadius: 8,
            background: AC + '08', border: `1px solid ${AC}22`,
            fontSize: 'var(--font-caption)', color: 'var(--muted)',
            lineHeight: 'var(--lh-snug)', animation: 'fadeIn .25s ease',
          }}>
            <strong style={{ color: AC }}>&ldquo;{words[selectedWord]}&rdquo;</strong> pays attention to:
            {linkMap[selectedWord].length > 0
              ? <> <strong style={{ color: '#34d399' }}>{linkMap[selectedWord].map(i => `"${words[i]}"`).join(', ')}</strong></>
              : <span> no direct connections (in this simplified view)</span>
            }
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Attention Lines Canvas Demo (inline) ─── */

function AttentionLinesDemo() {
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
    <div style={{ marginBottom: '2.5rem' }}>
      <div style={{ fontSize: 'var(--font-caption)', color: 'var(--muted)', fontFamily: 'var(--font-mono)', marginBottom: '1rem' }}>
        Click a word — see how attention flows to every other word:
      </div>
      <div style={{
        background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14,
        padding: '1.25rem',
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem', marginBottom: '1rem' }}>
          {SENTENCE.map((word, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              style={{
                padding: '.4rem .9rem', borderRadius: 8,
                background: selected === i ? 'rgba(124,58,237,.15)' : 'var(--bg3)',
                border: selected === i ? '1px solid var(--accent2)' : '1px solid var(--border)',
                color: selected === i ? 'var(--accent2)' : 'var(--text)',
                fontFamily: 'var(--font-mono)', fontSize: 'var(--font-body)',
                cursor: 'pointer', transition: 'all .2s',
              }}
            >
              {word}
            </button>
          ))}
        </div>
        <div style={{ borderRadius: 12, background: 'var(--bg3)', border: '1px solid var(--border)', overflow: 'hidden' }}>
          <canvas ref={canvasRef} style={{ display: 'block', width: '100%' }} />
        </div>
      </div>
    </div>
  );
}

export default function Session2Attention() {
  return (
    <section id="s2" style={{ maxWidth: 960, margin: '0 auto', padding: '4rem 2rem 6rem' }}>
      {/* ── Header + Intro ── */}
      <RevealSection>
        <SectionHeader num="02" tag="Topic 2" title="How LLMs Understand Words" accentColor={AC} borderColor={`${AC}44`} />
        <p style={{ color: 'var(--muted)', maxWidth: 640, fontSize: 'var(--font-body-lg)', lineHeight: 'var(--lh-relaxed)' }}>
          Here&apos;s the problem: in the sentence &ldquo;The cat sat on the mat because <strong style={{ color: 'var(--text)' }}>it</strong> was tired&rdquo; — what is &ldquo;it&rdquo;? The cat or the mat?
        </p>
        <p style={{ color: 'var(--muted)', maxWidth: 640, fontSize: 'var(--font-body-lg)', lineHeight: 'var(--lh-relaxed)' }}>
          Humans know instantly. But computers? They see only individual words. <strong style={{ color: 'var(--text)' }}>Attention</strong> is the clever mechanism that lets every word &ldquo;look at&rdquo; every other word and decide what&apos;s connected. It&apos;s the reason LLMs understand context instead of just memorizing phrases.
        </p>
      </RevealSection>

      {/* ── Why This Matters ── */}
      <RevealSection style={{ marginBottom: '2rem' }}>
        <ConceptBlock title="Why should you care?" accent={AC}>
          Attention is the <strong style={{ color: 'var(--text)' }}>secret sauce</strong> behind every modern LLM. Before 2017, models couldn&apos;t handle long sentences. Attention changed everything. Understanding it helps you know why LLMs are so powerful — and where they still mess up.
        </ConceptBlock>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          {[
            { icon: '🧩', title: 'Connects ideas', desc: 'Links pronouns to nouns, actions to subjects across any distance' },
            { icon: '⚡', title: 'Massively parallel', desc: 'Checks ALL word pairs simultaneously — not one at a time like old models' },
            { icon: '📏', title: 'Distance doesn\'t matter', desc: 'Connects word 1 to word 1000 as easily as word 1 to word 2' },
          ].map((r, i) => (
            <div key={i} style={{
              padding: '1rem 1.25rem', borderRadius: 12, background: 'var(--bg2)',
              border: '1px solid var(--border)', transition: 'all .25s',
            }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = AC + '44'; el.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = 'var(--border)'; el.style.transform = 'none'; }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '.35rem' }}>{r.icon}</div>
              <div style={{ fontSize: 'var(--font-body)', fontWeight: 500, color: 'var(--text)', marginBottom: '.2rem' }}>{r.title}</div>
              <div style={{ fontSize: 'var(--font-caption)', color: 'var(--muted)', lineHeight: 'var(--lh-snug)' }}>{r.desc}</div>
            </div>
          ))}
        </div>
      </RevealSection>

      {/* ── The Analogy ── */}
      <RevealSection style={{ marginBottom: '4rem' }}>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--font-heading)', color: 'var(--text)', marginBottom: '1rem', marginTop: 0 }}>
          The Spotlight Analogy
        </p>
        <p style={{ color: 'var(--muted)', fontSize: 'var(--font-body-lg)', lineHeight: 'var(--lh-relaxed)', maxWidth: 640, marginBottom: '2rem' }}>
          Imagine you&apos;re in a dark room full of people. Someone says &ldquo;The cat sat on the mat.&rdquo;
          Your brain instantly connects &ldquo;cat&rdquo; with &ldquo;sat&rdquo; — the cat is doing the action.
          <strong style={{ color: 'var(--text)' }}> Attention is the model&apos;s spotlight</strong> — it shines brighter on important connections.
        </p>
        <AnimatedPipeline accent={AC} stages={[
          { icon: '📝', label: 'Input Words', desc: 'The cat sat on the mat' },
          { icon: '🔍', label: 'Check All Pairs', desc: 'Every word × every word' },
          { icon: '📊', label: 'Score Relevance', desc: 'How important is this pair?' },
          { icon: '🔄', label: 'Blend Info', desc: 'Borrow info from relevant words' },
        ]} />
      </RevealSection>

      {/* ── The Old Way ── */}
      <RevealSection style={{ marginBottom: '4rem' }}>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--font-heading)', color: 'var(--text)', marginBottom: '1rem', marginTop: 0 }}>
          The Old Way: RNNs (Bad Memory)
        </p>
        <p style={{ color: 'var(--muted)', fontSize: 'var(--font-body-lg)', lineHeight: 'var(--lh-relaxed)', maxWidth: 640, marginBottom: '2rem' }}>
          Old models (RNNs) read text left-to-right, one word at a time. They had a tiny memory that got passed along.
          By the end of a paragraph, they&apos;d <strong style={{ color: 'var(--text)' }}>forgotten the beginning</strong>.
        </p>
        <BeforeAfter
          accent={AC}
          before="RNN: The → cat → sat → on → the → mat → (forgets 'cat' by now)"
          after="Transformer: ALL words at once, connected directly — no forgetting!"
        />
      </RevealSection>

      {/* ── Playground: interactive demos unwrapped ── */}
      <RevealSection>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--font-heading)', color: 'var(--text)', marginBottom: '.5rem', marginTop: 0 }}>
          The Playground
        </p>
        <p style={{ color: 'var(--muted)', fontSize: 'var(--font-caption)', fontFamily: 'var(--font-mono)', marginBottom: '2rem', letterSpacing: 'var(--ls-wide)', textTransform: 'uppercase' }}>
          Explore attention, QKV, and connections interactively
        </p>

        <AttentionHeatMap />
        <AttentionExplorer />
        <QKVDemo />
        <AttentionLinesDemo />
      </RevealSection>

      {/* ── Self-Attention Explained ── */}
      <RevealSection style={{ marginBottom: '4rem' }}>
        <SubSection title="Self-Attention: Every Word Checks Every Word" accent={AC}>
          <ConceptBlock title="Q, K, V = The Library System" accent={AC}>
            Every word creates 3 things:
            <br /><br />
            <strong style={{ color: 'var(--text)' }}>Query (Q)</strong> = &ldquo;What am I looking for?&rdquo;<br />
            <strong style={{ color: 'var(--text)' }}>Key (K)</strong> = &ldquo;What do I contain?&rdquo;<br />
            <strong style={{ color: 'var(--text)' }}>Value (V)</strong> = &ldquo;What info do I carry?&rdquo;
            <br /><br />
            &ldquo;cat&rdquo; creates a Query for &ldquo;things that sit.&rdquo; &ldquo;mat&rdquo; has a Key that matches. Result: cat pays attention to mat.
          </ConceptBlock>

          <StepBuilder accent={AC} steps={[
            { label: 'Step 1: Each word gets embedded as a number vector', detail: 'Every word is converted from text to a list of numbers (its embedding). Similar words have similar number patterns.' },
            { label: 'Step 2: Create Query, Key, Value vectors', detail: 'The embedding is multiplied by 3 different matrices (Wq, Wk, Wv) to produce Q, K, V. These are learned during training.' },
            { label: 'Step 3: Compute attention scores (Q × K)', detail: 'Every word\'s Query is dotted with every other word\'s Key. Higher dot product = more relevant.' },
            { label: 'Step 4: Softmax turns scores into percentages', detail: 'Raw scores can be any number. Softmax converts them to probabilities that sum to 100%.' },
            { label: 'Step 5: Blend Values using attention weights', detail: 'Each word\'s output is a weighted blend of all Value vectors. "cat" ends up carrying info from "sat" and "mat" too.' },
          ]} />

          <InfoBox accent={AC}>
            <strong style={{ color: 'var(--text)' }}>The key insight:</strong> Every word gets a &ldquo;personalized blend&rdquo; of every other word&apos;s information.
            &ldquo;Cat&rdquo; knows it&apos;s connected to &ldquo;sat&rdquo; (the action) and &ldquo;mat&rdquo; (the location).
            All computed in one parallel step.
          </InfoBox>
        </SubSection>
      </RevealSection>

      {/* ── Multi-Head Attention ── */}
      <RevealSection style={{ marginBottom: '4rem' }}>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--font-heading)', color: 'var(--text)', marginBottom: '1rem', marginTop: 0 }}>
          Many Spotlights at Once
        </p>
        <p style={{ color: 'var(--muted)', fontSize: 'var(--font-body-lg)', lineHeight: 'var(--lh-relaxed)', maxWidth: 640, marginBottom: '2rem' }}>
          A single attention head learns one relationship type. But language has many: grammar, meaning, position, coreference.
          Multiple heads run in parallel, then combine.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          {[
            { title: 'Multiple Perspectives', desc: 'Head 1 tracks grammar. Head 2 tracks meaning. Head 3 tracks position. They run in parallel, then combine.' },
            { title: 'Layers Build Depth', desc: 'Layer 1: simple word patterns. Layer 5: sentence structure. Layer 20: meaning. Layer 96: abstract reasoning.' },
            { title: 'Parallel Processing', desc: 'Unlike RNNs that read one word at a time, transformers process ALL words simultaneously. GPUs accelerated this.' },
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
      </RevealSection>

      {/* ── Positional Encoding ── */}
      <RevealSection style={{ marginBottom: '4rem' }}>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--font-heading)', color: 'var(--text)', marginBottom: '1rem', marginTop: 0 }}>
          Wait — Order Matters!
        </p>
        <p style={{ color: 'var(--muted)', fontSize: 'var(--font-body-lg)', lineHeight: 'var(--lh-relaxed)', maxWidth: 640, marginBottom: '2rem' }}>
          Here&apos;s a catch: attention treats input as a <strong style={{ color: 'var(--text)' }}>bag of words</strong> — it has no built-in sense of order.
          &ldquo;The dog bit the man&rdquo; and &ldquo;The man bit the dog&rdquo; would look identical without positional encoding.
        </p>
        <BeforeAfter
          accent={AC}
          before="Without position: 'dog bit man' = 'man bit dog' → BAD"
          after="With position: 'dog₁ bit₂ man₃' ≠ 'man₁ bit₂ dog₃' → CORRECT"
        />
        <WarningBox accent={AC}>
          <strong>Common confusion:</strong> Attention doesn&apos;t replace word order — it <em>adds</em> to it.
          Positional encoding gives each word a &ldquo;seat number&rdquo; so the model knows the sequence even though it processes everything in parallel.
        </WarningBox>
      </RevealSection>

      {/* ── Recap + Mental Model (side by side) ── */}
      <RevealSection>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 300px' }}>
            <RecapBox accent={AC} items={[
              'Attention lets every word look at every other word.',
              "Old models (RNNs) forgot early words — transformers don't.",
              'Q (Query), K (Key), V (Value) = library search system.',
              'Multiple heads = multiple relationship types in parallel.',
              'Positional encoding ensures word order is preserved.',
              'Transformers process all words in parallel — faster and better.',
            ]} />
          </div>
          <div style={{ flex: '1 1 300px' }}>
            <MentalModel
              emoji="🔦"
              title="Your Mental Model"
              desc="Think of attention as a spotlight system. Every word shines a spotlight on every other word. 'Cat' shines bright on 'sat' (who's doing what?) and 'mat' (where?). The brighter the light, the more information gets shared."
              accent={AC}
            />
          </div>
        </div>
      </RevealSection>

      {/* ── Quick Summary ── */}
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
          padding: '1.25rem', borderRadius: 12,
          background: 'var(--bg2)', border: '1px solid var(--border)', marginBottom: '1rem',
        }}>
          <div style={{ fontSize: 'var(--font-micro)', fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 'var(--ls-wide)', marginBottom: '.5rem' }}>What's Next</div>
          <div style={{ fontSize: 'var(--font-body)', color: 'var(--muted)', lineHeight: 'var(--lh-normal)' }}>
            You now know how LLMs connect words. But they can only &ldquo;see&rdquo; what&apos;s in their <strong style={{ color: '#059669' }}>context window</strong> —
            next we&apos;ll explore this critical limitation.
          </div>
        </div>
      </RevealSection>
    </section>
  );
}
