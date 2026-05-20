import { useState, useRef } from 'react';
import {
  RevealSection, SectionHeader, SubSection,
  ConceptBlock, KeyPoint, FlowDiagram, InfoBox,
  RecapBox, PracticeQuestions, QuickSummary, MentalModel, BeforeAfter,
  StepBuilder, AnimatedPipeline,
} from './shared';

const AC = '#0891b2';

interface McpStep {
  role: 'user' | 'llm' | 'tool';
  text?: string;
  thinking?: boolean;
  name?: string;
  input?: string;
  output?: string;
}

interface McpTool {
  id: string;
  icon: string;
  name: string;
  color: string;
  tools: string[];
  scenario: string;
  steps: McpStep[];
}

const MCP_TOOLS: McpTool[] = [
  {
    id: 'gdrive', icon: '📁', name: 'Google Drive', color: '#1863dc',
    tools: ['list_files', 'read_file', 'search_files'],
    scenario: 'Find the Q2 report and summarize it',
    steps: [
      { role: 'user', text: 'Find the Q2 report and summarize it' },
      { role: 'llm', text: "I'll search Google Drive for the Q2 report.", thinking: true },
      { role: 'tool', name: 'Drive › search_files', input: 'query: "Q2 report 2024"', output: 'Found: "Q2_Sales_Report_Final.pdf"' },
      { role: 'tool', name: 'Drive › read_file', input: 'file_id: "1xKj8..."', output: '[PDF content: Q2 revenue ₹4.2Cr, up 18% YoY...]' },
      { role: 'llm', text: 'Q2 Results: Revenue ₹4.2 Cr (+18% YoY), top region: Hyderabad, churn reduced to 3.2%. Strong quarter!' },
    ],
  },
  {
    id: 'gmail', icon: '✉️', name: 'Gmail', color: '#e11d48',
    tools: ['search_emails', 'read_email', 'send_email'],
    scenario: 'What did the client say about the proposal?',
    steps: [
      { role: 'user', text: 'What did the client say about the proposal?' },
      { role: 'llm', text: "Let me search your emails for proposal threads.", thinking: true },
      { role: 'tool', name: 'Gmail › search_emails', input: 'query: "proposal" last_week: true', output: 'Found: "Re: AI Proposal" from ravi@acmecorp.in' },
      { role: 'tool', name: 'Gmail › read_email', input: 'id: "msg_18f2a..."', output: '"Looks good. One concern: data residency — can data stay in India? If yes, we can sign Friday."' },
      { role: 'llm', text: "Client is positive. Blocker: they need confirmation data stays in India. If confirmed, they'll sign by Friday." },
    ],
  },
  {
    id: 'gcal', icon: '📅', name: 'Calendar', color: '#059669',
    tools: ['list_events', 'create_event', 'find_free_time'],
    scenario: 'Schedule 6 training sessions for next week',
    steps: [
      { role: 'user', text: 'Schedule all 6 LLM training sessions for next week' },
      { role: 'llm', text: "I'll check everyone's availability.", thinking: true },
      { role: 'tool', name: 'Calendar › find_free_time', input: 'team@co.in, 90min each, next week', output: 'Free slots: Mon-Fri, 10am & 2pm' },
      { role: 'tool', name: 'Calendar › create_event', input: '6 events, 90min each, team@co.in', output: '✓ 6 events created. Invites sent.' },
      { role: 'llm', text: 'Done! Mon 10am (Session 1), Tue 2pm (Session 2)... Invites sent to everyone.' },
    ],
  },
];

/* ─── MCP Tool Runner Demo (inline) ─── */

function McpToolRunner() {
  const [activeTool, setActiveTool] = useState(0);
  const [running, setRunning] = useState(false);
  const [steps, setSteps] = useState<McpStep[]>([]);
  const [btnLabel, setBtnLabel] = useState('▶ Run demo');
  const abortRef = useRef(false);

  const selectTool = (i: number) => {
    abortRef.current = true;
    setActiveTool(i);
    setSteps([]);
    setBtnLabel('▶ Run demo');
    setRunning(false);
  };

  const runDemo = async () => {
    if (running) return;
    abortRef.current = false;
    setRunning(true);
    setSteps([]);
    setBtnLabel('⏳ Running...');
    const tool = MCP_TOOLS[activeTool];
    for (const step of tool.steps) {
      if (abortRef.current) break;
      await new Promise(r => setTimeout(r, 700));
      if (abortRef.current) break;
      setSteps(prev => [...prev, step]);
    }
    setBtnLabel('↺ Run again');
    setRunning(false);
  };

  const tool = MCP_TOOLS[activeTool];

  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <div style={{ fontSize: 'var(--font-caption)', color: 'var(--muted)', fontFamily: 'var(--font-mono)', marginBottom: '1rem' }}>
        Pick a service and watch the full loop: question → reasoning → tool calls → answer
      </div>
      <div style={{
        background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14,
        padding: '1.25rem',
      }}>
        <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          {MCP_TOOLS.map((t, i) => (
            <button
              key={i}
              onClick={() => selectTool(i)}
              style={{
                padding: '.45rem 1rem', borderRadius: 8,
                border: activeTool === i ? `1px solid ${t.color}` : '1px solid var(--border)',
                background: activeTool === i ? t.color + '10' : 'var(--bg3)',
                color: activeTool === i ? t.color : 'var(--muted)',
                fontSize: 'var(--font-body)', cursor: 'pointer', fontFamily: "var(--font-body)", transition: 'all .2s',
              }}
            >
              {t.icon} {t.name}
            </button>
          ))}
        </div>

        <div style={{
          fontSize: 'var(--font-body)', color: 'var(--muted)', marginBottom: '1rem',
          padding: '.65rem 1rem', background: 'var(--bg3)', borderRadius: 8, border: '1px solid var(--border)',
        }}>
          💬 {tool.scenario}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.4rem', marginBottom: '1.25rem' }}>
          {tool.tools.map(t => (
            <span key={t} style={{
              fontSize: 'var(--font-micro)', fontFamily: 'var(--font-mono)', padding: '2px 10px', borderRadius: 100,
              background: `${tool.color}15`, border: `1px solid ${tool.color}40`, color: tool.color,
            }}>{t}</span>
          ))}
        </div>

        <div style={{
          minHeight: 200, maxHeight: 340, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '.75rem',
          marginBottom: '1rem', padding: '.5rem 0',
        }}>
          {steps.length === 0 && (
            <div style={{ color: 'var(--muted)', fontSize: 'var(--font-body)', textAlign: 'center', padding: '2rem 0' }}>Press Run to start the demo</div>
          )}
          {steps.map((step, i) => (
            <div key={i} style={{ animation: 'fadeUp .3s ease both' }}>
              {step.role === 'user' && (
                <>
                  <div style={{ fontSize: 'var(--font-micro)', fontFamily: 'var(--font-mono)', letterSpacing: 'var(--ls-wide)', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '.3rem' }}>You</div>
                  <div style={{ fontSize: 'var(--font-body)', lineHeight: 'var(--lh-normal)', background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--muted)', borderRadius: 10, padding: '.65rem .9rem' }}>{step.text}</div>
                </>
              )}
              {step.role === 'llm' && (
                <>
                  <div style={{ fontSize: 'var(--font-micro)', fontFamily: 'var(--font-mono)', letterSpacing: 'var(--ls-wide)', textTransform: 'uppercase', color: 'var(--accent2)', marginBottom: '.3rem' }}>
                    {step.thinking ? '🤔 Thinking' : '🤖 LLM'}
                  </div>
                  <div style={{ fontSize: 'var(--font-body)', lineHeight: 'var(--lh-normal)', background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 10, padding: '.65rem .9rem', whiteSpace: 'pre-wrap' }}>{step.text}</div>
                </>
              )}
              {step.role === 'tool' && (
                <>
                  <div style={{ fontSize: 'var(--font-micro)', fontFamily: 'var(--font-mono)', letterSpacing: 'var(--ls-wide)', textTransform: 'uppercase', color: tool.color, marginBottom: '.3rem' }}>⚙️ {step.name}</div>
                  <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', fontSize: 'var(--font-caption)', fontFamily: 'var(--font-mono)' }}>
                    <div style={{ display: 'flex', gap: '.75rem', padding: '.5rem .9rem', borderBottom: '1px solid var(--border)' }}>
                      <span style={{ color: 'var(--muted)', flexShrink: 0, width: 46 }}>input</span>
                      <span style={{ color: 'var(--text)', lineHeight: 'var(--lh-snug)' }}>{step.input}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '.75rem', padding: '.5rem .9rem' }}>
                      <span style={{ color: 'var(--muted)', flexShrink: 0, width: 46 }}>output</span>
                      <span style={{ color: 'var(--accent3)', lineHeight: 'var(--lh-snug)' }}>{step.output}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={() => { if (!running) runDemo(); }}
          style={{
            padding: '.6rem 1.4rem', borderRadius: 9, border: `1px solid ${tool.color}`,
            background: `${tool.color}10`, color: tool.color, fontSize: 'var(--font-body)', cursor: 'pointer',
            fontFamily: "var(--font-body)", fontWeight: 500, transition: 'all .2s',
          }}
          onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = `${tool.color}20`}
          onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = `${tool.color}10`}
        >
          {btnLabel}
        </button>
      </div>
    </div>
  );
}

export default function Session6MCP() {
  return (
    <section id="s6" style={{ maxWidth: 960, margin: '0 auto', padding: '4rem 2rem 6rem' }}>
      {/* ── Header + Intro ── */}
      <RevealSection>
        <SectionHeader num="06" tag="Session 6 · 1 hr" title="Giving the LLM Hands" accentColor={AC} borderColor={`${AC}44`} />
        <p style={{ color: 'var(--muted)', maxWidth: 640, fontSize: 'var(--font-body-lg)', lineHeight: 'var(--lh-relaxed)' }}>
          An LLM can <em>talk</em> about anything, but it can&apos;t <em>do</em> anything. It can tell you how to send an email, but it can&apos;t click &ldquo;send.&rdquo;
          <strong style={{ color: 'var(--text)' }}> MCP</strong> (Model Context Protocol) gives the LLM actual hands.
        </p>
      </RevealSection>

      {/* ── The Analogy ── */}
      <RevealSection style={{ marginBottom: '4rem' }}>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--font-heading)', color: 'var(--text)', marginBottom: '1rem', marginTop: 0 }}>
          A Consultant Who Can Only Talk
        </p>
        <p style={{ color: 'var(--muted)', fontSize: 'var(--font-body-lg)', lineHeight: 'var(--lh-relaxed)', maxWidth: 640, marginBottom: '2rem' }}>
          Imagine a brilliant consultant who gives amazing advice — but has <strong style={{ color: 'var(--text)' }}>no arms or legs</strong>.
          They can tell you exactly how to book a meeting, but they can&apos;t do it themselves.
          <strong style={{ color: 'var(--text)' }}> MCP gives them hands.</strong>
        </p>
        <BeforeAfter
          accent={AC}
          before="Without MCP: 'Here is how to book a meeting...' (you still have to do it)"
          after="With MCP: 'I have booked the meeting, sent invites, and added a reminder.' (it just did it)"
        />
      </RevealSection>

      {/* ── The Problem ── */}
      <RevealSection style={{ marginBottom: '4rem' }}>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--font-heading)', color: 'var(--text)', marginBottom: '1rem', marginTop: 0 }}>
          Why This Matters
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          {[
            { title: 'USB-C for AI tools', desc: 'Before MCP, every AI integration was custom-built. MCP is a universal connector — build one server, any AI client can use it.' },
            { title: 'Tools = Actions', desc: 'MCP servers give the LLM actions: search_emails, create_event, read_file. The LLM decides when to use each tool.' },
            { title: 'You stay in control', desc: 'The LLM can only use tools you give it. You see every action it takes. Nothing happens without an explicit tool call.' },
            { title: 'From talk to action', desc: 'A base LLM tells you how. An MCP-connected LLM actually DOES it. This is the big shift.' },
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

      {/* ── Architecture ── */}
      <RevealSection style={{ marginBottom: '4rem' }}>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--font-heading)', color: 'var(--text)', marginBottom: '1rem', marginTop: 0 }}>
          How It Works
        </p>
        {/* Architecture diagram */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 40px 1fr 40px 1fr',
          alignItems: 'center', gap: '.5rem',
          background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.5rem',
          marginBottom: '2rem',
        }}>
          {[
            { icon: '👤', title: 'You', desc: 'Ask in plain English' },
            null,
            { icon: '🤖', title: 'LLM', desc: 'Decides which tool to call' },
            null,
            { icon: '⚙️', title: 'MCP Server', desc: 'Gmail · Drive · Calendar' },
          ].map((item, i) => item ? (
            <div key={i} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.6rem', marginBottom: '.4rem' }}>{item.icon}</div>
              <div style={{ fontSize: 'var(--font-body)', fontWeight: 500, marginBottom: '.25rem', color: 'var(--text)' }}>{item.title}</div>
              <div style={{ fontSize: 'var(--font-micro)', color: 'var(--muted)', lineHeight: 'var(--lh-snug)' }}>{item.desc}</div>
            </div>
          ) : (
            <div key={i} style={{ textAlign: 'center', fontSize: '1.2rem', color: 'var(--muted)' }}>⇄</div>
          ))}
        </div>

        <FlowDiagram accent={AC} steps={[
          { label: 'You Ask', sub: 'Natural language' },
          { label: 'LLM Decides', sub: 'Which tool to call' },
          { label: 'Tool Runs', sub: 'Action happens' },
          { label: 'Result Back', sub: 'LLM continues' },
        ]} />
      </RevealSection>

      {/* ── Playground ── */}
      <RevealSection>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--font-heading)', color: 'var(--text)', marginBottom: '.5rem', marginTop: 0 }}>
          The Playground
        </p>
        <p style={{ color: 'var(--muted)', fontSize: 'var(--font-caption)', fontFamily: 'var(--font-mono)', marginBottom: '2rem', letterSpacing: 'var(--ls-wide)', textTransform: 'uppercase' }}>
          Watch the LLM think, call tools, and complete tasks
        </p>

        <McpToolRunner />
      </RevealSection>

      {/* ── Multi-Tool Chaining ── */}
      <RevealSection style={{ marginBottom: '4rem' }}>
        <SubSection title="Chaining Tools: A Real Workflow" accent={AC}>
          <ConceptBlock title="Multiple tools, one goal" accent={AC}>
            The real power of MCP is <strong style={{ color: 'var(--text)' }}>chaining</strong> — using multiple tools in sequence.
            Search Drive → read file → draft reply → send email. The LLM orchestrates the whole flow.
          </ConceptBlock>

          <StepBuilder accent={AC} steps={[
            { label: 'Step 1: You ask "What did the client say about the Q2 proposal?"', detail: 'The LLM needs to search for relevant emails first.' },
            { label: 'Step 2: LLM calls search_emails to find proposal threads', detail: 'Gmail search finds: "Re: Q2 Proposal" from ravi@acmecorp.in, dated yesterday.' },
            { label: 'Step 3: LLM reads the email content', detail: 'read_email returns: "Looks good. Concern about data residency. Can data stay in India?"' },
            { label: 'Step 4: LLM formulates answer AND suggests next action', detail: 'Answer: "Client is positive. They need confirmation about data residency in India. Want me to draft a reply?"' },
          ]} />

          <AnimatedPipeline accent={AC} stages={[
            { icon: '...', label: 'You Ask', desc: 'In plain English' },
            { icon: '...', label: 'LLM Plans', desc: 'Decides tool order' },
            { icon: '...', label: 'Search', desc: 'Finds relevant data' },
            { icon: '...', label: 'Read', desc: 'Gets the content' },
            { icon: '...', label: 'Draft', desc: 'Writes the reply' },
            { icon: '...', label: 'Send', desc: 'Completes the action' },
          ]} />
        </SubSection>
      </RevealSection>

      {/* ── Tools vs Resources ── */}
      <RevealSection style={{ marginBottom: '4rem' }}>
        <SubSection title="Tools, Resources, and Prompts" accent={AC}>
          <div style={{ overflowX: 'auto', borderRadius: 14, border: '1px solid var(--border)', marginBottom: '1rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-body)' }}>
              <thead>
                <tr>
                  <th style={{ padding: '.75rem 1rem', textAlign: 'left', borderBottom: '1px solid var(--border)', background: 'var(--bg2)', color: 'var(--text)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-micro)' }}>Type</th>
                  <th style={{ padding: '.75rem 1rem', textAlign: 'left', borderBottom: '1px solid var(--border)', background: 'var(--bg2)', color: AC, fontFamily: 'var(--font-mono)', fontSize: 'var(--font-micro)' }}>What it does</th>
                  <th style={{ padding: '.75rem 1rem', textAlign: 'left', borderBottom: '1px solid var(--border)', background: 'var(--bg2)', color: AC, fontFamily: 'var(--font-mono)', fontSize: 'var(--font-micro)' }}>Example</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Tool', 'A function the model can call', 'search_emails, create_event'],
                  ['Resource', 'Data the model can read', 'file://report.pdf, db://users'],
                  ['Prompt', 'A reusable template', 'code-review, summarize-doc'],
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
                    {row.map((cell, j) => (
                      <td key={j} style={{
                        padding: '.65rem 1rem', color: j === 0 ? 'var(--text)' : 'var(--muted)',
                        fontWeight: j === 0 ? 500 : 400, fontSize: 'var(--font-body)',
                      }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <InfoBox accent={AC}>
            <strong style={{ color: 'var(--text)' }}>Key distinction:</strong> Tools have side effects (send email, create file).
            Resources are read-only (read document, query data).
            The model chooses when to call tools; the application can attach resources proactively.
          </InfoBox>
        </SubSection>
      </RevealSection>

      {/* ── Recap + Mental Model ── */}
      <RevealSection>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 300px' }}>
            <RecapBox accent={AC} items={[
              "LLMs can talk but can't act — MCP gives them \"hands\" (tools).",
              'You ask → LLM decides which tool to call → tool runs → result comes back.',
              'The LLM can chain multiple tools: search, read, summarize, send.',
              'MCP is an open standard — like USB-C for AI tools.',
              'You stay in control: the LLM can only use tools you give it.',
              'Build your own MCP server to connect internal tools to any LLM.',
            ]} />
          </div>
          <div style={{ flex: '1 1 300px' }}>
            <MentalModel
              emoji="🦾"
              title="Your Mental Model"
              desc="Think of MCP as giving a brilliant consultant arms and legs. Before MCP, they could tell you exactly what to do but couldn't do it themselves. With MCP, they can send emails, read files, book meetings — all by themselves. You just ask, and they handle the execution."
              accent={AC}
            />
          </div>
        </div>
      </RevealSection>

      {/* ── Quick Summary ── */}
      <RevealSection>
        <QuickSummary
          accent={AC}
          summary="MCP connects LLMs to real-world tools (email, Drive, calendar, databases). The LLM decides which tool to call, calls it, gets the result, and continues. It can chain multiple tools together. MCP is an open standard — build one server, any AI can use it. This turns LLMs from talkers into doers."
        />
      </RevealSection>

      {/* ── Practice Questions ── */}
      <RevealSection>
        <PracticeQuestions accent={AC} questions={[
          "What problem does MCP solve? Why can't a normal LLM send an email?",
          'Walk through the steps: what happens when you ask "Schedule a meeting for tomorrow at 3pm"?',
          'What is the difference between MCP and old-style function calling?',
          'Why is MCP described as "USB-C for AI tools"?',
          'Give an example of a multi-step workflow using multiple MCP tools.',
        ]} />
      </RevealSection>

      {/* ── What Next ── */}
      <RevealSection>
        <div style={{
          padding: '1.25rem', borderRadius: 12,
          background: 'var(--bg2)', border: '1px solid var(--border)', marginBottom: '1rem',
        }}>
          <div style={{ fontSize: 'var(--font-micro)', fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 'var(--ls-wide)', marginBottom: '.5rem' }}>You've Completed All 6 Sessions!</div>
          <div style={{ fontSize: 'var(--font-body)', color: 'var(--muted)', lineHeight: 'var(--lh-normal)' }}>
            You now understand the full stack: what an LLM is (token predictor), how it connects words (attention),
            its limitations (context window), how to give it facts (RAG), how to talk to it (prompting),
            and how to give it tools (MCP).
            <br /><br />
            <strong style={{ color: 'var(--text)' }}>What to learn next:</strong> Try building an actual RAG pipeline with LangChain.
            Set up MCP servers for your own tools. Experiment with different prompting techniques.
            The best way to learn is to build.
          </div>
        </div>
      </RevealSection>
    </section>
  );
}
