from sentence_transformers import SentenceTransformer
from config.qdrant import client
from config.logger import logger

model = SentenceTransformer("all-MiniLM-L6-v2", device="cpu")       

def embed_chunks(chunks):

    for i, chunk in enumerate(chunks):

        embedding = model.encode(chunk["text"]).tolist()

        logger.info(f"Chunk {i} embedded | text_len {len(chunk["text"])} | vector_dimension={len(embedding)}")

        client.upsert(
            collection_name="yt-transcripts",
            points=[
                {
                    "id": i,
                    "vector": embedding,
                    "payload": {
                    "text": chunk["text"],
                    "start_time": chunk["start_time"],
                    "end_time": chunk["end_time"]
            }
                }
            ]
        )

    logger.info("All chunks embedded and stored successfully")



