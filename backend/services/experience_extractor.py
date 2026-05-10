import re


def extract_experience(text: str):

    if not text:
        return 0

    text = text.lower()

    patterns = [

        r"(\d+)\+?\s+years?\s+of\s+experience",
        r"(\d+)\+?\s+years?\s+experience",
        r"experience\s*:\s*(\d+)\+?\s*years?",
        r"(\d+)\+?\s+yrs"
    ]

    years_found = []

    for pattern in patterns:

        matches = re.findall(pattern, text)

        for match in matches:
            years_found.append(int(match))

    return max(years_found) if years_found else 0