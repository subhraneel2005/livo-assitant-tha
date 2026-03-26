from utils.transcript import batch_size, transcribe_video
from utils.chunk import chunk_transcript
from utils.translate import translate_text

batch = []

def main():
    transcript_data, language = transcribe_video("fHF22Wxuyw4")

    if language == "en":
        print("VIDEO LANGUAGE DETECTED: ENGLISH")
        chunk_transcript(transcript_data, 200, 0.2)
    
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

        chunk_transcript(transcript_data, 200, 0.2)

if __name__ == "__main__":
    main()

