import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const SESSION_LINKS = [
  { path: '/1', label: 'LLMs', num: '01' },
  { path: '/2', label: 'Attention', num: '02' },
  { path: '/3', label: 'Context', num: '03' },
  { path: '/4', label: 'RAG', num: '04' },
  { path: '/5', label: 'Prompting', num: '05' },
  { path: '/6', label: 'MCP', num: '06' },
];

export default function Footer() {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true);
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <footer ref={ref} style={{
      borderTop: '1px solid var(--border)',
      padding: '3rem 2rem 1rem',
      marginTop: 'auto',
    }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        {/* Session index */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '.75rem', marginBottom: '2rem',
        }}>
          {SESSION_LINKS.map((s, i) => {
            const isActive = location.pathname === s.path;
            return (
              <Link key={s.path} to={s.path} style={{
                padding: '.5rem .75rem', borderRadius: 8, textDecoration: 'none',
                fontSize: 'var(--font-caption)', fontFamily: 'var(--font-mono)',
                background: isActive ? 'var(--bg2)' : 'transparent',
                border: `1px solid ${isActive ? 'var(--border2)' : 'transparent'}`,
                color: isActive ? 'var(--text)' : 'var(--muted)',
                transition: 'all .2s',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(12px)',
                transitionDelay: `${i * 0.06}s`,
                transitionProperty: 'opacity, transform',
                transitionDuration: '0.4s',
                transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
              }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.background = 'var(--bg2)'; }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.background = 'transparent'; }}}
              >
                <span style={{ opacity: 0.5, marginRight: '.5rem' }}>{s.num}</span>
                {s.label}
              </Link>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
