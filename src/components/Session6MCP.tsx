import { useState, useRef } from 'react';
import { AnalogyGrid, DemoCard, RevealSection, SectionHeader, SubSection, ConceptBlock, KeyPoint, CodeExample, FlowDiagram, InfoBox, ComparisonTable } from './shared';

const AC = '#63dcb4';

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
    id: 'gdrive', icon: '📁', name: 'Google Drive', color: '#4f9eff',
    tools: ['list_files', 'read_file', 'search_files', 'create_file'],
    scenario: 'Find the Q2 report and summarize it',
    steps: [
      { role: 'user', text: 'Find the Q2 report and summarize it' },
      { role: 'llm', text: "I'll search Google Drive for the Q2 report.", thinking: true },
      { role: 'tool', name: 'gdrive › search_files', input: 'query: "Q2 report 2024"', output: 'Found: "Q2_Sales_Report_Final.pdf" (2.1MB, modified Jun 12)' },
      { role: 'tool', name: 'gdrive › read_file', input: 'file_id: "1xKj8..."', output: '[PDF content: Q2 revenue ₹4.2Cr, up 18% YoY. Top region: Hyderabad. Churn reduced to 3.2%...]' },
      { role: 'llm', text: 'Q2 Results Summary:\n• Revenue: ₹4.2 Cr (+18% YoY)\n• Top region: Hyderabad\n• Churn: 3.2% (down from 4.1%)\n\nStrong quarter driven by enterprise deals in Telangana.' },
    ],
  },
  {
    id: 'gmail', icon: '✉️', name: 'Gmail', color: '#f472b6',
    tools: ['search_emails', 'read_email', 'send_email', 'list_labels'],
    scenario: 'What did the client say about the proposal?',
    steps: [
      { role: 'user', text: 'What did the client say about the proposal?' },
      { role: 'llm', text: "Let me search your emails for recent proposal threads.", thinking: true },
      { role: 'tool', name: 'gmail › search_emails', input: 'query: "proposal" newer_than:7d', output: '3 results: "Re: AI Integration Proposal" from ravi@acmecorp.in (2h ago)' },
      { role: 'tool', name: 'gmail › read_email', input: 'id: "msg_18f2a..."', output: 'Subject: Re: AI Integration Proposal\nFrom: ravi@acmecorp.in\n\n"Looks good overall. One concern: data residency — can you confirm all data stays in India? If yes, we can sign by Friday."' },
      { role: 'llm', text: "The client (Ravi, Acme Corp) is positive on the proposal. One blocker: they need confirmation that data stays within India. If you can confirm this, they're ready to sign by Friday." },
    ],
  },
  {
    id: 'gcal', icon: '📅', name: 'Google Calendar', color: '#34d399',
    tools: ['list_events', 'create_event', 'find_free_time', 'update_event'],
    scenario: 'Schedule all 6 training sessions for the team',
    steps: [
      { role: 'user', text: 'Schedule all 6 LLM training sessions for our team next week' },
      { role: 'llm', text: "I'll check everyone's availability and book the sessions.", thinking: true },
      { role: 'tool', name: 'gcal › find_free_time', input: 'attendees: team@co.in, duration: 90min, next_week: true', output: 'Common free slots: Mon 10am, Tue 2pm, Wed 10am, Thu 2pm, Fri 10am, Fri 2pm' },
      { role: 'tool', name: 'gcal › create_event', input: '6 events: "LLM Training S1–S6", Mon–Fri+Fri, 90min each, team@co.in', output: '✓ 6 events created. Invites sent to 12 attendees.' },
      { role: 'llm', text: 'Done! Scheduled all 6 sessions:\n• Mon 10am – What is an LLM?\n• Tue 2pm – Attention & Transformers\n• Wed 10am – Context Window\n• Thu 2pm – RAG\n• Fri 10am – Prompting\n• Fri 2pm – MCP & Tools\n\nCalendar invites sent to the whole team.' },
    ],
  },
];

export default function Session6MCP() {
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
    <section id="s6" style={{ maxWidth: 900, margin: '0 auto', padding: '5rem 2rem' }}>
      <RevealSection>
        <SectionHeader num="06" tag="Session 6 · 1 hr" title="MCP — Model Context Protocol" accentColor={AC} borderColor="rgba(99,220,180,0.3)" />
        <p style={{ color: 'var(--muted)', maxWidth: 600, marginBottom: '2.5rem', fontSize: 15 }}>
          LLMs are powerful but isolated. MCP is the open standard that lets them reach out and
          <strong style={{ color: 'var(--text)' }}> actually do things</strong> — read files, send emails,
          book meetings, query databases. It bridges the gap between language understanding and real-world action.
        </p>
      </RevealSection>

      {/* ── The Problem MCP Solves ── */}
      <RevealSection>
        <SubSection title="The problem: LLMs are trapped in a text box" accent={AC}>
          <ConceptBlock title="From knowing to doing" accent={AC}>
            An LLM can tell you <em>how</em> to book a meeting, but it can't actually book it.
            It can explain a database query, but can't run it. Every real-world action requires a human in the loop.
            <strong style={{ color: 'var(--text)' }}> MCP eliminates this bottleneck</strong> by giving the model
            a standardized way to invoke external tools.
          </ConceptBlock>

          <AnalogyGrid items={[
            { emoji: '🔌', title: 'USB-C for AI tools', desc: 'Before MCP, every AI integration was custom-built. MCP is a universal connector standard — build one server, any AI client can plug in. Like USB-C replaced 10 different cables.' },
            { emoji: '🗂️', title: 'Tools, Resources, Prompts', desc: 'MCP servers expose three things: Tools (functions to call), Resources (data to read), and Prompts (reusable templates). The LLM decides when and how to use them.' },
            { emoji: '🔒', title: 'You stay in control', desc: 'The LLM can only use tools the server exposes. You see every tool call. Nothing happens without the model explicitly invoking it — no hidden background actions.' },
            { emoji: '🧠', title: 'From knowing to doing', desc: 'A base LLM can tell you how to book a meeting. An MCP-connected LLM can actually book it. The protocol bridges the gap between language and action.' },
          ]} />
        </SubSection>
      </RevealSection>

      {/* ── How MCP Works ── */}
      <RevealSection>
        <SubSection title="How MCP works: the architecture" accent={AC}>
          <ConceptBlock title="Client-server protocol" accent={AC}>
            MCP follows a client-server model. The <strong style={{ color: 'var(--text)' }}>MCP client</strong> lives inside
            the AI application (e.g., Claude Desktop, Cursor). The <strong style={{ color: 'var(--text)' }}>MCP server</strong> is
            a lightweight process that wraps your tools, data, or APIs. They communicate over a standard protocol using JSON-RPC.
          </ConceptBlock>

          {/* Architecture diagram */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 40px 1fr 40px 1fr',
            alignItems: 'center', gap: '.5rem',
            background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.5rem',
            marginBottom: '1.5rem',
          }}>
            {[
              { icon: '👤', title: 'You', desc: 'Ask a question in natural language', border: 'var(--border2)' },
              null,
              { icon: '🤖', title: 'LLM (Claude)', desc: 'Decides which tools to call and in what order', border: 'rgba(167,139,250,.4)' },
              null,
              { icon: '⚙️', title: 'MCP Servers', desc: 'Gmail · Drive · Calendar · Slack · Notion · DBs…', border: 'rgba(99,220,180,.4)' },
            ].map((item, i) => item ? (
              <div key={i} style={{ background: 'var(--bg3)', border: `1px solid ${item.border}`, borderRadius: 12, padding: '1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.6rem', marginBottom: '.4rem' }}>{item.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: '.25rem', color: 'var(--text)' }}>{item.title}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.4 }}>{item.desc}</div>
              </div>
            ) : (
              <div key={i} style={{ textAlign: 'center', fontSize: '1.2rem', color: 'var(--muted)' }}>⇄</div>
            ))}
          </div>

          <KeyPoint num={1} title="The tool-calling loop" accent={AC}>
            When the LLM decides to call a tool, it outputs a structured tool-call request (tool name + arguments).
            The MCP client routes this to the appropriate server, which executes it and returns the result.
            The result gets added to the conversation, and the LLM continues — potentially calling more tools.
          </KeyPoint>

          <KeyPoint num={2} title="Multiple servers, one conversation" accent={AC}>
            A single conversation can use multiple MCP servers simultaneously. Claude can read a file from Google Drive,
            check your calendar, and send an email — all in one turn, with the results feeding into each other.
          </KeyPoint>
        </SubSection>
      </RevealSection>

      {/* ── Tools vs Resources vs Prompts ── */}
      <RevealSection>
        <SubSection title="Tools, Resources, and Prompts" accent={AC}>
          <ComparisonTable accent={AC} headers={['Type', 'What it does', 'Example', 'Model action']} rows={[
            { label: '', cells: ['Tool', 'A function the model can call', 'search_emails, create_event', 'Actively invokes with arguments'] },
            { label: '', cells: ['Resource', 'Data the model can read', 'file://report.pdf, db://users', 'Reads like a file — passive'] },
            { label: '', cells: ['Prompt', 'A reusable prompt template', 'code-review, summarize-doc', 'Fills in template variables'] },
          ]} />

          <InfoBox accent={AC}>
            <strong style={{ color: 'var(--text)' }}>Key distinction:</strong> Tools have side effects (sending an email, creating a file).
            Resources are read-only (reading a document, querying a view). The model chooses when to call tools;
            the application can proactively attach resources to context.
          </InfoBox>
        </SubSection>
      </RevealSection>

      {/* ── MCP vs Function Calling ── */}
      <RevealSection>
        <SubSection title="MCP vs function calling: why MCP wins at scale" accent={AC}>
          <ComparisonTable accent={AC} headers={['Property', 'Function Calling', 'MCP']} rows={[
            { label: '', cells: ['Where tools are defined', 'In the prompt / API call', 'On the server — persistent'] },
            { label: '', cells: ['Cross-model support', 'No — each model has its own format', 'Yes — any MCP-compatible model'] },
            { label: '', cells: ['Tool discovery', 'You list all tools every call', 'Client discovers tools from server'] },
            { label: '', cells: ['State management', 'Stateless — each call is independent', 'Stateful — server maintains context'] },
            { label: '', cells: ['Ecosystem', 'Build your own every time', 'Hundreds of pre-built servers'] },
            { label: '', cells: ['Scalability', 'Breaks down with many tools', 'Scales — servers manage their own tools'] },
          ]} />

          <AnalogyGrid items={[
            { emoji: '⚡', title: 'Agentic workflows', desc: 'Chain multiple tool calls together. Claude can search Drive → read a doc → summarize → draft a reply → send it — all in one prompt, no human steps in between.' },
            { emoji: '🔗', title: 'Open standard', desc: 'MCP is open-source and published by Anthropic. Any developer can build an MCP server. Hundreds already exist: GitHub, Postgres, Jira, Figma, Linear, Stripe…' },
            { emoji: '🏗️', title: 'Build your own server', desc: 'Any REST API can become an MCP server in ~50 lines of Python. pip install mcp and expose your internal tools to Claude.' },
            { emoji: '🔒', title: 'Security model', desc: 'The LLM proposes tool calls; the client approves them. Sensitive operations (deleting data, sending emails) can require human confirmation. You control the blast radius.' },
          ]} />
        </SubSection>
      </RevealSection>

      {/* ── Live Demo ── */}
      <RevealSection>
        <DemoCard label="Live Demo — MCP Tool Call Simulator" title="Watch Claude reason + call real tools" desc="Pick a connected service and see the full loop: your question → Claude's reasoning → tool calls → final answer.">
          <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
            {MCP_TOOLS.map((t, i) => (
              <button
                key={i}
                onClick={() => selectTool(i)}
                style={{
                  padding: '.45rem 1rem', borderRadius: 8,
                  border: activeTool === i ? `1px solid ${t.color}` : '1px solid var(--border2)',
                  background: activeTool === i ? t.color + '10' : 'var(--bg3)',
                  color: activeTool === i ? t.color : 'var(--muted)',
                  fontSize: 13, cursor: 'pointer', fontFamily: "'Outfit', sans-serif", transition: 'all .2s',
                }}
              >
                {t.icon} {t.name}
              </button>
            ))}
          </div>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: '1rem', padding: '.65rem 1rem', background: 'var(--bg3)', borderRadius: 8, border: '1px solid var(--border)' }}>
            💬 {tool.scenario}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.4rem', marginBottom: '1.25rem' }}>
            {tool.tools.map(t => (
              <span key={t} style={{
                fontSize: 11, fontFamily: "'DM Mono', monospace", padding: '2px 10px', borderRadius: 100,
                background: `${tool.color}15`, border: `1px solid ${tool.color}40`, color: tool.color,
              }}>{t}</span>
            ))}
          </div>
          <div style={{ minHeight: 200, maxHeight: 340, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '.75rem', marginBottom: '1rem', padding: '.5rem 0' }}>
            {steps.length === 0 && (
              <div style={{ color: 'var(--muted)', fontSize: 13, textAlign: 'center', padding: '2rem 0' }}>Press Run to start the demo</div>
            )}
            {steps.map((step, i) => (
              <div key={i} style={{ animation: 'fadeUp .3s ease both' }}>
                {step.role === 'user' && (
                  <>
                    <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '.3rem' }}>You</div>
                    <div style={{ fontSize: 13, lineHeight: 1.6, background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 10, padding: '.65rem .9rem', color: 'var(--text)' }}>{step.text}</div>
                  </>
                )}
                {step.role === 'llm' && (
                  <>
                    <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--accent2)', marginBottom: '.3rem' }}>
                      {step.thinking ? '🤔 Thinking' : '🤖 Claude'}
                    </div>
                    <div style={{ fontSize: 13, lineHeight: 1.6, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '.65rem .9rem', whiteSpace: 'pre-wrap', color: 'var(--text)' }}>{step.text}</div>
                  </>
                )}
                {step.role === 'tool' && (
                  <>
                    <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", letterSpacing: '.06em', textTransform: 'uppercase', color: tool.color, marginBottom: '.3rem' }}>⚙️ {step.name}</div>
                    <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', fontSize: 12, fontFamily: "'DM Mono', monospace" }}>
                      <div style={{ display: 'flex', gap: '.75rem', padding: '.5rem .9rem', borderBottom: '1px solid var(--border)' }}>
                        <span style={{ color: 'var(--muted)', flexShrink: 0, width: 46 }}>input</span>
                        <span style={{ color: 'var(--text)', lineHeight: 1.5 }}>{step.input}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '.75rem', padding: '.5rem .9rem' }}>
                        <span style={{ color: 'var(--muted)', flexShrink: 0, width: 46 }}>output</span>
                        <span style={{ color: 'var(--accent3)', lineHeight: 1.5 }}>{step.output}</span>
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
              background: `${tool.color}10`, color: tool.color, fontSize: 13, cursor: 'pointer',
              fontFamily: "'Outfit', sans-serif", fontWeight: 500, transition: 'all .2s',
            }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = `${tool.color}20`}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = `${tool.color}10`}
          >
            {btnLabel}
          </button>
        </DemoCard>
      </RevealSection>
    </section>
  );
}
