from services.parsing.section_parser import extract_sections
from services.ai.skill_extractor import extract_skills
from services.ai.extractor.education_extractor import extract_education
from services.ai.extractor.experience_extractor import extract_experience
from services.ai.extractor.contact_extractor import extract_contact_info

def parse_resume(text: str):

    sections = extract_sections(text)

    skills_text = sections.get("skills", "")
    education_text = sections.get("education", "")
    experience_text = sections.get("experience", "")
    
    contact_info = extract_contact_info(text)

    parsed_data = {
        "name": contact_info.get("name"),

        "email": contact_info.get("email"),

        "phone": contact_info.get("phone"),

        "github": contact_info.get("github"),

        "linkedin": contact_info.get("linkedin"),

        
        "skills": extract_skills(skills_text),

        "education": extract_education(education_text),

        "experience_years": extract_experience(experience_text),

        "detected_sections": list(sections.keys())
    }

    return parsed_data