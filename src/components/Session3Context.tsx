import { useState } from 'react';
import { AnalogyGrid, DemoCard, RevealSection, SectionHeader, SubSection, ConceptBlock, KeyPoint, CodeExample, FlowDiagram, InfoBox, WarningBox, ComparisonTable } from './shared';

const MAX_CTX = 128000;
const AC = '#34d399';

export default function Session3Context() {
  const [ctx, setCtx] = useState({ sys: 0, conv: 0, docs: 0 });
  const total = ctx.sys + ctx.conv + ctx.docs;
  const pct = Math.min((total / MAX_CTX) * 100, 100);
  const barColor = pct < 50 ? '#34d399' : pct < 80 ? '#fb923c' : '#f87171';
  const left = Math.max(MAX_CTX - total, 0);

  const addCtx = (type: 'sys' | 'conv' | 'docs', amount: number) => {
    setCtx(prev => ({ ...prev, [type]: prev[type] + amount }));
  };

  const btnStyle: React.CSSProperties = {
    padding: '.5rem 1rem', borderRadius: 8, border: '1px solid var(--border2)',
    background: 'var(--bg3)', color: 'var(--text)', fontSize: 13, cursor: 'pointer',
    fontFamily: "'Outfit', sans-serif", transition: 'all .2s',
  };

  return (
    <section id="s3" style={{ maxWidth: 900, margin: '0 auto', padding: '5rem 2rem' }}>
      <RevealSection>
        <SectionHeader num="03" tag="Session 3 · 1.5 hrs" title="Context Window" accentColor={AC} borderColor="rgba(52,211,153,0.3)" />
        <p style={{ color: 'var(--muted)', maxWidth: 600, marginBottom: '2.5rem', fontSize: 15 }}>
          The context window is the model's <strong style={{ color: 'var(--text)' }}>entire working memory</strong> —
          everything it can see at once. Unlike humans, LLMs have <em>no persistent memory</em> between conversations.
          Understanding this constraint is critical for building reliable applications.
        </p>
      </RevealSection>

      {/* ── What Is the Context Window ── */}
      <RevealSection>
        <SubSection title="What is the context window?" accent={AC}>
          <ConceptBlock title="A fixed-size desk, not a brain" accent={AC}>
            When you send a prompt to an LLM, everything — system instructions, conversation history, documents, your question —
            gets packed into a single sequence of tokens. The model can only "see" what's in this sequence.
            <strong style={{ color: 'var(--text)' }}> Nothing outside this window exists for the model.</strong>
          </ConceptBlock>

          <ComparisonTable accent={AC} headers={['Model', 'Context Window', 'Approx. Pages']} rows={[
            { label: '', cells: ['GPT-3.5', '4K tokens', '~3 pages'] },
            { label: '', cells: ['GPT-4', '8K–32K tokens', '~6–24 pages'] },
            { label: '', cells: ['GPT-4 Turbo', '128K tokens', '~96 pages'] },
            { label: '', cells: ['Claude 3', '200K tokens', '~150 pages'] },
            { label: '', cells: ['Gemini 1.5 Pro', '1M tokens', '~750 pages'] },
          ]} />

          <KeyPoint num={1} title="Context window is a hard limit" accent={AC}>
            You cannot "overflow" the context window. If your input exceeds the limit, the API will truncate it or return an error.
            There is no "extra memory" the model can access. Everything the model knows about your task must fit within this window.
          </KeyPoint>
        </SubSection>
      </RevealSection>

      {/* ── Why Context Size Matters ── */}
      <RevealSection>
        <SubSection title="Why context size matters: the O(n²) problem" accent={AC}>
          <ConceptBlock title="Attention scales quadratically" accent={AC}>
            Self-attention computes a score for every pair of tokens. With n tokens, that's n×n scores.
            Doubling the context <strong style={{ color: 'var(--text)' }}>quadruples</strong> the compute and memory.
            A 128K context requires 16 billion attention scores per layer — that's why long-context models are expensive.
          </ConceptBlock>

          <CodeExample accent={AC} code={`# Attention memory scales quadratically
# n = sequence length, d = model dimension

# 4K context:  4,000 × 4,000 = 16M scores per head per layer
# 128K context: 128,000 × 128,000 = 16.4B scores per head per layer
# That's 1000x more memory for 32x more tokens!

# This is why long context is expensive:
# - More GPU memory needed
# - More compute per token
# - Slower inference time`} />

          <KeyPoint num={1} title="KV Cache: the inference optimization" accent={AC}>
            During generation, the model doesn't recompute attention for all previous tokens every step.
            It caches the Key and Value matrices from previous tokens (the <strong style={{ color: 'var(--text)' }}>KV cache</strong>)
            and only computes Q for the new token. This makes generation O(n) instead of O(n²) per step —
            but the KV cache itself grows linearly with sequence length, consuming GPU memory.
          </KeyPoint>

          <KeyPoint num={2} title="Context = cost" accent={AC}>
            APIs charge per token for both input and output. A 128K input prompt costs ~$1.92 on GPT-4 Turbo
            before the model generates a single word. <strong style={{ color: 'var(--text)' }}>Always estimate token costs before sending large contexts.</strong>
          </KeyPoint>
        </SubSection>
      </RevealSection>

      {/* ── Lost in the Middle ── */}
      <RevealSection>
        <SubSection title="The 'lost in the middle' problem" accent={AC}>
          <AnalogyGrid items={[
            { emoji: '📉', title: 'U-shaped recall curve', desc: 'Research (Liu et al., 2023) shows LLMs recall information at the beginning and end of context well, but often miss information buried in the middle. This is true across all models.' },
            { emoji: '📄', title: 'A desk, not a brain', desc: 'An LLM can only work with what\'s on the desk right now. Old conversations, previous sessions, documents you didn\'t paste in — all invisible to the model.' },
            { emoji: '🎯', title: 'What to put in context', desc: 'Role definition, key facts, examples, current task. What NOT to include: irrelevant history, repeated instructions, raw unformatted dumps.' },
            { emoji: '⚖️', title: 'Less is often more', desc: 'Stuffing more context doesn\'t always help. Irrelevant context dilutes attention and can hurt performance. Be surgical about what you include.' },
          ]} />

          <WarningBox accent="#fb923c">
            <strong>Practical implication:</strong> Put the most important information at the beginning or end of your prompt.
            If you're using RAG, place retrieved documents before the question, not after. If instructions matter, repeat them at the end.
          </WarningBox>
        </SubSection>
      </RevealSection>

      {/* ── Context Engineering ── */}
      <RevealSection>
        <SubSection title="Context engineering: the new skill" accent={AC}>
          <ConceptBlock title="Prompt engineering is dead; context engineering is the future" accent={AC}>
            As models get smarter, writing clever prompts matters less. What matters is <strong style={{ color: 'var(--text)' }}>what information you put in the context</strong> and
            <strong style={{ color: 'var(--text)' }}> how you structure it</strong>. This is context engineering —
            the skill of assembling the right information, in the right order, with the right instructions.
          </ConceptBlock>

          <KeyPoint num={1} title="Structure your context deliberately" accent={AC}>
            Good context order: (1) System role and constraints, (2) Key facts and retrieved documents,
            (3) Conversation history, (4) The current question or task. This puts the most important
            information where the model has the strongest attention.
          </KeyPoint>

          <KeyPoint num={2} title="Use RAG instead of stuffing" accent={AC}>
            Don't paste your entire knowledge base into the context. Use retrieval to find the 3-5 most relevant
            chunks and include only those. This saves tokens, reduces noise, and often gives better answers.
          </KeyPoint>

          <KeyPoint num={3} title="Summarize old conversations" accent={AC}>
            In long chat sessions, periodically summarize earlier turns instead of keeping the full history.
            This preserves key information while freeing up context for new content.
          </KeyPoint>
        </SubSection>
      </RevealSection>

      {/* ── Live Demo ── */}
      <RevealSection>
        <DemoCard label="Live Demo — Context Window Visualizer" title="See how context fills up" desc="A 128K context window isn't infinite. Watch how different content types consume it.">
          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: '1rem' }}>
            <div style={{ position: 'relative', height: 40, background: 'var(--bg2)', borderRadius: 10, overflow: 'hidden', marginBottom: '1rem' }}>
              <div style={{
                height: '100%', borderRadius: 10, width: pct + '%',
                background: barColor, transition: 'width 1s cubic-bezier(.4,0,.2,1), background .3s',
                display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 12,
                fontSize: 13, fontFamily: "'DM Mono', monospace", color: '#fff',
              }}>
                {pct > 5 && pct.toFixed(1) + '%'}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              {[
                { label: 'System Prompt', val: ctx.sys, color: 'var(--accent)', bg: 'rgba(79,158,255,.04)', border: 'rgba(79,158,255,.3)' },
                { label: 'Conversation', val: ctx.conv, color: 'var(--accent2)', bg: 'rgba(167,139,250,.04)', border: 'rgba(167,139,250,.3)' },
                { label: 'Documents', val: ctx.docs, color: 'var(--accent3)', bg: 'rgba(52,211,153,.04)', border: 'rgba(52,211,153,.3)' },
                { label: 'Remaining', val: left, color: 'var(--accent4)', bg: 'rgba(251,146,60,.04)', border: 'rgba(251,146,60,.3)' },
              ].map(seg => (
                <div key={seg.label} style={{ flex: 1, minWidth: 130, padding: '.75rem', borderRadius: 10, border: `1px solid ${seg.border}`, background: seg.bg }}>
                  <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: '.25rem', color: seg.color, opacity: 0.8 }}>{seg.label}</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 600, fontFamily: "'DM Mono', monospace", color: seg.color }}>{seg.val.toLocaleString()}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>tokens used</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              {[
                { label: '+ System Prompt', action: () => addCtx('sys', 500) },
                { label: '+ 10 turns chat', action: () => addCtx('conv', 2000) },
                { label: '+ Upload PDF', action: () => addCtx('docs', 20000) },
                { label: '+ Paste codebase', action: () => addCtx('docs', 60000) },
              ].map(btn => (
                <button key={btn.label} onClick={btn.action} style={btnStyle}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--accent)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--accent)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border2)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text)'; }}
                >{btn.label}</button>
              ))}
              <button onClick={() => setCtx({ sys: 0, conv: 0, docs: 0 })} style={{ ...btnStyle, borderColor: 'rgba(244,114,182,.3)', color: 'var(--accent5)' }}>↺ Reset</button>
            </div>
            {pct > 80 && (
              <div style={{ padding: '.75rem 1rem', borderRadius: 10, background: 'rgba(251,146,60,.08)', border: '1px solid rgba(251,146,60,.25)', color: '#fb923c', fontSize: 13, animation: 'fadeIn .4s ease' }}>
                Context is over 80% full! The model may start losing track of earlier information. Consider using RAG instead of pasting everything.
              </div>
            )}
          </div>
        </DemoCard>
      </RevealSection>
    </section>
  );
}
