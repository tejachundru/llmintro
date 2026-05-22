import { useState, useCallback, useEffect } from 'react';
import {
  RevealSection, SectionHeader, SubSection, WarningBox,
  KeyPoint, FlowDiagram, ConceptBlock, CodeExample,
  RecapBox, PracticeQuestions, QuickSummary, MentalModel,
  ProbabilityBars, StepBuilder, ToggleCompare, AnimatedPipeline,
  LiveCounter, InteractiveSlider,
} from './shared';

const TOKEN_COLORS = [
  { bg: 'rgba(37,99,235,.15)', border: 'rgba(37,99,235,.4)' },
  { bg: 'rgba(167,139,250,.15)', border: 'rgba(167,139,250,.4)' },
  { bg: 'rgba(52,211,153,.15)', border: 'rgba(52,211,153,.4)' },
  { bg: 'rgba(251,146,60,.15)', border: 'rgba(251,146,60,.4)' },
  { bg: 'rgba(244,114,182,.15)', border: 'rgba(244,114,182,.4)' },
  { bg: 'rgba(250,204,21,.15)', border: 'rgba(250,204,21,.4)' },
];

function naiveTokenize(text: string): string[] {
  if (!text.trim()) return [];
  const parts = text.match(/[\w']+|[^\w\s]|\s+/g) || [];
  const tokens: string[] = [];
  for (const p of parts) {
    if (p.length > 6 && /\w/.test(p)) {
      const half = Math.ceil(p.length / 2);
      tokens.push(p.slice(0, half), p.slice(half));
    } else {
      tokens.push(p);
    }
  }
  return tokens.filter(t => t.length > 0);
}

const AC = '#2563eb';

/* ─── Why This Matters ─── */

function WhyThisMatters() {
  const reasons = [
    { icon: '💰', title: 'Costs real money', desc: 'APIs charge by tokens. "Hyderabad" costs 2x more than "Mumbai" because it splits into more tokens.' },
    { icon: '🎯', title: 'Quality depends on setup', desc: 'Same LLM can be genius or gibberish — it all depends on how you ask. Prompting is a skill.' },
    { icon: '🏗️', title: 'Architecture matters', desc: 'Attention, context, RAG — these are the building blocks every AI product uses today.' },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
      {reasons.map((r, i) => (
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
  );
}

/* ─── Generation Animation ─── */

function GenerationDemo() {
  const fullText = 'The cat sat on the mat';
  const words = fullText.split(' ');
  const [idx, setIdx] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [showProbs, setShowProbs] = useState(false);

  const wordProbs: Record<string, { candidates: { word: string; prob: number }[] }> = {
    'The': { candidates: [{ word: 'cat', prob: 0.38 }, { word: 'dog', prob: 0.22 }, { word: 'man', prob: 0.15 }, { word: 'sun', prob: 0.08 }] },
    'The cat': { candidates: [{ word: 'sat', prob: 0.45 }, { word: 'ran', prob: 0.18 }, { word: 'slept', prob: 0.12 }] },
    'The cat sat': { candidates: [{ word: 'on', prob: 0.52 }, { word: 'in', prob: 0.20 }, { word: 'by', prob: 0.10 }] },
    'The cat sat on': { candidates: [{ word: 'the', prob: 0.65 }, { word: 'a', prob: 0.15 }, { word: 'my', prob: 0.08 }] },
    'The cat sat on the': { candidates: [{ word: 'mat', prob: 0.42 }, { word: 'floor', prob: 0.18 }, { word: 'couch', prob: 0.12 }, { word: 'bed', prob: 0.06 }] },
  };

  const tick = useCallback(() => setIdx(i => {
    if (i >= words.length) return i;
    return i + 1;
  }), [words.length]);

  const reset = useCallback(() => {
    setIdx(0);
    setAutoPlay(true);
  }, []);

  useEffect(() => {
    if (!autoPlay || idx >= words.length) return;
    const t = setTimeout(tick, 700);
    return () => clearTimeout(t);
  }, [idx, autoPlay, tick]);

  const currentPrefix = words.slice(0, idx).join(' ');
  const nextWordCandidates = currentPrefix ? wordProbs[currentPrefix]?.candidates : null;

  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <div style={{ fontSize: 'var(--font-caption)', color: 'var(--muted)', fontFamily: 'var(--font-mono)', marginBottom: '1rem' }}>
        LLM generates one word at a time — each word is the &ldquo;winner&rdquo; of a probability contest:
      </div>
      <div style={{
        background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14,
        padding: '1.5rem',
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: '1rem', minHeight: 40, alignItems: 'center' }}>
          {words.slice(0, idx).map((w, i) => (
            <span key={i} style={{
              padding: '6px 14px', borderRadius: 8,
              background: TOKEN_COLORS[i % TOKEN_COLORS.length].bg,
              border: `1px solid ${TOKEN_COLORS[i % TOKEN_COLORS.length].border}`,
              fontFamily: 'var(--font-mono)', fontSize: 'var(--font-body)',
              color: 'var(--text)', animation: 'chipIn .2s ease',
              position: 'relative',
            }}>
              {w}
              {showProbs && i > 0 && (
                <span style={{
                  position: 'absolute', top: -18, left: '50%', transform: 'translateX(-50%)',
                  fontSize: 'var(--font-micro)', color: AC,
                  fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap',
                }}>
                  ~{Math.floor(30 + Math.random() * 40)}%
                </span>
              )}
            </span>
          ))}
          {idx < words.length && (
            <span style={{
              display: 'inline-block', width: 2, height: 24,
              background: AC, animation: 'blink .7s step-end infinite',
              verticalAlign: 'middle',
            }} />
          )}
          {idx >= words.length && (
            <span style={{ fontSize: 'var(--font-label)', color: 'var(--accent3)', fontFamily: 'var(--font-mono)', padding: '6px 0' }}>
              ✓ Complete
            </span>
          )}
        </div>

        {nextWordCandidates && idx > 0 && idx < words.length && (
          <div style={{
            marginBottom: '1rem', padding: '.65rem', borderRadius: 8,
            background: 'var(--bg3)', border: '1px solid var(--border)',
            animation: 'fadeIn .3s ease',
          }}>
            <div style={{ fontSize: 'var(--font-micro)', fontFamily: 'var(--font-mono)', color: 'var(--muted)', marginBottom: '.35rem' }}>
              Next-word probabilities for &ldquo;{currentPrefix}&rdquo;:
            </div>
            <div style={{ display: 'flex', gap: '.35rem', flexWrap: 'wrap' }}>
              {nextWordCandidates.map((c, i) => {
                const isWinner = i === 0;
                return (
                  <div key={i} style={{
                    padding: '.25rem .6rem', borderRadius: 6,
                    background: isWinner ? AC + '1e' : 'var(--bg2)',
                    border: `1px solid ${isWinner ? AC + '55' : 'var(--border)'}`,
                    fontFamily: 'var(--font-mono)', fontSize: 'var(--font-micro)',
                    color: isWinner ? AC : 'var(--muted)',
                    display: 'flex', alignItems: 'center', gap: '.35rem',
                  }}>
                    <span style={{ fontWeight: isWinner ? 600 : 400 }}>{c.word}</span>
                    <span style={{ opacity: 0.6 }}>{(c.prob * 100).toFixed(0)}%</span>
                    {isWinner && <span style={{ color: AC }}>✓</span>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
          <button onClick={reset} style={{
            padding: '.4rem .9rem', borderRadius: 8, border: '1px solid var(--border)',
            background: 'var(--bg3)', color: 'var(--text)', fontSize: 'var(--font-caption)',
            cursor: 'pointer', fontFamily: 'var(--font-mono)', transition: 'all .2s',
          }}
            onMouseEnter={e => { const el = e.currentTarget; el.style.background = AC + '0a'; el.style.borderColor = AC + '33'; }}
            onMouseLeave={e => { const el = e.currentTarget; el.style.background = 'var(--bg3)'; el.style.borderColor = 'var(--border)'; }}
          >↺ Replay</button>
          <button onClick={tick} style={{
            padding: '.4rem .9rem', borderRadius: 8, border: '1px solid var(--border)',
            background: 'var(--bg3)', color: 'var(--text)', fontSize: 'var(--font-caption)',
            cursor: 'pointer', fontFamily: 'var(--font-mono)', transition: 'all .2s',
          }}
            onMouseEnter={e => { const el = e.currentTarget; el.style.background = AC + '0a'; el.style.borderColor = AC + '33'; }}
            onMouseLeave={e => { const el = e.currentTarget; el.style.background = 'var(--bg3)'; el.style.borderColor = 'var(--border)'; }}
          >⏭ Step</button>
          <button onClick={() => setShowProbs(s => !s)} style={{
            padding: '.4rem .9rem', borderRadius: 8, cursor: 'pointer',
            border: `1px solid ${showProbs ? AC + '55' : 'var(--border)'}`,
            background: showProbs ? AC + '15' : 'var(--bg3)',
            color: showProbs ? AC : 'var(--muted)',
            fontSize: 'var(--font-caption)', fontFamily: 'var(--font-mono)', transition: 'all .2s',
          }}
            onMouseEnter={e => { if (!showProbs) { const el = e.currentTarget; el.style.background = AC + '0a'; el.style.borderColor = AC + '33'; }}}
            onMouseLeave={e => { if (!showProbs) { const el = e.currentTarget; el.style.background = 'var(--bg3)'; el.style.borderColor = 'var(--border)'; }}}
          >
            {showProbs ? '📊 Hide probs' : '📊 Show probs'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Probability Demo ─── */

function ProbabilityDemo() {
  const [word, setWord] = useState('The cat sat on the');
  const predictions: Record<string, { label: string; prob: number; color: string }[]> = {
    'The cat sat on the': [
      { label: 'mat', prob: 0.42, color: '#2563eb' },
      { label: 'floor', prob: 0.18, color: '#7c3aed' },
      { label: 'couch', prob: 0.12, color: '#047857' },
      { label: 'chair', prob: 0.08, color: '#c2410c' },
      { label: 'bed', prob: 0.06, color: '#be185d' },
    ],
    'I love to eat': [
      { label: 'pizza', prob: 0.35, color: '#2563eb' },
      { label: 'food', prob: 0.22, color: '#7c3aed' },
      { label: 'ice cream', prob: 0.14, color: '#047857' },
      { label: 'sushi', prob: 0.09, color: '#c2410c' },
    ],
    'The capital of India is': [
      { label: 'New Delhi', prob: 0.78, color: '#2563eb' },
      { label: 'Mumbai', prob: 0.08, color: '#7c3aed' },
      { label: 'India', prob: 0.04, color: '#047857' },
    ],
    'Python is a': [
      { label: 'programming language', prob: 0.65, color: '#2563eb' },
      { label: 'snake', prob: 0.12, color: '#7c3aed' },
      { label: 'language', prob: 0.08, color: '#047857' },
    ],
    'She opened the': [
      { label: 'door', prob: 0.38, color: '#2563eb' },
      { label: 'book', prob: 0.15, color: '#7c3aed' },
      { label: 'window', prob: 0.12, color: '#047857' },
      { label: 'box', prob: 0.09, color: '#c2410c' },
    ],
  };

  const probs = predictions[word] || predictions['The cat sat on the'];

  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <div style={{ fontSize: 'var(--font-caption)', color: 'var(--muted)', fontFamily: 'var(--font-mono)', marginBottom: '1rem' }}>
        Click an input to see probability distribution:
      </div>
      <div style={{
        background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14,
        padding: '1.5rem',
      }}>
        <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          {Object.keys(predictions).map((key) => (
            <button
              key={key}
              onClick={() => setWord(key)}
              style={{
                padding: '.35rem .75rem', borderRadius: 8, fontSize: 'var(--font-caption)',
                background: word === key ? AC + '1e' : 'var(--bg3)',
                border: `1px solid ${word === key ? AC + '55' : 'var(--border)'}`,
                color: word === key ? AC : 'var(--muted)',
                cursor: 'pointer', fontFamily: 'var(--font-mono)',
              }}
            >
              &ldquo;{key} ___&rdquo;
            </button>
          ))}
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--font-caption)', color: 'var(--text)', marginBottom: '.5rem' }}>
          Input: &ldquo;<span style={{ color: AC }}>{word}</span><span style={{ color: 'var(--accent4)', animation: 'blink .7s step-end infinite' }}>_</span>&rdquo;
        </div>
        <div style={{ fontSize: 'var(--font-micro)', color: 'var(--muted)', fontFamily: 'var(--font-mono)', marginBottom: '.25rem' }}>
          Next word probabilities:
        </div>
        {probs.length > 0 && <ProbabilityBars items={probs} accent={AC} height={18} />}
      </div>
    </div>
  );
}

/* ─── Text to Numbers Demo ─── */

function TextToNumbersDemo() {
  const [input, setInput] = useState('AI');
  const textToNum: Record<string, number[]> = {
    A: [0.12, 0.87, 0.34, 0.56, 0.91],
    I: [0.08, 0.92, 0.11, 0.73, 0.44],
    AI: [0.45, 0.89, 0.23, 0.67, 0.78],
    cat: [0.34, 0.12, 0.91, 0.56, 0.23],
    dog: [0.31, 0.15, 0.88, 0.52, 0.27],
    love: [0.91, 0.34, 0.12, 0.78, 0.56],
    hate: [0.11, 0.87, 0.34, 0.23, 0.92],
    hello: [0.45, 0.23, 0.89, 0.12, 0.67],
    world: [0.56, 0.34, 0.78, 0.23, 0.91],
  };
  const vec = textToNum[input] || textToNum['AI'];

  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <div style={{ fontSize: 'var(--font-caption)', color: 'var(--muted)', fontFamily: 'var(--font-mono)', marginBottom: '1rem' }}>
        See how words become numbers:
      </div>
      <div style={{
        background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14,
        padding: '1.5rem',
      }}>
        <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          {Object.keys(textToNum).map((key) => (
            <button
              key={key}
              onClick={() => setInput(key)}
              style={{
                padding: '.35rem .75rem', borderRadius: 8, fontSize: 'var(--font-caption)',
                background: input === key ? AC + '1e' : 'var(--bg3)',
                border: `1px solid ${input === key ? AC + '55' : 'var(--border)'}`,
                color: input === key ? AC : 'var(--muted)',
                cursor: 'pointer', fontFamily: 'var(--font-mono)',
              }}
            >
              &ldquo;{key}&rdquo;
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '.75rem' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--font-sub-heading)', color: AC, fontWeight: 600 }}>&ldquo;{input}&rdquo;</span>
          <span style={{ color: 'var(--muted)', fontSize: 'var(--font-body-lg)' }}>&rarr;</span>
          <div style={{ display: 'flex', gap: 3 }}>
            {vec.map((v, i) => (
              <div key={i} style={{
                width: 32, height: 32, borderRadius: 6,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-mono)', fontSize: 'var(--font-micro)',
                background: `rgba(37,99,235,${v * 0.4})`,
                border: '1px solid rgba(37,99,235,0.3)',
                color: v > 0.5 ? '#fff' : 'var(--muted)',
                animation: `chipIn .2s ${i * 0.05}s ease both`,
              }}>
                {(v * 100).toFixed(0)}
              </div>
            ))}
          </div>
        </div>
        <div style={{ fontSize: 'var(--font-mono)', color: 'var(--muted)' }}>
          Words with similar meanings have similar number patterns
        </div>
      </div>
    </div>
  );
}

export default function Session1Tokenizer() {
  const [input, setInput] = useState('The cat sat on the mat');
  const tokens = naiveTokenize(input);
  const charCount = input.length;
  const ratio = tokens.length ? (charCount / tokens.length).toFixed(1) : '0';

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  }, []);

  return (
    <section id="s1" style={{ maxWidth: 960, margin: '0 auto', padding: '4rem 2rem 6rem' }}>
      {/* ── Header + Intro ── */}
      <RevealSection>
        <SectionHeader num="01" tag="Topic 1" title="What is an LLM?" accentColor={AC} borderColor={`${AC}44`} />
        <p style={{ color: 'var(--muted)', maxWidth: 640, fontSize: 'var(--font-body-lg)', lineHeight: 'var(--lh-relaxed)' }}>
          Let&apos;s start with a question: <strong style={{ color: 'var(--text)' }}>How does ChatGPT know what to say?</strong>
        </p>
        <p style={{ color: 'var(--muted)', maxWidth: 640, fontSize: 'var(--font-body-lg)', lineHeight: 'var(--lh-relaxed)' }}>
          Short answer: it doesn&apos;t <em>know</em> anything. It&apos;s not a brain. An LLM is a <strong style={{ color: 'var(--text)' }}>next-word prediction machine</strong> — it got incredibly good at guessing what word comes next. That&apos;s it. Everything else (coding, reasoning, creativity) is just that one skill, applied over and over.
        </p>
      </RevealSection>

      {/* ── Why This Matters ── */}
      <RevealSection style={{ marginBottom: '2rem' }}>
        <ConceptBlock title="Why should you care?" accent={AC}>
          LLMs are changing how we work, code, and think. Understanding how they actually work (not the magic, the mechanics) helps you use them better, debug them when they fail, and build things with them. This first session gives you the <strong style={{ color: 'var(--text)' }}>one key insight</strong> that explains everything else.
        </ConceptBlock>
        <WhyThisMatters />
      </RevealSection>

      {/* ── The Analogy ── */}
      <RevealSection style={{ marginBottom: '4rem' }}>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--font-heading)', color: 'var(--text)', marginBottom: '1rem', marginTop: 0 }}>
          Autocomplete
        </p>
        <p style={{ color: 'var(--muted)', fontSize: 'var(--font-body-lg)', lineHeight: 'var(--lh-relaxed)', maxWidth: 640, marginBottom: '2rem' }}>
          Phone autocomplete, scaled to the internet. &ldquo;I love ___&rdquo; &rarr; &ldquo;you&rdquo;. Billions of examples.
        </p>
        <AnimatedPipeline accent={AC} stages={[
          { icon: '✍️', label: 'You Type', desc: '"The cat sat on the"' },
          { icon: '🧠', label: 'LLM Thinks', desc: 'Checks probabilities' },
          { icon: '🎯', label: 'Picks Best', desc: 'Highest = "mat"' },
          { icon: '➕', label: 'Adds Word', desc: 'Now "The cat sat on the mat"' },
          { icon: '🔄', label: 'Repeats', desc: 'Predicts next word...' },
        ]} />
      </RevealSection>

      {/* ── Playground: the three core demos, unwrapped ── */}
      <RevealSection style={{ marginBottom: '4rem' }}>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--font-heading)', color: 'var(--text)', marginBottom: '.5rem', marginTop: 0 }}>
          The Playground
        </p>
        <p style={{ color: 'var(--muted)', fontSize: 'var(--font-caption)', fontFamily: 'var(--font-mono)', marginBottom: '2rem', letterSpacing: 'var(--ls-wide)', textTransform: 'uppercase' }}>
          Interact with these demos to see how LLMs actually work
        </p>
        <GenerationDemo />
        <ProbabilityDemo />
        <TextToNumbersDemo />
      </RevealSection>

      {/* ── Tokens ── */}
      <RevealSection style={{ marginBottom: '4rem' }}>
        <SubSection title="Tokens: The Building Blocks" accent={AC}>
          <p style={{ color: 'var(--muted)', fontSize: 'var(--font-body-lg)', lineHeight: 'var(--lh-relaxed)', maxWidth: 640 }}>
            LLMs do not read whole words. They read <strong style={{ color: 'var(--text)' }}>tokens</strong>, which are chunks of text. Common words like &ldquo;the&rdquo; are one token. Rare words get split: &ldquo;unbelievable&rdquo; becomes &ldquo;un&rdquo; + &ldquo;believe&rdquo; + &ldquo;able&rdquo;.
          </p>
          <div style={{ marginBottom: '1.5rem' }}>
            <CodeExample accent={AC} code={`// Byte Pair Encoding (BPE) — the actual tokenization algorithm:
// 1. Start with individual characters as tokens
// 2. Count all adjacent character pairs
// 3. Merge the most frequent pair into a new token
// 4. Repeat until desired vocabulary size (~50K-100K tokens)

// "low" + "low" + "lower" → "l o w" + "l o w" + "l o w e r"
// Most common pair: "lo" → merge → new token #427
// Next: "ow" → merge → token #892
// Result: "low" becomes 1 token (common), "lower" = "low" + "er" (2 tokens)`} />
          </div>

          <div style={{
            background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14,
            padding: '1.25rem', marginBottom: '1.5rem',
          }}>
            {[
              { text: 'Hello, world!', tokens: ['Hello', ', ', 'world', '!'] },
              { text: 'I love pizza', tokens: ['I', ' love', ' pizza'] },
              { text: 'unbelievable', tokens: ['un', 'believe', 'able'] },
              { text: 'Hyderabad is great', tokens: ['Hyder', 'abad', ' is', ' great'] },
            ].map((ex, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: i < 3 ? '.6rem' : 0,
                fontFamily: 'var(--font-mono)', fontSize: 'var(--font-caption)',
              }}>
                <span style={{ color: 'var(--muted)', minWidth: 140 }}>&ldquo;{ex.text}&rdquo;</span>
                <span style={{ color: 'var(--muted)' }}>&rarr;</span>
                <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                  {ex.tokens.map((t, j) => (
                    <span key={j} style={{
                      padding: '2px 8px', borderRadius: 4,
                      background: TOKEN_COLORS[j % TOKEN_COLORS.length].bg,
                      border: `1px solid ${TOKEN_COLORS[j % TOKEN_COLORS.length].border}`,
                      color: 'var(--text)',
                    }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <ToggleCompare
            accent={AC}
            labelA="Text View"
            labelB="Token View"
            renderA={
              <div style={{
                padding: '1rem', borderRadius: 8, background: 'var(--bg2)',
                border: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-body)',
                color: 'var(--text)', lineHeight: 1.8,
              }}>
                The cat sat on the mat and purred loudly while eating fish
              </div>
            }
            renderB={
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, padding: '.5rem' }}>
                {['The', ' cat', ' sat', ' on', ' the', ' mat', ' and', ' purr', 'ed', ' loudly', ' while', ' eating', ' fish'].map((t, i) => (
                  <span key={i} style={{
                    padding: '3px 8px', borderRadius: 4, animation: `chipIn .2s ${i * 0.03}s ease both`,
                    background: TOKEN_COLORS[i % TOKEN_COLORS.length].bg,
                    border: `1px solid ${TOKEN_COLORS[i % TOKEN_COLORS.length].border}`,
                    fontFamily: 'var(--font-mono)', fontSize: 'var(--font-caption)', color: 'var(--text)',
                  }}>
                    {t.trim() ? t : '\u00B7'}
                  </span>
                ))}
              </div>
            }
          />

          <div style={{ marginTop: '1.5rem' }}>
            <KeyPoint num={1} title="Why tokens matter for your wallet" accent={AC}>
              APIs charge by <strong style={{ color: 'var(--text)' }}>tokens, not words</strong>.
              &ldquo;The cat sat&rdquo; = 3 tokens. &ldquo;Hyderabad is great&rdquo; = 4 tokens (Hyder+abad = 2 tokens for one word).
              Indian languages often use <strong style={{ color: 'var(--text)' }}>2-4x more tokens</strong> than English.
            </KeyPoint>
          </div>
        </SubSection>
      </RevealSection>

      {/* ── Training ── */}
      <RevealSection style={{ marginBottom: '4rem' }}>
        <SubSection title="How Does It Learn?" accent={AC}>
          <p style={{ color: 'var(--muted)', fontSize: 'var(--font-body-lg)', lineHeight: 'var(--lh-relaxed)', maxWidth: 640, marginBottom: '1.5rem' }}>
            Imagine a student doing fill-in-the-blank questions for months, non-stop, learning from every mistake. That is LLM training.
          </p>

          <FlowDiagram accent={AC} steps={[
            { label: 'Read Text', sub: 'Billions of pages' },
            { label: 'Guess Next Word', sub: 'Make a prediction' },
            { label: 'Check Answer', sub: 'Was I right?' },
            { label: 'Adjust Slightly', sub: 'Fix the error' },
            { label: 'Repeat', sub: 'Trillions of times' },
          ]} />

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem',
          }}>
            {[
              { title: 'Pre-training', desc: 'The model reads the whole internet. Takes months, costs millions. Learns grammar, facts, reasoning.' },
              { title: 'Fine-tuning', desc: 'Teach it to follow instructions using Q&A examples. Like training a dog with reward signals.' },
              { title: 'RLHF', desc: 'Humans rate answers. The model learns preferences. Why ChatGPT is polite, not raw.' },
            ].map((card, i) => (
              <div key={i} style={{
                padding: '1.25rem', borderRadius: 12, background: 'var(--bg2)',
                border: `1px solid ${AC}22`,
              }}>
                <h4 style={{ fontSize: 'var(--font-body)', fontWeight: 500, color: 'var(--text)', margin: '0 0 .35rem 0' }}>{card.title}</h4>
                <div style={{ fontSize: 'var(--font-caption)', color: 'var(--muted)', lineHeight: 'var(--lh-snug)' }}>{card.desc}</div>
              </div>
            ))}
          </div>

          <StepBuilder accent={AC} steps={[
            { label: 'Step 1: Collect massive text data', detail: 'The internet, books, Wikipedia, code repos. Trillions of words worth of text. Cleaner data means a better model.' },
            { label: 'Step 2: Convert text to tokens', detail: 'All text gets split into tokens (sub-word chunks). The tokenizer is built by finding the most common character pairs and merging them repeatedly.' },
            { label: 'Step 3: Predict next token, check, adjust', detail: 'The model reads tokens one by one, predicts the next, compares to the actual next token, and adjusts weights by a tiny amount. Repeat trillions of times.' },
            { label: 'Step 4: Fine-tune on instructions', detail: 'Take the base model and train it on Q&A pairs. This teaches it to follow instructions instead of just completing text.' },
            { label: 'Step 5: Align with human preferences', detail: 'RLHF: humans rate multiple answers. The model learns which answers humans prefer: polite, helpful, honest.' },
          ]} />
        </SubSection>
      </RevealSection>

      {/* ── Emergent Abilities ── */}
      <RevealSection style={{ marginBottom: '4rem' }}>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--font-heading)', color: 'var(--text)', marginBottom: '1rem', marginTop: 0 }}>
          The Crazy Part: Skills That Just Appear
        </p>
        <p style={{ color: 'var(--muted)', fontSize: 'var(--font-body-lg)', lineHeight: 'var(--lh-relaxed)', maxWidth: 640, marginBottom: '1.5rem' }}>
          At small sizes, the model can only complete sentences. At huge sizes, it can suddenly write code, translate, solve math. These skills were never taught; they emerged from scale.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          {[
            { title: 'Emergence', desc: 'At certain model sizes, reasoning suddenly appears. A 1B model cannot reason; a 70B model can. It is not gradual.' },
            { title: 'Like ice forming', desc: 'At 0\u00B0C, water suddenly becomes solid. At certain sizes, new capabilities crystallize from raw prediction ability.' },
            { title: 'In-context learning', desc: 'Show the model 3 examples of a new task. It immediately learns to do it, without any training. This emerged from scale.' },
          ].map((card, i) => (
            <div key={i} style={{
              padding: '1.25rem', borderRadius: 12, background: 'var(--bg2)',
              border: '1px solid var(--border)',
            }}>
              <h4 style={{ fontSize: 'var(--font-body-lg)', fontWeight: 500, color: 'var(--text)', margin: '0 0 .35rem 0' }}>{card.title}</h4>
              <div style={{ fontSize: 'var(--font-caption)', color: 'var(--muted)', lineHeight: 'var(--lh-snug)' }}>{card.desc}</div>
            </div>
          ))}
        </div>
      </RevealSection>

      {/* ── Interactive: Model Size Explorer ── */}
      <RevealSection style={{ marginBottom: '4rem' }}>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--font-heading)', color: 'var(--text)', marginBottom: '.5rem', marginTop: 0 }}>
          Interactive: How Big Is Big?
        </p>
        <p style={{ color: 'var(--muted)', fontSize: 'var(--font-caption)', fontFamily: 'var(--font-mono)', marginBottom: '1rem', letterSpacing: 'var(--ls-wide)', textTransform: 'uppercase' }}>
          Drag to see how model size changes capability
        </p>
        <div style={{
          background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14,
          padding: '1.5rem',
        }}>
          {(() => {
            const ModelSizeExplorer = () => {
              const [params, setParams] = useState(7);
              const capabilities = [
                { at: 0.1, label: 'Tiny', can: 'Basic word prediction, short sentences' },
                { at: 1, label: 'Small', can: 'Simple Q&A, short stories' },
                { at: 7, label: 'Medium', can: 'Chat, basic reasoning, code snippets' },
                { at: 70, label: 'Large', can: 'Complex reasoning, translation, creative writing' },
                { at: 500, label: 'Very Large', can: 'Advanced math, multi-step reasoning, expert-level tasks' },
              ];
              const current = capabilities.reduce((prev, curr) => Math.abs(curr.at - params) < Math.abs(prev.at - params) ? curr : prev);
              return (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                    <LiveCounter value={params} label="Parameters (billions)" accent={AC} suffix="B" decimals={params < 1 ? 2 : params < 10 ? 1 : 0} />
                    <div style={{ flex: 1 }}>
                      <InteractiveSlider
                        value={params} min={0.1} max={500} step={0.1}
                        onChange={setParams} label="Drag to resize model" accent={AC}
                        format={v => v < 1 ? v.toFixed(2) + 'B' : v.toFixed(v < 10 ? 1 : 0) + 'B'}
                      />
                    </div>
                  </div>
                  <div style={{
                    padding: '1rem', borderRadius: 10,
                    background: `linear-gradient(135deg, ${AC}15, ${AC}05)`,
                    border: `1px solid ${AC}33`,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                        <span style={{
                          padding: '2px 10px', borderRadius: 100,
                          background: AC + '22', color: AC,
                          fontFamily: 'var(--font-mono)', fontSize: 'var(--font-micro)',
                          border: `1px solid ${AC}44`,
                        }}>
                          {current.label}
                        </span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--font-caption)', color: AC, fontWeight: 600 }}>
                          ~{current.at}B params
                        </span>
                      </div>
                      <span style={{
                        padding: '2px 10px', borderRadius: 100,
                        background: params >= 70 ? 'rgba(52,211,153,.15)' : 'rgba(251,146,60,.15)',
                        color: params >= 70 ? '#047857' : '#c2410c',
                        fontFamily: 'var(--font-mono)', fontSize: 'var(--font-micro)',
                      }}>
                        {params >= 70 ? '🚀 Frontier' : params >= 7 ? '👍 Capable' : '🔰 Basic'}
                      </span>
                    </div>
                    <div style={{ fontSize: 'var(--font-caption)', color: 'var(--text)', lineHeight: 'var(--lh-snug)' }}>{current.can}</div>
                  </div>
                  <div style={{ marginTop: '1rem', display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
                    {[
                      { label: 'GPT-2', size: '1.5B' },
                      { label: 'LLaMA-7B', size: '7B' },
                      { label: 'GPT-3', size: '175B' },
                      { label: 'GPT-4', size: '~1.8T' },
                    ].map(m => (
                      <button
                        key={m.label}
                        onClick={() => setParams(parseFloat(m.size))}
                        style={{
                          padding: '.3rem .7rem', borderRadius: 6, cursor: 'pointer',
                          background: 'var(--bg3)', border: '1px solid var(--border)',
                          color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-micro)',
                        }}
                      >
                        {m.label}: {m.size}
                      </button>
                    ))}
                  </div>
                </>
              );
            };
            return <ModelSizeExplorer />;
          })()}
        </div>
      </RevealSection>

      {/* ── Common Mistakes ── */}
      <RevealSection style={{ marginBottom: '4rem' }}>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--font-heading)', color: 'var(--text)', marginBottom: '1rem', marginTop: 0 }}>
          Common Confusions
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
          <WarningBox accent={AC}>
            <strong>&ldquo;The LLM understands what I&apos;m saying.&rdquo;</strong> No, it doesn&apos;t. It predicts words. It has no consciousness, no feelings, no real understanding. It just got so good at prediction that it <em>seems</em> to understand. Don&apos;t anthropomorphize it.
          </WarningBox>
          <WarningBox accent={AC}>
            <strong>&ldquo;More tokens = smarter answer.&rdquo;</strong> Not necessarily. A long, rambling prompt can actually make answers worse because the model&apos;s attention gets diluted. Be concise.
          </WarningBox>
          <WarningBox accent={AC}>
            <strong>&ldquo;It can reason like a human.&rdquo;</strong> It can <em>simulate</em> reasoning by predicting what a reasoning answer looks like. But it can&apos;t actually think. This is why it sometimes gives confident wrong answers (hallucinations).
          </WarningBox>
        </div>
      </RevealSection>

      {/* ── Token Playground (session closer) ── */}
      <RevealSection style={{ marginBottom: '4rem' }}>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--font-heading)', color: 'var(--text)', marginBottom: '.5rem', marginTop: 0 }}>
          Try It Yourself
        </p>
        <p style={{ color: 'var(--muted)', fontSize: 'var(--font-caption)', fontFamily: 'var(--font-mono)', marginBottom: '1rem' }}>
          Type anything and watch it get split into tokens
        </p>
        <div style={{
          background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14,
          padding: '1.25rem',
        }}>
          <textarea
            value={input}
            onChange={handleChange}
            aria-label="Tokenize text input"
            style={{
              width: '100%', background: 'transparent', border: 'none', outline: 'none',
              color: 'var(--text)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-body)',
              resize: 'vertical', minHeight: 80, lineHeight: 'var(--lh-normal)',
            }}
            placeholder="Type something..."
          />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, minHeight: 40, marginTop: '.75rem' }}>
            {tokens.map((t, i) => {
              const c = TOKEN_COLORS[i % TOKEN_COLORS.length];
              return (
                <span
                  key={i}
                  style={{
                    padding: '3px 10px', borderRadius: 6,
                    fontFamily: 'var(--font-mono)', fontSize: 'var(--font-body)',
                    background: c.bg, border: `1px solid ${c.border}`, color: 'var(--text)',
                    animation: 'chipIn .2s ease both', animationDelay: `${i * 0.03}s`,
                  }}
                >
                  {t === ' ' ? '\u00B7' : t.replace(/ /g, '\u00B7')}
                </span>
              );
            })}
          </div>
          <div style={{
            display: 'flex', gap: '1.5rem', marginTop: '1rem', paddingTop: '1rem',
            borderTop: '1px solid var(--border)', fontSize: 'var(--font-body)', color: 'var(--muted)', flexWrap: 'wrap',
          }}>
            <div>Tokens: <strong style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>{tokens.length}</strong></div>
            <div>Characters: <strong style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>{charCount}</strong></div>
            <div>Ratio: <strong style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>{ratio}</strong> chars/token</div>
          </div>
        </div>
      </RevealSection>

      {/* ── Recap + Mental Model ── */}
      <RevealSection style={{ marginBottom: '4rem' }}>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 300px' }}>
            <RecapBox accent={AC} items={[
              'An LLM is just a next-word prediction machine, nothing more.',
              'It reads tokens (word chunks), not whole words or letters.',
              'Training = practice guessing the next word trillions of times.',
              'Fine-tuning teaches it to follow instructions.',
              'Skills can "emerge" at larger sizes without being taught.',
            ]} />
          </div>
          <div style={{ flex: '1 1 300px' }}>
            <MentalModel
              emoji="..."
              title="Your Mental Model"
              desc="Super-powered autocomplete. Guesses next word. That's it."
              accent={AC}
            />
          </div>
        </div>
      </RevealSection>

      {/* ── Quick Summary ── */}
      <RevealSection style={{ marginBottom: '4rem' }}>
        <QuickSummary
          accent={AC}
          summary="An LLM predicts the next word, one token at a time. It learned by practicing on billions of texts. After enough practice, it got so good that it seems intelligent, but it is really just filling in the blank, over and over. Tokens matter because they are what the model reads and what you pay for."
        />
      </RevealSection>

      {/* ── Practice Questions ── */}
      <RevealSection style={{ marginBottom: '4rem' }}>
        <PracticeQuestions accent={AC} questions={[
          'What is the single task an LLM does?',
          'Why does "Hyderabad" use more tokens than "Mumbai"?',
          'What does "emergent ability" mean? Give an example.',
          'If a word has 7 characters and is rare, how many tokens might it become?',
          'Why do APIs charge by tokens instead of by words?',
        ]} />
      </RevealSection>

      {/* ── What to Learn Next ── */}
      <RevealSection style={{ marginBottom: '4rem' }}>
        <div style={{
          padding: '1.25rem', borderRadius: 12,
          background: 'var(--bg2)', border: '1px solid var(--border)', marginBottom: '1rem',
        }}>
          <div style={{ fontSize: 'var(--font-micro)', fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 'var(--ls-wide)', marginBottom: '.5rem' }}>What's Next</div>
          <div style={{ fontSize: 'var(--font-body)', color: 'var(--muted)', lineHeight: 'var(--lh-normal)' }}>
            Now you know what an LLM <em>is</em>. Next we will look at <strong style={{ color: 'var(--accent2)' }}>how it decides</strong> which word to predict: the <strong style={{ color: 'var(--accent2)' }}>Attention mechanism</strong>.
          </div>
        </div>
      </RevealSection>
    </section>
  );
}
