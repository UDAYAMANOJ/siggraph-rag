#!/usr/bin/env python3
"""
Upload chunks to Qdrant Cloud with embeddings via OpenRouter.

Uses BAAI/bge-large-en-v1.5 model with rate limit handling.

Usage:
    python upload_to_qdrant.py
    python upload_to_qdrant.py --recreate  # Delete and recreate collection
"""

import json
import os
import time
import requests
from tqdm import tqdm
from qdrant_client import QdrantClient
from qdrant_client.http import models

from dotenv import load_dotenv
load_dotenv()

# Configuration
COLLECTION_NAME = "siggraph2025_papers"
CHUNKS_PATH = "./chunks.json"
BATCH_SIZE = 100  # BGE model can handle larger batches
EMBEDDING_MODEL = "baai/bge-large-en-v1.5"  # Via OpenRouter
VECTOR_SIZE = 1024  # Dimension for BAAI/bge-large-en-v1.5

# Rate limit settings
MAX_RETRIES = 5
RETRY_DELAY = 2


def load_chunks(path: str) -> list[dict]:
    """Load chunks from the JSON file."""
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    return data["chunks"]


def get_embeddings_batch(texts: list[str], api_key: str) -> list[list[float]]:
    """Get embeddings with retry on rate limit."""
    url = "https://openrouter.ai/api/v1/embeddings"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    payload = {"model": EMBEDDING_MODEL, "input": texts}
    
    for attempt in range(MAX_RETRIES):
        try:
            response = requests.post(url, headers=headers, json=payload, timeout=60)
            data = response.json()
            
            if "error" in data:
                wait = RETRY_DELAY * (2 ** attempt)
                print(f"\n⚠️  API error: {data['error'].get('message', 'Unknown')}. Retry in {wait}s...")
                time.sleep(wait)
                continue
            
            if "data" in data:
                return [item["embedding"] for item in data["data"]]
            
            raise Exception(f"Unexpected response: {data}")
            
        except requests.exceptions.RequestException as e:
            wait = RETRY_DELAY * (2 ** attempt)
            print(f"\n⚠️  Request error: {e}. Retry in {wait}s...")
            time.sleep(wait)
    
    raise Exception(f"Failed after {MAX_RETRIES} retries")


def create_collection(client: QdrantClient, name: str, size: int, recreate: bool = False):
    """Create Qdrant collection."""
    if client.collection_exists(name):
        if recreate:
            print(f"Deleting '{name}'...")
            client.delete_collection(name)
        else:
            info = client.get_collection(name)
            print(f"Collection exists: {info.points_count} points")
            return
    
    client.create_collection(
        collection_name=name,
        vectors_config=models.VectorParams(size=size, distance=models.Distance.COSINE)
    )
    print(f"✓ Created collection '{name}' (dim={size})")


def upload_chunks(client: QdrantClient, name: str, chunks: list, api_key: str, batch_size: int):
    """Upload chunks with embeddings to Qdrant."""
    uploaded = 0
    
    for i in tqdm(range(0, len(chunks), batch_size), desc="Uploading"):
        batch = chunks[i:i + batch_size]
        texts = [c["text"] for c in batch]
        
        embeddings = get_embeddings_batch(texts, api_key)
        
        points = [
            models.PointStruct(
                id=i + idx,
                vector=emb,
                payload={
                    "chunk_id": c["chunk_id"], "paper_id": c["paper_id"],
                    "title": c["title"], "authors": c["authors"],
                    "text": c["text"], "chunk_type": c["chunk_type"],
                    "chunk_section": c.get("chunk_section", ""),
                    "pdf_url": c.get("pdf_url"), "github_link": c.get("github_link"),
                    "video_link": c.get("video_link"), "acm_url": c.get("acm_url"),
                    "abstract_url": c.get("abstract_url"),
                }
            )
            for idx, (c, emb) in enumerate(zip(batch, embeddings))
        ]
        
        client.upsert(collection_name=name, points=points)
        uploaded += len(batch)
    
    print(f"\n✓ Uploaded {uploaded} chunks")


def main():
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--recreate", action="store_true", help="Recreate collection")
    args = parser.parse_args()
    
    api_key = os.getenv("OPENROUTER_API_KEY")
    qdrant_url = os.getenv("QDRANT_URL")
    qdrant_key = os.getenv("QDRANT_API_KEY")
    
    if not all([api_key, qdrant_url, qdrant_key]):
        raise ValueError("Missing env vars: OPENROUTER_API_KEY, QDRANT_URL, QDRANT_API_KEY")
    
    print(f"Model: {EMBEDDING_MODEL} | Batch: {BATCH_SIZE} | Dim: {VECTOR_SIZE}")
    
    client = QdrantClient(url=qdrant_url, api_key=qdrant_key, timeout=120)
    print("✓ Connected to Qdrant")
    
    chunks = load_chunks(CHUNKS_PATH)
    print(f"Loaded {len(chunks)} chunks")
    
    create_collection(client, COLLECTION_NAME, VECTOR_SIZE, args.recreate)
    upload_chunks(client, COLLECTION_NAME, chunks, api_key, BATCH_SIZE)
    
    print(f"\n✅ Done! Collection: {COLLECTION_NAME}")


if __name__ == "__main__":
    main()
