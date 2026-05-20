import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const SESSION_LINKS = [
  { path: '/1', label: 'The Prediction Machine', num: '01' },
  { path: '/2', label: 'The Attention Engine', num: '02' },
  { path: '/3', label: 'The Working Desk', num: '03' },
  { path: '/4', label: 'The Open-Book Exam', num: '04' },
  { path: '/5', label: 'The Art of the Ask', num: '05' },
  { path: '/6', label: 'From Talk to Action', num: '06' },
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

  const currentIdx = SESSION_LINKS.findIndex(s => s.path === location.pathname);
  const prev = currentIdx > 0 ? SESSION_LINKS[currentIdx - 1] : null;
  const next = currentIdx >= 0 && currentIdx < SESSION_LINKS.length - 1 ? SESSION_LINKS[currentIdx + 1] : null;

  return (
    <footer ref={ref} style={{
      borderTop: '1px solid var(--border)',
      padding: '3rem 2rem 6rem',
      marginTop: 'auto',
    }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        {/* Session nav arrows */}
        {prev && next && (
          <div style={{
            display: 'flex', gap: '1rem', marginBottom: '2.5rem',
            justifyContent: 'space-between',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          }}>
            <Link to={prev.path} style={{
              display: 'flex', alignItems: 'center', gap: '.5rem',
              padding: '.65rem 1rem', borderRadius: 10, textDecoration: 'none',
              background: 'var(--bg2)', border: '1px solid var(--border)',
              color: 'var(--muted)', fontSize: 'var(--font-caption)',
              fontFamily: 'var(--font-mono)', transition: 'all .2s',
              flex: 1, maxWidth: 300,
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.color = 'var(--text)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)'; }}
            >
              <span>←</span>
              <div>
                <div style={{ fontSize: 'var(--font-micro)', opacity: 0.6 }}>Previous</div>
                <div>{prev.num} {prev.label}</div>
              </div>
            </Link>
            <Link to={next.path} style={{
              display: 'flex', alignItems: 'center', gap: '.5rem',
              padding: '.65rem 1rem', borderRadius: 10, textDecoration: 'none',
              background: 'var(--bg2)', border: '1px solid var(--border)',
              color: 'var(--muted)', fontSize: 'var(--font-caption)',
              fontFamily: 'var(--font-mono)', transition: 'all .2s',
              flex: 1, maxWidth: 300, textAlign: 'right',
              justifyContent: 'flex-end',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.color = 'var(--text)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)'; }}
            >
              <div>
                <div style={{ fontSize: 'var(--font-micro)', opacity: 0.6 }}>Next</div>
                <div>{next.num} {next.label}</div>
              </div>
              <span>→</span>
            </Link>
          </div>
        )}

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

        <div style={{
          textAlign: 'center', color: 'var(--muted)', fontSize: 'var(--font-caption)',
          paddingTop: '1.5rem', borderTop: '1px solid var(--border)',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.5s 0.3s ease',
        }}>
          LLMs Made Simple — Team Training · 6 Sessions
        </div>
      </div>
    </footer>
  );
}
