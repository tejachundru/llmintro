import { Routes, Route } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import SessionPage from './pages/SessionPage';
import Home from './pages/Home';
import Session1Tokenizer from './components/Session1Tokenizer';
import Session2Attention from './components/Session2Attention';
import Session3Context from './components/Session3Context';
import Session4RAG from './components/Session4RAG';
import Session5Prompting from './components/Session5Prompting';
import Session6MCP from './components/Session6MCP';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/1" element={<SessionPage num={1}><Session1Tokenizer /></SessionPage>} />
        <Route path="/2" element={<SessionPage num={2}><Session2Attention /></SessionPage>} />
        <Route path="/3" element={<SessionPage num={3}><Session3Context /></SessionPage>} />
        <Route path="/4" element={<SessionPage num={4}><Session4RAG /></SessionPage>} />
        <Route path="/5" element={<SessionPage num={5}><Session5Prompting /></SessionPage>} />
        <Route path="/6" element={<SessionPage num={6}><Session6MCP /></SessionPage>} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
