from rag.semantic_retrieve import semantic_retrieve

def build_context(query: str, top_k: int = 3) -> str:
    """
    Build context from the most relevant chunks.
    """

    results = semantic_retrieve(query, top_k)

    context = "Business Knowledge:\n\n"

    for index, (score, chunk) in enumerate(results, start=1):
        context += f"{index}. {chunk}\n\n"

    return context


if __name__ == "__main__":
    query = "How can I know if users really need my product?"

    context = build_context(query)

    print("QUESTION:")
    print(query)

    print("\n" + "=" * 50 + "\n")

    print(context)