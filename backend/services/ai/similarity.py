from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity


model = SentenceTransformer('all-MiniLM-L6-v2')


def calculate_similarity(job_text, resume_text):

    embeddings = model.encode([job_text, resume_text])

    similarity = cosine_similarity(
        [embeddings[0]],
        [embeddings[1]]
    )[0][0]

    return round(float(similarity) * 100, 2)


def calculate_experience_score(
required_experience,candidate_experience):

    if candidate_experience >= required_experience:
        return 100

    if required_experience == 0:
        return 100

    score = (
        candidate_experience /
        required_experience
    ) * 100

    return round(score, 2)

def calculate_skill_match(job_skills, resume_skills):

    if not job_skills:
        return 0

    matched = set(job_skills).intersection(set(resume_skills))

    score = (len(matched) / len(job_skills)) * 100

    return round(score, 2)


