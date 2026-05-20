import { useState, useEffect } from 'react';

const SECTIONS = ['s1', 's2', 's3', 's4', 's5', 's6'];
const LABELS = ['Top', 'What is LLM', 'Attention', 'Context', 'RAG', 'Prompting', 'MCP & Tools'];

export default function ProgressDots() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < 200) { setActive(0); return; }
      let idx = 0;
      SECTIONS.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 300) idx = i + 1;
      });
      setActive(idx);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (idx: number) => {
    if (idx === 0) { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    const el = document.getElementById(SECTIONS[idx - 1]);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav style={{
      position: 'fixed', right: '1.5rem', top: '50%', transform: 'translateY(-50%)',
      display: 'flex', flexDirection: 'column', gap: '.5rem', zIndex: 100,
    }}>
      {LABELS.map((label, i) => (
        <button
          key={i}
          title={label}
          onClick={() => scrollTo(i)}
          style={{
            width: 8, height: 8, borderRadius: '50%', border: 'none', cursor: 'pointer',
            background: active === i ? 'var(--accent)' : 'var(--border2)',
            transform: active === i ? 'scale(1.4)' : 'scale(1)',
            transition: 'all .3s',
            padding: 0,
          }}
        />
      ))}
    </nav>
  );
}
