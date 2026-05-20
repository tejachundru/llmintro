import Hero from './components/Hero';
import ProgressDots from './components/ProgressDots';
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
      <ProgressDots />
      <Hero />
      <Divider />
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
      <Divider />
      <footer style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--muted)', fontSize: 13 }}>
        LLMs Under the Hood — Team Training · 6 Sessions
      </footer>
    </>
  );
}
