import json
from pathlib import Path
from sentence_transformers import SentenceTransformer

CHUNKS_PATH = Path("rag/chunks/chunks.json")
OUTPUT_PATH = Path("rag/chunks/embeddings.json")

with open(CHUNKS_PATH, "r", encoding="utf-8") as file:
    chunks = json.load(file)

model = SentenceTransformer("intfloat/multilingual-e5-base")

texts = [item["text"] for item in chunks]
embeddings = model.encode([f"passage: {text}" for text in texts]).tolist()

embedded_chunks = [
    {
        "id": index,
        "source": item["source"],
        "text": item["text"],
        "embedding": embedding
    }
    for index, (item, embedding) in enumerate(zip(chunks, embeddings))
]

with open(OUTPUT_PATH, "w", encoding="utf-8") as file:
    json.dump(embedded_chunks, file, indent=4, ensure_ascii=False)

print(f"Created embeddings for {len(embedded_chunks)} chunks.")
print(f"Saved to: {OUTPUT_PATH}")