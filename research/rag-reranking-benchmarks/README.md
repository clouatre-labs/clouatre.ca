# RAG Reranking Benchmarks

Supplementary materials for [Making Legacy Knowledge Searchable with RAG](https://clouatre.ca/posts/rag-legacy-systems/).

## Key Finding

**Reranking overhead is minimal and model-agnostic:**

| Metric | Value |
|--------|-------|
| Mean overhead | +31ms |
| Overhead as % of total query time | 0.3% |
| Cross-model variance | 3.7ms |

Reranking adds negligible latency while improving retrieval quality by 6-8%.

## Contents

| File | Description |
|------|-------------|
| `README.md` | This overview |
| `METHODOLOGY.md` | Detailed measurement approach |
| `benchmark_retrieval.py` | Reproducible benchmark script (template) |
| `results_summary.json` | Aggregate timing data |

## Quick Results

### Single-Model Benchmark (Production)

| Metric | With Reranking | Without Reranking | Difference |
|--------|----------------|-------------------|------------|
| Mean Latency | 79.1ms | 47.8ms | +31.3ms |
| Median Latency | 82.1ms | 49.9ms | +32.2ms |
| Min Latency | 50.3ms | 32.5ms | +17.8ms |
| Max Latency | 124.6ms | 80.6ms | +44.0ms |

### Multi-Model Benchmark (Cross-Provider Validation)

| Model Family | Size | Reranking Overhead |
|--------------|------|-------------------|
| Mistral | 22B | +32.5ms |
| Llama | 70B | +24.1ms |
| Qwen | 32B | +25.1ms |
| **Mean** | - | **+27.2ms (±3.7ms)** |

Cross-provider comparison (Amazon Bedrock vs OpenRouter): 4.1ms difference, confirming model-agnostic behavior.

## System Configuration

- **Corpus:** 7,432 pages, 20,679 chunks (legacy enterprise documentation)
- **Retrieval:** Hybrid (BM25 + vector search with RRF fusion)
- **Reranking:** FlashRank ms-marco-MiniLM-L-12-v2 (~4MB, CPU-optimized)
- **Candidates:** 16 retrieved, reranked to top 8
- **Hardware:** MacBook Pro M-series (CPU only, no GPU)

## Adapting for Your System

The benchmark script is a template. Modify for your RAG implementation:

1. Replace imports with your RAG components
2. Define domain-specific test queries
3. Adjust retrieval configuration (k, reranking model)

See `benchmark_retrieval.py` for the full template with inline comments.

## Citation

```
Clouatre, H. (2026). RAG Reranking Benchmarks.
Supplementary materials for "Making Legacy Knowledge Searchable with RAG".
https://clouatre.ca/posts/rag-legacy-systems/
```

## License

Apache-2.0

## Contact

- Blog: [clouatre.ca](https://clouatre.ca)
- LinkedIn: [huguesclouatre](https://linkedin.com/in/huguesclouatre)
