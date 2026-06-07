import json
from pathlib import Path
from sentence_transformers import SentenceTransformer

CHUNKS_PATH = Path("rag/chunks/chunks.json")
OUTPUT_PATH = Path("rag/chunks/embeddings.json")

# Load chunks
with open(CHUNKS_PATH, "r", encoding="utf-8") as file:
    chunks = json.load(file)

# Load local embedding model
model = SentenceTransformer("all-MiniLM-L6-v2")

# Generate embeddings
embeddings = model.encode(chunks).tolist()

# Save chunks with embeddings
embedded_chunks = [
    {
        "id": index,
        "text": chunk,
        "embedding": embedding
    }
    for index, (chunk, embedding) in enumerate(zip(chunks, embeddings))
]

with open(OUTPUT_PATH, "w", encoding="utf-8") as file:
    json.dump(embedded_chunks, file, indent=4)

print(f"Created embeddings for {len(embedded_chunks)} chunks.")
print(f"Saved to: {OUTPUT_PATH}")