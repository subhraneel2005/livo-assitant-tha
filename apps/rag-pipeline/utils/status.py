from enum import Enum
from config.redis import r

class UploadVideoStatus(str, Enum):
    PENDING = "pending"
    FETCHING_TRANSCRIPT = "fetching_transcript"
    TRANSLATING = "translating"
    CHUNKING = "chunking"
    EMBEDDING = "embedding"
    COMPLETED = "completed"
    FAILED = "failed"

def set_status(job_id, status):
    r.set(f"job:{job_id}", status)

def get_status(job_id):
    return r.get(f"job:{job_id}")