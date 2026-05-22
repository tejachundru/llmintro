import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

const SESSIONS = [
  { path: '/', label: 'Home', num: '⌂', accent: '#2563eb' },
  { path: '/1', label: 'The Prediction Machine', num: '01', accent: '#2563eb' },
  { path: '/2', label: 'The Attention Engine', num: '02', accent: '#7c3aed' },
  { path: '/3', label: 'The Working Desk', num: '03', accent: '#047857' },
  { path: '/4', label: 'The Open-Book Exam', num: '04', accent: '#c2410c' },
  { path: '/5', label: 'The Art of the Ask', num: '05', accent: '#be185d' },
  { path: '/6', label: 'From Talk to Action', num: '06', accent: '#0f766e' },
];

export default function AppNav() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const activeIdx = SESSIONS.findIndex(s => s.path === location.pathname);
  const active = activeIdx >= 0 ? SESSIONS[activeIdx] : null;

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(245,246,250,.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        transition: 'all .3s',
        padding: '0 1.5rem',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'flex', alignItems: 'center',
          height: 56,
        }}>
          <Link to="/" style={{
            fontFamily: 'var(--font-serif)', fontSize: 'var(--font-sub-heading)',
            color: 'var(--text)', textDecoration: 'none', fontWeight: 500,
            display: 'flex', alignItems: 'center', gap: '.5rem',
          }}>
            <span style={{ color: 'var(--accent)' }}>✦</span>
            LLMs Made Simple
          </Link>

          <div style={{ flex: 1 }} />

          {/* Desktop nav */}
          <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {SESSIONS.slice(1).map((s) => {
              const isActive = location.pathname === s.path;
              return (
                <Link
                  key={s.path}
                  to={s.path}
                  style={{
                    padding: '4px 10px', borderRadius: 6, textDecoration: 'none',
                    fontSize: 'var(--font-label)', fontFamily: 'var(--font-mono)',
                    color: isActive ? s.accent : 'var(--muted)',
                    background: isActive ? s.accent + '15' : 'transparent',
                    border: '1px solid transparent',
                    borderColor: isActive ? s.accent + '33' : 'transparent',
                    transition: 'all .2s',
                    display: 'none',
                  }}
                  className="nav-desktop"
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.background = 'var(--bg2)'; }}}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.background = 'transparent'; }}}
                >
                  {s.num}
                </Link>
              );
            })}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            style={{
              display: 'none', background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text)', fontSize: '1.3rem', padding: '.25rem',
            }}
            className="nav-hamburger"
            aria-label="Toggle menu"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Mobile menu dropdown */}
      <div style={{
        position: 'fixed', top: 56, left: 0, right: 0, zIndex: 99,
        background: 'rgba(245,246,250,.98)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border)',
        padding: '.5rem 1.5rem 1rem',
        pointerEvents: menuOpen ? 'auto' : 'none',
        opacity: menuOpen ? 1 : 0,
        transform: menuOpen ? 'translateY(0)' : 'translateY(-8px)',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
          {SESSIONS.slice(1).map(s => {
            const isActive = location.pathname === s.path;
            return (
              <Link
                key={s.path}
                to={s.path}
                style={{
                  display: 'flex', alignItems: 'center', gap: '.75rem',
                  padding: '.65rem .75rem', borderRadius: 8, textDecoration: 'none',
                  color: isActive ? s.accent : 'var(--muted)',
                  background: isActive ? s.accent + '10' : 'transparent',
                  fontSize: 'var(--font-body)', transition: 'all .2s',
                }}
              >
                <span style={{
                  width: 24, height: 24, borderRadius: 6, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-mono)', fontSize: 'var(--font-micro)',
                  background: isActive ? s.accent + '33' : 'var(--bg3)',
                  color: isActive ? s.accent : 'var(--muted)',
                }}>{s.num}</span>
                {s.label}
                {isActive && <span style={{ marginLeft: 'auto', color: s.accent }}>←</span>}
              </Link>
            );
          })}
        </div>

      {/* Progress bar */}
      <div style={{
        position: 'fixed', top: 56, left: 0, right: 0, height: 2, zIndex: 100,
        background: 'var(--border)',
      }}>
        {active && activeIdx > 0 && (
          <div style={{
            height: '100%',
            width: `${(activeIdx / (SESSIONS.length - 1)) * 100}%`,
            background: `linear-gradient(90deg, #2563eb, ${active.accent})`,
            transition: 'width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }} />
        )}
      </div>

      <style>{`
        @media (min-width: 768px) {
          .nav-desktop { display: inline-flex !important; }
          .nav-hamburger { display: none !important; }
        }
        @media (max-width: 767px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: inline-flex !important; }
        }
      `}</style>
    </>
  );
}
