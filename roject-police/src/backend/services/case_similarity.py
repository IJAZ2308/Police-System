from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def find_similar_cases(input_text, existing_texts, threshold=0.5):
    if not existing_texts:
        return []

    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform([input_text] + existing_texts)

    similarity_scores = cosine_similarity(
        tfidf_matrix[0:1],
        tfidf_matrix[1:]
    )[0]

    results = [
        (i, score)
        for i, score in enumerate(similarity_scores)
        if score >= threshold
    ]

    results.sort(key=lambda x: x[1], reverse=True)

    return results
