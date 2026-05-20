import { useState, useEffect } from 'react';

const SESSIONS = [
  { id: 's1', num: '01', label: 'What is an LLM?', accent: '#4f9eff' },
  { id: 's2', num: '02', label: 'Attention', accent: '#a78bfa' },
  { id: 's3', num: '03', label: 'Context Window', accent: '#34d399' },
  { id: 's4', num: '04', label: 'RAG', accent: '#fb923c' },
  { id: 's5', num: '05', label: 'Prompting', accent: '#f472b6' },
  { id: 's6', num: '06', label: 'MCP & Tools', accent: '#63dcb4' },
];

/**
 * Sticky session navigation bar.
 * On desktop: fixed bottom bar with session pills.
 * On mobile: collapses to a minimal bottom sheet.
 */
export default function SessionNav() {
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < 200) { setActive(-1); return; }
      let idx = -1;
      SESSIONS.forEach((s, i) => {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= 300) idx = i;
      });
      setActive(idx);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setExpanded(false);
    }
  };

  return (
    <nav
      aria-label="Session navigation"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: 'rgba(10, 12, 15, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderTop: '1px solid var(--border)',
        padding: '0 1rem',
        transform: expanded ? 'translateY(0)' : 'translateY(calc(100% - 40px))',
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Handle to expand/collapse */}
      <button
        aria-label={expanded ? 'Collapse navigation' : 'Expand navigation'}
        onClick={() => setExpanded(e => !e)}
        style={{
          display: 'block',
          margin: '0 auto',
          width: 40,
          height: 4,
          borderRadius: 2,
          background: 'var(--border2)',
          border: 'none',
          cursor: 'pointer',
          marginTop: 8,
          marginBottom: 8,
        }}
      />

      {/* Session pills */}
      <div
        style={{
          display: 'flex',
          gap: 6,
          overflowX: 'auto',
          paddingBottom: 10,
          paddingTop: 2,
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {SESSIONS.map((s, i) => (
          <button
            key={s.id}
            aria-current={i === active ? 'true' : undefined}
            onClick={() => scrollTo(s.id)}
            style={{
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              borderRadius: 100,
              border: i === active
                ? `1px solid ${s.accent}66`
                : '1px solid var(--border)',
              background: i === active
                ? `${s.accent}18`
                : 'transparent',
              color: i === active
                ? s.accent
                : 'var(--muted)',
              fontSize: 'var(--font-label)',
              fontFamily: 'var(--font-mono)',
              fontWeight: i === active ? 500 : 400,
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              letterSpacing: '0.02em',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ opacity: 0.5 }}>{s.num}</span>
            <span>{s.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
