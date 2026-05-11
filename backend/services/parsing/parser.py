from services.parsing.section_parser import extract_sections
from services.ai.skill_extractor import extract_skills
from services.ai.extractor.education_extractor import extract_education
from services.ai.extractor.experience_extractor import extract_experience


def parse_resume(text: str):

    sections = extract_sections(text)

    skills_text = sections.get("skills", "")
    education_text = sections.get("education", "")
    experience_text = sections.get("experience", "")

    parsed_data = {

        "skills": extract_skills(skills_text),

        "education": extract_education(education_text),

        "experience_years": extract_experience(experience_text),

        "detected_sections": list(sections.keys())
    }

    return parsed_data