import json
import re
from pathlib import Path

# Simple keyword-based retrieval system for RAG example.
CHUNKS_PATH = Path("rag/chunks/chunks.json")

# This is a very basic retrieval system that scores chunks based on the number of shared words with the query.
def tokenize(text: str) -> set[str]:
  """Convert text into a set of clean lowercase words."""
  text = text.lower()
  words = re.findall(r"\b[a-zA-Z]+\b", text)
  return set(words)

# In a real system, you would use more sophisticated methods like TF-IDF or embeddings for retrieval.
def score_chunk(query: str, chunk: str) -> int:
    """Score chunk by number of shared words with the query."""
    query_words = tokenize(query)
    chunk_words = tokenize(chunk)

    return len(query_words.intersection(chunk_words))

# Retrieve top_k most relevant chunks based on keyword overlap.
def retrieve(query: str, top_k: int = 3) -> list[tuple[int, str]]:
    """Return top_k most relevant chunks based on keyword overlap."""
    with open(CHUNKS_PATH, "r", encoding="utf-8") as file:
        chunks = json.load(file)

    scored_chunks = [
        (score_chunk(query, chunk), chunk)
        for chunk in chunks
    ]

    scored_chunks = sorted(scored_chunks, key=lambda x: x[0], reverse=True)

    return scored_chunks[:top_k]

# Example usage
if __name__ == "__main__":
    query = "How do I validate my startup idea?"

    results = retrieve(query)

    print(f"Query: {query}\n")
    print("Top chunks:")

    for score, chunk in results:
        print(f"\nScore: {score}")
        print(chunk)