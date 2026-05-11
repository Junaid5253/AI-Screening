import re

SECTION_HEADERS = {

    "education",
    "skills",
    "projects",
    "experience",
    "certifications",
    "profile",
    "summary",
    "extracurricular activities"
}

SECTION_ALIASES = {

    "technical skills": "skills",
    "soft skills": "skills",
    "professional summary": "profile",
    "work experience": "experience",
    "academic background": "education",
    "education and certifications": "education",
}


def normalize_header(line: str) -> str:

    line = line.lower().strip()

    line = re.sub(r"[^a-z\s]", "", line)

    line = re.sub(r"\s+", " ", line).strip()

    return SECTION_ALIASES.get(line, line)


def extract_sections(text: str):

    sections = {}
    current = "general"
    sections[current] = []

    for line in text.splitlines():

        normalized = normalize_header(line)

        matched = None

        for header in SECTION_HEADERS:

            if header in normalized:

                matched = header
                break

        if matched:

            current = matched

            if current not in sections:
                sections[current] = []

        else:

            sections[current].append(line)

    for k in sections:

        sections[k] = "\n".join(sections[k]).strip()

    return sections