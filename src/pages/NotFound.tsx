import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section style={{
      maxWidth: 600, margin: '0 auto', padding: '6rem 2rem', textAlign: 'center',
    }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔮</div>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--font-hero)', color: 'var(--text)', marginBottom: '.5rem' }}>
        404
      </h1>
      <p style={{ color: 'var(--muted)', fontSize: 'var(--font-body-lg)', marginBottom: '2rem' }}>
        This page doesn&apos;t exist — maybe it was hallucinated by an LLM.
      </p>
      <Link to="/" style={{
        padding: '.6rem 1.4rem', borderRadius: 8, textDecoration: 'none',
        background: 'var(--bg2)', border: '1px solid var(--border)',
        color: 'var(--text)', fontSize: 'var(--font-body)', display: 'inline-block',
        fontFamily: 'var(--font-mono)', transition: 'all .2s',
      }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text)'; }}
      >
        ← Back to Home
      </Link>
    </section>
  );
}
