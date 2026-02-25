import os
import numpy as np
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# In-memory storage (assignment scope)
document_chunks = []
document_embeddings = []

EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "text-embedding-3-small")


def chunk_text(text: str, chunk_size_words: int = 500):
    words = text.split()
    return [
        " ".join(words[i:i + chunk_size_words])
        for i in range(0, len(words), chunk_size_words)
    ]


def embed_document(text: str):
    """Append embeddings for new documents."""

    global document_chunks, document_embeddings

    new_chunks = chunk_text(text)

    if not new_chunks:
        return

    for chunk in new_chunks:
        resp = client.embeddings.create(
            model=EMBEDDING_MODEL,
            input=chunk
        )
        document_embeddings.append(resp.data[0].embedding)
        document_chunks.append(chunk)

    print(
        f"[RAG] Total chunks={len(document_chunks)} "
        f"Total embeddings={len(document_embeddings)}"
    )


def cosine_similarity(a, b):
    a = np.array(a, dtype=np.float32)
    b = np.array(b, dtype=np.float32)
    denom = (np.linalg.norm(a) * np.linalg.norm(b))
    if denom == 0:
        return 0.0
    return float(np.dot(a, b) / denom)


def retrieve_relevant_chunks(query: str, top_k: int = 3):
    if not document_embeddings or not document_chunks:
        print("[RAG] retrieve called but no embeddings/chunks in memory")
        return []

    q = client.embeddings.create(
        model=EMBEDDING_MODEL,
        input=query
    ).data[0].embedding

    sims = [cosine_similarity(q, emb) for emb in document_embeddings]
    top_indices = np.argsort(sims)[-top_k:][::-1]

    return [document_chunks[i] for i in top_indices]