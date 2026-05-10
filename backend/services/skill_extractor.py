import re

from core.skills import SKILL_DB
from core.normalization import normalize_text


def extract_skills(text: str):

    text = normalize_text(text)

    found = set()

    for skill in SKILL_DB:

        pattern = r"\b" + re.escape(skill) + r"\b"

        if re.search(pattern, text):

            found.add(skill)

    return sorted(found)