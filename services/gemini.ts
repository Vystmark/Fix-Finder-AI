import { GoogleGenAI, Type } from "@google/genai";
import { ServiceProvider, AiAnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = "gemini-3-flash-preview";

export const findProviders = async (query: string, zipCode: string): Promise<ServiceProvider[]> => {
  try {
    const prompt = `
      Generate a realistic list of 6 local service providers for the trade or service: "${query}" in zip code "${zipCode}".
      Simulate a search that scans multiple sources: Google Business, Facebook Pages, and local FixFinder partners.
      
      Return the data as a JSON array. 
      - "source": Randomly assign one of ['FixFinder', 'Facebook', 'Google', 'Directory'].
      - "socialLink": If source is Facebook, provide a realistic mock URL (e.g., facebook.com/businessname).
      - "distance": relative to the zip code (e.g., "2.5 miles").
      - "imageUrl": keyword for picsum (e.g. "plumber", "renovation").
      
      Ensure at least 2 results are from "Facebook" to show we find pros not on traditional search engines.
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
              imageUrl: { type: Type.STRING },
              source: { type: Type.STRING },
              socialLink: { type: Type.STRING }
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