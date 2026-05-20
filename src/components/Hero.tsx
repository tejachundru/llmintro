const sessions = [
  { num: '01', label: 'What is an LLM?', sub: 'Training, tokens, next-token prediction', href: '#s1', accent: 'var(--accent)' },
  { num: '02', label: 'Attention & Transformers', sub: 'Q/K/V, multi-head, positional encoding', href: '#s2', accent: 'var(--accent2)' },
  { num: '03', label: 'Context Window', sub: 'KV cache, O(n²), lost-in-middle', href: '#s3', accent: 'var(--accent3)' },
  { num: '04', label: 'RAG', sub: 'Embeddings, chunking, vector search', href: '#s4', accent: 'var(--accent4)' },
  { num: '05', label: 'Prompting', sub: 'System prompts, CoT, temperature', href: '#s5', accent: 'var(--accent5)' },
  { num: '06', label: 'MCP & Tools', sub: 'Protocol, tool calling, agentic workflows', href: '#s6', accent: 'var(--accent6)' },
];

export default function Hero() {
  return (
    <section style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center',
      padding: '2rem', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
        maskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 30%, transparent 100%)',
        animation: 'gridPulse 8s ease-in-out infinite',
        WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 30%, transparent 100%)',
      }} />
      <div style={{
        position: 'absolute', width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(79,158,255,0.12) 0%, transparent 70%)',
        top: '50%', left: '50%', animation: 'glowPulse 4s ease-in-out infinite',
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'inline-block',
          background: 'rgba(79,158,255,0.1)', border: '1px solid rgba(79,158,255,0.3)',
          color: 'var(--accent)', padding: '.35rem 1rem', borderRadius: 100,
          fontSize: 12, fontFamily: "'DM Mono', monospace", letterSpacing: '.1em',
          textTransform: 'uppercase', marginBottom: '1.5rem',
          animation: 'fadeUp .8s ease both',
        }}>
          Team Training · 6 Sessions · Under the Hood
        </div>

        <h1 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 'clamp(2.5rem, 7vw, 5rem)', lineHeight: 1.1,
          marginBottom: '1rem', color: 'var(--text)',
          animation: 'fadeUp .8s .1s ease both',
        }}>
          LLMs{' '}
          <em style={{
            fontStyle: 'italic',
            background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>Under the Hood</em>
        </h1>

        <p style={{
          fontSize: '1.1rem', color: 'var(--muted)', maxWidth: 560,
          margin: '0 auto 2.5rem',
          animation: 'fadeUp .8s .2s ease both',
        }}>
          Not surface-level tips — real understanding of how LLMs work internally.
          Training, attention, context, RAG, prompting, and tool-use — explained for beginners who want depth.
        </p>

        <nav style={{
          display: 'flex', flexWrap: 'wrap', gap: '.75rem', justifyContent: 'center',
          animation: 'fadeUp .8s .3s ease both',
        }}>
          {sessions.map(s => (
            <a
              key={s.num}
              href={s.href}
              style={{
                display: 'flex', alignItems: 'center', gap: '.5rem',
                padding: '.6rem 1.2rem', borderRadius: 10,
                background: 'var(--bg2)', border: '1px solid var(--border2)',
                color: 'var(--text)', textDecoration: 'none',
                fontSize: 13, fontWeight: 500, transition: 'all .2s',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget;
                el.style.borderColor = s.accent;
                el.style.color = s.accent;
                el.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget;
                el.style.borderColor = 'var(--border2)';
                el.style.color = 'var(--text)';
                el.style.transform = 'none';
              }}
            >
              <span style={{
                width: 22, height: 22, borderRadius: 6, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 600, fontFamily: "'DM Mono', monospace",
                background: s.accent + '33', color: s.accent,
              }}>
                {s.num}
              </span>
              <span>{s.label}</span>
            </a>
          ))}
        </nav>
      </div>
    </section>
  );
}
