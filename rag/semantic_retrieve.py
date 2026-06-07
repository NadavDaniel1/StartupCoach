import json
import numpy as np
from pathlib import Path
from sentence_transformers import SentenceTransformer

EMBEDDINGS_PATH = Path("rag/chunks/embeddings.json")


def cosine_similarity(vector_a, vector_b):
    """Calculate cosine similarity between two vectors."""
    vector_a = np.array(vector_a)
    vector_b = np.array(vector_b)

    return np.dot(vector_a, vector_b) / (
        np.linalg.norm(vector_a) * np.linalg.norm(vector_b)
    )


def semantic_retrieve(query: str, top_k: int = 3):
    """Retrieve top_k chunks based on semantic similarity."""
    with open(EMBEDDINGS_PATH, "r", encoding="utf-8") as file:
        embedded_chunks = json.load(file)

    model = SentenceTransformer("all-MiniLM-L6-v2")
    query_embedding = model.encode(query).tolist()

    scored_chunks = []

    for item in embedded_chunks:
        score = cosine_similarity(query_embedding, item["embedding"])
        scored_chunks.append((score, item["text"]))

    scored_chunks = sorted(scored_chunks, key=lambda x: x[0], reverse=True)

    return scored_chunks[:top_k]


if __name__ == "__main__":
    query = "How can I know if users really need my product?"

    results = semantic_retrieve(query)

    print(f"Query: {query}\n")
    print("Top semantic chunks:")

    for score, chunk in results:
        print(f"\nScore: {score:.4f}")
        print(chunk)