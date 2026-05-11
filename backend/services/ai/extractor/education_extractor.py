import re
from core.normalization import normalize_text


EDUCATION_KEYWORDS = [

    "bachelor",
    "bs",
    "master",
    "ms",
    "phd",
    "computer science",
    "data science",
    "software engineering",
    "artificial intelligence",
]


def extract_education(text: str):

    text = normalize_text(text)

    found = set()

    for edu in EDUCATION_KEYWORDS:

        edu_norm = normalize_text(edu)

        pattern = r"\b" + re.escape(edu_norm) + r"\b"

        if re.search(pattern, text):

            found.add(edu)

    return sorted(found)