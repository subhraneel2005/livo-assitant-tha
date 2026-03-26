
from qdrant_client import models
from config.qdrant import client

client.create_collection(
    collection_name="yt-transcripts",
    vectors_config=models.models.VectorParams(size=384, distance=models.Distance.COSINE)
)

# set the vector size to be 384 because
# ill be using all-MiniLM-L6-v2 as the embedding model and its embedding_model_dimension is 384.