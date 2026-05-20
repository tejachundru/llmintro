import { useState, useCallback } from 'react';
import { AnalogyGrid, DemoCard, RevealSection, SectionHeader, SubSection, ConceptBlock, KeyPoint, CodeExample, FlowDiagram, InfoBox } from './shared';

const TOKEN_COLORS = [
  { bg: 'rgba(79,158,255,.15)', border: 'rgba(79,158,255,.4)' },
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

const AC = '#4f9eff';

export default function Session1Tokenizer() {
  const [input, setInput] = useState('Hyderabad is a great city for AI engineers!');

  const tokens = naiveTokenize(input);
  const charCount = input.length;
  const ratio = tokens.length ? (charCount / tokens.length).toFixed(1) : '0';
  const cost = ((tokens.length / 1000) * 0.03).toFixed(4);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  }, []);

  return (
    <section id="s1" style={{ maxWidth: 900, margin: '0 auto', padding: '5rem 2rem' }}>
      <RevealSection>
        <SectionHeader num="01" tag="Session 1 · 1.5 hrs" title="What is an LLM?" accentColor={AC} borderColor="rgba(79,158,255,0.3)" />
        <p style={{ color: 'var(--muted)', maxWidth: 600, marginBottom: '2.5rem', fontSize: 15 }}>
          Forget the hype. An LLM is fundamentally a <strong style={{ color: 'var(--text)' }}>next-token predictor</strong> trained on enormous text.
          Everything amazing it does flows from that one idea — but the details of <em>how</em> it predicts are what make it powerful.
        </p>
      </RevealSection>

      {/* ── How Training Works ── */}
      <RevealSection>
        <SubSection title="How does an LLM learn?" accent={AC}>
          <ConceptBlock title="The training pipeline" accent={AC}>
            An LLM doesn't memorize text. It learns <strong style={{ color: 'var(--text)' }}>statistical patterns</strong> by reading
            billions of tokens and adjusting its weights to minimize prediction error. Think of it as a giant compression algorithm:
            the model distills the structure of language into numbers.
          </ConceptBlock>

          <FlowDiagram accent={AC} steps={[
            { label: 'Collect Data', sub: 'Trillions of tokens' },
            { label: 'Tokenize', sub: 'Text → numbers' },
            { label: 'Train', sub: 'Adjust weights' },
            { label: 'Predict', sub: 'Next token' },
          ]} />

          <KeyPoint num={1} title="Pre-training: the bulk of learning" accent={AC}>
            The model reads a token, predicts the next one, checks if it was right, and adjusts its weights.
            This loop runs <strong style={{ color: 'var(--text)' }}>trillions of times</strong>. Each adjustment is tiny,
            but over months of training on thousands of GPUs, the model internalizes grammar, facts, reasoning patterns,
            and even coding logic — all from predicting the next token.
          </KeyPoint>

          <KeyPoint num={2} title="Fine-tuning: shaping behavior" accent={AC}>
            Pre-training gives a model that can complete any text. Fine-tuning on curated Q&A pairs teaches it to
            <strong style={{ color: 'var(--text)' }}> follow instructions</strong> instead of just completing text.
            RLHF (Reinforcement Learning from Human Feedback) further aligns it to be helpful, harmless, and honest.
          </KeyPoint>

          <KeyPoint num={3} title="Weights: the model's knowledge" accent={AC}>
            A model like GPT-4 has ~1.8 trillion parameters (numbers). These are the "weights" — the knowledge.
            Training is the process of finding the right values for all those numbers so that next-token predictions
            are accurate. No one programmed these numbers; they were discovered through optimization.
          </KeyPoint>
        </SubSection>
      </RevealSection>

      {/* ── Next-Token Prediction ── */}
      <RevealSection>
        <SubSection title="Next-token prediction: the core loop" accent={AC}>
          <ConceptBlock title="Probability over vocabulary" accent={AC}>
            At every step, the model doesn't just pick one word. It outputs a <strong style={{ color: 'var(--text)' }}>probability distribution</strong> over
            its entire vocabulary (~100K tokens). The token with the highest probability is usually chosen — but temperature
            and sampling can change this.
          </ConceptBlock>

          <CodeExample accent={AC} code={`# Simplified next-token prediction
input = "The cat sat on the"
logits = model(input)                    # shape: [1, vocab_size]
probs = softmax(logits / temperature)     # turn into probabilities
next_token = sample(probs)               # pick one token
# → "mat" (probability: 0.34)
# → "floor" (probability: 0.12)
# → "couch" (probability: 0.08)`} />

          <InfoBox accent={AC}>
            <strong style={{ color: 'var(--text)' }}>Why does this work?</strong> Because language is highly predictable.
            "The cat sat on the ___" has very few plausible completions. After seeing trillions of examples,
            the model learns which completions are plausible in any context — and that's effectively understanding.
          </InfoBox>
        </SubSection>
      </RevealSection>

      {/* ── Tokens ── */}
      <RevealSection>
        <SubSection title="Tokens: the atoms of language" accent={AC}>
          <ConceptBlock title="Sub-word tokenization" accent={AC}>
            LLMs don't read characters or whole words. They read <strong style={{ color: 'var(--text)' }}>tokens</strong> —
            sub-word chunks. Common words are single tokens; rare words get split.
            "unbelievable" → ["un", "believ", "able"]. This handles any word, even ones never seen in training.
          </ConceptBlock>

          <KeyPoint num={1} title="BPE: Byte-Pair Encoding" accent={AC}>
            The tokenizer is built by repeatedly merging the most common byte pairs in the training data.
            Starting from individual characters, it builds up a vocabulary of ~100K tokens.
            This vocabulary is fixed after training — every input must be expressible with these tokens.
          </KeyPoint>

          <KeyPoint num={2} title="Token count matters for cost and quality" accent={AC}>
            APIs charge per token. A 1000-word email is ~1300 tokens. A code file with rare variable names
            can be 2-3x more tokens than you'd expect. Non-English text often uses 2-4x more tokens than English.
            <strong style={{ color: 'var(--text)' }}> Always count tokens, not words, when estimating cost.</strong>
          </KeyPoint>
        </SubSection>
      </RevealSection>

      {/* ── Emergent Abilities ── */}
      <RevealSection>
        <SubSection title="Emergent abilities: scale unlocks new skills" accent={AC}>
          <AnalogyGrid items={[
            { emoji: '📐', title: 'Scale is the magic', desc: 'Bigger data + bigger model + more compute = emergent abilities. Reasoning, coding, and creativity weren\'t explicitly programmed — they emerged from scale.' },
            { emoji: '🧠', title: 'Phase transitions', desc: 'Research shows abilities like multi-step reasoning appear suddenly at certain scale thresholds. A 7B model can\'t do chain-of-thought; a 70B model can. It\'s not gradual.' },
            { emoji: '🎯', title: 'In-context learning', desc: 'GPT-3\'s breakthrough: the model learns new tasks from examples in the prompt, without weight updates. This wasn\'t trained for — it emerged from predicting the next token at scale.' },
            { emoji: '🗜️', title: 'Compression = intelligence', desc: 'Training is lossy compression of the internet into weights. The better the compression, the more the model "understands." Understanding is what good compression looks like.' },
          ]} />
        </SubSection>
      </RevealSection>

      {/* ── Live Demo ── */}
      <RevealSection>
        <DemoCard label="Live Demo — Tokenizer" title="Watch text become tokens" desc="Type anything below and see how it gets split into tokens. Notice how spaces, punctuation, and rare words get their own tokens.">
          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: '1rem' }}>
            <textarea
              value={input}
              onChange={handleChange}
              style={{
                width: '100%', background: 'transparent', border: 'none', outline: 'none',
                color: 'var(--text)', fontFamily: "'DM Mono', monospace", fontSize: 14,
                resize: 'vertical', minHeight: 80, lineHeight: 1.6,
              }}
              placeholder="Type something..."
            />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, minHeight: 40, marginTop: '.75rem' }}>
              {tokens.map((t, i) => {
                const c = TOKEN_COLORS[i % TOKEN_COLORS.length];
                return (
                  <span
                    key={i}
                    title={`Token ${i + 1}: "${t}" (${t.length} chars)`}
                    style={{
                      padding: '3px 10px', borderRadius: 6,
                      fontFamily: "'DM Mono', monospace", fontSize: 13,
                      background: c.bg, border: `1px solid ${c.border}`, color: 'var(--text)',
                      animation: 'chipIn .2s ease both', animationDelay: `${i * 0.03}s`,
                    }}
                  >
                    {t === ' ' ? '·' : t.replace(/ /g, '·')}
                  </span>
                );
              })}
            </div>
            <div style={{
              display: 'flex', gap: '1.5rem', marginTop: '1rem', paddingTop: '1rem',
              borderTop: '1px solid var(--border)', fontSize: 13, color: 'var(--muted)', flexWrap: 'wrap',
            }}>
              <div>Tokens: <strong style={{ color: 'var(--text)', fontFamily: "'DM Mono', monospace" }}>{tokens.length}</strong></div>
              <div>Characters: <strong style={{ color: 'var(--text)', fontFamily: "'DM Mono', monospace" }}>{charCount}</strong></div>
              <div>Ratio: <strong style={{ color: 'var(--text)', fontFamily: "'DM Mono', monospace" }}>{ratio}</strong> chars/token</div>
              <div>~Cost: <strong style={{ color: 'var(--text)', fontFamily: "'DM Mono', monospace" }}>${cost}</strong> (GPT-4 est.)</div>
            </div>
          </div>
        </DemoCard>
      </RevealSection>
    </section>
  );
}
