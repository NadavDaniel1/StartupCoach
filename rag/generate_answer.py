import os
from dotenv import load_dotenv
from openai import OpenAI

from rag.build_context import build_context

# Load environment variables from .env file
load_dotenv()

# Create OpenAI client
client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)


def generate_answer(question: str) -> str:
    """
    Generate startup advice using RAG context and OpenAI.
    """

    context = build_context(question)

    prompt = f"""
You are StartupCoach, an experienced startup advisor.

Use only the business knowledge provided below to answer the entrepreneur's question.

Business Knowledge:
{context}

Entrepreneur Question:
{question}

Provide a practical and clear answer.
"""

    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {
                "role": "system",
                "content": "You are a helpful startup coach."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.7
    )

    return response.choices[0].message.content


if __name__ == "__main__":

    question = "How do I know if customers really need my product?"

    answer = generate_answer(question)

    print("QUESTION:")
    print(question)

    print("\n" + "=" * 50 + "\n")

    print("STARTUP COACH ANSWER:")
    print(answer)