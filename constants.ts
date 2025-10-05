
export const PROMPT_INSTRUCTIONS = `
You are an expert Resume Content Generator. Your task is to act as a highly selective HR professional and generate a complete, professional, achievement-focused resume in a single, strict JSON object.

CANDIDATE INPUT:
{CANDIDATE_DETAILS}

JSON SCHEMA INSTRUCTIONS:
1.  **Strict Format:** The entire output must be a single JSON object that adheres strictly to the provided response schema. Do not include any text, markdown, or commentary outside of the JSON object.
2.  **Professional Summary:** Create a compelling 3-4 sentence summary. It must quantify at least one major achievement.
3.  **Experience Bullets:** For every work history entry, generate 3-5 high-impact, quantified bullet points. Each bullet must start with a strong action verb (e.g., Led, Engineered, Drove, Secured, Increased) and include a metric (e.g., "$5M", "20%", "team of 10").
4.  **Skills:** Categorize all skills into **Technical**, **Soft**, and **Certifications**.
`;

export const PLACEHOLDER_TEXT = `PASTE ALL RAW CANDIDATE DETAILS HERE. For example:

Name: Jane Doe
Contact: 555-123-4567, jane.doe@email.com, linkedin.com/in/janedoe
Target Role: Senior Product Manager

Work History:
1. Tech Solutions Inc - Product Manager (Jan 2020 - Present)
   - Managed the product lifecycle for our main SaaS platform.
   - Worked with engineering and design teams.
   - Did user research and gathered feedback.
   - Helped increase user engagement.

2. Web Innovators LLC - Junior Product Manager (June 2017 - Dec 2019)
   - Assisted senior PMs on feature development.
   - Wrote user stories and specifications.
   - Helped with market analysis.

Education:
- University of Technology, M.S. in Information Systems (2015 - 2017)
- State University, B.A. in Business Administration (2011 - 2015)

Key Skills:
- Product Roadmapping, Agile/Scrum, JIRA, SQL, Market Research, User Interviews, Public Speaking, Leadership
`;
