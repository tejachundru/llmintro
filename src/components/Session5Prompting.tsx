import { useState, useEffect } from 'react';
import {
  RevealSection, SectionHeader, SubSection,
  ConceptBlock, KeyPoint, WarningBox,
  RecapBox, PracticeQuestions, QuickSummary, MentalModel, BeforeAfter,
  InteractiveSlider, StepBuilder, AnimatedPipeline,
} from './shared';

const AC = '#e11d48';

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
      { type: 'sys', label: 'System Instruction', body: 'You are a helpful support agent for Acme Corp. Be concise, professional, and always offer a next step. Never make up information.' },
      { type: 'ctx', label: 'Retrieved Policy Doc', body: 'Refund Policy: Returns accepted within 30 days with receipt. Electronics: 14-day window.' },
      { type: 'user', label: 'User', body: 'Can I return my laptop? Bought it 20 days ago.' },
      { type: 'out', label: 'Model Response', body: "Unfortunately, laptops are electronics with a 14-day return window. Since it's been 20 days, that window has passed. I can check warranty options if you'd like!", typing: true },
    ],
  },
  {
    label: 'Code reviewer',
    layers: [
      { type: 'sys', label: 'System Instruction', body: 'You are a senior engineer. Review code for bugs and security. Think step by step before responding.' },
      { type: 'ctx', label: 'Example Given', body: 'Input: x = int(input())\nFix: Add try/except for non-numeric input.' },
      { type: 'user', label: 'User', body: 'Review: def divide(a,b): return a/b' },
      { type: 'out', label: 'Model Response', body: 'Bug: ZeroDivisionError when b=0.\nFix: Add `if b == 0: raise ValueError("Cannot divide by zero")`.\nAlso add type hints.', typing: true },
    ],
  },
  {
    label: 'Data extractor',
    layers: [
      { type: 'sys', label: 'System Instruction', body: 'Extract structured data. Respond ONLY with valid JSON. No explanation.' },
      { type: 'user', label: 'User', body: 'Extract from: "Meeting with Sarah Chen on March 15 at 2pm to discuss Q2 budget of $50,000."' },
      { type: 'out', label: 'Model Response', body: '{"person":"Sarah Chen","date":"March 15","time":"14:00","topic":"Q2 budget","amount":50000}', typing: true },
    ],
  },
];

const LAYER_STYLES: Record<string, { border: string; bg: string; labelColor: string }> = {
  sys: { border: 'var(--accent)', bg: 'rgba(24,99,220,.05)', labelColor: 'var(--accent)' },
  ctx: { border: 'var(--accent2)', bg: 'rgba(124,58,237,.05)', labelColor: 'var(--accent2)' },
  user: { border: 'var(--accent3)', bg: 'rgba(5,150,105,.05)', labelColor: 'var(--accent3)' },
  out: { border: 'var(--accent4)', bg: 'rgba(251,146,60,.05)', labelColor: 'var(--accent4)' },
};

/* ─── Prompt Layer Card ─── */

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
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 'var(--font-micro)', letterSpacing: 'var(--ls-wide)',
        textTransform: 'uppercase', marginBottom: '.35rem', fontWeight: 500, color: s.labelColor,
      }}>{layer.label}</div>
      <div style={{
        fontSize: 'var(--font-caption)', color: 'var(--muted)', lineHeight: 'var(--lh-snug)',
        fontFamily: 'var(--font-mono)',
      }}>
        {typed ? layer.body : <span style={{ opacity: 0.3 }}>Generating...</span>}
      </div>
    </div>
  );
}

/* ─── Prompt Builder Demo (inline) ─── */

function PromptBuilder() {
  const [presetIdx, setPresetIdx] = useState(0);
  const preset = PRESETS[presetIdx];

  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <div style={{ fontSize: 'var(--font-caption)', color: 'var(--muted)', fontFamily: 'var(--font-mono)', marginBottom: '1rem' }}>
        Click a preset to see how the prompt is layered:
      </div>
      <div style={{
        background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14,
        padding: '1.25rem',
      }}>
        <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          {PRESETS.map((p, i) => (
            <button
              key={i}
              onClick={() => setPresetIdx(i)}
              style={{
                padding: '.35rem .75rem', borderRadius: 6, fontSize: 'var(--font-caption)',
                background: presetIdx === i ? AC + '1e' : 'var(--bg3)',
                border: `1px solid ${presetIdx === i ? AC + '55' : 'var(--border)'}`,
                color: presetIdx === i ? AC : 'var(--muted)',
                cursor: 'pointer', fontFamily: 'var(--font-mono)', fontWeight: presetIdx === i ? 600 : 400,
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        {preset.layers.map((layer, i) => (
          <PromptLayer key={`${presetIdx}-${i}`} layer={layer} idx={i} />
        ))}
      </div>
    </div>
  );
}

/* ─── Temperature Demo (inline) ─── */

function TemperatureDemo() {
  const [temp, setTemp] = useState(0.7);
  const outputs: Record<number, string[]> = {
    0: ['The cat sat on the mat.', 'The cat sat on the mat.', 'The cat sat on the mat.'],
    3: ['The cat lounged on the mat.', 'The cat rested on the rug.', 'The feline sprawled across the carpet.'],
    7: ['The cat napped lazily.', 'A feline snoozed in the sun.', 'Whiskers curled up somewhere warm.'],
    10: ['The dragon soared through clouds.', 'A spaceship hummed in orbit.', 'Quantum particles danced in chaos.'],
  };
  const closestTemp = [0, 3, 7, 10].reduce((prev, curr) => Math.abs(curr - temp * 10) < Math.abs(prev - temp * 10) ? curr : prev);

  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <div style={{ fontSize: 'var(--font-caption)', color: 'var(--muted)', fontFamily: 'var(--font-mono)', marginBottom: '1rem' }}>
        Drag the slider to see how temperature affects creativity:
      </div>
      <div style={{
        background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14,
        padding: '1.25rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--font-micro)', color: 'var(--muted)' }}>Deterministic</span>
          <input
            type="range" min="0" max="1" step="0.1" value={temp}
            onChange={e => setTemp(Number(e.target.value))}
            style={{ flex: 1, accentColor: AC }}
            aria-label="Temperature slider"
          />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--font-micro)', color: 'var(--muted)' }}>Creative</span>
        </div>
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--font-body)', color: AC, fontWeight: 600 }}>
            Temperature: {temp.toFixed(1)}
          </span>
        </div>
        <div style={{ fontSize: 'var(--font-micro)', color: 'var(--muted)', fontFamily: 'var(--font-mono)', marginBottom: '.5rem' }}>
          Prompt: &ldquo;The cat sat on the___&rdquo;
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.35rem' }}>
          {outputs[closestTemp].map((out, i) => (
            <div key={i} style={{
              padding: '.5rem .75rem', borderRadius: 6,
              background: 'var(--bg3)', border: '1px solid var(--border)',
              fontFamily: 'var(--font-mono)', fontSize: 'var(--font-caption)', color: 'var(--text)',
            }}>
              {out}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Session5Prompting() {
  return (
    <section id="s5" style={{ maxWidth: 960, margin: '0 auto', padding: '4rem 2rem 6rem' }}>
      {/* ── Header + Intro ── */}
      <RevealSection>
        <SectionHeader num="05" tag="Session 5 · 1.5 hrs" title="The Art of Prompting" accentColor={AC} borderColor={`${AC}44`} />
        <p style={{ color: 'var(--muted)', maxWidth: 640, fontSize: 'var(--font-body-lg)', lineHeight: 'var(--lh-relaxed)' }}>
          The same model can produce garbage or gold depending on <strong style={{ color: 'var(--text)' }}>how you ask</strong>.
          Prompt engineering is the skill of crafting inputs that reliably produce great outputs.
        </p>
      </RevealSection>

      {/* ── The Analogy ── */}
      <RevealSection style={{ marginBottom: '4rem' }}>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--font-heading)', color: 'var(--text)', marginBottom: '1rem', marginTop: 0 }}>
          Prompting = Giving Instructions to a Smart Intern
        </p>
        <p style={{ color: 'var(--muted)', fontSize: 'var(--font-body-lg)', lineHeight: 'var(--lh-relaxed)', maxWidth: 640, marginBottom: '2rem' }}>
          Imagine a brilliant intern who has read every book but has zero context about your company.
          They will do exactly what you ask — nothing more, nothing less. Vague instructions yield vague results.
          <strong style={{ color: 'var(--text)' }}> Be specific, structured, and clear.</strong>
        </p>
        <AnimatedPipeline accent={AC} stages={[
          { icon: '...', label: 'Bad Prompt', desc: '"Write something about AI"' },
          { icon: '...', label: 'Vague Output', desc: 'Generic, unfocused text' },
          { icon: '...', label: 'Good Prompt', desc: 'Role + context + format + example' },
          { icon: '...', label: 'Great Output', desc: 'Specific, useful, on-target' },
        ]} />
      </RevealSection>

      {/* ── Playground ── */}
      <RevealSection>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--font-heading)', color: 'var(--text)', marginBottom: '.5rem', marginTop: 0 }}>
          The Playground
        </p>
        <p style={{ color: 'var(--muted)', fontSize: 'var(--font-caption)', fontFamily: 'var(--font-mono)', marginBottom: '2rem', letterSpacing: 'var(--ls-wide)', textTransform: 'uppercase' }}>
          Explore prompt layers and temperature interactively
        </p>

        <PromptBuilder />
        <TemperatureDemo />
      </RevealSection>

      {/* ── Prompt Anatomy ── */}
      <RevealSection style={{ marginBottom: '4rem' }}>
        <SubSection title="Anatomy of a Great Prompt" accent={AC}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            {[
              { title: '1. System Instructions', desc: 'Set the role: "You are a senior engineer who reviews code for bugs." This frames all responses.', color: 'var(--accent)' },
              { title: '2. Context', desc: 'Relevant background: policy docs, code snippets, examples. From RAG or pasted directly.', color: 'var(--accent2)' },
              { title: '3. User Message', desc: 'The actual task: "Review this function and find bugs." Be specific about what you want.', color: 'var(--accent3)' },
              { title: '4. Output Format', desc: '"Respond as JSON" or "Use bullet points" or "Max 3 sentences." Constrain the output.', color: 'var(--accent4)' },
            ].map((card, i) => (
              <div key={i} style={{
                padding: '1.25rem', borderRadius: 12, background: 'var(--bg2)',
                borderLeft: `3px solid ${card.color}`,
              }}>
                <h4 style={{ fontSize: 'var(--font-body)', fontWeight: 500, color: 'var(--text)', margin: '0 0 .35rem 0' }}>{card.title}</h4>
                <div style={{ fontSize: 'var(--font-caption)', color: 'var(--muted)', lineHeight: 'var(--lh-snug)' }}>{card.desc}</div>
              </div>
            ))}
          </div>
        </SubSection>
      </RevealSection>

      {/* ── Key Techniques ── */}
      <RevealSection style={{ marginBottom: '4rem' }}>
        <SubSection title="Techniques That Actually Work" accent={AC}>
          <StepBuilder accent={AC} steps={[
            { label: 'Chain of Thought', detail: 'Add "Think step by step" to force the model to reason aloud. It dramatically improves accuracy on math, logic, and multi-step problems.' },
            { label: 'Few-Shot Examples', detail: 'Show 2-3 input/output pairs before your actual question. The model pattern-matches. "Here are examples of good answers: ..."' },
            { label: 'Role / Persona', detail: '"You are a senior security engineer." This biases the model toward domain-specific vocabulary and concerns.' },
            { label: 'Output Constraints', detail: '"Respond in JSON only, max 100 words, include a confidence score." Constraints reduce rambling and format inconsistency.' },
            { label: 'Self-Critique', detail: 'Ask the model to review its own answer: "Now critique your response for errors." Often catches its own mistakes.' },
          ]} />

          <WarningBox accent={AC}>
            <strong>Common mistake:</strong> Writing long, vague prompts. If you wouldn&apos;t accept it as instructions from your boss, the model won&apos;t either.
            <strong style={{ color: 'var(--text)' }}> Be specific about role, context, format, and constraints.</strong>
          </WarningBox>
        </SubSection>
      </RevealSection>

      {/* ── Recap + Mental Model ── */}
      <RevealSection>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 300px' }}>
            <RecapBox accent={AC} items={[
              'Same model, different prompt = wildly different output quality.',
              'Prompt = System Instructions + Context + Task + Output Format.',
              'Chain of Thought ("think step by step") improves reasoning.',
              'Few-shot examples teach the model the pattern you want.',
              'Temperature controls creativity vs. consistency.',
              'Constrain output format to get reliable, parseable results.',
            ]} />
          </div>
          <div style={{ flex: '1 1 300px' }}>
            <MentalModel
              emoji="🎯"
              title="Your Mental Model"
              desc="Think of prompting like briefing a brilliant intern. They have all the knowledge, but zero context about YOUR task. The better the brief (role, docs, examples, format), the better the work."
              accent={AC}
            />
          </div>
        </div>
      </RevealSection>

      {/* ── Quick Summary ── */}
      <RevealSection>
        <QuickSummary
          accent={AC}
          summary="Prompt engineering is the skill of crafting inputs that reliably produce great outputs. Structure prompts as: System Instructions + Context + Task + Format. Use Chain of Thought for reasoning, few-shot examples for patterns, and temperature to control creativity. Be specific — the model does exactly what you ask."
        />
      </RevealSection>

      {/* ── Practice Questions ── */}
      <RevealSection>
        <PracticeQuestions accent={AC} questions={[
          'What are the 4 parts of a well-structured prompt?',
          'How does "Chain of Thought" prompting improve accuracy?',
          'What is the effect of temperature = 0 vs temperature = 1?',
          'Give an example of a few-shot prompt.',
          'Why is "respond in JSON only" a useful constraint?',
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
            You can prompt an LLM with text. But what if it could <strong style={{ color: 'var(--text)' }}>take actions</strong> —
            read your files, search your email, create calendar events? That&apos;s <strong style={{ color: 'var(--accent6)' }}>MCP</strong>.
          </div>
        </div>
      </RevealSection>
    </section>
  );
}
