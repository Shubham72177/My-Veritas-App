
import { GoogleGenAI } from "@google/genai";
import type { FactCheckResponse, Source } from '../../types';

// In Vite, environment variables are exposed on import.meta.env
// and must be prefixed with VITE_ to be exposed to the client.
const apiKey = import.meta.env.VITE_API_KEY;

if (!apiKey) {
    throw new Error("VITE_API_KEY environment variable not set. Please create a .env file in the project root and add your key as VITE_API_KEY=your_api_key");
}

const ai = new GoogleGenAI({ apiKey });

// Define type for grounding chunk to avoid 'any'
interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
}

const parseResponseText = (text: string): Omit<FactCheckResponse, 'sources'> => {
  const summaryMatch = text.match(/\[FACT_CHECKED_SUMMARY\]\s*([\s\S]*?)\s*\[CREDIBILITY_SCORE\]/);
  const scoreMatch = text.match(/\[CREDIBILITY_SCORE\]\s*(\d+)\s*\[JUSTIFICATION\]/);
  const justificationMatch = text.match(/\[JUSTIFICATION\]\s*([\s\S]*)/);

  const summary = summaryMatch ? summaryMatch[1].trim() : "The model did not provide a summary in the expected format.";
  const credibilityScore = scoreMatch ? parseInt(scoreMatch[1], 10) : 0;
  const justification = justificationMatch ? justificationMatch[1].trim() : "The model did not provide a justification in the expected format.";

  // Basic validation
  if (credibilityScore < 0 || credibilityScore > 100) {
      console.warn(`Credibility score out of range: ${credibilityScore}`);
  }

  return {
    summary,
    credibilityScore: Math.max(0, Math.min(100, credibilityScore)), // Clamp score between 0 and 100
    justification,
  };
};

export const factCheckWithGoogleSearch = async (query: string): Promise<FactCheckResponse> => {
  const model = "gemini-2.5-flash";
  
  const prompt = `
You are an expert fact-checker and neutral news analyst. Your task is to investigate the following topic using real-time information from Google Search. Provide a neutral, evidence-based summary.

Topic: "${query}"

After your investigation, you MUST format your entire response using the following structure, and only this structure. Do not add any text before or after this structure, including "Here is the response in the requested format:".

[FACT_CHECKED_SUMMARY]
<Your detailed, neutral, and fact-checked summary of the topic based on the search results. Synthesize information from multiple sources and present a balanced view. Aim for 3-4 paragraphs.>

[CREDIBILITY_SCORE]
<An integer score from 0 to 100 representing the confidence in the provided information based on the quality and consensus of the sources found. 100 is highest credibility.>

[JUSTIFICATION]
<A brief justification for the credibility score. Mention the general consensus, any conflicting reports, and the quality of the sources (e.g., reputable news agencies, scientific journals, etc.).>
`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const responseText = response.text;
    if (!responseText) {
        throw new Error('The model did not return a text response.');
    }

    const parsedData = parseResponseText(responseText);

    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const sources: Source[] = groundingMetadata?.groundingChunks?.map((chunk: GroundingChunk) => ({
        uri: chunk.web?.uri || '#',
        title: chunk.web?.title || 'Unknown Source',
    })).filter((source: Source, index: number, self: Source[]) => 
        source.uri !== '#' && index === self.findIndex((s) => s.uri === source.uri)
    ) || [];

    return { ...parsedData, sources };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error && error.message.includes('SAFETY')) {
        throw new Error('The request was blocked due to safety settings. Please modify your query.');
    }
    throw new Error("Failed to get a response from the AI model. The service may be unavailable.");
  }
};
