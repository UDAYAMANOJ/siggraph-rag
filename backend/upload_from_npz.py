#!/usr/bin/env python3
"""
Upload pre-computed embeddings from .npz file to Qdrant Cloud.

This script uses pre-computed BAAI/bge-large-en-v1.5 embeddings,
so NO API calls are needed for embedding generation.

Usage:
    python upload_from_npz.py
    python upload_from_npz.py --recreate  # Delete and recreate collection
"""

import json
import os
import numpy as np
from tqdm import tqdm
from qdrant_client import QdrantClient
from qdrant_client.http import models

from dotenv import load_dotenv
load_dotenv()

# Configuration
COLLECTION_NAME = "siggraph2025_papers"
CHUNKS_PATH = "./chunks.json"
EMBEDDINGS_PATH = "./embeddings_BAAI_bge_large_en_v1.5.npz"
VECTOR_SIZE = 1024  # Dimension for BAAI/bge-large-en-v1.5
BATCH_SIZE = 100  # Can be larger since no API calls needed


def load_chunks(path: str) -> list[dict]:
    """Load chunks from the JSON file."""
    print(f"Loading chunks from {path}...")
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    chunks = data["chunks"]
    print(f"Loaded {len(chunks)} chunks")
    return chunks


def load_embeddings(path: str) -> np.ndarray:
    """Load pre-computed embeddings from .npz file."""
    print(f"Loading embeddings from {path}...")
    data = np.load(path)
    embeddings = data['embeddings']
    print(f"Loaded {len(embeddings)} embeddings with dimension {embeddings.shape[1]}")
    return embeddings


def create_qdrant_collection(client: QdrantClient, collection_name: str, vector_size: int, recreate: bool = False):
    """Create a Qdrant collection. Optionally delete existing one first."""
    if client.collection_exists(collection_name):
        if recreate:
            print(f"Deleting existing collection '{collection_name}'...")
            client.delete_collection(collection_name)
            print("✓ Deleted")
        else:
            print(f"Collection '{collection_name}' already exists")
            info = client.get_collection(collection_name)
            print(f"Current points: {info.points_count}")
            return
    
    print(f"Creating collection '{collection_name}'...")
    client.create_collection(
        collection_name=collection_name,
        vectors_config=models.VectorParams(
            size=vector_size,
            distance=models.Distance.COSINE
        )
    )
    print(f"✓ Collection created with vector size {vector_size}")


def upload_to_qdrant(
    client: QdrantClient,
    collection_name: str,
    chunks: list[dict],
    embeddings: np.ndarray,
    batch_size: int = BATCH_SIZE
):
    """Upload chunks with pre-computed embeddings to Qdrant."""
    
    if len(chunks) != len(embeddings):
        raise ValueError(f"Mismatch: {len(chunks)} chunks but {len(embeddings)} embeddings")
    
    total_batches = (len(chunks) + batch_size - 1) // batch_size
    uploaded_count = 0
    
    print(f"\nUploading {len(chunks)} chunks in {total_batches} batches...")
    
    for i in tqdm(range(0, len(chunks), batch_size), desc="Uploading"):
        batch_chunks = chunks[i:i + batch_size]
        batch_embeddings = embeddings[i:i + batch_size]
        
        points = [
            models.PointStruct(
                id=i + idx,  # Use integer index as point ID
                vector=embedding.tolist(),
                payload={
                    "chunk_id": chunk["chunk_id"],
                    "paper_id": chunk["paper_id"],
                    "title": chunk["title"],
                    "authors": chunk["authors"],
                    "text": chunk["text"],
                    "chunk_type": chunk["chunk_type"],
                    "chunk_section": chunk.get("chunk_section", ""),
                    "pdf_url": chunk.get("pdf_url"),
                    "github_link": chunk.get("github_link"),
                    "video_link": chunk.get("video_link"),
                    "acm_url": chunk.get("acm_url"),
                    "abstract_url": chunk.get("abstract_url"),
                }
            )
            for idx, (chunk, embedding) in enumerate(zip(batch_chunks, batch_embeddings))
        ]
        
        client.upsert(collection_name=collection_name, points=points)
        uploaded_count += len(batch_chunks)
    
    print(f"\n✓ Successfully uploaded {uploaded_count} chunks to Qdrant!")


def verify_upload(client: QdrantClient, collection_name: str):
    """Verify the upload."""
    info = client.get_collection(collection_name)
    print(f"\n📊 Collection Stats:")
    print(f"   Points count: {info.points_count}")
    print(f"   Status: {info.status}")


def main():
    import argparse
    
    parser = argparse.ArgumentParser(description="Upload pre-computed embeddings to Qdrant")
    parser.add_argument("--recreate", action="store_true", help="Delete existing collection and start fresh")
    parser.add_argument("--chunks", type=str, default=CHUNKS_PATH, help="Path to chunks.json")
    parser.add_argument("--embeddings", type=str, default=EMBEDDINGS_PATH, help="Path to embeddings .npz file")
    args = parser.parse_args()
    
    # Load environment variables
    qdrant_url = os.getenv("QDRANT_URL")
    qdrant_api_key = os.getenv("QDRANT_API_KEY")
    
    # Validate
    if not qdrant_url:
        raise ValueError("QDRANT_URL not set in .env")
    if not qdrant_api_key:
        raise ValueError("QDRANT_API_KEY not set in .env")
    
    print("=" * 60)
    print("SIGGRAPH 2025 Papers → Qdrant Cloud Uploader")
    print("Using pre-computed BAAI/bge-large-en-v1.5 embeddings")
    print("=" * 60)
    print(f"Qdrant URL: {qdrant_url}")
    print(f"Collection: {COLLECTION_NAME}")
    print(f"Vector size: {VECTOR_SIZE}")
    print("=" * 60)
    
    # Initialize Qdrant client
    print("\nConnecting to Qdrant Cloud...")
    client = QdrantClient(url=qdrant_url, api_key=qdrant_api_key, timeout=120)
    print("✓ Connected!")
    
    # Load data
    chunks = load_chunks(args.chunks)
    embeddings = load_embeddings(args.embeddings)
    
    # Create collection
    create_qdrant_collection(client, COLLECTION_NAME, VECTOR_SIZE, recreate=args.recreate)
    
    # Upload
    upload_to_qdrant(client, COLLECTION_NAME, chunks, embeddings)
    
    # Verify
    verify_upload(client, COLLECTION_NAME)
    
    print("\n" + "=" * 60)
    print("✅ Done! Your vectors are now in Qdrant Cloud.")
    print(f"Collection: {COLLECTION_NAME}")
    print("Embedding model: BAAI/bge-large-en-v1.5 (1024 dims)")
    print("You can verify at: https://cloud.qdrant.io")
    print("=" * 60)


if __name__ == "__main__":
    main()
