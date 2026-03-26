from sentence_transformers import SentenceTransformer
from config.qdrant import client
from config.logger import logger
import uuid

model = SentenceTransformer("all-MiniLM-L6-v2", device="cpu")       

def embed_chunks(chunks, video_id, original_lang, is_translated, source):

    for i, chunk in enumerate(chunks):

        embedding = model.encode(chunk["text"]).tolist()

        logger.info(
            f"Chunk {i} embedded | text_len={len(chunk['text'])} | vector_dimension={len(embedding)}"
        )
        client.upsert(
            collection_name="yt-transcripts",
            points=[
                {
                    "id": str(uuid.uuid4()),
                    "vector": embedding,
                    "payload": {
                        "text": chunk["text"],
                        "start_time": chunk["start_time"],
                        "end_time": chunk["end_time"],
                        "video_id": video_id,
                        "source": source,
                        "original_lang": original_lang,
                        "is_translated": is_translated
                    }
                }
            ]
        )

    logger.info("All chunks embedded and stored successfully")



