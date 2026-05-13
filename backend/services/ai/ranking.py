from services.ai.similarity import calculate_similarity
from services.ai.similarity import calculate_skill_match
from services.ai.similarity import calculate_experience_score


def rank_resumes(job, resumes):

    ranked = []

    for resume in resumes:

        similarity_score = calculate_similarity(
            job.description,
            resume.raw_text
        )

        skill_score = calculate_skill_match(
            job.required_skills,
            resume.skills
        )

        experience_score = calculate_experience_score(
            job.experience_required,
            resume.experience_years
        )

        # FINAL WEIGHTED SCORE
        final_score = (
            similarity_score * 0.5 +
            skill_score * 0.3 +
            experience_score * 0.2
        )

        ranked.append({
            "resume_id": resume.id,
            "candidate_name": resume.candidate_name,
            "skills": resume.skills or [],
            "experience_years": resume.experience_years,
            "similarity_score": similarity_score,
            "skill_score": skill_score,
            "experience_score": experience_score,
            "final_score": round(final_score, 2)
        })

    ranked.sort(
        key=lambda x: x["final_score"],
        reverse=True
    )

    return ranked