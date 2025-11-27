import { GoogleGenAI, Type } from "@google/genai";
import { OptimizationResponse } from "../types";

// Initialize the client. The key is guaranteed to be available in this environment.
// Always use process.env.API_KEY directly as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const schema = {
  type: Type.OBJECT,
  properties: {
    originalScore: {
      type: Type.INTEGER,
      description: "An estimated ATS score (0-100) for the original resume based on the job description.",
    },
    optimizedScore: {
      type: Type.INTEGER,
      description: "The estimated ATS score (0-100) after optimization. This should be significantly higher.",
    },
    missingKeywords: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of specific high-value ATS keywords (Hard Skills, Tools, Certifications) from the JD that were missing in the original resume. Be extremely specific (e.g., 'React.js' not just 'React').",
    },
    optimizedResume: {
      type: Type.STRING,
      description: "The full text of the rewritten resume. Use Markdown formatting (H1, H2, bullet points). Ensure missing keywords are naturally integrated into Experience and Skills sections.",
    },
    coverLetter: {
        type: Type.STRING,
        description: "A simplified, professional cover letter connecting the user's experience to the job description. Use standard letter formatting.",
    },
    improvementsMade: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of specific changes made to improve the resume (e.g., 'Added keyword X to experience Y', 'Expanded bullet points to include Z').",
    },
  },
  required: ["originalScore", "optimizedScore", "missingKeywords", "optimizedResume", "coverLetter", "improvementsMade"],
};

export const optimizeResumeWithGemini = async (
  jobDescription: string,
  resumeText: string
): Promise<OptimizationResponse> => {
  try {
    const prompt = `
      You are an expert ATS (Applicant Tracking System) optimizer and Senior Technical Recruiter.
      
      Your goal is to maximize the match rate between the Resume and the Job Description (JD) by identifying and integrating critical keywords.
      
      Instructions:
      1. **Precision Extraction (Target Keywords)**: 
         - Analyze the JD to extract a definitive list of **Hard Skills**, **Technologies** (e.g., Python, AWS, Tableau), **Certifications** (e.g., PMP, CISSP), and **Domain-Specific Terminology**.
         - **Ignore** generic soft skills (e.g., "communication", "hard working") unless they are the *primary* focus of the role.
         - The 'missingKeywords' list must ONLY contain these high-value technical/hard skills that are missing from the user's resume.
      
      2. **Mandatory Integration (CRITICAL)**: 
         - You **MUST** naturally weave **EVERY SINGLE** term from your 'missingKeywords' list into the 'optimizedResume' text.
         - **Exact Match**: Use the exact spelling found in the JD (e.g., if JD asks for "React.js", use "React.js", not just "React").
         - **Contextual Placement**: Place these keywords in the **Skills** section OR within the bullet points of **Experience** where they make logical sense based on the user's background.
      
      3. **Strategic Optimization**: 
         - **Eliminate Repetition**: Do NOT repeat the same duties across different roles. Diversify the achievements.
         - **Maximize Impact**: Rewrite bullet points to focus on *unique* achievements and metrics using strong action verbs.
         - **Retain Education**: Ensure the candidate's Education details are preserved and clearly presented.
      
      4. **Cover Letter Generation**:
         - Write a **simplified, well-connecting cover letter**.
         - Highlight 2-3 key achievements that directly solve problems mentioned in the JD.
         - Keep it professional and concise (under 300 words).
      
      5. **Formatting Rules**: 
         - Return content in **clean Markdown**.
         - **Header**: Use **#** (H1) for the candidate's name.
         - **Sections**: Use **##** (H2) for section titles.
         - **Lists**: Use standard bullet points (-) for job details and Skills.
         - **Skills**: Format as a bulleted list or categorized list, NOT a comma-separated paragraph.
         - **Newlines**: Use actual newline characters between sections/bullets.
         - **No Global Bold**: Do NOT wrap the entire document in bold. Use bold ONLY for titles, companies, and metrics.

      6. **Scoring**: Provide a realistic original ATS score and a high optimized score (aim for 85+).

      Job Description:
      ${jobDescription}

      Resume:
      ${resumeText}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        systemInstruction: "You are a highly skilled career coach and ATS specialist. Your output must be valid JSON matching the schema provided.",
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response text received from Gemini.");
    }

    const data = JSON.parse(text) as OptimizationResponse;
    // Add client-side timestamp
    return {
      ...data,
      timestamp: Date.now()
    };
  } catch (error) {
    console.error("Error optimizing resume:", error);
    throw error;
  }
};