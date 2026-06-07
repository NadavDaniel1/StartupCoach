import json

# Read the knowledge base file
with open("rag/knowledge/startup_principles.txt", "r", encoding="utf-8") as file:
    text = file.read()

# Split text into chunks using double line breaks
chunks = text.split("\n\n")

# Remove empty chunks
chunks = [chunk.strip() for chunk in chunks if chunk.strip()]

# Save chunks to JSON file
with open("rag/chunks/chunks.json", "w", encoding="utf-8") as file:
    json.dump(chunks, file, indent=4)

# Print results
print(f"Created {len(chunks)} chunks.")