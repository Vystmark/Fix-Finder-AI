import { GoogleGenAI, Type } from "@google/genai";
import { ServiceProvider, AiAnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Using gemini-2.5-flash for speed and cost-effectiveness
const MODEL_NAME = "gemini-2.5-flash";

export const findProviders = async (query: string, zipCode: string): Promise<ServiceProvider[]> => {
  try {
    const prompt = `
      Generate a realistic list of 6 local service providers for the trade or service: "${query}" in zip code "${zipCode}".
      If the query is generic (e.g., "fix my house"), infer the most likely general contractor or handyman service.
      Return the data as a JSON array. 
      Ensure names sound like authentic local small businesses. 
      "distance" should be relative to the zip code (e.g., "2.5 miles").
      "imageUrl" should be a keyword suitable for picsum photos (e.g. "plumber", "electrician", "tools").
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              trade: { type: Type.STRING },
              rating: { type: Type.NUMBER },
              reviewCount: { type: Type.INTEGER },
              hourlyRate: { type: Type.STRING },
              distance: { type: Type.STRING },
              badges: { 
                type: Type.ARRAY,
                items: { type: Type.STRING } 
              },
              description: { type: Type.STRING },
              availability: { type: Type.STRING },
              imageUrl: { type: Type.STRING }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as ServiceProvider[];
  } catch (error) {
    console.error("Gemini search error:", error);
    return [];
  }
};

export const analyzeHomeIssue = async (base64Image: string): Promise<AiAnalysisResult | null> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image
            }
          },
          {
            text: "Analyze this image of a home maintenance issue. Identify the professional trade needed to fix it (e.g. Plumber, Electrician, Roofer). Assess the severity and estimate a rough cost range for repair."
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detectedTrade: { type: Type.STRING },
            description: { type: Type.STRING },
            severity: { type: Type.STRING, enum: ['Low', 'Medium', 'High', 'Emergency'] },
            estimatedCostRange: { type: Type.STRING }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as AiAnalysisResult;
  } catch (error) {
    console.error("Gemini analysis error:", error);
    return null;
  }
};