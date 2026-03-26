from utils.transcript import transcribe_video
from utils.chunk import chunk_transcript
def main():
    transcript_data, language = transcribe_video("aircAruvnKk")
    chunk_transcript(transcript_data, 200, 0.2)

    if language == "en":
        print("ENGLISH VIDEO")
    
    if language == "hi":
        print("HINDI VIDEO")

if __name__ == "__main__":
    main()

