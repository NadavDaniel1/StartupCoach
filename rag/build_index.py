import json
import re
from pathlib import Path

KNOWLEDGE_DIR = Path("rag/knowledge")
OUTPUT_PATH = Path("rag/chunks/chunks.json")

all_chunks = []


def split_into_principles(text: str) -> list[str]:
    """
    Split knowledge files into individual principles.
    Supports:
    - numbered lines: 1. Principle
    - bullet lines: - Principle
    - fallback: double newlines
    """
    lines = text.splitlines()
    chunks = []

    current = []

    for line in lines:
        line = line.strip()

        if not line:
            continue

        # Skip title/header lines
        if line.lower() in {
            "founder experience layer",
            "knowledge base for the ai startup coach",
        }:
            continue

        # Match numbered principle or bullet principle
        is_new_principle = (
            re.match(r"^\d+\.\s+", line) is not None
            or line.startswith("- ")
        )

        if is_new_principle:
            if current:
                chunks.append(" ".join(current).strip())
                current = []

            # remove numbering/bullet
            line = re.sub(r"^\d+\.\s+", "", line)
            line = re.sub(r"^-+\s+", "", line)

        current.append(line)

    if current:
        chunks.append(" ".join(current).strip())

    return [chunk for chunk in chunks if len(chunk) > 20]


for file_path in sorted(KNOWLEDGE_DIR.glob("*.txt")):
    with open(file_path, "r", encoding="utf-8") as file:
        text = file.read()

    chunks = split_into_principles(text)

    for chunk in chunks:
        all_chunks.append({
            "source": file_path.stem,
            "text": chunk
        })

OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)

with open(OUTPUT_PATH, "w", encoding="utf-8") as file:
    json.dump(all_chunks, file, indent=4, ensure_ascii=False)

print(f"Created {len(all_chunks)} chunks from {len(list(KNOWLEDGE_DIR.glob('*.txt')))} files.")
print(f"Saved to: {OUTPUT_PATH}")