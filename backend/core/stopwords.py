from spacy.lang.en.stop_words import STOP_WORDS


CUSTOM_STOPWORDS = {

    # job description filler words
    "looking",
    "join",
    "team",
    "work",
    "working",
    "strong",
    "basic",
    "preferred",
    "requirements",
    "responsibilities",
    "minimum",
    "candidate",
    "familiarity",

    # generic hiring words
    "company",
    "role",
    "position",
    "job",
    "opportunity",

    # weak semantic words
    "ability",
    "knowledge",
    "experience",
    "understanding",
    "skills",

    # noisy tech words
    "developer",
    "developers",
    "engineer",
    "engineering"
}


STOPWORDS = STOP_WORDS.union(CUSTOM_STOPWORDS)