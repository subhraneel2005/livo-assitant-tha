from qdrant_client import QdrantClient
from dotenv import load_dotenv
import os

load_dotenv()

qdrant_client = QdrantClient(
    url=os.getenv("QDRANT_CLUSTER_ENDPOINT"), 
    api_key=os.getenv("QDRANT_API_KEY"),
)

print(qdrant_client.get_collections())