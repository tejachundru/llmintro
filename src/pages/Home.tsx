import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const sessions = [
  { num: '01', label: 'LLMs', sub: 'Tokens, next-word prediction, training', path: '/1', accent: '#2563eb', icon: '🧠' },
  { num: '02', label: 'Attention', sub: 'QKV, self-attention, transformers', path: '/2', accent: '#7c3aed', icon: '🔦' },
  { num: '03', label: 'Context', sub: 'Context window, memory limits, cost', path: '/3', accent: '#047857', icon: '🪟' },
  { num: '04', label: 'RAG', sub: 'RAG, embeddings, vector databases', path: '/4', accent: '#c2410c', icon: '📎' },
  { num: '05', label: 'Prompting', sub: 'Prompts, temperature, techniques', path: '/5', accent: '#be185d', icon: '🎯' },
  { num: '06', label: 'MCP', sub: 'MCP, tools, chaining actions', path: '/6', accent: '#0f766e', icon: '🦾' },
];

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setLoaded(true); }, []);

  return (
    <section style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center',
      padding: '6rem 2rem 4rem', position: 'relative', overflow: 'hidden',
    }}>
      {/* Grid background */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
        maskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 30%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 30%, transparent 100%)',
        animation: 'gridPulse 8s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(79,158,255,0.12) 0%, transparent 70%)',
        top: '50%', left: '50%', animation: 'glowPulse 4s ease-in-out infinite',
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 800 }}>
 
        <h1 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 'clamp(2.5rem, 7vw, 5rem)', lineHeight: 1.1,
          marginBottom: '1rem', color: 'var(--text)',
          opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateY(10px)',
          transition: 'all .6s .1s ease',
        }}>
          LLMs{' '}
          <em style={{ fontStyle: 'italic', color: 'var(--accent2)' }}>Made Simple</em>
        </h1>

        <p style={{
          fontSize: 'var(--font-sub-heading)', color: 'var(--muted)', maxWidth: 560,
          margin: '0 auto 3rem',
          opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateY(10px)',
          transition: 'all .6s .2s ease',
        }}>
          No jargon. No assumed knowledge. Just clear, visual explanations of how LLMs really work —
          from tokens to tools. Each session builds on the last.
        </p>

        {/* Session cards grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem', textAlign: 'left',
          opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateY(20px)',
          transition: 'all .6s .3s ease',
        }}>
          {sessions.map((s) => (
            <Link
              key={s.path}
              to={s.path}
              style={{
                padding: '1.25rem', borderRadius: 14, textDecoration: 'none',
                background: 'var(--bg2)', border: '1px solid var(--border)',
                color: 'var(--text)', transition: 'all .25s',
                display: 'flex', flexDirection: 'column',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget;
                el.style.borderColor = s.accent + '55';
                el.style.transform = 'translateY(-3px)';
                el.style.background = s.accent + '08';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget;
                el.style.borderColor = 'var(--border)';
                el.style.transform = 'none';
                el.style.background = 'var(--bg2)';
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 10, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                background: s.accent + '1e', border: `1px solid ${s.accent}44`,
                fontSize: '1.1rem', marginBottom: '.75rem',
              }}>
                {s.icon}
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 'var(--font-micro)',
                color: s.accent, marginBottom: '.25rem', letterSpacing: 'var(--ls-wide)',
              }}>
                Session {s.num}
              </div>
              <div style={{ fontSize: 'var(--font-body)', fontWeight: 500, marginBottom: '.25rem' }}>
                {s.label}
              </div>
              <div style={{ fontSize: 'var(--font-caption)', color: 'var(--muted)', lineHeight: 'var(--lh-snug)' }}>
                {s.sub}
              </div>
            </Link>
          ))}
        </div>

        {/* Decorative "start anywhere" note */}
        <div style={{
          marginTop: '3rem', padding: '.75rem 1.25rem', borderRadius: 10,
          background: 'var(--bg3)', border: '1px solid var(--border)',
          fontSize: 'var(--font-caption)', color: 'var(--muted)',
          display: 'flex', alignItems: 'center', gap: '.75rem',
          justifyContent: 'center',
          opacity: loaded ? 1 : 0,
          transition: 'all .6s .4s ease',
        }}>
          <span style={{ fontSize: '1.2rem' }}>💡</span>
          Start from Session 1 if you&apos;re new, or jump to any topic. Each session is self-contained.
        </div>
      </div>
    </section>
  );
}
