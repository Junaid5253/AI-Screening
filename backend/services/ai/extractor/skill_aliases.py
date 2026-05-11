SKILL_ALIASES = {

    "ml": "machine learning",
    "machine-learning": "machine learning",
    "data analytics": "data analysis",
    "eda": "exploratory data analysis",
    "sklearn": "scikit-learn",
    "jupyter": "jupyter notebook",
    "sql": "sql",
    "git hub": "github",
}
def resolve_skill(skill: str) -> str:

    skill = skill.lower().strip()

    return SKILL_ALIASES.get(skill, skill)