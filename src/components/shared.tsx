import { useEffect, useRef, useState } from 'react';

/* ─── Basic Types ─── */

export interface AnalogyItem {
  emoji: string;
  title: string;
  desc: string;
}

/* ─── AnalogyCard / Grid ─── */

export function AnalogyCard({ emoji, title, desc }: AnalogyItem) {
  return (
    <div
      style={{
        background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14,
        padding: '1.25rem', transition: 'all .25s', cursor: 'default',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = 'var(--border2)';
        el.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = 'var(--border)';
        el.style.transform = 'none';
      }}
    >
      <div style={{ fontSize: '1.8rem', marginBottom: '.75rem' }}>{emoji}</div>
      <h4 style={{ fontSize: 14, fontWeight: 500, marginBottom: '.4rem', color: 'var(--text)' }}>{title}</h4>
      <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>{desc}</p>
    </div>
  );
}

export function AnalogyGrid({ items }: { items: AnalogyItem[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
      {items.map((item, i) => <AnalogyCard key={i} {...item} />)}
    </div>
  );
}

/* ─── SectionHeader ─── */

interface SectionHeaderProps {
  num: string;
  tag: string;
  title: string;
  accentColor: string;
  borderColor: string;
}

export function SectionHeader({ num, tag, title, accentColor, borderColor }: SectionHeaderProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
      <div style={{
        width: 42, height: 42, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'DM Mono', monospace", fontSize: 14, fontWeight: 500, flexShrink: 0,
        background: accentColor + '1e', border: `1px solid ${borderColor}`, color: accentColor,
      }}>
        {num}
      </div>
      <div>
        <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '.25rem' }}>{tag}</div>
        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '2rem', lineHeight: 1.2, color: 'var(--text)' }}>{title}</div>
      </div>
    </div>
  );
}

/* ─── Divider ─── */

export function Divider() {
  return <div style={{ height: 1, background: 'var(--border)', maxWidth: 900, margin: '0 auto' }} />;
}

/* ─── DemoCard ─── */

export function DemoCard({ label, title, desc, children }: { label: string; title: string; desc?: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.5rem', marginBottom: '1rem' }}>
      <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '.5rem' }}>{label}</div>
      <h3 style={{ fontSize: '1rem', fontWeight: 500, marginBottom: desc ? '.5rem' : '1rem', color: 'var(--text)' }}>{title}</h3>
      {desc && <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: '1rem', lineHeight: 1.6 }}>{desc}</p>}
      {children}
    </div>
  );
}

/* ─── RevealSection ─── */

export function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return { ref, visible };
}

export function RevealSection({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(20px)', transition: 'all .6s ease', ...style }}>
      {children}
    </div>
  );
}

/* ─── ConceptBlock — a highlighted concept explanation ─── */

export function ConceptBlock({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <div style={{
      borderLeft: `3px solid ${accent}`, borderRadius: '0 12px 12px 0',
      padding: '1rem 1.25rem', marginBottom: '1rem',
      background: accent + '0a',
    }}>
      <div style={{ fontSize: 14, fontWeight: 500, color: accent, marginBottom: '.5rem', fontFamily: "'DM Serif Display', serif" }}>{title}</div>
      <div style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7 }}>{children}</div>
    </div>
  );
}

/* ─── KeyPoint — a numbered key insight ─── */

export function KeyPoint({ num, title, accent, children }: { num: number; title: string; accent: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', alignItems: 'flex-start' }}>
      <div style={{
        width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: accent + '1e', border: `1px solid ${accent}44`, color: accent, flexShrink: 0,
        fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 600,
      }}>
        {num}
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)', marginBottom: '.25rem' }}>{title}</div>
        <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>{children}</div>
      </div>
    </div>
  );
}

/* ─── CodeExample — inline code block ─── */

export function CodeExample({ code, accent }: { code: string; accent: string }) {
  return (
    <pre style={{
      background: 'var(--bg3)', border: `1px solid ${accent}22`, borderRadius: 10,
      padding: '1rem 1.25rem', fontFamily: "'DM Mono', monospace", fontSize: 12,
      color: 'var(--text)', lineHeight: 1.7, overflowX: 'auto', marginBottom: '1rem',
    }}>
      <code>{code}</code>
    </pre>
  );
}

/* ─── ComparisonTable ─── */

interface CompRow { label: string; cells: string[] }

export function ComparisonTable({ headers, rows, accent }: { headers: string[]; rows: CompRow[]; accent: string }) {
  return (
    <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid var(--border)', marginBottom: '1rem' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} style={{
                padding: '.75rem 1rem', textAlign: 'left', borderBottom: '1px solid var(--border)',
                background: 'var(--bg3)', color: i === 0 ? 'var(--text)' : accent,
                fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: '.06em', textTransform: 'uppercase',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: i < rows.length - 1 ? '1px solid var(--border)' : 'none' }}>
              {row.cells.map((cell, j) => (
                <td key={j} style={{
                  padding: '.65rem 1rem', color: j === 0 ? 'var(--text)' : 'var(--muted)',
                  fontWeight: j === 0 ? 500 : 400, fontSize: 13,
                }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── FlowDiagram — horizontal step flow ─── */

export function FlowDiagram({ steps, accent }: { steps: { label: string; sub: string }[]; accent: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto', padding: '.5rem 0', marginBottom: '1rem' }}>
      {steps.map((step, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <div style={{
            padding: '.75rem 1rem', borderRadius: 10, border: `1px solid ${accent}44`,
            background: accent + '0a', minWidth: 120, textAlign: 'center',
          }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: '.15rem' }}>{step.label}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>{step.sub}</div>
          </div>
          {i < steps.length - 1 && (
            <div style={{ color: accent, padding: '0 .5rem', fontSize: 18, opacity: 0.6 }}>→</div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── SubSection — a titled sub-section within a session ─── */

export function SubSection({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <div style={{
        fontSize: '1.15rem', fontFamily: "'DM Serif Display', serif", color: 'var(--text)',
        marginBottom: '1rem', paddingBottom: '.5rem', borderBottom: `1px solid ${accent}22`,
      }}>
        {title}
      </div>
      {children}
    </div>
  );
}

/* ─── WarningBox ─── */

export function WarningBox({ accent, children }: { accent: string; children: React.ReactNode }) {
  return (
    <div style={{
      padding: '.75rem 1rem', borderRadius: 10,
      background: accent + '0a', border: `1px solid ${accent}44`,
      color: accent, fontSize: 13, lineHeight: 1.6, marginBottom: '1rem',
    }}>
      {children}
    </div>
  );
}

/* ─── InfoBox ─── */

export function InfoBox({ accent, children }: { accent: string; children: React.ReactNode }) {
  return (
    <div style={{
      padding: '1rem 1.25rem', borderRadius: 12,
      background: accent + '08', border: `1px solid ${accent}22`,
      fontSize: 14, color: 'var(--muted)', lineHeight: 1.7, marginBottom: '1rem',
    }}>
      {children}
    </div>
  );
}
