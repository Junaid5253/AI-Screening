from services.ai.nlp import nlp
from services.ai.skill_matcher import matcher
from services.ai.extractor.skill_aliases import resolve_skill, normalize_skill_text


def extract_skills(text: str):

    doc = nlp.make_doc(text)

    matches = matcher(doc)

    skills = set()

    for match_id, start, end in matches:

        skill = doc[start:end].text.lower().strip()
        
        # Normalize and resolve skill to canonical form
        skill = resolve_skill(skill)

        skills.add(skill)

    return sorted(skills)