# Methodology: RAG Reranking Benchmarks

## What We Measured

**Retrieval latency only** - the time from query submission to ranked document retrieval, excluding LLM generation.

| Component | Included | Time |
|-----------|----------|------|
| BM25 search | Yes | ~15ms |
| Vector search | Yes | ~25ms |
| RRF fusion | Yes | ~2ms |
| Reranking | Yes (when enabled) | ~31ms |
| LLM generation | **No** | ~4,000ms |

**Why exclude LLM generation?** The 4-second LLM response time would mask the 31ms reranking overhead. Isolating retrieval shows the true cost of reranking.

## Test Configuration

### Corpus

- **Size:** 7,432 pages, 20,679 chunks
- **Type:** Legacy enterprise software documentation (PDFs)
- **Chunking:** 1,000 tokens with 200-token overlap

### Retrieval Pipeline

```
Query → BM25 (top 16) + Vector (top 16) → RRF Fusion → Rerank (top 8) → LLM
```

- **Hybrid retrieval:** BM25 (lexical) + dense vectors (semantic)
- **Fusion:** Reciprocal Rank Fusion (RRF) with k=60
- **Reranking:** FlashRank cross-encoder, 16 candidates to 8 results

### Reranking Model

- **Model:** ms-marco-MiniLM-L-12-v2
- **Size:** ~4MB
- **Inference:** CPU only (no GPU required)
- **Library:** FlashRank (Python)

### Hardware

- MacBook Pro M-series
- 16GB RAM
- CPU-only inference (no GPU acceleration)

## Measurement Protocol

### Single-Model Benchmark

1. **Warm-up:** Load embeddings, vector store, BM25 index (cached)
2. **Queries:** 20 domain-specific questions covering configuration, troubleshooting, architecture
3. **Runs:** 3 iterations per query (60 total measurements)
4. **Conditions:** With reranking vs. without reranking
5. **Timing:** `time.perf_counter()` around retrieval call only

### Multi-Model Benchmark

Same protocol, repeated across 3 LLM families:

| Model | Family | Size | Provider |
|-------|--------|------|----------|
| Devstral | Mistral | 22B | OpenRouter |
| Llama 3.3 | Meta | 70B | OpenRouter |
| Qwen 2.5 Coder | Alibaba | 32B | OpenRouter |

**Total measurements:** 360 (20 queries x 3 models x 2 conditions x 3 runs)

## Why This Approach

### Warm Cache

Production systems operate with warm caches. Cold start (2.2s) is a one-time cost at startup. Users experience warm cache performance.

### Multiple Runs

Averaging 3 runs per query reduces variance from:
- OS scheduling noise
- Background processes
- Memory allocation patterns

### Retrieval Isolation

Measuring retrieval separately from generation allows:
- Accurate overhead calculation
- Fair comparison across LLM providers
- Identification of retrieval bottlenecks

## Statistical Validation

### Variance Analysis (Multi-Model)

**Null hypothesis:** Reranking overhead varies significantly across models.

| Metric | Value |
|--------|-------|
| Between-group variance | 17.6 ms² |
| Within-group variance | 3.7 ms² |
| F-statistic | 4.76 |
| p-value | 0.09 |

**Conclusion:** No statistically significant difference in overhead across models (p > 0.05).

### Confidence Intervals (95%)

| Model | Overhead | 95% CI |
|-------|----------|--------|
| Mistral | 32.5ms | [24.7, 40.3] |
| Llama | 24.1ms | [20.4, 27.8] |
| Qwen | 25.1ms | [21.2, 29.0] |

Overlapping confidence intervals confirm model-agnostic behavior.

## Comparison to Industry Benchmarks

| Source | Reported Overhead | Our Result |
|--------|-------------------|------------|
| FlashRank paper | 50-100ms | 31ms |
| CustomGPT (2025) | 50-150ms | 31ms |
| LangChain docs | "negligible for <1000 candidates" | 31ms for 16 candidates |

Our lower overhead is likely due to:
1. Small candidate set (16 vs typical 50-100)
2. CPU-optimized model choice
3. Efficient hybrid retrieval (fewer irrelevant candidates)

## Limitations

### Domain Specificity

Queries focused on enterprise software documentation. Results may vary for:
- Conversational queries
- Multi-hop reasoning
- Non-technical domains

### Hardware Dependency

CPU-only benchmarks. GPU acceleration would reduce overhead further but wasn't necessary for our use case.

### Provider Variability

OpenRouter free tier may introduce rate limiting and network variability. Mitigated by averaging multiple runs.

## Reproducibility

To reproduce these benchmarks:

1. Set up a hybrid RAG system (BM25 + vector + reranking)
2. Define 20+ domain-specific queries
3. Run each query 3 times with and without reranking
4. Measure retrieval time only (exclude LLM generation)
5. Calculate mean, median, min, max for each condition

See `benchmark_retrieval.py` for a template implementation.
