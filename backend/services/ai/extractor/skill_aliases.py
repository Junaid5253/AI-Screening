import re

SKILL_ALIASES = {
    # Programming Languages
    "js": "javascript",
    "ts": "typescript",
    "py": "python",
    "cpp": "c++",
    "c++": "c++",
    "golang": "go",

    # Web Development
    "reactjs": "react",
    "react.js": "react",
    "vuejs": "vue",
    "vue.js": "vue",
    "angularjs": "angular",
    "angular.js": "angular",
    "es6": "javascript",
    "es5": "javascript",

    # Node.js variations
    "nodejs": "node.js",
    "node": "node.js",
    "npm": "npm",

    # REST API variations
    "rest": "rest api",
    "restapi": "rest api",
    "rest-api": "rest api",
    "rest_api": "rest api",
    "api": "rest api",
    "apis": "rest api",
    "web api": "rest api",

    # Data Science
    "ml": "machine learning",
    "machine learning": "machine learning",
    "machine-learning": "machine learning",
    "dl": "deep learning",
    "deep-learning": "deep learning",
    "ds": "data science",
    "data-science": "data science",
    "da": "data analysis",
    "data analytics": "data analysis",
    "data-analysis": "data analysis",

    # Libraries & Frameworks
    "eda": "exploratory data analysis",
    "sklearn": "scikit-learn",
    "scikit learn": "scikit-learn",
    "scikit-learn": "scikit-learn",
    "tf": "tensorflow",
    "torch": "pytorch",

    # Databases
    "postgres": "postgresql",
    "mongo": "mongodb",
    "sqlite3": "sqlite",
    "redis": "redis",
    "elastic": "elasticsearch",

    # Cloud Platforms
    "amazon": "aws",
    "amazon web services": "aws",
    "gcp": "gcp",
    "google cloud": "gcp",

    # Version Control
    "git hub": "github",
    "git-hub": "github",
    "git lab": "gitlab",
    "git-lab": "gitlab",

    # Containers & Orchestration
    "docker": "docker",
    "k8s": "kubernetes",
    "k8": "kubernetes",

    # Web Frameworks
    "django": "django",
    "flask": "flask",
    "fastapi": "fastapi",
    "spring": "spring",
    "springboot": "spring boot",
    "spring-boot": "spring boot",
    "laravel": "laravel",
    "aspnet": "asp.net",
    "asp-net": "asp.net",

    # Notebooks
    "jupyter": "jupyter notebook",

    # Testing
    "unit test": "unit testing",
    "testing": "unit testing",

    # Methodologies
    "agile methodology": "agile",
    "scrum master": "scrum",
    "ci/cd": "ci cd",

    # Operating Systems
    "unix": "linux",
    "macos": "macos",

    # Markup/Style
    "html5": "html",
    "css3": "css",
    "scss": "sass",

    # Other
    "oop": "oop",
    "oops": "oop",
}


def normalize_skill_text(skill: str):

    skill = skill.lower().strip()

    # replace separators
    skill = re.sub(r"[_\-]", " ", skill)

    # remove extra spaces
    skill = re.sub(r"\s+", " ", skill)

    return skill


def resolve_skill(skill: str) -> str:

    skill = normalize_skill_text(skill)

    return SKILL_ALIASES.get(skill, skill)