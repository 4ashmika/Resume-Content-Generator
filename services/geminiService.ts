
import { GoogleGenAI, Type } from "@google/genai";
import { PROMPT_INSTRUCTIONS } from '../constants';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const resumeSchema = {
  type: Type.OBJECT,
  properties: {
    personalInfo: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        title: { type: Type.STRING, description: "Candidate's target or current job title" },
        phone: { type: Type.STRING },
        email: { type: Type.STRING },
        linkedin: { type: Type.STRING },
      },
      required: ["name", "title", "phone", "email", "linkedin"],
    },
    summary: {
      type: Type.STRING,
      description: "A compelling 3-4 sentence professional summary, quantifying at least one major achievement.",
    },
    experience: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          company: { type: Type.STRING },
          dates: { type: Type.STRING, description: "e.g., Jan 2020 - Present" },
          achievements: {
            type: Type.ARRAY,
            items: { 
                type: Type.STRING,
                description: "Quantified, action-verb-led bullet point."
            },
          },
        },
        required: ["title", "company", "dates", "achievements"],
      },
    },
    education: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          institution: { type: Type.STRING },
          degree: { type: Type.STRING, description: "e.g., M.S. in Computer Science" },
          dates: { type: Type.STRING, description: "e.g., 2016 - 2020" },
          details: { type: Type.STRING, description: "e.g., GPA or relevant coursework" },
        },
        required: ["institution", "degree", "dates", "details"],
      },
    },
    skills: {
      type: Type.OBJECT,
      properties: {
        Technical: { type: Type.ARRAY, items: { type: Type.STRING } },
        Soft: { type: Type.ARRAY, items: { type: Type.STRING } },
        Certifications: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ["Technical", "Soft", "Certifications"],
    },
  },
  required: ["personalInfo", "summary", "experience", "education", "skills"],
};


export const generateResumeJson = async (rawText: string): Promise<string> => {
  const prompt = PROMPT_INSTRUCTIONS.replace('{CANDIDATE_DETAILS}', rawText);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: resumeSchema,
        temperature: 0.2, // Lower temperature for more deterministic, structured output
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
        throw new Error("Received an empty response from the API.");
    }
    return jsonText;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate content from Gemini API.");
  }
};
