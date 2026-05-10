import re


def normalize_text(text: str) -> str:

    if not text:
        return ""

    text = text.lower()

    # remove special characters but keep + and #
    text = re.sub(r"[^a-z0-9\s\+\#]", " ", text)

    # collapse spaces
    text = re.sub(r"\s+", " ", text).strip()

    return text