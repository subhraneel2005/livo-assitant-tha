import uuid
from utils.status import get_status, set_status, UploadVideoStatus
from utils.extract_vid import extract_video_id
from utils.transcript import batch_size, transcribe_video
from utils.chunk import chunk_transcript
from utils.translate import translate_text
from actions.embed import embed_chunks
from fastapi import BackgroundTasks, APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/api", tags=["Upload"])

class UploadRequest(BaseModel):
    url: str

def process_video_upload(job_id, url):
    video_id = extract_video_id(url)
    try:
        set_status(job_id, UploadVideoStatus.FETCHING_TRANSCRIPT)
        transcript_data, language = transcribe_video(video_id)

        if language == "en":
            print("VIDEO LANGUAGE DETECTED: ENGLISH")
            set_status(job_id, UploadVideoStatus.CHUNKING)
            chunks = chunk_transcript(transcript_data, 200, 0.2)
            set_status(job_id, UploadVideoStatus.EMBEDDING)
            embed_chunks(chunks, video_id, original_lang="en", source="youtube", is_translated=False)

            set_status(job_id, UploadVideoStatus.COMPLETED)


        elif language == "hi":
            print("VIDEO LANGUAGE DETECTED: HINDI")
            # translate to eng then chunk the transcript
            translated_texts = []

            for i in range(0,  len(transcript_data), batch_size):

                batch = transcript_data[i: i+batch_size]

                texts = [snippet["text"] for snippet in batch]
                set_status(job_id, UploadVideoStatus.TRANSLATING)
                translated = translate_text(texts)
                translated_texts.extend(translated)

            
            for i, snippet in enumerate(transcript_data):
                snippet["text"] = translated_texts[i]

            set_status(job_id, UploadVideoStatus.CHUNKING)
            chunks = chunk_transcript(transcript_data, 200, 0.2)

            set_status(job_id, UploadVideoStatus.EMBEDDING)
            embed_chunks(chunks, video_id, original_lang="hi", source="youtube", is_translated=True)
            
            set_status(job_id, UploadVideoStatus.COMPLETED)
    
    except:
        set_status(job_id, UploadVideoStatus.FAILED)


@router.post("/upload")
def upload(req: UploadRequest, bg: BackgroundTasks):
    job_id = str(uuid.uuid4())

    set_status(job_id, UploadVideoStatus.PENDING)

    bg.add_task(process_video_upload, job_id, req.url)

    return {
        "job_id": job_id
    }

@router.get("/status/{job_id}")
def status(job_id: str):
    return { "status": get_status(job_id)}