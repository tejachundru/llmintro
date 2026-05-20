import { useState, useEffect } from 'react';
import { AnalogyGrid, DemoCard, RevealSection, SectionHeader, SubSection, ConceptBlock, KeyPoint, CodeExample, InfoBox, WarningBox, ComparisonTable } from './shared';

const AC = '#f472b6';

interface Layer {
  type: 'sys' | 'ctx' | 'user' | 'out';
  label: string;
  body: string;
  typing?: boolean;
}

interface Preset {
  label: string;
  layers: Layer[];
}

const PRESETS: Preset[] = [
  {
    label: 'Customer support bot',
    layers: [
      { type: 'sys', label: 'System', body: 'You are a helpful customer support agent for Acme Corp. Be concise, professional, and always offer a next step. Never make up information about products.' },
      { type: 'ctx', label: 'Context (RAG)', body: 'Retrieved doc: "Refund Policy: Items can be returned within 30 days of purchase with receipt. Electronics have a 14-day window."' },
      { type: 'user', label: 'User message', body: 'Hey can I return my laptop? I bought it 20 days ago.' },
      { type: 'out', label: 'Model output', body: "Yes! Laptops fall under our electronics category, so you have a 14-day return window — unfortunately that window has passed for a 20-day-old purchase. However, I can check if there's a warranty claim option. Would you like me to look into that?", typing: true },
    ],
  },
  {
    label: 'Code reviewer',
    layers: [
      { type: 'sys', label: 'System', body: 'You are a senior software engineer. Review code for bugs, performance, and security. Be specific. Think step by step before responding.' },
      { type: 'ctx', label: 'Few-shot example', body: 'Input: x = int(input())\nExpected: Add input validation — this will crash on non-numeric input. Use try/except.' },
      { type: 'user', label: 'User message', body: 'Review this: def divide(a,b): return a/b' },
      { type: 'out', label: 'Model output', body: 'Issue: ZeroDivisionError when b=0. Fix: add `if b == 0: raise ValueError("Cannot divide by zero")`. Also consider type hints: `def divide(a: float, b: float) -> float`.', typing: true },
    ],
  },
  {
    label: 'Data extractor (JSON)',
    layers: [
      { type: 'sys', label: 'System', body: 'Extract structured data. Respond ONLY with valid JSON. No explanation, no markdown fences. If a field is missing, use null.' },
      { type: 'user', label: 'User message', body: 'Extract from: "Meeting with Sarah Chen on March 15 at 2pm to discuss the Q2 budget of $50,000."' },
      { type: 'out', label: 'Model output', body: '{"person":"Sarah Chen","date":"March 15","time":"14:00","topic":"Q2 budget","amount":50000}', typing: true },
    ],
  },
];

const LAYER_STYLES: Record<string, { border: string; bg: string; labelColor: string }> = {
  sys: { border: 'var(--accent)', bg: 'rgba(79,158,255,.05)', labelColor: 'var(--accent)' },
  ctx: { border: 'var(--accent2)', bg: 'rgba(167,139,250,.05)', labelColor: 'var(--accent2)' },
  user: { border: 'var(--accent3)', bg: 'rgba(52,211,153,.05)', labelColor: 'var(--accent3)' },
  out: { border: 'var(--accent4)', bg: 'rgba(251,146,60,.05)', labelColor: 'var(--accent4)' },
};

function PromptLayer({ layer, idx }: { layer: Layer; idx: number }) {
  const [typed, setTyped] = useState(!layer.typing);
  const s = LAYER_STYLES[layer.type];

  useEffect(() => {
    if (layer.typing) {
      setTyped(false);
      const t = setTimeout(() => setTyped(true), 3000);
      return () => clearTimeout(t);
    }
  }, [layer]);

  return (
    <div style={{
      borderLeft: `3px solid ${s.border}`, padding: '.75rem 1rem',
      borderRadius: '0 10px 10px 0', marginBottom: '.5rem',
      background: s.bg, animation: 'fadeUp .4s ease both', animationDelay: idx * 0.08 + 's',
    }}>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: '.35rem', fontWeight: 500, color: s.labelColor }}>{layer.label}</div>
      <div style={{
        color: 'var(--text)', fontFamily: "'DM Mono', monospace", fontSize: 13, whiteSpace: 'pre-wrap',
        borderRight: (!typed && layer.typing) ? '2px solid var(--accent4)' : 'none',
        animation: (!typed && layer.typing) ? 'blink .7s step-end infinite' : 'none',
      }}>
        {layer.body}
      </div>
    </div>
  );
}

export default function Session5Prompting() {
  const [activePreset, setActivePreset] = useState(0);
  const [key, setKey] = useState(0);

  const handlePreset = (i: number) => {
    setActivePreset(i);
    setKey(k => k + 1);
  };

  return (
    <section id="s5" style={{ maxWidth: 900, margin: '0 auto', padding: '5rem 2rem' }}>
      <RevealSection>
        <SectionHeader num="05" tag="Bonus Session · 1 hr" title="Prompting Like an Engineer" accentColor={AC} borderColor="rgba(244,114,182,0.3)" />
        <p style={{ color: 'var(--muted)', maxWidth: 600, marginBottom: '2.5rem', fontSize: 15 }}>
          Prompts aren't magic words — they're <strong style={{ color: 'var(--text)' }}>structured inputs</strong> to a
          statistical system. Understanding what the model actually sees helps you write prompts that reliably work,
          not just sometimes work.
        </p>
      </RevealSection>

      {/* ── System Prompts ── */}
      <RevealSection>
        <SubSection title="The system prompt: setting the rules" accent={AC}>
          <ConceptBlock title="The invisible instruction layer" accent={AC}>
            The system prompt is the most powerful lever you have. It sets the model's persona, constraints, output format,
            and behavioral rules. <strong style={{ color: 'var(--text)' }}>It's processed before every user message</strong>,
            so it's always "in context." A good system prompt prevents 80% of common LLM failures.
          </ConceptBlock>

          <KeyPoint num={1} title="Be specific about what NOT to do" accent={AC}>
            "Don't make up information" is weak. "If the answer isn't in the provided documents, say 'I don't have enough
            information to answer that' — never guess" is strong. Negative constraints are more effective than positive ones.
          </KeyPoint>

          <KeyPoint num={2} title="Define the output format explicitly" accent={AC}>
            "Respond in JSON" is vague. "Respond with a JSON object with keys: name (string), date (ISO 8601), amount (number).
            No markdown fences, no explanation, just the JSON object." is precise. The model follows format instructions
            <strong style={{ color: 'var(--text)' }}> literally</strong> — be literal.
          </KeyPoint>

          <KeyPoint num={3} title="System prompts are not secret" accent={AC}>
            Users can often extract system prompts through clever questioning. Never put secrets, API keys, or sensitive
            logic in system prompts. They're a behavioral guide, not a security boundary.
          </KeyPoint>
        </SubSection>
      </RevealSection>

      {/* ── Chain-of-Thought ── */}
      <RevealSection>
        <SubSection title="Chain-of-thought: more compute = better answers" accent={AC}>
          <ConceptBlock title="Thinking tokens are compute tokens" accent={AC}>
            When you ask an LLM to "think step by step," you're not changing its personality — you're giving it
            <strong style={{ color: 'var(--text)' }}> more tokens to compute on</strong> before producing the final answer.
            Each intermediate step is a forward pass that refines the model's internal representation. More steps = more compute = better reasoning.
          </ConceptBlock>

          <CodeExample accent={AC} code={`# Without CoT: model jumps straight to answer
"What is 15% of 847?" → "126" (wrong — model guessed)

# With CoT: model reasons through steps
"Think step by step. What is 15% of 847?"
→ "Step 1: 10% of 847 = 84.7
   Step 2: 5% of 847 = 42.35
   Step 3: 15% = 84.7 + 42.35 = 127.05"
→ Correct! The intermediate tokens gave the model compute.`} />

          <KeyPoint num={1} title="CoT emerges at scale" accent={AC}>
            Small models (under 7B params) can't do chain-of-thought reliably — they don't have enough capacity
            to maintain coherent multi-step reasoning. This ability emerges around 70B+ parameters.
          </KeyPoint>

          <KeyPoint num={2} title="Zero-shot vs few-shot CoT" accent={AC}>
            Zero-shot: just add "Think step by step." Few-shot: provide 2-3 examples of questions with step-by-step solutions.
            Few-shot CoT is significantly more reliable, especially for complex tasks.
          </KeyPoint>
        </SubSection>
      </RevealSection>

      {/* ── Temperature & Sampling ── */}
      <RevealSection>
        <SubSection title="Temperature, top-p, and sampling" accent={AC}>
          <ConceptBlock title="Controlling randomness" accent={AC}>
            The model outputs a probability distribution over tokens. How we sample from this distribution determines
            the output's character. <strong style={{ color: 'var(--text)' }}>Temperature</strong> scales the logits before softmax.
            Low temperature makes the distribution sharper (more deterministic). High temperature flattens it (more random).
          </ConceptBlock>

          <ComparisonTable accent={AC} headers={['Setting', 'Behavior', 'Use for']} rows={[
            { label: '', cells: ['Temperature 0', 'Always picks the most likely token', 'Code generation, data extraction, factual Q&A'] },
            { label: '', cells: ['Temperature 0.3–0.5', 'Slightly varied but mostly focused', 'Summarization, analysis, professional writing'] },
            { label: '', cells: ['Temperature 0.7–1.0', 'Creative, varied responses', 'Brainstorming, creative writing, chat'] },
            { label: '', cells: ['Top-p 0.9', 'Nucleus sampling — only consider tokens in top 90% probability mass', 'General purpose (better than top-k)'] },
          ]} />

          <WarningBox accent={AC}>
            <strong>Temperature 0 does NOT mean deterministic in all APIs.</strong> Some providers still apply slight randomness.
            If you need truly deterministic output, set temperature=0 AND top_p=1 AND use a fixed seed (if supported).
          </WarningBox>
        </SubSection>
      </RevealSection>

      {/* ── Few-Shot Learning ── */}
      <RevealSection>
        <SubSection title="Few-shot learning: teaching by example" accent={AC}>
          <ConceptBlock title="Show, don't tell" accent={AC}>
            Instead of describing the format, show 2-3 input/output examples. The model infers the pattern
            from the examples and applies it. This is <strong style={{ color: 'var(--text)' }}>in-context learning</strong> —
            the model learns a new task without any weight updates, just from the examples in the prompt.
          </ConceptBlock>

          <KeyPoint num={1} title="More examples = more reliable" accent={AC}>
            0 examples: the model guesses the format. 1 example: it has a pattern. 3 examples: it's confident.
            5+ examples: diminishing returns. <strong style={{ color: 'var(--text)' }}>2-3 examples is the sweet spot</strong> for most tasks.
          </KeyPoint>

          <KeyPoint num={2} title="Examples must be diverse" accent={AC}>
            If all examples are similar, the model overfits to that pattern. Include edge cases:
            an empty input, a long input, an input with special characters. This teaches the model the boundaries.
          </KeyPoint>
        </SubSection>
      </RevealSection>

      {/* ── Structured Outputs ── */}
      <RevealSection>
        <SubSection title="Structured outputs: JSON, XML, and beyond" accent={AC}>
          <AnalogyGrid items={[
            { emoji: '🧩', title: 'Chain-of-thought', desc: 'Adding "think step by step" forces the model to use tokens for reasoning before answering. More compute on the problem = better answers.' },
            { emoji: '🎯', title: 'Few-shot examples', desc: 'Show 2-3 input/output examples. The model infers the pattern and applies it. This is faster than fine-tuning for format consistency.' },
            { emoji: '🌡️', title: 'Temperature', desc: 'Low temp (0.1) = deterministic, focused. High temp (1.0) = creative, varied. For factual tasks: low. For brainstorming: high.' },
            { emoji: '🚧', title: 'Output format matters', desc: 'Asking for JSON, markdown, or XML makes responses easier to parse downstream. Always specify format when building pipelines.' },
          ]} />
        </SubSection>
      </RevealSection>

      {/* ── Prompt Anatomy Demo ── */}
      <RevealSection>
        <DemoCard label="Live Demo — Prompt Anatomy Builder" title="See what the model really receives" desc="Select a preset to understand the layers of a well-structured prompt.">
          <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
            {PRESETS.map((p, i) => (
              <button
                key={i}
                onClick={() => handlePreset(i)}
                style={{
                  padding: '.45rem 1rem', borderRadius: 8,
                  border: activePreset === i ? '1px solid var(--accent)' : '1px solid var(--border2)',
                  background: activePreset === i ? 'rgba(79,158,255,.06)' : 'var(--bg3)',
                  color: activePreset === i ? 'var(--accent)' : 'var(--muted)',
                  fontSize: 12, cursor: 'pointer', fontFamily: "'Outfit', sans-serif", transition: 'all .2s',
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div key={key}>
            {PRESETS[activePreset].layers.map((layer, i) => (
              <PromptLayer key={i} layer={layer} idx={i} />
            ))}
          </div>
        </DemoCard>
      </RevealSection>
    </section>
  );
}
