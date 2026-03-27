from pydantic import BaseModel
from config.gemini import gemnini_client
from utils.format_timestamp import format_timestamp

class ContextChunk(BaseModel):
    text: str
    video_id: str
    start_time: str
    end_time: str
    source: str
    original_lang: str
    is_translated: str

def build_context_str(points) -> str:
    parts = []

    for p in points:
        c = p.payload

        start_raw = float(c["start_time"])
        end_raw = float(c["end_time"])

        start = format_timestamp(start_raw)
        end = format_timestamp(end_raw)

        url = f"https://youtube.com/watch?v={c['video_id']}&t={int(start_raw)}s"


        # parts.append(
        #     f"[video_id: {c['video_id']} | "
        #     f"[video_url]: {url}"
        #     f"start_time: {start} | "
        #     f"end_time: {end} | "
        #     f"[source: {c['video_id']} | {start}-{end}] | "
        #     f"original_lang: {c['original_lang']} | "
        #     f"is_translated: {c['is_translated']}]\n"
        #     f"{c['text']}"
        # )

        parts.append(
            f"[source: {c['video_id']} | {start} | {url}]\n"
            f"{c['text']}"
        )


    return "\n\n".join(parts)


def get_llm_response(context: str, query: str) -> str:
    
    prompt = f"""
    You are answering questions using YouTube transcript excerpts.

    Question:
    {query}

    Context:
    <CONTEXT>
    {context}
    </CONTEXT>

    Rules:
    - Use ONLY the provided context.
    - If the answer is not in the context, respond exactly with:
    I cannot find the answer in the provided context.
    - Sources must come only from inside <CONTEXT>.

    Citation Rules:
    - Citations must be copied EXACTLY from the context.
    - A citation must match this format exactly:
    [source: VIDEO_ID | TIMESTAMP | URL]
    - Copy the entire citation line exactly as written in the context.
    - Do NOT modify, rewrite, shorten, or regenerate the URL.
    - Do NOT merge multiple sources into one citation.
    - Do NOT invent new sources.
    - If the same source is used multiple times, cite it only once.

    Output Format:
    Answer the question clearly.

    Then list sources at the end like this:

    Sources:
    [source: VIDEO_ID | TIMESTAMP | URL]
    [source: VIDEO_ID | TIMESTAMP | URL]
    """
    
    
    print(f"-----------CONTEXT INSIDE PROMPT-----------: {context}")


    response = gemnini_client.models.generate_content(
        model = "gemini-2.5-flash",
        contents = prompt
    )

    return response.text 


