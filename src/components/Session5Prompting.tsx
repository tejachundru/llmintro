import { useState, useEffect } from 'react';
import {
  DemoCard, RevealSection, SectionHeader, SubSection,
  ConceptBlock, KeyPoint, WarningBox,
  RecapBox, PracticeQuestions, QuickSummary, MentalModel, BeforeAfter,
  InteractiveSlider, StepBuilder,
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
      { type: 'out', label: 'Model Response', body: 'Bug: ZeroDivisionError when b=0.\nFix: Add `if b == 0: raise ValueError("Cannot divide by zero")`.\nAlso add type hints: `def divide(a: float, b: float) -> float`.', typing: true },
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
        fontFamily: 'var(--ff-mono)', fontSize: 'var(--font-micro)', letterSpacing: 'var(--ls-wide)',
        textTransform: 'uppercase', marginBottom: '.35rem', fontWeight: 500, color: s.labelColor,
      }}>{layer.label}</div>
      <div style={{
        color: 'var(--ink)', fontFamily: 'var(--ff-mono)', fontSize: 'var(--font-body)', whiteSpace: 'pre-wrap',
        borderRight: (!typed && layer.typing) ? '2px solid var(--accent4)' : 'none',
        animation: (!typed && layer.typing) ? 'blink .7s step-end infinite' : 'none',
      }}>
        {layer.body}
      </div>
    </div>
  );
}

/* ─── Live Temperature Slider ─── */

const TEMP_OUTPUTS: Record<number, string> = {
  0: '"The capital of France is Paris."',
  0.3: '"The capital of France is Paris, known for the Eiffel Tower."',
  0.5: '"Paris is the capital of France, a beautiful city with amazing food and culture."',
  0.7: '"Paris — France\'s dazzling capital where history meets modern charm and every street tells a story."',
  1.0: '"Ah, Paris! The City of Light, France\'s magnificent capital where croissants are poetry and the Eiffel Tower kisses the sky."',
};

function TemperatureSlider() {
  const [temp, setTemp] = useState(0.3);

  const getOutput = (t: number) => {
    const keys = Object.keys(TEMP_OUTPUTS).map(Number).sort((a, b) => a - b);
    let closest = keys[0];
    for (const k of keys) {
      if (k <= t) closest = k;
    }
    return TEMP_OUTPUTS[closest];
  };

  return (
    <div style={{ background: 'var(--primary)', border: '1px solid var(--border-dark)', color: 'var(--muted-dark-strong)', borderRadius: 12, padding: '1.25rem' }}>
      <InteractiveSlider
        value={temp}
        min={0}
        max={1}
        step={0.1}
        label="Temperature"
        accent={AC}
        format={v => v.toFixed(1)}
        onChange={setTemp}
      />

      <div style={{
        marginTop: '1rem', padding: '1rem', borderRadius: 8,
        background: 'var(--soft-stone)', border: '1px solid var(--border)',
        fontFamily: 'var(--ff-mono)', fontSize: 'var(--font-body)', color: 'var(--ink)',
        lineHeight: 'var(--lh-body)', minHeight: 40,
      }}>
        {getOutput(temp)}
      </div>

      <div style={{ display: 'flex', gap: '.5rem', justifyContent: 'center', marginTop: '.75rem', flexWrap: 'wrap' }}>
        {[
          { t: 0, label: '0.0', color: AC },
          { t: 0.3, label: '0.3', color: 'var(--accent2)' },
          { t: 0.5, label: '0.5', color: 'var(--accent3)' },
          { t: 0.7, label: '0.7', color: 'var(--accent4)' },
          { t: 1.0, label: '1.0', color: 'var(--accent5)' },
        ].map(p => (
          <button
            key={p.t}
            onClick={() => setTemp(p.t)}
            style={{
              padding: '.25rem .6rem', borderRadius: 5, fontSize: 'var(--font-micro)',
              background: temp === p.t ? p.color + '20' : 'var(--soft-stone)',
              border: `1px solid ${temp === p.t ? p.color + '66' : 'var(--border)'}`,
              color: temp === p.t ? p.color : 'var(--muted)',
              cursor: 'pointer', fontFamily: 'var(--ff-mono)',
            }}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Few-Shot Builder ─── */

function FewShotBuilder() {
  const [examples, setExamples] = useState<{ input: string; output: string }[]>([
    { input: 'I love this!', output: 'Positive' },
    { input: 'This is terrible.', output: 'Negative' },
  ]);
  const [testInput, setTestInput] = useState('Best day ever!');
  const [showAnswer, setShowAnswer] = useState(false);

  const addExample = () => {
    setExamples(prev => [...prev, { input: '', output: '' }]);
  };

  const updateExample = (i: number, field: 'input' | 'output', val: string) => {
    setExamples(prev => prev.map((ex, j) => j === i ? { ...ex, [field]: val } : ex));
  };

  const removeExample = (i: number) => {
    setExamples(prev => prev.filter((_, j) => j !== i));
  };

  return (
    <div style={{ background: 'var(--primary)', border: '1px solid var(--border-dark)', color: 'var(--muted-dark-strong)', borderRadius: 12, padding: '1.25rem' }}>
      <div style={{ fontSize: 'var(--font-caption)', color: 'var(--muted)', fontFamily: 'var(--ff-mono)', marginBottom: '.75rem' }}>
        Add examples to teach the model a pattern:
      </div>

      {examples.map((ex, i) => (
        <div key={i} style={{ display: 'flex', gap: '.5rem', marginBottom: '.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: 'var(--font-mono)', color: 'var(--muted)', fontFamily: 'var(--ff-mono)', minWidth: 20 }}>#{i + 1}</span>
          <input
            value={ex.input}
            onChange={e => updateExample(i, 'input', e.target.value)}
            placeholder="Input..."
            style={{
              flex: 1, padding: '.4rem .6rem', borderRadius: 6,
              background: 'var(--soft-stone)', border: '1px solid var(--hairline)',
              color: 'var(--ink)', fontFamily: 'var(--ff-mono)', fontSize: 'var(--font-caption)',
              outline: 'none',
            }}
          />
          <span style={{ color: 'var(--muted)', fontSize: 'var(--font-caption)' }}>→</span>
          <input
            value={ex.output}
            onChange={e => updateExample(i, 'output', e.target.value)}
            placeholder="Output..."
            style={{
              flex: 1, padding: '.4rem .6rem', borderRadius: 6,
              background: 'var(--soft-stone)', border: '1px solid var(--hairline)',
              color: 'var(--accent3)', fontFamily: 'var(--ff-mono)', fontSize: 'var(--font-caption)',
              outline: 'none',
            }}
          />
          <button
            onClick={() => removeExample(i)}
            style={{
              padding: '.25rem .5rem', borderRadius: 4,
              background: 'rgba(244,67,54,.1)', border: '1px solid rgba(244,67,54,.3)',
              color: '#f87171', fontSize: 'var(--font-mono)', cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>
      ))}

      <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1rem' }}>
        <button onClick={addExample} style={{
          padding: '.35rem .7rem', borderRadius: 6, fontSize: 'var(--font-micro)',
          background: AC + '15', border: `1px solid ${AC}44`,
          color: AC, cursor: 'pointer', fontFamily: "var(--font-body)",
        }}>
          + Add Example
        </button>
      </div>

      <div style={{
        padding: '.75rem', borderRadius: 8,
        background: 'var(--soft-stone)', border: '1px solid var(--border)',
      }}>
        <div style={{ fontSize: 'var(--font-micro)', color: 'var(--muted)', fontFamily: 'var(--ff-mono)', marginBottom: '.5rem' }}>
          Test with new input:
        </div>
        <div style={{ display: 'flex', gap: '.5rem', marginBottom: '.5rem' }}>
          <input
            value={testInput}
            onChange={e => setTestInput(e.target.value)}
            style={{
              flex: 1, padding: '.4rem .6rem', borderRadius: 6,
              background: 'var(--primary)', border: '1px solid var(--hairline)', color: 'var(--muted-dark)',
              fontFamily: 'var(--ff-mono)', fontSize: 'var(--font-caption)',
              outline: 'none',
            }}
            placeholder="Type a test input..."
          />
          <button
            onClick={() => setShowAnswer(true)}
            style={{
              padding: '.35rem .7rem', borderRadius: 6, fontSize: 'var(--font-micro)',
              background: 'var(--accent3)' + '20', border: '1px solid var(--accent3)' + '44',
              color: 'var(--accent3)', cursor: 'pointer',
            }}
          >
            Predict
          </button>
        </div>
        {showAnswer && (
          <div style={{
            padding: '.5rem .75rem', borderRadius: 6,
            background: 'rgba(5,150,105,.1)', border: '1px solid rgba(5,150,105,.3)',
            fontFamily: 'var(--ff-mono)', fontSize: 'var(--font-body)', color: 'var(--accent3)',
            animation: 'fadeIn .3s ease',
          }}>
            Input: "{testInput}" → <strong>Positive</strong>
            <div style={{ fontSize: 'var(--font-mono)', color: 'var(--muted)', marginTop: '.25rem' }}>
              (Predicted based on your {examples.length} examples)
            </div>
          </div>
        )}
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
        <SectionHeader num="05" tag="Bonus Session · 1 hr" title="How to Talk to an LLM" accentColor={AC} borderColor="rgba(244,114,182,0.3)" />
        <p style={{ color: 'var(--muted)', maxWidth: 600, marginBottom: '2.5rem', fontSize: 'var(--font-body)' }}>
          Prompts are not magic spells. They're <strong style={{ color: 'var(--ink)' }}>instructions to a statistical machine</strong>.
          Once you understand how the model "thinks," you can write prompts that work every time — not just sometimes.
        </p>
      </RevealSection>

      {/* ── Real-World Analogy ── */}
      <RevealSection>
        <SubSection title="The Intern Analogy" accent={AC}>
          <ConceptBlock title="You're the boss, LLM is the intern" accent={AC}>
            Imagine you have a new intern. They're incredibly smart but have never worked at your company.
            They take everything you say <strong style={{ color: 'var(--ink)' }}>literally</strong>.
            <br /><br />
            If you say "handle this," they might guess wrong.
            If you say "read this document, extract the refund policy, and answer yes/no if the customer qualifies,"
            they'll do exactly that.
            <br /><br />
            <strong style={{ color: 'var(--ink)' }}>That's prompting.</strong> Clear instructions = good results. Vague instructions = random guesses.
          </ConceptBlock>
        </SubSection>
      </RevealSection>

      {/* ── System Prompts ── */}
      <RevealSection>
        <SubSection title="System Prompts: The Invisible Instruction Manual" accent={AC}>
          <ConceptBlock title="Set the rules before the conversation starts" accent={AC}>
            The system prompt is like a rule sheet you give your intern at the start of the day.
            It sets the persona, constraints, and output format. <strong style={{ color: 'var(--ink)' }}>Every user message follows these rules.</strong>
          </ConceptBlock>

          <BeforeAfter
            accent={AC}
            before='"Answer the question." (Vague — model might give a short or long, correct or wrong answer)'
            after={'"You are a senior accountant. Answer concisely. If you don\u2019t know, say: I don\u2019t have enough information. Use bullet points. Cite sources." (Clear \u2014 model knows exactly what to do)'}
          />

          <KeyPoint num={1} title="Tell it what NOT to do" accent={AC}>
            "Don't make up information" is weak.
            <strong style={{ color: 'var(--ink)' }}>"If the answer isn't in the provided documents, say 'I don't know' — never guess"</strong> is strong.
            Negative instructions work better than positive ones.
          </KeyPoint>

          <KeyPoint num={2} title="Specify the output format" accent={AC}>
            "Respond in JSON" is vague. "Respond with a JSON object with keys: name (string), date (string), amount (number). No other text."
            The model follows format instructions <strong style={{ color: 'var(--ink)' }}>literally</strong> — be literal.
          </KeyPoint>
        </SubSection>
      </RevealSection>

      {/* ── Chain-of-Thought ── */}
      <RevealSection>
        <SubSection title="Chain-of-Thought: Show Your Work" accent={AC}>
          <ConceptBlock title={'"Think step by step" is not a suggestion \u2014 it\u2019s a performance hack'} accent={AC}>
            When you ask the model to think step by step, you're giving it <strong style={{ color: 'var(--ink)' }}>more tokens to compute on</strong>
            before the final answer. Each step is a chance to refine the reasoning.
            <br /><br />
            It's the difference between asking someone "What's 15% of 847?" and making them blurt an answer,
            vs asking them to calculate it on paper first.
          </ConceptBlock>

          <BeforeAfter
            accent={AC}
            before='Q: "What is 15% of 847?" → A: "126" (Wrong — model guessed)'
            after='Q: "Think step by step. What is 15% of 847?"\n→ "10% of 847 = 84.7\n5% of 847 = 42.35\n15% = 84.7 + 42.35 = 127.05" → Correct!'
          />

          <KeyPoint num={1} title="Zero-shot vs Few-shot CoT" accent={AC}>
            Zero-shot: just add "Think step by step." Few-shot: provide 2-3 examples of questions with step-by-step solutions.
            <strong style={{ color: 'var(--ink)' }}>Few-shot CoT is more reliable</strong>, especially for complex tasks.
          </KeyPoint>

          <StepBuilder accent={AC} steps={[
            { label: 'Without CoT: model jumps to answer', detail: 'Q: "A bat and ball cost ₹110. The bat costs ₹100 more than the ball. How much is the ball?"\n\nA: "₹10" ❌ Wrong! The model rushed.' },
            { label: 'With CoT: model thinks step by step', detail: 'Q: "Think step by step. A bat and ball cost ₹110. The bat costs ₹100 more than the ball. How much is the ball?"\n\nA: "Let x = cost of ball. Bat = x + 100. Total: x + (x + 100) = 110. So 2x + 100 = 110. 2x = 10. x = ₹5." ✅ Correct!' },
          ]} />
        </SubSection>
      </RevealSection>

      {/* ── Temperature ── */}
      <RevealSection>
        <SubSection title="Temperature: The Creativity Dial" accent={AC}>
          <ConceptBlock title="How random do you want the answer?" accent={AC}>
            Temperature controls how "creative" the model gets.
            <br /><br />
            <strong style={{ color: 'var(--ink)' }}>Low temperature (0)</strong> = always picks the most likely word. Boring but reliable.
            <strong style={{ color: 'var(--ink)' }}>High temperature (1)</strong> = picks less likely words. Creative but unpredictable.
          </ConceptBlock>

          <div style={{
            background: 'var(--primary)', border: '1px solid var(--border-dark)', color: 'var(--muted-dark-strong)', borderRadius: 12,
            padding: '1.25rem', marginBottom: '1rem',
          }}>
            <div style={{ fontSize: 'var(--font-body)', color: 'var(--muted)', marginBottom: '.75rem', textAlign: 'center' }}>
              Same prompt, different temperatures
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: 'var(--font-micro)', fontFamily: 'var(--ff-mono)', color: 'var(--accent)', marginBottom: '.25rem' }}>Temperature 0.0 (Factual):</div>
              <div style={{ fontSize: 'var(--font-caption)', fontFamily: 'var(--ff-mono)', color: 'var(--ink)', padding: '.5rem .75rem', background: 'var(--soft-stone)', borderRadius: 8 }}>
                "The capital of France is Paris."
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: 'var(--font-micro)', fontFamily: 'var(--ff-mono)', color: 'var(--accent5)', marginBottom: '.25rem' }}>Temperature 0.5 (Balanced):</div>
              <div style={{ fontSize: 'var(--font-caption)', fontFamily: 'var(--ff-mono)', color: 'var(--ink)', padding: '.5rem .75rem', background: 'var(--soft-stone)', borderRadius: 8 }}>
                "The capital of France is Paris, a city known for its art, cuisine, and the Eiffel Tower."
              </div>
            </div>

            <div>
              <div style={{ fontSize: 'var(--font-micro)', fontFamily: 'var(--ff-mono)', color: 'var(--accent4)', marginBottom: '.25rem' }}>Temperature 1.0 (Creative):</div>
              <div style={{ fontSize: 'var(--font-caption)', fontFamily: 'var(--ff-mono)', color: 'var(--ink)', padding: '.5rem .75rem', background: 'var(--soft-stone)', borderRadius: 8 }}>
                "Paris, the City of Light, is France's majestic capital — where history whispers from every corner and croissants melt like buttered sunshine."
              </div>
            </div>
          </div>

          <DemoCard
            label="Interactive Demo"
            title="Live Temperature Control"
            desc="Drag the slider to see how temperature changes the model's output for the same prompt."
          >
            <TemperatureSlider />
          </DemoCard>

          <WarningBox accent={AC}>
            <strong>Temperature 0 does NOT guarantee the same answer every time.</strong> Some providers still add slight randomness.
            For truly deterministic output, use temperature=0, top_p=1, and a fixed seed (if supported).
          </WarningBox>
        </SubSection>
      </RevealSection>

      {/* ── Few-Shot Learning ── */}
      <RevealSection>
        <SubSection title="Few-Shot: Teaching by Example" accent={AC}>
          <ConceptBlock title="Show, don't tell" accent={AC}>
            Instead of explaining the format, show 2-3 examples. The model sees the pattern and follows it.
            <strong style={{ color: 'var(--ink)' }}>This is called in-context learning</strong> — the model learns a new task
            just from examples in the prompt, without any training.
          </ConceptBlock>

          <div style={{
            background: 'var(--primary)', border: '1px solid var(--border-dark)', color: 'var(--muted-dark-strong)', borderRadius: 12,
            padding: '1rem', marginBottom: '1rem',
          }}>
            <div style={{ fontSize: 'var(--font-body)', color: 'var(--muted)', marginBottom: '.75rem' }}>Example: Teaching sentiment analysis</div>
            <div style={{ fontFamily: 'var(--ff-mono)', fontSize: 'var(--font-caption)', lineHeight: 1.8 }}>
              <div style={{ color: 'var(--accent3)' }}>Input: "I love this product!" → Positive</div>
              <div style={{ color: 'var(--accent3)' }}>Input: "This is terrible." → Negative</div>
              <div style={{ color: 'var(--accent3)' }}>Input: "It's okay I guess." → Neutral</div>
              <div style={{ color: 'var(--ink)', marginTop: '.5rem' }}>Input: "Best purchase ever!" → <span style={{ color: 'var(--accent2)' }}>???</span></div>
            </div>
            <div style={{ fontSize: 'var(--font-caption)', color: 'var(--muted)', marginTop: '.5rem' }}>
              The model will predict "Positive" because it matches the pattern
            </div>
          </div>

          <KeyPoint num={1} title="Sweet spot: 2-3 examples" accent={AC}>
            0 examples: model guesses. 1 example: has a pattern. 3 examples: confident.
            5+ examples: diminishing returns. <strong style={{ color: 'var(--ink)' }}>2-3 diverse examples is ideal.</strong>
          </KeyPoint>

          <DemoCard
            label="Interactive Demo"
            title="Build Your Own Few-Shot Prompt"
            desc="Add examples to teach the model a pattern, then test it with new input."
          >
            <FewShotBuilder />
          </DemoCard>
        </SubSection>
      </RevealSection>

      {/* ── Prompt Layers Demo ── */}
      <RevealSection>
        <DemoCard
          label="Explore It Yourself"
          title="See What the Model Actually Receives"
          desc="Every prompt has layers. Click a preset to see the full structure."
        >
          <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
            {PRESETS.map((p, i) => (
              <button
                key={i}
                onClick={() => handlePreset(i)}
                style={{
                  padding: '.45rem 1rem', borderRadius: 8,
                  border: activePreset === i ? '1px solid var(--accent)' : '1px solid var(--hairline)',
                  background: activePreset === i ? 'rgba(24,99,220,.06)' : 'var(--primary)',
                  color: activePreset === i ? 'var(--accent)' : 'var(--muted)',
                  fontSize: 'var(--font-caption)', cursor: 'pointer', fontFamily: "var(--font-body)", transition: 'all .2s',
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

      {/* ── Quick Tips ── */}
      <RevealSection>
        <SubSection title="Quick Prompting Tips" accent={AC}>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem',
          }}>
            {[
              { title: 'Be specific', emoji: '🎯', desc: '"Answer concisely" → not "Answer." "Use bullet points" → not "Format nicely."' },
              { title: 'Set the persona', emoji: '👤', desc: '"You are a senior Python developer" works better than "Write code."' },
              { title: 'Use examples', emoji: '📝', desc: 'Show 2-3 examples instead of describing the format. The model learns from patterns.' },
              { title: 'Chain of thought', emoji: '🧮', desc: 'Add "Think step by step" for better reasoning. Each step is more compute.' },
              { title: 'Format for reliability', emoji: '📋', desc: 'Ask for JSON, markdown, or XML to make output parseable.' },
              { title: 'Repeat important stuff', emoji: '🔄', desc: 'Put key instructions at both start and end of the prompt.' },
            ].map((card, i) => (
              <div key={i} style={{
                padding: '1rem', borderRadius: 10, background: 'var(--primary)',
                border: `1px solid ${AC}22`, textAlign: 'center',
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '.5rem' }}>{card.emoji}</div>
                <div style={{ fontSize: 'var(--font-body)', fontWeight: 500, color: 'var(--ink)', marginBottom: '.25rem' }}>{card.title}</div>
                <div style={{ fontSize: 'var(--font-caption)', color: 'var(--muted)', lineHeight: 'var(--lh-snug)' }}>{card.desc}</div>
              </div>
            ))}
          </div>
        </SubSection>
      </RevealSection>

      {/* ── Recap ── */}
      <RevealSection>
        <RecapBox accent={AC} items={[
          'Think of the LLM as a literal-minded intern — give clear, specific instructions.',
          'System prompt = the rule sheet for the entire conversation.',
          'Chain-of-thought = more tokens = better reasoning. Add "think step by step."',
          'Temperature = creativity dial. Low for facts, high for creativity.',
          'Few-shot examples teach the model the format without training.',
          'Be specific about what NOT to do and the exact output format you want.',
        ]} />
      </RevealSection>

      {/* ── Mental Model ── */}
      <RevealSection>
        <MentalModel
          emoji="🎯"
          title="Your Mental Model"
          desc="Think of prompting as giving instructions to a brilliant but very literal intern. They take everything you say at face value. Vague instructions = random results. Specific, structured instructions with examples = reliable, high-quality results every time."
          accent={AC}
        />
      </RevealSection>

      {/* ── 30-Second Summary ── */}
      <RevealSection>
        <QuickSummary
          accent={AC}
          summary="Good prompting = clear, specific instructions to a literal-minded machine. Use system prompts for rules, chain-of-thought for reasoning, temperature for creativity control, and few-shot examples for format consistency. Be precise, use examples, and tell the model what NOT to do."
        />
      </RevealSection>

      {/* ── Practice Questions ── */}
      <RevealSection>
        <PracticeQuestions accent={AC} questions={[
          'Why does "think step by step" improve answers?',
          'What temperature would you use for writing a poem vs extracting data from a receipt?',
          'What\'s the difference between zero-shot and few-shot chain-of-thought?',
          'Why shouldn\'t you put secrets (like API keys) in system prompts?',
          'Give an example of a bad (vague) vs good (specific) system prompt.',
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
            You can now talk to LLMs effectively. But what if you want the model to <strong style={{ color: 'var(--ink)' }}>do</strong> things —
            send emails, read files, book meetings? That's where <strong style={{ color: 'var(--accent6)' }}>MCP</strong> comes in.
          </div>
        </div>
      </RevealSection>
    </section>
  );
}
