import { useState, useEffect, useRef } from 'react';
import {
  AnalogyGrid, DemoCard, RevealSection, SectionHeader, SubSection,
  ConceptBlock, CodeExample, WarningBox,
  RecapBox, PracticeQuestions, QuickSummary, MentalModel,
  StepBuilder, AnimatedPipeline,
} from './shared';

const MAX_CTX = 128000;
const AC = '#059669';

/* ─── Context Calculator ─── */

function ContextCalculator() {
  const [items, setItems] = useState<{ label: string; tokens: number }[]>([]);
  const total = items.reduce((s, i) => s + i.tokens, 0);
  const pct = Math.min((total / MAX_CTX) * 100, 100);
  const barColor = pct < 50 ? '#059669' : pct < 80 ? '#ea580c' : '#f87171';

  const presets = [
    { label: '+ Short Instruction', tokens: 200, icon: '📋' },
    { label: '+ Page of Text', tokens: 2500, icon: '📄' },
    { label: '+ 10 Chat Messages', tokens: 3000, icon: '💬' },
    { label: '+ PDF Document', tokens: 20000, icon: '📕' },
    { label: '+ Code File', tokens: 15000, icon: '💻' },
    { label: '+ Long Email Thread', tokens: 8000, icon: '✉️' },
  ];

  return (
    <div style={{ background: 'var(--primary)', border: '1px solid var(--border-dark)', color: 'var(--muted-dark-strong)', borderRadius: 12, padding: '1.25rem' }}>
      <div style={{ fontSize: 'var(--font-caption)', color: 'var(--muted)', fontFamily: 'var(--ff-mono)', marginBottom: '.75rem' }}>
        Add items to see how the context window fills up (128K limit):
      </div>

      <div style={{ position: 'relative', height: 40, background: 'var(--soft-stone)', borderRadius: 10, overflow: 'hidden', marginBottom: '1rem' }}>
        <div style={{
          height: '100%', borderRadius: 10, width: pct + '%',
          background: barColor, transition: 'width .8s cubic-bezier(.4,0,.2,1), background .3s',
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 12,
          fontSize: 'var(--font-body)', fontFamily: 'var(--ff-mono)', color: '#fff',
        }}>
          {pct > 5 && pct.toFixed(1) + '%'}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {presets.map((p, i) => (
          <button
            key={i}
            onClick={() => setItems(prev => [...prev, { label: p.icon + ' ' + p.label, tokens: p.tokens }])}
            style={{
              padding: '.4rem .7rem', borderRadius: 6, fontSize: 'var(--font-micro)',
              background: 'var(--soft-stone)', border: '1px solid var(--hairline)',
              color: 'var(--ink)', cursor: 'pointer', fontFamily: "var(--font-body)",
              transition: 'all .2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = AC; (e.currentTarget as HTMLButtonElement).style.color = AC; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--hairline)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--ink)'; }}
          >
            {p.icon} {p.label}
          </button>
        ))}
        <button
          onClick={() => setItems([])}
          style={{
            padding: '.4rem .7rem', borderRadius: 6, fontSize: 'var(--font-micro)',
            background: 'rgba(244,67,54,.1)', border: '1px solid rgba(244,67,54,.3)',
            color: '#f87171', cursor: 'pointer', fontFamily: "var(--font-body)",
          }}
        >↺ Reset</button>
      </div>

      {items.length > 0 && (
        <div style={{ marginBottom: '1rem', maxHeight: 150, overflowY: 'auto' }}>
          {items.map((item, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', padding: '.3rem .5rem',
              borderBottom: '1px solid var(--border)', fontSize: 'var(--font-caption)', fontFamily: 'var(--ff-mono)',
              color: 'var(--muted)', animation: 'fadeIn .2s ease',
            }}>
              <span>{item.label}</span>
              <span>{item.tokens.toLocaleString()} tokens</span>
            </div>
          ))}
          <div style={{
            display: 'flex', justifyContent: 'space-between', padding: '.4rem .5rem',
            fontSize: 'var(--font-caption)', fontFamily: 'var(--ff-mono)', fontWeight: 600,
            color: 'var(--ink)',
          }}>
            <span>Total</span>
            <span style={{ color: barColor }}>{total.toLocaleString()} / {MAX_CTX.toLocaleString()}</span>
          </div>
        </div>
      )}

      {pct > 80 && (
        <div style={{
          padding: '.65rem 1rem', borderRadius: 8,
          background: 'rgba(251,146,60,.08)', border: '1px solid rgba(251,146,60,.25)',
          color: '#ea580c', fontSize: 'var(--font-caption)', animation: 'fadeIn .4s ease',
        }}>
          ⚠️ Context is {pct.toFixed(0)}% full! The model may forget earlier information.
        </div>
      )}

      {items.length === 0 && (
        <div style={{ fontSize: 'var(--font-caption)', color: 'var(--muted)', textAlign: 'center', padding: '1rem 0' }}>
          Click the buttons above to add items to context
        </div>
      )}
    </div>
  );
}

/* ─── Conversation Simulator ─── */

function ConversationSimulator() {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const abortRef = useRef(false);

  const conversationFlow = [
    { role: 'System', text: 'You are a helpful assistant.' },
    { role: 'User', text: 'What is the capital of France?' },
    { role: 'Assistant', text: 'The capital of France is Paris.' },
    { role: 'User', text: 'Tell me about the Eiffel Tower.' },
    { role: 'Assistant', text: 'The Eiffel Tower is a wrought-iron lattice tower in Paris. It was built in 1889.' },
    { role: 'User', text: 'What are some good restaurants near it?' },
    { role: 'Assistant', text: 'There are many excellent restaurants near the Eiffel Tower, including Le Jules Verne inside the tower itself.' },
    { role: 'User', text: 'Can you translate the menu for me?' },
    { role: 'Assistant', text: 'Of course! Please share the menu and I\'ll translate it from French to English for you.' },
    { role: 'User', text: 'What about hotels nearby?' },
    { role: 'Assistant', text: 'Hotels near the Eiffel Tower include Pullman Paris Tour Eiffel, Hotel Mercure, and many boutique options.' },
  ];

  const simTokenCount = messages.length * 150;

  useEffect(() => {
    if (!isRunning) return;
    if (messages.length >= conversationFlow.length) {
      setIsRunning(false);
      return;
    }
    const t = setTimeout(() => {
      setMessages(prev => [...prev, conversationFlow[prev.length]]);
    }, 600);
    return () => clearTimeout(t);
  }, [isRunning, messages.length]);

  const startSim = () => {
    setMessages([]);
    abortRef.current = false;
    setIsRunning(true);
  };

  return (
    <div style={{ background: 'var(--primary)', border: '1px solid var(--border-dark)', color: 'var(--muted-dark-strong)', borderRadius: 12, padding: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.75rem' }}>
        <div style={{ fontSize: 'var(--font-caption)', color: 'var(--muted)', fontFamily: 'var(--ff-mono)' }}>
          Conversation simulator — each message adds ~150 tokens
        </div>
        <div style={{ fontFamily: 'var(--ff-mono)', fontSize: 'var(--font-micro)', color: simTokenCount > MAX_CTX * 0.8 ? '#ea580c' : 'var(--muted)' }}>
          {simTokenCount.toLocaleString()} tokens used
        </div>
      </div>

      <div style={{
        maxHeight: 200, overflowY: 'auto', marginBottom: '.75rem',
        background: 'var(--soft-stone)', borderRadius: 8, padding: '.5rem',
        border: '1px solid var(--border)',
      }}>
        {messages.length === 0 && (
          <div style={{ fontSize: 'var(--font-caption)', color: 'var(--muted)', textAlign: 'center', padding: '1.5rem 0' }}>
            Press "Start Conversation" to begin
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} style={{
            padding: '.35rem .6rem', marginBottom: '.25rem', borderRadius: 6,
            background: msg.role === 'User' ? 'rgba(24,99,220,.08)' : msg.role === 'System' ? 'rgba(124,58,237,.08)' : 'rgba(5,150,105,.08)',
            animation: 'fadeIn .3s ease',
          }}>
            <span style={{
              fontSize: 'var(--font-mono)', fontFamily: 'var(--ff-mono)', fontWeight: 600,
              color: msg.role === 'User' ? 'var(--accent)' : msg.role === 'System' ? 'var(--accent2)' : 'var(--accent3)',
            }}>
              {msg.role}
            </span>
            <span style={{ fontSize: 'var(--font-caption)', color: 'var(--muted)', marginLeft: '.5rem' }}>{msg.text}</span>
          </div>
        ))}
      </div>

      {!isRunning && messages.length === 0 && (
        <button onClick={startSim} style={{
          padding: '.5rem 1rem', borderRadius: 8, border: `1px solid ${AC}`,
          background: AC + '15', color: AC, fontSize: 'var(--font-caption)', cursor: 'pointer',
          fontFamily: "var(--font-body)",
        }}>▶ Start Conversation</button>
      )}

      {!isRunning && messages.length > 0 && messages.length < conversationFlow.length && (
        <button onClick={startSim} style={{
          padding: '.5rem 1rem', borderRadius: 8, border: `1px solid ${AC}`,
          background: AC + '15', color: AC, fontSize: 'var(--font-caption)', cursor: 'pointer',
          fontFamily: "var(--font-body)",
        }}>▶ Continue</button>
      )}

      {messages.length >= conversationFlow.length && (
        <div style={{ fontSize: 'var(--font-micro)', color: 'var(--accent3)', fontFamily: 'var(--ff-mono)' }}>
          ✓ Conversation complete. ~{(messages.length * 150).toLocaleString()} tokens used.
        </div>
      )}

      <div style={{
        marginTop: '.75rem', height: 6, background: 'var(--soft-stone)', borderRadius: 3, overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', width: `${Math.min((simTokenCount / MAX_CTX) * 100, 100)}%`,
          background: simTokenCount > MAX_CTX * 0.8 ? '#ea580c' : AC,
          borderRadius: 3, transition: 'width .5s ease',
        }} />
      </div>
    </div>
  );
}

export default function Session3Context() {
  return (
    <section id="s3" style={{ maxWidth: 900, margin: '0 auto', padding: '5rem 2rem' }}>
      <RevealSection>
        <SectionHeader num="03" tag="Session 3 · 1.5 hrs" title="The Context Window" accentColor={AC} borderColor="rgba(5,150,105,0.3)" />
        <p style={{ color: 'var(--muted)', maxWidth: 600, marginBottom: '2.5rem', fontSize: 'var(--font-body)' }}>
          Imagine a desk that can only hold <strong style={{ color: 'var(--ink)' }}>one page of paper</strong> at a time.
          You can't store anything else and look at it later. That's the context window — the LLM's entire working memory.
        </p>
      </RevealSection>

      {/* ── Analogy ── */}
      <RevealSection>
        <SubSection title="The Desk Analogy" accent={AC}>
          <ConceptBlock title="A Desk, Not a Brain" accent={AC}>
            Humans have long-term memory. LLMs have <strong style={{ color: 'var(--ink)' }}>NO memory</strong> between conversations.
            Each time you chat, it's a fresh desk. Everything it knows about your task must fit on that desk <strong style={{ color: 'var(--ink)' }}>right now</strong>.
            Context window = size of the desk.
          </ConceptBlock>

          <AnimatedPipeline accent={AC} stages={[
            { icon: '🪟', label: 'Empty Desk', desc: 'Fresh conversation, 0 tokens' },
            { icon: '📋', label: 'Add Instructions', desc: 'System prompt + rules' },
            { icon: '💬', label: 'Chat Messages', desc: 'Back and forth conversation' },
            { icon: '📕', label: 'Upload Documents', desc: 'PDFs, code, references' },
            { icon: '⚠️', label: 'Desk Gets Full', desc: 'Lost in the middle!' },
          ]} />

          <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid var(--border)', marginBottom: '1rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-body)' }}>
              <thead>
                <tr>
                  <th style={{ padding: '.75rem 1rem', textAlign: 'left', borderBottom: '1px solid var(--border-dark)', background: 'var(--primary)', color: 'var(--on-dark)', fontFamily: 'var(--ff-mono)', fontSize: 'var(--font-micro)' }}>Model</th>
                  <th style={{ padding: '.75rem 1rem', textAlign: 'left', borderBottom: '1px solid var(--border)', background: 'var(--primary)', color: AC, fontFamily: 'var(--ff-mono)', fontSize: 'var(--font-micro)' }}>Desk Size (tokens)</th>
                  <th style={{ padding: '.75rem 1rem', textAlign: 'left', borderBottom: '1px solid var(--border)', background: 'var(--primary)', color: AC, fontFamily: 'var(--ff-mono)', fontSize: 'var(--font-micro)' }}>Pages</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['GPT-3.5', '4,000', '~3 pages'],
                  ['GPT-4', '32,000', '~24 pages'],
                  ['GPT-4 Turbo', '128,000', '~96 pages'],
                  ['Claude 3', '200,000', '~150 pages'],
                  ['Gemini 1.5', '1,000,000', '~750 pages'],
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: i < 4 ? '1px solid var(--border)' : 'none' }}>
                    {row.map((cell, j) => (
                      <td key={j} style={{
                        padding: '.65rem 1rem', color: j === 0 ? 'var(--ink)' : 'var(--muted)',
                        fontWeight: j === 0 ? 500 : 400, fontSize: 'var(--font-body)',
                      }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SubSection>
      </RevealSection>

      {/* ── Hands-On Demos ── */}
      <RevealSection>
        <SubSection title="Hands-On: Fill the Desk Yourself" accent={AC}>
          <DemoCard
            label="Interactive Demo 1"
            title="Context Window Calculator"
            desc="Add items to see how fast the 128K context fills up."
          >
            <ContextCalculator />
          </DemoCard>

          <DemoCard
            label="Interactive Demo 2"
            title="Conversation Simulator"
            desc="Watch a real conversation eat through context, one message at a time."
          >
            <ConversationSimulator />
          </DemoCard>
        </SubSection>
      </RevealSection>

      {/* ── Why Context Size Matters ── */}
      <RevealSection>
        <SubSection title="Bigger Context = Much Higher Cost" accent={AC}>
          <ConceptBlock title="The O(n²) problem" accent={AC}>
            Remember attention? Every word checks every other word. With 1,000 words = 1M checks.
            With 128,000 words = <strong style={{ color: 'var(--ink)' }}>16 billion</strong> checks.
            Double the context → <strong style={{ color: 'var(--ink)' }}>4x the cost</strong>.
          </ConceptBlock>

          <CodeExample accent={AC} code={`// Attention cost explosion:
// 1K tokens → 1M connections
// 4K tokens → 16M connections
// 32K tokens → 1B connections
// 128K tokens → 16B connections

// Doubling tokens = QUADRUPLING cost!`} />

          <StepBuilder accent={AC} steps={[
            { label: 'The KV Cache trick', detail: 'During generation, the model caches Key and Value matrices from previous tokens. This means it only computes the new token\'s Query, making generation O(n) per step instead of O(n²). But the cache itself grows linearly with context length.' },
            { label: 'Context = Money', detail: 'APIs charge for both input AND output tokens. A 128K input on GPT-4 Turbo costs ~$1.92 before the model says a word. Always estimate token cost before sending large prompts.' },
          ]} />
        </SubSection>
      </RevealSection>

      {/* ── Lost in the Middle ── */}
      <RevealSection>
        <SubSection title="The 'Lost in the Middle' Problem" accent={AC}>
          <AnalogyGrid items={[
            { emoji: '📉', title: 'Remember the start and end', desc: 'Research shows LLMs remember info at the beginning and end of context really well — but often MISS info buried in the middle. Put important stuff first or last.' },
            { emoji: '🔄', title: 'No long-term memory', desc: 'An LLM can only work with what\'s on the desk right now. Yesterday\'s conversation? Gone. A document you didn\'t paste in? Invisible.' },
            { emoji: '🎯', title: 'Be surgical', desc: 'Don\'t dump everything in. Irrelevant info dilutes attention and can make answers WORSE. Include only what\'s needed.' },
          ]} />

          <WarningBox accent="#ea580c">
            <strong>Practical tip:</strong> Put the most important information at the <strong style={{ color: 'var(--ink)' }}>beginning or end</strong> of your prompt.
            If using RAG, place retrieved documents before the question. If instructions matter, repeat them at the end.
          </WarningBox>
        </SubSection>
      </RevealSection>

      {/* ── Context Engineering ── */}
      <RevealSection>
        <SubSection title="How to Use Context Wisely" accent={AC}>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem',
          }}>
            {[
              { title: 'Structure matters', emoji: '📋', desc: 'Instructions first, then facts/docs, then history, then question. Matches where attention is strongest.' },
              { title: 'Use RAG', emoji: '🔍', desc: 'Don\'t paste your whole database. Retrieve only 3-5 most relevant chunks.' },
              { title: 'Summarize history', emoji: '📝', desc: 'In long chats, summarize old turns into a short paragraph to free context.' },
              { title: 'Less is more', emoji: '✂️', desc: 'Irrelevant info dilutes attention. Be ruthless about what you include.' },
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
          'Context window = LLM\'s entire working memory (a desk, not a brain).',
          'Nothing outside the context window exists for the model.',
          'Larger context = much higher cost (double context = 4x compute).',
          'Models remember start and end better than middle.',
          'Structure context: instructions → facts → history → question.',
          'Use RAG + summarization to manage context efficiently.',
        ]} />
      </RevealSection>

      {/* ── Mental Model ── */}
      <RevealSection>
        <MentalModel
          emoji="🪟"
          title="Your Mental Model"
          desc="Think of the context window as a desk. You can only work with papers currently on your desk. Filed away yesterday? Can't access it. Every new conversation = clean desk. Everything needed must be placed on the desk right now."
          accent={AC}
        />
      </RevealSection>

      {/* ── 30-Second Summary ── */}
      <RevealSection>
        <QuickSummary
          accent={AC}
          summary="The context window is an LLM's working memory — a fixed-size desk. Everything must fit here. Larger windows cost much more (4x for 2x size). Models remember start and end best, losing info in the middle. Be surgical about what you put in context."
        />
      </RevealSection>

      {/* ── Practice Questions ── */}
      <RevealSection>
        <PracticeQuestions accent={AC} questions={[
          'What happens to information outside the context window?',
          'Why does doubling the context quadruple the cost?',
          'Where should you put the most important information? Why?',
          'What is one strategy to handle conversations longer than the context window?',
          'How many pages fit in GPT-4 Turbo\'s 128K context (approx)?',
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
            Since context is limited, we need a way to give the model <strong style={{ color: 'var(--ink)' }}>relevant information</strong>
            without filling the window. That's <strong style={{ color: 'var(--accent4)' }}>RAG</strong>.
          </div>
        </div>
      </RevealSection>
    </section>
  );
}
