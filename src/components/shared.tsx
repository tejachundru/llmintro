import { Children, useEffect, useRef, useState } from 'react';

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
      <div style={{ fontSize: 'var(--font-emoji)', marginBottom: 'var(--space-md)' }}>{emoji}</div>
      <h4 style={{ fontSize: 'var(--font-body-lg)', fontWeight: 500, marginBottom: 'var(--space-xs)', color: 'var(--text)' }}>{title}</h4>
      <p style={{ fontSize: 'var(--font-caption)', color: 'var(--muted)', lineHeight: 'var(--lh-snug)' }}>{desc}</p>
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
        fontFamily: 'var(--font-mono)', fontSize: 'var(--font-body-lg)', fontWeight: 500, flexShrink: 0,
        background: accentColor + '1e', border: `1px solid ${borderColor}`, color: accentColor,
      }}>
        {num}
      </div>
      <div>
        <div style={{ fontSize: 'var(--font-micro)', fontFamily: 'var(--font-mono)', letterSpacing: 'var(--ls-wide)', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 'var(--space-2xs)' }}>{tag}</div>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--font-hero)', lineHeight: 'var(--lh-tight)', color: 'var(--text)', margin: 0 }}>{title}</h2>
      </div>
    </div>
  );
}

/* ─── Divider ─── */

export function Divider() {
  return <div style={{ height: 1, background: 'var(--border)', maxWidth: 900, margin: '0 auto' }} />;
}

/* ─── Text Animation: step-by-step reveal ─── */

export function StepReveal({ steps, accent, interval = 800 }: { steps: string[]; accent: string; interval?: number }) {
  const [visible, setVisible] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setVisible(prev => (prev < steps.length ? prev + 1 : prev));
    }, interval);
    return () => clearInterval(timerRef.current);
  }, [steps, interval]);

  return (
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--font-caption)', lineHeight: 2, padding: 'var(--space-lg) 0' }}>
      {steps.map((step, i) => (
        <div
          key={i}
          style={{
            opacity: i < visible ? 1 : 0,
            transform: i < visible ? 'translateX(0)' : 'translateX(-10px)',
            transition: 'all .4s ease',
            color: i === visible - 1 ? accent : 'var(--text)',
            fontWeight: i === visible - 1 ? 500 : 400,
          }}
        >
          {i > 0 && <span style={{ color: 'var(--muted)', marginRight: 8 }}>↓</span>}
          {step}
        </div>
      ))}
    </div>
  );
}

/* ─── Before / After Comparison ─── */

export function BeforeAfter({ before, after, accent }: { before: string; after: string; accent: string }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
      <div style={{
        background: 'rgba(244,67,54,.05)', border: '1px solid rgba(244,67,54,.3)', borderRadius: 12, padding: '1rem',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(-16px)',
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        <div style={{ fontSize: 'var(--font-micro)', fontFamily: 'var(--font-mono)', color: '#f44336', marginBottom: 'var(--space-sm)', textTransform: 'uppercase', letterSpacing: 'var(--ls-mono)' }}>Before</div>
        <div style={{ fontSize: 'var(--font-caption)', color: 'var(--muted)', lineHeight: 'var(--lh-normal)' }}>{before}</div>
      </div>
      <div style={{
        background: accent + '0a', border: `1px solid ${accent}44`, borderRadius: 12, padding: '1rem',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(16px)',
        transition: 'all 0.5s 0.1s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        <div style={{ fontSize: 'var(--font-micro)', fontFamily: 'var(--font-mono)', color: accent, marginBottom: 'var(--space-sm)', textTransform: 'uppercase', letterSpacing: 'var(--ls-mono)' }}>After</div>
        <div style={{ fontSize: 'var(--font-caption)', color: 'var(--text)', lineHeight: 'var(--lh-normal)', fontWeight: 500 }}>{after}</div>
      </div>
    </div>
  );
}

/* ─── Live Word Animation ─── */

export function AnimatedFlow({ items, accent }: { items: string[]; accent: string }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i < items.length - 1 ? i + 1 : i)), 1000);
    return () => clearInterval(t);
  }, [items]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', padding: '1rem', flexWrap: 'wrap' }}>
      {items.slice(0, idx + 1).map((item, i) => (
        <span key={i} style={{
          animation: 'chipIn .3s ease both',
          padding: '6px 14px', borderRadius: 8,
          background: accent + '1e', border: `1px solid ${accent}44`,
          color: 'var(--text)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-caption)',
        }}>
          {item}
        </span>
      ))}
      {idx < items.length - 1 && (
        <span style={{ color: accent, fontSize: 'var(--font-sub-heading)', animation: 'fadeIn .5s ease infinite' }}>→</span>
      )}
    </div>
  );
}

/* ─── DemoCard ─── */

export function DemoCard({ label, title, desc, children }: { label: string; title: string; desc?: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.5rem', marginBottom: '1rem' }}>
      <div style={{ fontSize: 'var(--font-micro)', fontFamily: 'var(--font-mono)', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 'var(--space-sm)' }}>{label}</div>
      <h3 style={{ fontSize: 'var(--font-body)', fontWeight: 500, marginBottom: desc ? 'var(--space-sm)' : 'var(--space-lg)', color: 'var(--text)', margin: 0 }}>{title}</h3>
      {desc && <p style={{ fontSize: 'var(--font-body-lg)', color: 'var(--muted)', marginBottom: 'var(--space-lg)', lineHeight: 'var(--lh-normal)', marginTop: 0 }}>{desc}</p>}
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
  const childrenArray = Children.toArray(children);
  return (
    <div ref={ref} style={style}>
      {childrenArray.length > 1 ? (
        childrenArray.map((child, i) => (
          <div
            key={i}
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(20px)',
              transition: `all 0.5s ${i * 0.07}s cubic-bezier(0.4, 0, 0.2, 1)`,
            }}
          >
            {child}
          </div>
        ))
      ) : (
        <div style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>
          {children}
        </div>
      )}
    </div>
  );
}

/* ─── ConceptBlock ─── */

export function ConceptBlock({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} style={{
      borderLeft: `3px solid ${accent}`, borderRadius: '0 12px 12px 0',
      padding: '1rem 1.25rem', marginBottom: '1rem',
      background: accent + '0a',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateX(0)' : 'translateX(-12px)',
      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    }}>
      <div style={{ fontSize: 'var(--font-body-lg)', fontWeight: 500, color: accent, marginBottom: 'var(--space-sm)', fontFamily: 'var(--font-serif)' }}>{title}</div>
      <div style={{ fontSize: 'var(--font-body-lg)', color: 'var(--muted)', lineHeight: 'var(--lh-relaxed)' }}>{children}</div>
    </div>
  );
}

/* ─── KeyPoint ─── */

export function KeyPoint({ num, title, accent, children }: { num: number; title: string; accent: string; children: React.ReactNode }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} style={{
      display: 'flex', gap: '1rem', marginBottom: '1.25rem', alignItems: 'flex-start',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateX(0)' : 'translateX(-12px)',
      transition: `all 0.4s ${num * 0.06}s cubic-bezier(0.4, 0, 0.2, 1)`,
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: accent + '1e', border: `1px solid ${accent}44`, color: accent, flexShrink: 0,
        fontFamily: 'var(--font-mono)', fontSize: 'var(--font-label)', fontWeight: 600,
      }}>
        {num}
      </div>
      <div>
        <div style={{ fontSize: 'var(--font-body-lg)', fontWeight: 500, color: 'var(--text)', marginBottom: 'var(--space-2xs)' }}>{title}</div>
        <div style={{ fontSize: 'var(--font-caption)', color: 'var(--muted)', lineHeight: 'var(--lh-normal)' }}>{children}</div>
      </div>
    </div>
  );
}

/* ─── CodeExample ─── */

export function CodeExample({ code, accent }: { code: string; accent: string }) {
  return (
    <pre style={{
      background: 'var(--bg3)', border: `1px solid ${accent}22`, borderRadius: 10,
      padding: 'var(--space-lg) 1.25rem', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-label)',
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
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-caption)' }}>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} style={{
                padding: '.75rem 1rem', textAlign: 'left', borderBottom: '1px solid var(--border)',
                background: 'var(--bg3)', color: i === 0 ? 'var(--text)' : accent,
                fontFamily: 'var(--font-mono)', fontSize: 'var(--font-micro)', letterSpacing: 'var(--ls-mono)', textTransform: 'uppercase',
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
                  fontWeight: j === 0 ? 500 : 400, fontSize: 'var(--font-caption)',
                }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── FlowDiagram ─── */

export function FlowDiagram({ steps, accent }: { steps: { label: string; sub: string }[]; accent: string }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} style={{ display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto', padding: '.5rem 0', marginBottom: '1rem' }}>
      {steps.map((step, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', flexShrink: 0,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(12px)',
          transition: `all 0.4s ${i * 0.08}s cubic-bezier(0.4, 0, 0.2, 1)`,
        }}>
          <div style={{
            padding: '.75rem 1rem', borderRadius: 10, border: `1px solid ${accent}44`,
            background: accent + '0a', minWidth: 120, textAlign: 'center',
            transition: 'all .25s',
          }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = accent + '88'; el.style.background = accent + '18'; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = accent + '44'; el.style.background = accent + '0a'; }}
          >
            <div style={{ fontSize: 'var(--font-caption)', fontWeight: 500, color: 'var(--text)', marginBottom: 'var(--space-2xs)' }}>{step.label}</div>
            <div style={{ fontSize: 'var(--font-micro)', color: 'var(--muted)' }}>{step.sub}</div>
          </div>
          {i < steps.length - 1 && (
            <div style={{
              color: accent, padding: '0 var(--space-sm)', fontSize: 'var(--font-sub-heading)',
              opacity: visible ? 0.6 : 0,
              transition: `opacity 0.3s ${i * 0.08 + 0.15}s ease`,
            }}>→</div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── SubSection ─── */

export function SubSection({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: '2.5rem' }}>
      <h3 style={{
        fontSize: 'var(--font-sub-heading)', fontFamily: 'var(--font-serif)', color: 'var(--text)',
        marginBottom: 'var(--space-lg)', paddingBottom: 'var(--space-sm)', borderBottom: `1px solid ${accent}22`,
        margin: 0,
      }}>
        {title}
      </h3>
      {children}
    </section>
  );
}

/* ─── WarningBox ─── */

export function WarningBox({ accent, children }: { accent: string; children: React.ReactNode }) {
  return (
    <div style={{
      padding: '.75rem 1rem', borderRadius: 10,
      background: accent + '0a', border: `1px solid ${accent}44`,
      color: accent, fontSize: 'var(--font-caption)', lineHeight: 'var(--lh-normal)', marginBottom: 'var(--space-lg)',
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
      fontSize: 'var(--font-body-lg)', color: 'var(--muted)', lineHeight: 'var(--lh-relaxed)', marginBottom: 'var(--space-lg)',
    }}>
      {children}
    </div>
  );
}

/* ─── Recap Box ─── */

export function RecapBox({ items, accent }: { items: string[]; accent: string }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} style={{
      padding: '1.25rem', borderRadius: 12,
      background: accent + '08', border: `1px solid ${accent}22`,
      marginBottom: '1rem',
    }}>
      <div style={{ fontSize: 'var(--font-micro)', fontFamily: 'var(--font-mono)', color: accent, textTransform: 'uppercase', letterSpacing: 'var(--ls-mono)', marginBottom: 'var(--space-md)' }}>Recap</div>
      {items.map((item, i) => (
        <div key={i} style={{
          display: 'flex', gap: '.5rem', marginBottom: i < items.length - 1 ? '.5rem' : 0,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateX(0)' : 'translateX(-12px)',
          transition: `all 0.4s ${i * 0.06}s cubic-bezier(0.4, 0, 0.2, 1)`,
        }}>
          <span style={{ color: accent }}>→</span>
          <span style={{ fontSize: 'var(--font-caption)', color: 'var(--muted)', lineHeight: 'var(--lh-snug)' }}>{item}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Practice Questions ─── */

export function PracticeQuestions({ questions, accent }: { questions: string[]; accent: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      borderRadius: 12, border: `1px solid ${accent}22`, overflow: 'hidden', marginBottom: '1rem',
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', padding: '.85rem 1.25rem', border: 'none', cursor: 'pointer',
          background: accent + '08', color: accent, fontSize: 'var(--font-caption)', fontWeight: 500,
          fontFamily: 'var(--font-sans)', textAlign: 'left', display: 'flex', justifyContent: 'space-between',
          transition: 'background .2s',
        }}
        onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = accent + '15'}
        onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = accent + '08'}
      >
        Practice Questions
        <span style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>▼</span>
      </button>
      {open && (
        <div style={{ padding: '1rem 1.25rem', background: 'var(--bg2)' }}>
          {questions.map((q, i) => (
            <div key={i} style={{ fontSize: 'var(--font-caption)', color: 'var(--muted)', marginBottom: i < questions.length - 1 ? 'var(--space-md)' : 0, lineHeight: 'var(--lh-snug)' }}>
              <span style={{ color: accent, fontFamily: 'var(--font-mono)', marginRight: 'var(--space-sm)' }}>{i + 1}.</span>
              {q}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── 30 Second Summary ─── */

export function QuickSummary({ summary, accent }: { summary: string; accent: string }) {
  return (
    <div style={{
      position: 'relative', padding: '1.25rem 1.5rem', borderRadius: 12,
      background: accent + '0a', border: `1px solid ${accent}33`, marginBottom: '1rem',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, bottom: 0, width: 4,
        background: accent,
      }} />
      <div style={{ fontSize: 'var(--font-micro)', fontFamily: 'var(--font-mono)', color: accent, textTransform: 'uppercase', letterSpacing: 'var(--ls-mono)', marginBottom: 'var(--space-sm)' }}>30-Second Summary</div>
      <div style={{ fontSize: 'var(--font-body-lg)', color: 'var(--text)', lineHeight: 'var(--lh-relaxed)', fontWeight: 400 }}>{summary}</div>
    </div>
  );
}

/* ─── Mental Model ─── */

export function MentalModel({ emoji, title, desc, accent }: { emoji: string; title: string; desc: string; accent: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: '1rem',
      padding: '1rem 1.25rem', borderRadius: 12,
      background: 'var(--bg3)', border: `1px solid ${accent}22`, marginBottom: '1rem',
    }}>
      <span style={{ fontSize: 'var(--font-emoji)', flexShrink: 0 }}>{emoji}</span>
      <div>
        <div style={{ fontSize: 'var(--font-body-lg)', fontWeight: 500, color: accent, marginBottom: 'var(--space-2xs)' }}>{title}</div>
        <div style={{ fontSize: 'var(--font-caption)', color: 'var(--muted)', lineHeight: 'var(--lh-normal)' }}>{desc}</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   NEW INTERACTIVE / ANIMATED COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

/* ─── Probability Bars ─── */

interface ProbItem { label: string; prob: number; color: string }

export function ProbabilityBars({ items, accent, height = 20 }: { items: ProbItem[]; accent: string; height?: number }) {
  const maxProb = Math.max(...items.map(i => i.prob), 0.01);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '.75rem 0' }}>
      {items.map((item, i) => (
        <div key={i}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-micro)', fontFamily: 'var(--font-mono)', marginBottom: 2 }}>
            <span style={{ color: 'var(--text)' }}>{item.label}</span>
            <span style={{ color: 'var(--muted)' }}>{(item.prob * 100).toFixed(1)}%</span>
          </div>
          <div style={{ background: 'var(--bg2)', borderRadius: height / 2, height, overflow: 'hidden' }}>
            <div
              style={{
                width: `${(item.prob / maxProb) * 100}%`,
                height: '100%',
                background: `linear-gradient(90deg, ${item.color}, ${accent})`,
                borderRadius: height / 2,
                transition: 'width .6s cubic-bezier(.4,0,.2,1)',
                animation: `barGrow 0.6s ${i * 0.1}s ease both`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Interactive Slider ─── */

export function InteractiveSlider({
  value, min, max, step, onChange, label, accent, format,
}: {
  value: number; min: number; max: number; step?: number;
  onChange: (v: number) => void; label: string; accent: string;
  format?: (v: number) => string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.5rem' }}>
        <span style={{ fontSize: 'var(--font-label)', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{label}</span>
        <span style={{ fontSize: 'var(--font-caption)', color: accent, fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
          {format ? format(value) : value}
        </span>
      </div>
      <div style={{ position: 'relative', height: 6, background: 'var(--bg2)', borderRadius: 3 }}>
        <div style={{
          position: 'absolute', left: 0, top: 0, height: '100%', width: pct + '%',
          background: `linear-gradient(90deg, ${accent}88, ${accent})`,
          borderRadius: 3, transition: 'width .15s ease',
        }} />
        <input
          type="range"
          min={min}
          max={max}
          step={step || 0.1}
          value={value}
          onChange={e => onChange(parseFloat(e.target.value))}
          style={{
            position: 'absolute', inset: 0, width: '100%', margin: 0,
            appearance: 'none', background: 'transparent', cursor: 'pointer',
            outline: 'none',
          }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-micro)', color: 'var(--muted)', marginTop: 2 }}>
        <span>{format ? format(min) : min}</span>
        <span>{format ? format(max) : max}</span>
      </div>
      <style>{`
        input[type=range]::-webkit-slider-thumb {
          appearance: none;
          width: 16px; height: 16px;
          border-radius: 50%;
          background: ${accent};
          border: 2px solid var(--bg);
          cursor: pointer;
          transition: transform .15s;
          box-shadow: 0 0 8px ${accent}44;
        }
        input[type=range]::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }
      `}</style>
    </div>
  );
}

/* ─── Step Builder (click to reveal each step) ─── */

export function StepBuilder({ steps, accent }: { steps: { label: string; detail: string }[]; accent: string }) {
  const [active, setActive] = useState<number | null>(null);
  return (
    <div style={{ marginBottom: '1rem' }}>
      {steps.map((step, i) => (
        <div key={i} style={{
          marginBottom: '.5rem',
          animation: `fadeUp 0.3s ${i * 0.06}s ease both`,
        }}>
          <button
            onClick={() => setActive(active === i ? null : i)}
            style={{
              width: '100%', padding: '.65rem 1rem', borderRadius: 8,
              background: active === i ? accent + '15' : 'var(--bg3)',
              border: `1px solid ${active === i ? accent + '44' : 'var(--border)'}`,
              color: active === i ? accent : 'var(--text)',
              fontSize: 'var(--font-caption)', cursor: 'pointer', fontFamily: 'var(--font-sans)',
              textAlign: 'left', display: 'flex', alignItems: 'center', gap: '.75rem',
              transition: 'all .2s',
            }}
            onMouseEnter={e => { if (active !== i) { e.currentTarget.style.borderColor = accent + '33'; e.currentTarget.style.background = accent + '08'; }}}
            onMouseLeave={e => { if (active !== i) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg3)'; }}}
          >
            <span style={{
              width: 24, height: 24, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: active === i ? accent + '33' : 'var(--bg2)',
              border: `1px solid ${active === i ? accent + '66' : 'var(--border2)'}`,
              fontFamily: 'var(--font-mono)', fontSize: 'var(--font-micro)',
              flexShrink: 0,
              transition: 'all .2s',
            }}>
              {i + 1}
            </span>
            <span style={{ flex: 1 }}>{step.label}</span>
            <span style={{ transform: active === i ? 'rotate(180deg)' : 'none', transition: 'transform .25s cubic-bezier(0.34, 1.56, 0.64, 1)', fontSize: 'var(--font-micro)' }}>▼</span>
          </button>
          {active === i && (
            <div style={{
              padding: '.75rem 1rem .75rem 2.75rem',
              fontFamily: 'var(--font-mono)', fontSize: 'var(--font-label)',
              color: 'var(--muted)', lineHeight: 1.6,
              overflow: 'hidden',
              animation: 'fadeUp 0.25s ease',
            }}>
              {step.detail}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Toggle Compare (click to flip between two states) ─── */

export function ToggleCompare({ labelA, labelB, renderA, renderB, accent }: {
  labelA: string; labelB: string;
  renderA: React.ReactNode; renderB: React.ReactNode;
  accent: string;
}) {
  const [showB, setShowB] = useState(false);
  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', gap: '.5rem', marginBottom: '.75rem' }}>
        <button
          onClick={() => setShowB(false)}
          style={{
            flex: 1, padding: '.5rem', borderRadius: 8, cursor: 'pointer',
            background: !showB ? accent + '15' : 'var(--bg3)',
            border: `1px solid ${!showB ? accent + '44' : 'var(--border)'}`,
            color: !showB ? accent : 'var(--muted)',
            fontSize: 'var(--font-label)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase',
            letterSpacing: 'var(--ls-mono)', transition: 'all .2s',
          }}
        >
          {labelA}
        </button>
        <button
          onClick={() => setShowB(true)}
          style={{
            flex: 1, padding: '.5rem', borderRadius: 8, cursor: 'pointer',
            background: showB ? accent + '15' : 'var(--bg3)',
            border: `1px solid ${showB ? accent + '44' : 'var(--border)'}`,
            color: showB ? accent : 'var(--muted)',
            fontSize: 'var(--font-label)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase',
            letterSpacing: 'var(--ls-mono)', transition: 'all .2s',
          }}
        >
          {labelB}
        </button>
      </div>
      <div style={{
        animation: 'fadeUp .25s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        {showB ? renderB : renderA}
      </div>
    </div>
  );
}

/* ─── Typewriter Block ─── */

export function TypewriterBlock({ text, accent, speed = 30 }: { text: string; accent: string; speed?: number }) {
  const [displayed, setDisplayed] = useState('');
  const idxRef = useRef(0);

  useEffect(() => {
    idxRef.current = 0;
    setDisplayed('');
    const t = setInterval(() => {
      idxRef.current++;
      setDisplayed(text.slice(0, idxRef.current));
      if (idxRef.current >= text.length) clearInterval(t);
    }, speed);
    return () => clearInterval(t);
  }, [text, speed]);

  return (
    <div style={{
      padding: '1rem', borderRadius: 10, background: 'var(--bg3)',
      border: `1px solid ${accent}22`,
      fontFamily: 'var(--font-mono)', fontSize: 'var(--font-caption)',
      color: 'var(--text)', lineHeight: 1.7, minHeight: 40,
    }}>
      {displayed}
      <span style={{ color: accent, animation: 'blink .7s step-end infinite' }}>▌</span>
    </div>
  );
}

/* ─── Animated Pipeline Flow ─── */

export function AnimatedPipeline({ stages, accent }: {
  stages: { icon: string; label: string; desc: string }[];
  accent: string;
}) {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setActiveIdx(i => (i < stages.length - 1 ? i + 1 : i));
    }, 1500);
    return () => clearInterval(t);
  }, [stages]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', overflowX: 'auto', padding: '1rem 0', gap: 0 }}>
      {stages.map((stage, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <div style={{
            padding: '.65rem .85rem', borderRadius: 10,
            background: i <= activeIdx ? accent + '1e' : 'var(--bg3)',
            border: `1px solid ${i <= activeIdx ? accent + '55' : 'var(--border)'}`,
            textAlign: 'center', minWidth: 90,
            transition: 'all .45s cubic-bezier(0.34, 1.56, 0.64, 1)',
            transform: i === activeIdx ? 'scale(1.08)' : i < activeIdx ? 'scale(1)' : 'scale(0.95)',
            boxShadow: i === activeIdx ? `0 0 20px ${accent}33` : 'none',
          }}>
            <div style={{
              fontSize: '1.2rem', marginBottom: '.2rem',
              transition: 'transform .3s',
              transform: i === activeIdx ? 'scale(1.15)' : 'scale(1)',
            }}>{stage.icon}</div>
            <div style={{
              fontSize: 'var(--font-caption)', fontWeight: 500,
              color: i <= activeIdx ? accent : 'var(--muted)',
              transition: 'color .45s',
            }}>{stage.label}</div>
            <div style={{
              fontSize: 'var(--font-micro)', color: 'var(--muted)', marginTop: '.15rem',
              opacity: i <= activeIdx ? 1 : 0.5,
              transition: 'opacity .45s',
            }}>{stage.desc}</div>
          </div>
          {i < stages.length - 1 && (
            <div style={{
              padding: '0 .35rem', fontSize: 'var(--font-body-lg)',
              color: i < activeIdx ? accent : 'var(--muted)',
              transition: 'color .45s',
              animation: i === activeIdx ? 'pulseArrow .8s ease infinite' : 'none',
            }}>→</div>
          )}
        </div>
      ))}
      <style>{`
        @keyframes pulseArrow {
          0%, 100% { opacity: 0.3; transform: translateX(0); }
          50% { opacity: 1; transform: translateX(3px); }
        }
        @keyframes barGrow {
          from { width: 0 !important; }
        }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   NEW INTERACTIVE COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

/* ─── CompareSlider — drag to compare before/after ─── */

export function CompareSlider({ left, right, leftLabel, rightLabel, accent }: {
  left: React.ReactNode; right: React.ReactNode;
  leftLabel: string; rightLabel: string; accent: string;
}) {
  const [pos, setPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const handleMove = (clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPos((x / rect.width) * 100);
  };

  return (
    <div style={{ marginBottom: '1.5rem', userSelect: 'none' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.5rem', fontSize: 'var(--font-label)', fontFamily: 'var(--font-mono)' }}>
        <span style={{ color: 'var(--muted)' }}>{leftLabel}</span>
        <span style={{ color: 'var(--muted)' }}>{rightLabel}</span>
      </div>
      <div
        ref={containerRef}
        onMouseDown={() => { dragging.current = true; }}
        onMouseMove={e => { if (dragging.current) handleMove(e.clientX); }}
        onMouseUp={() => { dragging.current = false; }}
        onMouseLeave={() => { dragging.current = false; }}
        onTouchMove={e => handleMove(e.touches[0].clientX)}
        style={{
          position: 'relative', overflow: 'hidden', borderRadius: 12,
          background: 'var(--bg3)', border: '1px solid var(--border)', cursor: 'ew-resize',
          minHeight: 100,
        }}
      >
        <div style={{ position: 'absolute', inset: 0, padding: '1rem' }}>{left}</div>
        <div style={{
          position: 'absolute', inset: 0, padding: '1rem',
          clipPath: `inset(0 ${100 - pos}% 0 0)`,
          background: 'var(--bg2)', borderRight: `2px solid ${accent}`,
          transition: dragging.current ? 'none' : 'clip-path .3s, border .3s',
        }}>{right}</div>
        <div style={{
          position: 'absolute', top: 0, bottom: 0, left: `${pos}%`, width: 2,
          background: accent, transform: 'translateX(-50%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: '50%', left: `${pos}%`,
          width: 28, height: 28, borderRadius: '50%',
          background: accent, transform: 'translate(-50%, -50%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '12px', color: '#fff',
          pointerEvents: 'none', boxShadow: `0 0 12px ${accent}66`,
        }}>⇄</div>
      </div>
    </div>
  );
}

/* ─── LiveCounter — animated number count-up ─── */

export function LiveCounter({ value, label, accent, suffix = '', decimals = 0 }: {
  value: number; label: string; accent: string; suffix?: string; decimals?: number;
}) {
  const [display, setDisplay] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) setStarted(true);
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const duration = 1000;
    const steps = 30;
    const increment = value / steps;
    let current = 0;
    const t = setInterval(() => {
      current += increment;
      if (current >= value) { setDisplay(value); clearInterval(t); }
      else setDisplay(current);
    }, duration / steps);
    return () => clearInterval(t);
  }, [started, value]);

  return (
    <div ref={ref} style={{
      padding: '1rem', borderRadius: 12, background: accent + '0a',
      border: `1px solid ${accent}22`, textAlign: 'center',
    }}>
      <div style={{ fontSize: 'var(--font-micro)', fontFamily: 'var(--font-mono)', color: 'var(--muted)', marginBottom: '.25rem' }}>{label}</div>
      <div style={{
        fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 600,
        fontFamily: 'var(--font-mono)', color: accent,
      }}>
        {started ? display.toFixed(decimals) + suffix : '0' + suffix}
      </div>
    </div>
  );
}

/* ─── Interactive WordGrid — click words to see relationships ─── */

export function WordGrid({ words, accent }: {
  words: { word: string; group: string; desc: string }[];
  accent: string;
}) {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {words.map((w, i) => (
          <button
            key={i}
            onClick={() => setSelected(selected === i ? null : i)}
            style={{
              padding: '6px 12px', borderRadius: 8, cursor: 'pointer', fontFamily: 'var(--font-mono)',
              fontSize: 'var(--font-caption)', border: '1px solid',
              background: selected === i ? accent + '1e' : 'var(--bg3)',
              borderColor: selected === i ? accent + '55' : 'var(--border)',
              color: selected === i ? accent : 'var(--text)',
              transition: 'all .2s',
            }}
          >
            {w.word}
          </button>
        ))}
      </div>
      {selected !== null && (
        <div style={{
          marginTop: '.5rem', padding: '.65rem .85rem', borderRadius: 8,
          background: accent + '08', border: `1px solid ${accent}22`,
          fontFamily: 'var(--font-mono)', fontSize: 'var(--font-label)',
          color: 'var(--muted)', lineHeight: 'var(--lh-snug)',
          animation: 'fadeIn .25s ease',
        }}>
          <strong style={{ color: accent }}>{words[selected].word}</strong> ({words[selected].group}): {words[selected].desc}
        </div>
      )}
    </div>
  );
}

/* ─── PulseButton — button with animated ring ─── */

export function PulseButton({ onClick, label, accent, icon }: {
  onClick: () => void; label: string; accent: string; icon?: string;
}) {
  const [pulse, setPulse] = useState(false);
  return (
    <button
      onClick={() => { onClick(); setPulse(true); setTimeout(() => setPulse(false), 600); }}
      style={{
        position: 'relative', padding: '.55rem 1.2rem', borderRadius: 9,
        background: accent + '15', border: `1px solid ${accent}44`,
        color: accent, fontSize: 'var(--font-body)', fontWeight: 500,
        cursor: 'pointer', fontFamily: 'var(--font-sans)',
        display: 'inline-flex', alignItems: 'center', gap: '.4rem',
        transition: 'all .2s',
      }}
    >
      {icon && <span>{icon}</span>}
      {label}
      {pulse && (
        <span style={{
          position: 'absolute', inset: -4, borderRadius: 12,
          border: `2px solid ${accent}`,
          animation: 'ping .6s ease',
        }} />
      )}
      <style>{`
        @keyframes ping {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.3); opacity: 0; }
        }
      `}</style>
    </button>
  );
}
