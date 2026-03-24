from youtube_transcript_api import YouTubeTranscriptApi

def transcribe_video(video_id):
    transcript = YouTubeTranscriptApi()
    fetched_transcript = transcript.fetch(video_id, languages=["hi", "en"])

    for snippet in fetched_transcript:
        print(snippet.text)

    print("snippet count", len(fetched_transcript))

def main():
    transcribe_video("fHF22Wxuyw4")

if __name__ == "__main__":
    main()

