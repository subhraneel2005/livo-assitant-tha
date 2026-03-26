import time
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
from deep_translator import GoogleTranslator

batch_size = 20

def translate_text(batch):
    translated = []

    print("Translation started")

    for text in batch:
        result = GoogleTranslator(source='hi', target='en').translate(text)
        print("translation of text:", text, "in English: ", result)
        translated.append(result)
        time.sleep(0.5)

    return translated