from transformers import pipeline

summarizer = pipeline(
    "summarization",
    model="facebook/bart-large-cnn"
)

def summarize_fir(text: str) -> str:
    if len(text) < 200:
        return text

    summary = summarizer(
        text,
        max_length=150,
        min_length=60,
        do_sample=False
    )

    return summary[0]["summary_text"]
