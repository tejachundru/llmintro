import { useEffect, useState } from 'react';

export default function SessionPage({ children, num }: { children: React.ReactNode; num: number }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 50);
    window.scrollTo({ top: 0, behavior: 'instant' });
    return () => clearTimeout(t);
  }, [num]);

  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.98)',
      filter: visible ? 'blur(0)' : 'blur(4px)',
      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    }}>
      {children}
    </div>
  );
}
