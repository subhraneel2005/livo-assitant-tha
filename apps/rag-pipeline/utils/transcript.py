from youtube_transcript_api import YouTubeTranscriptApi
import os

batch_size=20

# os.environ["HTTP_PROXY"] = "http://154.0.14.116:3128"
# os.environ["HTTPS_PROXY"] = "http://157.66.138.79:1080"


def transcribe_video(video_id):
    data = []
    transcript = YouTubeTranscriptApi()
    fetched_transcript = transcript.fetch(video_id, languages=["en", "hi"])

    for snippet in fetched_transcript:
       data.append({
        "text": snippet.text,
        "start": snippet.start,
        "end": snippet.start + snippet.duration,
        "duration": snippet.duration
       })

    print(data)
    print("snippet count", len(fetched_transcript))
    print("total data length", len(data))

    lang = fetched_transcript.language_code

    print("language: ", lang)

    return data, lang

    # this is for translating hindi transcripts
    
    # if(fetched_transcript.language_code == "hi"):
    #     for i in range(0, len(fetched_transcript), batch_size):
    #         batch = fetched_transcript[i: i+batch_size]
        
    #     texts = []

    #     for snippet in batch:
    #         texts.append(snippet.text)
        
    #     translate_text(texts)
