#!/usr/bin/env python3
"""
Retrieval Pipeline for SIGGRAPH 2025 Papers.

Implements hybrid search:
1. Semantic search (embeddings via OpenRouter + Qdrant Cloud)
2. Keyword search (BM25 - runs locally)
3. Reranking (Cohere API - optional)

Usage:
    from retrieval_pipeline import RetrievalPipeline

    pipeline = RetrievalPipeline()
    results = pipeline.retrieve("3D Gaussian Splatting", top_k=5)
"""

import json
import os
import re
import requests
import numpy as np
from typing import Optional, List
from dataclasses import dataclass
from qdrant_client import QdrantClient
from rank_bm25 import BM25Okapi

from dotenv import load_dotenv
load_dotenv()

# Must match the collection name used in upload_to_qdrant.py
COLLECTION_NAME = "siggraph2025_papers"


@dataclass
class RetrievalResult:
    """
    Represents a single search result.
    The api_server.py expects these exact fields - do not change!
    """
    chunk_id: str
    paper_id: str
    title: str
    authors: str
    text: str
    score: float
    chunk_type: str = ""
    chunk_section: str = ""
    pdf_url: Optional[str] = None
    github_link: Optional[str] = None
    video_link: Optional[str] = None
    acm_url: Optional[str] = None
    abstract_url: Optional[str] = None


@dataclass
class RetrievalPipelineConfig:
    """Configuration for the retrieval pipeline."""
    qdrant_url: str
    qdrant_api_key: str
    openrouter_api_key: str
    embedding_model: str = "baai/bge-large-en-v1.5"
    chunks_path: str = "./chunks.json"
    semantic_weight: float = 0.7
    bm25_weight: float = 0.3
    use_reranker: bool = True
    cohere_api_key: Optional[str] = None


class OpenRouterEmbedder:
    """
    Generate embeddings using OpenRouter API.
    Used to embed user queries for semantic search.
    """

    def __init__(self, api_key: str, model: str = "baai/bge-large-en-v1.5"):
        self.api_key = api_key
        self.model = model
        self.base_url = "https://openrouter.ai/api/v1"

    def embed_query(self, text: str) -> np.ndarray:
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": self.model,
            "input": text
        }
        response = requests.post(
            f"{self.base_url}/embeddings",
            headers=headers,
            json=payload
        )
        response.raise_for_status()
        data = response.json()
        embedding = data["data"][0]["embedding"]
        return np.array(embedding, dtype=np.float32)


class BM25Index:
    """
    BM25 index for keyword search.
    This runs entirely locally - no API calls needed!
    BM25 is good at finding exact keyword matches that semantic search might miss.
    """

    def __init__(self, chunks: list[dict]):
        self.chunks = chunks
        self.chunk_id_to_idx = {c["chunk_id"]: i for i, c in enumerate(chunks)}
        self.tokenized_docs = [self._tokenize(c["text"]) for c in chunks]
        self.bm25 = BM25Okapi(self.tokenized_docs)

    def _tokenize(self, text: str) -> list[str]:
        return re.findall(r'\w+', text.lower())

    def search(self, query: str, top_k: int = 50) -> list[tuple[int, float]]:
        tokenized = self._tokenize(query)
        scores = self.bm25.get_scores(tokenized)
        top_indices = np.argsort(scores)[::-1][:top_k]
        return [(int(idx), float(scores[idx])) for idx in top_indices if scores[idx] > 0]


class RetrievalPipeline:
    """
    Main retrieval pipeline combining semantic search + BM25 + reranking.
    This is what api_server.py uses to find relevant chunks.
    """

    def __init__(self, config: Optional[RetrievalPipelineConfig] = None):
        if config is None:
            config = RetrievalPipelineConfig(
                qdrant_url=os.getenv("QDRANT_URL"),
                qdrant_api_key=os.getenv("QDRANT_API_KEY"),
                openrouter_api_key=os.getenv("OPENROUTER_API_KEY"),
                cohere_api_key=os.getenv("COHERE_API_KEY"),
                chunks_path=os.getenv("CHUNKS_PATH", "./chunks.json"),
            )

        if not config.qdrant_url:
            raise ValueError("QDRANT_URL not set")
        if not config.qdrant_api_key:
            raise ValueError("QDRANT_API_KEY not set")
        if not config.openrouter_api_key:
            raise ValueError("OPENROUTER_API_KEY not set")

        print("Connecting to Qdrant...")
        self.qdrant = QdrantClient(url=config.qdrant_url, api_key=config.qdrant_api_key)

        print("Initializing embedder...")
        self.embedder = OpenRouterEmbedder(config.openrouter_api_key, config.embedding_model)

        if os.path.exists(config.chunks_path):
            print(f"Loading chunks from {config.chunks_path}...")
            with open(config.chunks_path, encoding="utf-8") as f:
                data = json.load(f)
            self.chunks = data["chunks"]
        else:
            print("chunks.json not found — loading chunks from Qdrant for BM25 index...")
            records, _ = self.qdrant.scroll(
                collection_name=COLLECTION_NAME,
                limit=20000,
                with_payload=True,
                with_vectors=False
            )
            self.chunks = [r.payload for r in records]

        print(f"Loaded {len(self.chunks):,} chunks")
        print("Building BM25 index...")
        self.bm25_index = BM25Index(self.chunks)
        print("BM25 index built")

        self.config = config

    def semantic_search(self, query: str, top_k: int = 30) -> list[dict]:
        query_embedding = self.embedder.embed_query(query)
        results = self.qdrant.query_points(
            collection_name=COLLECTION_NAME,
            query=query_embedding.tolist(),
            limit=top_k,
            with_payload=True
        ).points
        return [
            {
                "chunk_id": r.payload["chunk_id"],
                "score": r.score,
                "payload": r.payload
            }
            for r in results
        ]

    def bm25_search(self, query: str, top_k: int = 30) -> list[dict]:
        results = self.bm25_index.search(query, top_k)
        return [
            {
                "chunk_id": self.chunks[idx]["chunk_id"],
                "score": score,
                "payload": self.chunks[idx]
            }
            for idx, score in results
        ]

    def hybrid_search(self, query: str, semantic_top_k: int = 30, bm25_top_k: int = 30) -> list[dict]:
        semantic_results = self.semantic_search(query, semantic_top_k)
        bm25_results = self.bm25_search(query, bm25_top_k)


        if semantic_results:
            max_semantic = max(r["score"] for r in semantic_results)
            for r in semantic_results:
                r["normalized_score"] = r["score"] / max_semantic if max_semantic > 0 else 0

        if bm25_results:
            max_bm25 = max(r["score"] for r in bm25_results)
            for r in bm25_results:
                r["normalized_score"] = r["score"] / max_bm25 if max_bm25 > 0 else 0

        combined = {}

        for r in semantic_results:
            combined[r["chunk_id"]] = {
                **r,
                "semantic_score": r["normalized_score"],
                "bm25_score": 0.0,
                "combined_score": self.config.semantic_weight * r["normalized_score"]
            }

        for r in bm25_results:
            if r["chunk_id"] in combined:
                combined[r["chunk_id"]]["bm25_score"] = r["normalized_score"]
                combined[r["chunk_id"]]["combined_score"] += self.config.bm25_weight * r["normalized_score"]
            else:
                combined[r["chunk_id"]] = {
                    **r,
                    "semantic_score": 0.0,
                    "bm25_score": r["normalized_score"],
                    "combined_score": self.config.bm25_weight * r["normalized_score"]
                }

        return sorted(combined.values(), key=lambda x: x["combined_score"], reverse=True)

    def rerank(self, query: str, results: list[dict], top_k: int = 10) -> list[dict]:
        if not self.config.cohere_api_key or not results:
            return results[:top_k]

        texts = [r["payload"]["text"] for r in results]

        try:
            response = requests.post(
                "https://api.cohere.ai/v1/rerank",
                headers={"Authorization": f"Bearer {self.config.cohere_api_key}"},
                json={
                    "model": "rerank-english-v3.0",
                    "query": query,
                    "documents": texts,
                    "top_n": top_k
                }
            )
            response.raise_for_status()
            data = response.json()
            reranked = []
            for item in data["results"]:
                r = dict(results[item["index"]])
                r["rerank_score"] = item["relevance_score"]
                reranked.append(r)
            return reranked
        except Exception as e:
            print(f"Reranking failed: {e}, falling back to original order")
            return results[:top_k]

    def retrieve(self, query: str, top_k: int = 8) -> list[RetrievalResult]:
        """
        Full retrieval pipeline - THIS IS WHAT api_server.py CALLS!
        """
        candidates = self.hybrid_search(query)

        if self.config.use_reranker:
            reranked = self.rerank(query, candidates, top_k=min(top_k * 2, len(candidates)))
        else:
            reranked = candidates

        final = reranked[:top_k]

        return [
            RetrievalResult(
                chunk_id=r["payload"]["chunk_id"],
                paper_id=r["payload"]["paper_id"],
                title=r["payload"]["title"],
                authors=r["payload"]["authors"],
                text=r["payload"]["text"],
                score=r.get("rerank_score", r.get("combined_score", r.get("score", 0))),
                chunk_type=r["payload"].get("chunk_type", ""),
                chunk_section=r["payload"].get("chunk_section", ""),
                pdf_url=r["payload"].get("pdf_url"),
                github_link=r["payload"].get("github_link"),
                video_link=r["payload"].get("video_link"),
                acm_url=r["payload"].get("acm_url"),
                abstract_url=r["payload"].get("abstract_url"),
            )
            for r in final
        ]


# For testing this file directly
if __name__ == "__main__":
    import sys

    query = sys.argv[1] if len(sys.argv) > 1 else "3D Gaussian Splatting"

    print(f"Testing retrieval pipeline with query: '{query}'")
    print("=" * 60)

    pipeline = RetrievalPipeline()
    results = pipeline.retrieve(query, top_k=5)

    print(f"\nFound {len(results)} results:\n")

    for i, r in enumerate(results, 1):
        print(f"{i}. [{r.score:.4f}] {r.title[:60]}...")
        print(f"   Paper ID: {r.paper_id}")
        print(f"   Text preview: {r.text[:100]}...")
        print()
