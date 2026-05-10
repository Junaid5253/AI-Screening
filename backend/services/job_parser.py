import re

from core.normalization import normalize_text
from services.skill_extractor import extract_skills
from core.stopwords import STOPWORDS

def extract_experience_requirement(text: str):

    text = text.lower()

    patterns = [

        r"(\d+)\+?\s+years?\s+of\s+experience",
        r"(\d+)\+?\s+years?\s+experience",
        r"minimum\s+(\d+)\+?\s+years?",
        r"at least\s+(\d+)\+?\s+years?"
    ]

    for p in patterns:

        match = re.search(p, text)

        if match:
            return int(match.group(1))

    return 0





WEAK_WORDS = set([

    "build", "built", "work", "working", "like", "using", "into",
    "tools", "system", "systems", "knowledge", "experience",
    "understanding", "skills", "team", "engineer", "engineering"
])


def extract_context_terms(text: str):

    text = normalize_text(text)

    words = text.split()

    # IMPORTANT: get skills first and remove them from context
    skills = set(extract_skills(text))

    context_terms = set()

    for w in words:

        if len(w) < 3:
            continue

        if w in STOPWORDS:
            continue

        if w in WEAK_WORDS:
            continue

        if w.isdigit():
            continue

        # remove skills from context
        if w in skills:
            continue

        context_terms.add(w)

    return sorted(context_terms)
def parse_job(text: str):

    return {

        "required_skills": extract_skills(text),

        "experience_required": extract_experience_requirement(text),

        "context_terms": extract_context_terms(text)
    }