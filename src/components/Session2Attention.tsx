import { useEffect, useRef, useState } from 'react';
import { AnalogyGrid, DemoCard, RevealSection, SectionHeader, SubSection, ConceptBlock, KeyPoint, CodeExample, FlowDiagram, InfoBox, ComparisonTable } from './shared';

const SENTENCE = ['The', 'cat', 'sat', 'on', 'the', 'mat', 'near', 'the', 'door'];
const ATTENTION: Record<number, number[]> = {
  0: [0.1, 0.4, 0.1, 0.05, 0.3, 0.05, 0.0, 0.0, 0.0],
  1: [0.2, 0.1, 0.5, 0.05, 0.05, 0.05, 0.02, 0.02, 0.01],
  2: [0.05, 0.4, 0.1, 0.15, 0.05, 0.1, 0.05, 0.05, 0.05],
  3: [0.05, 0.1, 0.2, 0.05, 0.1, 0.3, 0.1, 0.05, 0.05],
  4: [0.3, 0.1, 0.1, 0.05, 0.1, 0.2, 0.05, 0.05, 0.05],
  5: [0.05, 0.1, 0.2, 0.3, 0.15, 0.1, 0.05, 0.02, 0.03],
  6: [0.05, 0.05, 0.1, 0.1, 0.05, 0.15, 0.1, 0.2, 0.2],
  7: [0.1, 0.05, 0.05, 0.05, 0.2, 0.05, 0.1, 0.1, 0.3],
  8: [0.05, 0.05, 0.05, 0.1, 0.05, 0.1, 0.3, 0.2, 0.1],
};

const AC = '#a78bfa';

function drawAttention(canvas: HTMLCanvasElement, fromIdx: number) {
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.parentElement!.clientWidth;
  const H = 200;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  canvas.style.height = H + 'px';
  const ctx = canvas.getContext('2d')!;
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, W, H);
  const weights = ATTENTION[fromIdx] || [];
  const cols = SENTENCE.length;
  const colW = W / cols;

  weights.forEach((weight, i) => {
    if (weight < 0.03) return;
    const x1 = colW * fromIdx + colW / 2;
    const x2 = colW * i + colW / 2;
    ctx.beginPath();
    ctx.moveTo(x1, 30);
    ctx.quadraticCurveTo((x1 + x2) / 2, 30 + (160 - 30) * 0.4 - 40, x2, 160);
    ctx.strokeStyle = `rgba(167,139,250,${weight * 2.5})`;
    ctx.lineWidth = weight * 10;
    ctx.stroke();
  });

  const sx = colW * fromIdx + colW / 2;
  ctx.fillStyle = 'rgba(167,139,250,0.15)';
  ctx.beginPath(); ctx.roundRect(sx - 30, 10, 60, 28, 6); ctx.fill();
  ctx.strokeStyle = 'rgba(167,139,250,0.6)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.roundRect(sx - 30, 10, 60, 28, 6); ctx.stroke();
  ctx.fillStyle = '#a78bfa'; ctx.font = '13px DM Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText(SENTENCE[fromIdx], sx, 29);

  SENTENCE.forEach((w, i) => {
    const x = colW * i + colW / 2;
    const weight = weights[i] || 0;
    ctx.fillStyle = `rgba(255,255,255,${0.3 + weight * 2})`;
    ctx.font = weight > 0.2 ? '500 13px DM Mono, monospace' : '13px DM Mono, monospace';
    ctx.fillText(w, x, 175);
    if (weight > 0.05) {
      ctx.fillStyle = `rgba(167,139,250,${weight * 3})`;
      ctx.font = '11px DM Mono, monospace';
      ctx.fillText((weight * 100).toFixed(0) + '%', x, 195);
    }
  });
}

export default function Session2Attention() {
  const [selected, setSelected] = useState(2);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) drawAttention(canvasRef.current, selected);
  }, [selected]);

  useEffect(() => {
    const handleResize = () => { if (canvasRef.current) drawAttention(canvasRef.current, selected); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [selected]);

  return (
    <section id="s2" style={{ maxWidth: 900, margin: '0 auto', padding: '5rem 2rem' }}>
      <RevealSection>
        <SectionHeader num="02" tag="Session 2 · 1.5 hrs" title="Attention & Transformers" accentColor={AC} borderColor="rgba(167,139,250,0.3)" />
        <p style={{ color: 'var(--muted)', maxWidth: 600, marginBottom: '2.5rem', fontSize: 15 }}>
          The transformer architecture revolutionized AI in 2017. Its core innovation: <strong style={{ color: 'var(--text)' }}>self-attention</strong> —
          a mechanism that lets every token look at every other token and decide how much to care about it.
        </p>
      </RevealSection>

      {/* ── The Problem Before Transformers ── */}
      <RevealSection>
        <SubSection title="Why we needed transformers" accent={AC}>
          <ConceptBlock title="The RNN bottleneck" accent={AC}>
            Before transformers, language models used RNNs — they read text left-to-right, one token at a time,
            maintaining a hidden state. The problem: by the time they reach the end of a long sentence,
            they've <strong style={{ color: 'var(--text)' }}>forgotten</strong> what was at the beginning.
            Information degrades over distance.
          </ConceptBlock>

          <ComparisonTable accent={AC} headers={['Property', 'RNN', 'Transformer']} rows={[
            { label: '', cells: ['Processing', 'Sequential (one at a time)', 'Parallel (all at once)'] },
            { label: '', cells: ['Long-range dependencies', 'Poor — info decays', 'Excellent — direct connections'] },
            { label: '', cells: ['Training speed', 'Slow — can\'t parallelize', 'Fast — fully parallelizable'] },
            { label: '', cells: ['Memory', 'Fixed hidden state', 'Grows O(n²) with sequence length'] },
          ]} />
        </SubSection>
      </RevealSection>

      {/* ── Self-Attention Mechanism ── */}
      <RevealSection>
        <SubSection title="Self-attention: the core computation" accent={AC}>
          <ConceptBlock title="Query, Key, Value" accent={AC}>
            Every token creates three vectors from its embedding: a <strong style={{ color: 'var(--text)' }}>Query</strong> (what am I looking for?),
            a <strong style={{ color: 'var(--text)' }}>Key</strong> (what do I contain?), and a <strong style={{ color: 'var(--text)' }}>Value</strong> (what information do I carry?).
            Attention is the dot product of Query and Key — it measures how relevant two tokens are to each other.
          </ConceptBlock>

          <FlowDiagram accent={AC} steps={[
            { label: 'Embed tokens', sub: 'Input → vectors' },
            { label: 'Create Q, K, V', sub: 'Linear projections' },
            { label: 'Dot product', sub: 'Q × Kᵀ = scores' },
            { label: 'Softmax', sub: 'Normalize → weights' },
            { label: 'Weighted sum', sub: 'Weights × V = output' },
          ]} />

          <CodeExample accent={AC} code={`# Self-attention in 5 lines
Q = x @ W_q    # Query: "what am I looking for?"    [seq_len, d_k]
K = x @ W_k    # Key:   "what do I contain?"        [seq_len, d_k]
V = x @ W_v    # Value: "what info do I carry?"     [seq_len, d_v]

scores = Q @ K.T / sqrt(d_k)          # Raw attention scores
weights = softmax(scores, dim=-1)      # Normalize to probabilities
output = weights @ V                   # Weighted combination of values`} />

          <KeyPoint num={1} title="The dot product is the magic" accent={AC}>
            When Query and Key point in similar directions, their dot product is large — meaning those two tokens are relevant to each other.
            "The <em>cat</em> sat on the <em>mat</em>" — "cat" creates a Query that matches "mat"'s Key because
            cats and mats are semantically linked. The model <em>learned</em> these Q/K/V projections during training.
          </KeyPoint>

          <KeyPoint num={2} title="Softmax normalizes into probabilities" accent={AC}>
            Raw dot products can be any number. Softmax converts them into a probability distribution that sums to 1.
            The scaling by sqrt(d_k) prevents the gradients from vanishing when d_k is large.
          </KeyPoint>

          <KeyPoint num={3} title="The output is a weighted blend" accent={AC}>
            Each token's output is a weighted average of all Value vectors. Tokens with high attention weights
            contribute more. This is how "cat" can incorporate information from "mat" — and every other token — simultaneously.
          </KeyPoint>
        </SubSection>
      </RevealSection>

      {/* ── Multi-Head Attention ── */}
      <RevealSection>
        <SubSection title="Multi-head attention: multiple perspectives" accent={AC}>
          <ConceptBlock title="Why multiple heads?" accent={AC}>
            A single attention head learns one type of relationship. But language has many: grammar, semantics,
            coreference, position. Multi-head attention runs the same computation in parallel with different
            Q/K/V projections, letting each head specialize.
          </ConceptBlock>

          <AnalogyGrid items={[
            { emoji: '📚', title: 'The library analogy', desc: 'Query = what you\'re looking for. Key = the index card on each book. Value = the book\'s actual content. Attention = matching query to keys, retrieving values.' },
            { emoji: '🔭', title: 'Head specialization', desc: 'Head 1 might track subject-verb agreement. Head 5 tracks pronoun references. Head 12 tracks positional proximity. They run in parallel and get concatenated.' },
            { emoji: '🕸️', title: 'Every word sees every word', desc: 'Unlike RNNs that read left-to-right, transformers process all tokens in parallel. Any token can attend to any other — no information bottleneck.' },
            { emoji: '🗼', title: 'Layers build understanding', desc: 'Layer 1 learns local patterns. Layer 5 learns syntax. Layer 20 learns semantics. Layer 96 does complex reasoning. Depth = abstraction level.' },
          ]} />
        </SubSection>
      </RevealSection>

      {/* ── Positional Encoding ── */}
      <RevealSection>
        <SubSection title="Positional encoding: where words are matters" accent={AC}>
          <ConceptBlock title="Attention is order-agnostic" accent={AC}>
            Self-attention treats input as a <strong style={{ color: 'var(--text)' }}>bag of tokens</strong> — it has no
            built-in sense of order. "The dog bit the man" and "The man bit the dog" would look identical.
            Positional encodings solve this by adding position information to each token's embedding before attention.
          </ConceptBlock>

          <KeyPoint num={1} title="Sinusoidal encodings (original)" accent={AC}>
            The original transformer uses sine and cosine functions of different frequencies.
            Each position gets a unique pattern. Nearby positions have similar patterns; distant positions have different patterns.
            This lets the model learn relative positions.
          </KeyPoint>

          <KeyPoint num={2} title="Rotary Position Embeddings (RoPE)" accent={AC}>
            Modern LLMs (Llama, Mistral, etc.) use RoPE, which encodes position by rotating the Query and Key vectors.
            The angle of rotation depends on position. This naturally gives relative position information
            because the dot product of two rotated vectors depends on their angle difference.
          </KeyPoint>
        </SubSection>
      </RevealSection>

      {/* ── The Full Transformer Block ── */}
      <RevealSection>
        <SubSection title="The full transformer block" accent={AC}>
          <FlowDiagram accent={AC} steps={[
            { label: 'Input', sub: 'Token embeddings' },
            { label: '+ Position', sub: 'Add pos encoding' },
            { label: 'Multi-Head Attn', sub: 'Self-attention' },
            { label: 'Add & Norm', sub: 'Residual + LayerNorm' },
            { label: 'Feed-Forward', sub: '2-layer MLP' },
            { label: 'Add & Norm', sub: 'Residual + LayerNorm' },
          ]} />

          <InfoBox accent={AC}>
            <strong style={{ color: 'var(--text)' }}>Residual connections</strong> are critical: they let gradients flow
            through deep networks and let each layer learn small corrections to the previous representation.
            Without them, 96-layer models would be impossible to train. LayerNorm stabilizes training by normalizing
            activations across the feature dimension.
          </InfoBox>
        </SubSection>
      </RevealSection>

      {/* ── Live Demo ── */}
      <RevealSection>
        <DemoCard label="Live Demo — Attention Weights" title="Click a word to see what it attends to" desc="This simulates attention in the sentence below. Thicker, brighter lines = stronger attention weight.">
          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: '1rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem', marginBottom: '1rem' }}>
              {SENTENCE.map((word, i) => (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  style={{
                    padding: '.4rem .9rem', borderRadius: 8,
                    background: selected === i ? 'rgba(167,139,250,.15)' : 'var(--bg2)',
                    border: selected === i ? '1px solid var(--accent2)' : '1px solid var(--border)',
                    color: selected === i ? 'var(--accent2)' : 'var(--text)',
                    fontFamily: "'DM Mono', monospace", fontSize: 14,
                    cursor: 'pointer', transition: 'all .2s',
                  }}
                >
                  {word}
                </button>
              ))}
            </div>
            <div style={{ borderRadius: 12, background: 'var(--bg2)', border: '1px solid var(--border)', overflow: 'hidden' }}>
              <canvas ref={canvasRef} style={{ display: 'block', width: '100%' }} />
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: '.75rem', fontFamily: "'DM Mono', monospace" }}>
              Click any word above to see its attention pattern
            </div>
          </div>
        </DemoCard>
      </RevealSection>
    </section>
  );
}
