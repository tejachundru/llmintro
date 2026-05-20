import Hero from './components/Hero';
import SessionNav from './components/SessionNav';
import Session1Tokenizer from './components/Session1Tokenizer';
import Session2Attention from './components/Session2Attention';
import Session3Context from './components/Session3Context';
import Session4RAG from './components/Session4RAG';
import Session5Prompting from './components/Session5Prompting';
import Session6MCP from './components/Session6MCP';
import { Divider } from './components/shared';

export default function App() {
  return (
    <>
      <header>
        <Hero />
      </header>
      <main style={{ paddingBottom: 80 }}>
        <Session1Tokenizer />
        <Divider />
        <Session2Attention />
        <Divider />
        <Session3Context />
        <Divider />
        <Session4RAG />
        <Divider />
        <Session5Prompting />
        <Divider />
        <Session6MCP />
      </main>
      <Divider />
      <footer style={{ textAlign: 'center', padding: 'var(--space-4xl) var(--space-xl)', color: 'var(--muted)', fontSize: 'var(--font-caption)' }}>
        LLMs Made Simple — Team Training · 6 Sessions
      </footer>
      <SessionNav />
    </>
  );
}
