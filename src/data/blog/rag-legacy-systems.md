---
title: "RAG for Legacy Systems: 7,432 Pages to 3s Answers"
pubDatetime: 2026-01-22T23:02:00Z
description: "Production RAG for legacy systems: model-agnostic reranking validated across 4 LLM families. Real metrics, no vendor lock-in, 7,432 pages to 3s queries."
featured: true
draft: false
tags:
  - ai
  - rag
  - legacy-systems
  - amazon-bedrock
  - reranking
---

Your legacy system documentation is 20 years old, 7,432 pages, and locked in PDFs. Manual search takes 15-30 minutes per query. We made it queryable in 170 seconds. Query response time: 3-5 seconds. ROI break-even: one day.

This isn't a prototype. It's production RAG on Amazon Bedrock, validated across 4 LLM families with 420 measurements. The implementation indexes 20,679 chunks and delivers sub-5-second responses with model-agnostic reranking. Overhead: 27.2ms ± 3.7ms regardless of which LLM you use.

Here's the production architecture, the multi-model validation data, and why you can switch providers without re-tuning.

## Why RAG, Not Fine-Tuning?

Fine-tuning sounds appealing. Train a model on your docs, get perfect answers. The reality is messier. Fine-tuning bakes knowledge into model weights (making provenance verification difficult), requires retraining for every update, and costs $3-15 per run with modern QLoRA on cloud GPUs. RAG setup costs $0 with local embeddings, updates instantly by re-indexing, and keeps knowledge external (making source verification straightforward).

The decision isn't about cost anymore. In 2026, QLoRA fine-tuning on an A100 costs [$0.66-0.78/hour on GPU clouds like Thunder Compute](https://www.thundercompute.com/blog/ai-gpu-rental-market-trends) (Thunder Compute, 2025), or $3-4/hour on AWS/GCP/Azure. For bursty fine-tuning workloads, specialized providers are 80% cheaper. A 7B model trains in 2-8 hours, totaling $1.32-6.24 per run on specialized clouds. With quarterly updates, that's $5.28-24.96 annually. RAG costs $0.0011 per query on Amazon Bedrock. Fine-tuning breaks even at just 13-57 queries per day on specialized clouds.

For legacy systems, RAG wins on operational factors, not economics. Documentation is scattered across wikis and PDFs. It's mostly static but evolves as reverse-engineering uncovers new system behaviors. Query volume is low (dozens per week, not thousands per day). The deciding factors: instant updates (2 seconds vs retraining), source citations for compliance, and simpler maintenance.

We evaluated both approaches for this use case. Fine-tuning would require retraining every time we discover new system behaviors. RAG setup took 170 seconds with local embeddings ($0 cost). Updates take 2 seconds when documentation changes. At our query volume (50-100/week), both approaches cost under $20/year. We chose RAG for agility, not savings.

## How Does RAG Turn PDFs Into Answers?

The pipeline has six stages. Extract text from PDFs using PyMuPDF. Convert to Markdown with heading detection and cleanup. Load Markdown files. Split into 1,000-character chunks with 200-character overlap. Generate embeddings with a local model (all-MiniLM-L6-v2). Store in ChromaDB vector database. Query with hybrid retrieval combining keyword search (BM25) and semantic search (vector similarity).

```python file="src/ingest.py"
import fitz  # pymupdf

doc = fitz.open(pdf_path)
for page_num in range(len(doc)):
    page = doc[page_num]
    text = page.get_text()  # [!code highlight]
    
    for line in text.split("\n"):  # [!code highlight]
        # Detect chapter headings (e.g., "Chapter 1. Title")
        if line.startswith("Chapter ") and ". " in line:
            cleaned_lines.append(f"\n## {line}\n")  # [!code highlight]
        # Detect section headings
        elif len(line) < 80 and line[0].isupper():
            cleaned_lines.append(f"\n### {line}\n")  # [!code highlight]
doc.close()
```

*Code Snippet 1: PyMuPDF extracts text and converts to Markdown with heading detection, processing 44 pages/second.*

The pipeline converts PDFs to Markdown before chunking. This preserves document structure (chapters, sections, headings) and enables Markdown-aware chunking that respects semantic boundaries. Chunks split at heading boundaries (`## `, `### `) instead of mid-paragraph, keeping related content together. The Markdown files are cached, so subsequent runs skip PDF extraction and complete in 2 seconds instead of 170 seconds.

Hybrid retrieval matters. Pure vector search misses exact terms like "port 5432" or "module_id 2847". Pure keyword search misses semantic queries like "how do I configure authentication?" Combining both with Reciprocal Rank Fusion (RRF) [consistently outperforms either method alone](https://arxiv.org/abs/2401.04055) (Mandikal & Mooney, 2024).

```python file="src/rag.py"
# Reciprocal Rank Fusion (RRF) combines BM25 + vector scores
doc_scores: dict[str, tuple[Document, float]] = {}

for rank, idx in enumerate(bm25_top_indices[:retrieve_k]):
    doc = chunks[idx]
    doc_id = doc.metadata.get("source", "") + str(hash(doc.page_content[:100]))
    rrf_score = 1 / (rank + 60)  # RRF with k=60 // [!code highlight]
    if doc_id in doc_scores:
        doc_scores[doc_id] = (doc, doc_scores[doc_id][1] + rrf_score)
    else:
        doc_scores[doc_id] = (doc, rrf_score)
```

*Code Snippet 2: RRF formula combines keyword and semantic search scores with k=60 constant.*

Hybrid retrieval returns 16 candidate chunks. A cross-encoder model (FlashRank) scores each query-document pair and returns the top 8. This fixes the precision problem: high recall from hybrid search, high precision from reranking.

![RAG Pipeline with Reranking](@/assets/images/rag-pipeline-reranking.png)

*Figure 1: RAG pipeline with hybrid retrieval and reranking (FlashRank adds 31ms overhead for [6-8% accuracy gain](https://arxiv.org/abs/2601.03258)) (FlashRank Research Team, 2026)*

Why local embeddings? Cost and privacy. Cloud embedding APIs charge $0.10-0.50 per million tokens. Local models are free and keep sensitive docs on-premises. The all-MiniLM-L6-v2 model is 80 MB, runs on CPU, and embeds 1,000 chunks in under 10 seconds.

The architecture is model-agnostic by design. We use Amazon Bedrock, but the same pipeline works with Azure OpenAI, Google Vertex AI, or local models. We proved this with multi-model validation.

## Does Reranking Work Across Different Models?

We tested across four LLM families to validate portability: Anthropic (Claude Haiku 4.5), Mistral (Devstral-2512), Meta (Llama 3.3 70B), and Alibaba (Qwen 2.5 Coder 32B). The question: does the LLM choice affect performance?

No impact: mean latency was 27.2ms ± 3.7ms across 420 measurements. ANOVA p-value of 0.09 confirms no statistically significant difference. Cross-provider variance (Amazon Bedrock vs OpenRouter) was only 4.1ms.

*Table 1: Latency is consistent across models and providers (420 measurements, ANOVA p=0.09)*

| Model | Family | Specialization | Latency | Provider |
|-------|--------|----------------|---------|----------|
| Claude Haiku 4.5 | Anthropic | Coding | +31.3ms | Amazon Bedrock |
| Mistral Devstral-2512 | Mistral | Coding | +32.5ms | OpenRouter |
| Llama 3.3 Instruct | Meta | General | +24.1ms | OpenRouter |
| Qwen 2.5 Coder | Alibaba | Coding | +25.1ms | OpenRouter |

The latency is dominated by FlashRank's cross-encoder, not the LLM. This means you implement once and switch providers without re-tuning.

```python file="src/rag.py"
from flashrank import Ranker, RerankRequest

def _rerank(self, query: str, docs: list[Document]) -> list[Document]:
    passages = [
        {"id": i, "text": doc.page_content, "meta": doc.metadata}
        for i, doc in enumerate(docs)
    ]
    
    rerank_request = RerankRequest(query=query, passages=passages)  # [!code highlight]
    results = self.ranker.rerank(rerank_request)  # [!code highlight]
    
    return [docs[result["id"]] for result in results[:RERANK_TOP_N]]
```

*Code Snippet 3: FlashRank reranks 16 candidates in 31ms using cross-encoder scoring.*

The practical takeaway: reranking is infrastructure, not model-specific configuration. Build it into your retrieval pipeline and forget about it.

## What Are the Real Performance Numbers?

With model-agnostic reranking validated, here are the production metrics.

We indexed 7,432 pages in 170 seconds. First-time setup includes PDF extraction (120s), chunking (20s), embedding (25s), and indexing (5s). Cached runs skip extraction and take 2.2 seconds. Query response time averages 3-5 seconds: retrieval (80ms), LLM generation (4s), overhead (200ms).

Cost per query is $0.01-0.05 on Amazon Bedrock. Input tokens (context from retrieved chunks) cost $0.25 per million. Output tokens (LLM answer) cost $1.25 per million. A typical query uses 2,000 input tokens and 500 output tokens, totaling $0.0011.

*Table 2: Performance metrics across two production RAG systems (System A handles technical docs, System B processes meeting notes)*

| Metric | System A (Docs) | System B (Notes) |
|--------|-----------------|------------------|
| Documents | 14 PDFs (7,432 pages) | 94 markdown files |
| Chunks | 20,679 | Auto-chunked |
| First run | 170s | 40s |
| Cached run | 2.2s | 2s |
| Query time | 3-5s | 3-5s |
| Cost/query | $0.01-0.05 | $0.01-0.05 |

Reranking adds 31ms to retrieval time. That's a 65% increase in retrieval latency but only 0.3% of total query time. Users don't notice 31ms in a 9-second end-to-end response. The 6-8% accuracy improvement compounds with hybrid retrieval's gains over single-method search, making the overhead negligible compared to the final quality benefit.

## What's the ROI Without Modernization?

Manual search through 7,432 pages takes 15-30 minutes (median: 25 min). You open PDFs, use Ctrl+F, read context, cross-reference sections. RAG reduces this to 3-5 seconds.

The math is straightforward. Assume 10 queries per day during a 6-month migration project. Labor cost: $100/hour (mid-market technical consultant). Time saved: 25 minutes per query.

Daily savings: 10 queries × 25 min × ($100/hr ÷ 60) = **$417/day**

Setup cost: 170 seconds of compute time plus $0 for local embeddings. Query cost: $0.01-0.05 on Amazon Bedrock. Break-even happens in one day.

The hidden benefit: onboarding time drops from weeks to days. New team members query the system instead of reading everything. They learn by asking questions. The knowledge graph builds itself through usage patterns.

Expert dependency drops too. Before RAG, tribal knowledge lived in people's heads. Bus factor was high. After RAG, we measured 85-90% autonomous resolution in our technical documentation system. Experts focus on the edge cases that need human judgment.

## When Does RAG Fail?

RAG isn't magic. It fails on multi-step reasoning, ambiguous questions, and knowledge not in the docs. We've seen three failure modes in production.

First: hallucination. The LLM invents answers not in the retrieved chunks. Mitigation: show source citations, add confidence scores, constrain responses to retrieved context only. We display the top 3 source documents with page numbers for every answer.

Second: context overflow. Complex queries need more context than fits in the LLM's window. Mitigation: break queries into sub-questions, use query expansion for domain terms, implement multi-hop retrieval for connected concepts.

Third: stale data. Documentation changes but embeddings don't update. Mitigation: hash-based cache invalidation for PDFs, timestamp-based for markdown files, automated re-indexing on file changes.

Failure rate in production: 10-15% of queries need human review for complex multi-step reasoning or ambiguous questions. That's acceptable. The alternative is searching 7,432 pages manually. As measured above, RAG handles the straightforward 85-90% autonomously, while experts focus on edge cases.

The key is transparency. Users see which documents were retrieved, can verify claims, and know when to escalate. Trust comes from citations, not blind faith in LLM outputs.

## How Do You Migrate from Prototype to Production?

We started on OpenRouter's free tier. Model: Devstral-2512. Cost: $0. Limits: rate-limited, no compliance guarantees. Good enough for testing with 20-30 queries to validate quality.

Migration to Amazon Bedrock took under 30 minutes. Code changes were minimal: swap dependencies (langchain-openai to langchain-aws), replace ChatOpenAI with ChatBedrock, update authentication to use AWS credentials instead of API keys. Benefits: no rate limits, SOC 2 compliance, governance controls, better answer quality from Claude Haiku 4.5.

The migration path: start small with one document set and one use case. Validate quality with test queries comparing RAG answers to ground truth from source documents. Measure adoption by tracking query volume and user feedback. Iterate by adding more docs, tuning chunking strategy, and improving retrieval.

![Migration Path](@/assets/images/migration-path.png)

*Figure 2: Migration path from free tier validation to enterprise production (iterate on quality before investing in infrastructure)*

Scale by building multiple RAG systems for different domains. We run two: one for technical documentation, one for meeting notes and tribal knowledge. Same architecture, different corpora. Total maintenance: under 1 hour per month.

## What Should You Do Next?

Identify high-value document sets. Look for onboarding materials, compliance docs, or migration guides. Estimate ROI using queries per day, time saved per query, and hourly labor cost. If the math works, start with a free tier.

Use OpenRouter or local models for validation. Run 20-30 test queries. Compare RAG answers to ground truth from source documents. Measure accuracy, check for hallucinations, verify source citations. If quality is acceptable, invest in enterprise infrastructure.

Amazon Bedrock and Azure OpenAI offer compliance, governance, and better models. Cost is $0.01-0.05 per query. For 100 queries per day, that's $1-5 daily or $30-150 monthly. Compare that to $9,000 in labor savings.

The decision framework: RAG wins when documentation changes frequently, source citations matter for compliance, or you need operational agility. Fine-tuning wins when knowledge is stable, you need specialized behavior beyond retrieval, or query volume is extreme (thousands per day) with strict latency requirements.

For legacy systems, RAG delivers ROI without modernization. No need to rewrite docs, migrate databases, or retrain staff. Layer RAG over existing PDFs and get 3-second answers to 20-year-old questions.

---

## References

- FlashRank Research Team, "Enhancing Retrieval-Augmented Generation with Two-Stage Retrieval" (2026) — https://arxiv.org/abs/2601.03258
- Oche et al., "A Systematic Review of Key Retrieval-Augmented Generation (RAG) Systems: Progress, Gaps, and Future Directions" (2025) — https://arxiv.org/abs/2507.18910
- Gan et al., "Retrieval Augmented Generation Evaluation in the Era of Large Language Models: A Comprehensive Survey" (2025) — https://arxiv.org/abs/2504.14891
- de Luis Balaguer et al., "RAG vs Fine-tuning: Pipelines, Tradeoffs, and a Case Study on Agriculture" (2024) — https://arxiv.org/abs/2401.08406
- Mandikal & Mooney, "Sparse Meets Dense: A Hybrid Approach to Enhance Scientific Document Retrieval" (2024) — https://arxiv.org/abs/2401.04055
- Dettmers et al., "QLoRA: Efficient Finetuning of Quantized LLMs" (2023) — https://arxiv.org/abs/2305.14314
- Thunder Compute, "AI GPU Rental Market Trends December 2025: Complete Industry Analysis" (2025) — https://www.thundercompute.com/blog/ai-gpu-rental-market-trends
- Braintrust, "RAG Evaluation Metrics: How to Evaluate Your RAG Pipeline" (2025) — https://www.braintrust.dev/articles/rag-evaluation-metrics
- LangChain Documentation, "Contextual Compression and Reranking" (2025) — https://python.langchain.com/docs/how_to/contextual_compression/
