import re


def extract_email(text: str):

    pattern = r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"

    match = re.search(pattern, text)

    if match:
        return match.group(0)

    return None



def extract_phone(text: str):

    pattern = r"(\+92|0)?\d{10,12}"

    match = re.search(pattern, text)

    if match:
        return match.group(0)

    return None



def extract_github(text: str):

    pattern = r"(https?:\/\/)?(www\.)?github\.com\/[A-Za-z0-9_-]+"

    match = re.search(pattern, text)

    if match:
        return match.group(0)

    return None



def extract_linkedin(text: str):

    pattern = r"(https?:\/\/)?(www\.)?linkedin\.com\/in\/[A-Za-z0-9_-]+"

    match = re.search(pattern, text)

    if match:
        return match.group(0)

    return None



def extract_name(text: str):

    lines = text.splitlines()

    for line in lines[:10]:

        clean = line.strip()

        # ignore empty
        if not clean:
            continue

        # ignore emails/websites
        if "@" in clean:
            continue

        if "http" in clean:
            continue

        # probable name
        words = clean.split()

        if 2 <= len(words) <= 4:

            if all(w.replace("-", "").isalpha() for w in words):

                return clean.title()

    return None



def extract_contact_info(text: str):

    return {

        "name": extract_name(text),

        "email": extract_email(text),

        "phone": extract_phone(text),

        "github": extract_github(text),

        "linkedin": extract_linkedin(text)
    }