from utils.transcript import batch_size, transcribe_video
from utils.chunk import chunk_transcript
from utils.translate import translate_text
from actions.embed import embed_chunks

batch = []

def main():
    transcript_data, language = transcribe_video("aircAruvnKk")

    if language == "en":
        print("VIDEO LANGUAGE DETECTED: ENGLISH")
        chunks = chunk_transcript(transcript_data, 200, 0.2)
        embed_chunks(chunks)
    
    if language == "hi":
        print("VIDEO LANGUAGE DETECTED: HINDI")
        # translate to eng then chunk the transcript
        translated_texts = []

        for i in range(0,  len(transcript_data), batch_size):

            batch = transcript_data[i: i+batch_size]

            texts = [snippet["text"] for snippet in batch]

            translated = translate_text(texts)
            translated_texts.extend(translated)

        
        for i, snippet in enumerate(transcript_data):
            snippet["text"] = translated_texts[i]

        chunks = chunk_transcript(transcript_data, 200, 0.2)
        embed_chunks(chunks)

if __name__ == "__main__":
    main()

