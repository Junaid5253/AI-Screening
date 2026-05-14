import re
from services.ai.nlp import nlp

BLACKLIST = {
    "resume",
    "curriculum vitae",
    "cv",
    "developer",
    "engineer",
    "student",
    "profile",
    "summary",
    "education",
    "skills",
    "experience",
    "personal information",
    "contact information"
}

def extract_email(text: str):

    pattern = r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"

    match = re.search(pattern, text)

    if match:
        return match.group(0)

    return None



def extract_phone(text: str):

    pattern = r"\+?\d[\d\s\-\(\)]{8,15}"

    matches = re.finditer(pattern, text)

    for match in matches:

        phone = match.group(0).strip()

        digits = re.sub(r"\D", "", phone)

        if 10 <= len(digits) <= 15:
            return phone

    return None

def extract_github(text: str):

    pattern = r"(https?:\/\/)?(www\.)?github\.com\/[A-Za-z0-9_.-]+"

    match = re.search(pattern, text, re.IGNORECASE)

    if match:

        url = match.group(0)

        if not url.startswith("http"):
            url = "https://" + url

        return url

    return None


def extract_linkedin(text: str):

    pattern = r"(https?:\/\/)?(www\.)?linkedin\.com\/in\/[A-Za-z0-9_-]+"

    match = re.search(pattern, text, re.IGNORECASE)

    if match:

        url = match.group(0)

        if not url.startswith("http"):
            url = "https://" + url

        return url

    return None


def extract_name(text: str):

    sample = text[:2000]

    doc = nlp(sample)

    candidates = []

    for ent in doc.ents:

        if ent.label_ != "PERSON":
            continue

        name = ent.text.strip()

        # cleanup
        name = re.sub(r"[^A-Za-z\s\-\.]", "", name)
        name = re.sub(r"\s+", " ", name).strip()

        lower = name.lower()

        # blacklist filtering
        if lower in BLACKLIST:
            continue

        words = name.split()

        # realistic name length
        if not (2 <= len(words) <= 4):
            continue

        # avoid lowercase garbage
        if not all(w[0].isupper() for w in words if w):
            continue

        candidates.append(name.title())

    if candidates:
        return candidates[0]

    return None

def extract_contact_info(text: str):

    return {

        "name": extract_name(text),

        "email": extract_email(text),

        "phone": extract_phone(text),

        "github": extract_github(text),

        "linkedin": extract_linkedin(text)
    }