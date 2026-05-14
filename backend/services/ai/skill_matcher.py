from spacy.matcher import PhraseMatcher

from services.ai.nlp import nlp
from core.skills import SKILL_DB

matcher = PhraseMatcher(nlp.vocab, attr="LOWER")

patterns = [nlp.make_doc(skill) for skill in SKILL_DB]

matcher.add("SKILLS", patterns)