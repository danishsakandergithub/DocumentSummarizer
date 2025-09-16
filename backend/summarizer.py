import os
os.environ["TRANSFORMERS_NO_TF"] = "1"  # disable TensorFlow completely

from transformers import pipeline

# Load Hugging Face summarization pipeline (PyTorch only)
summarizer = pipeline("summarization", model="facebook/bart-large-cnn", framework="pt")

def generate_summary(text, max_length=130, min_length=30):
    """
    Summarize the following document into a clear, concise, and professional summary. 
    Focus only on the key ideas, main arguments, and important details. 
    Avoid repetition, minor examples, or unnecessary details.
    """
    summary = summarizer(
        text,
        max_length=max_length,
        min_length=min_length,
        do_sample=False
    )
    return summary[0]['summary_text']
