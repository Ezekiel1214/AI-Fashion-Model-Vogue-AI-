
import { GoogleGenAI, Type } from "@google/genai";
import { ClothingItem, GenerationConfig } from "../types";

// Models updated to follow latest GenAI SDK guidelines for common names and series versions
const RESEARCH_MODEL = "gemini-3-flash-preview";
const THINKING_MODEL = "gemini-3-pro-preview";
const MAPS_MODEL = "gemini-2.5-flash";
const LITE_MODEL = "gemini-flash-lite-latest"; // Fixed to use the standard alias name
const STD_IMAGE_MODEL = "gemini-2.5-flash-image";
const PRO_IMAGE_MODEL = "gemini-3-pro-image-preview";

export const quickSuggestStyle = async (gender: string): Promise<string> => {
  // Creating a new instance to ensure the most up-to-date API key is used
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: LITE_MODEL,
      contents: `Suggest a unique, trending 3-word fashion style for a ${gender} model. Just the 3 words.`,
    });
    // Correctly accessing .text property
    return response.text?.trim() || "Avant-Garde Minimalist";
  } catch (e) {
    return "Modern Chic Casual";
  }
};

export const getLocationInfo = async (city: string, country: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: MAPS_MODEL,
      contents: `What are 3 top fashion districts or shopping landmarks in ${city}, ${country}? Provide a brief list.`,
      config: {
        // Maps grounding requires gemini-2.5 series
        tools: [{ googleMaps: {} }],
      }
    });
    return response.text || `Fashion districts in ${city}.`;
  } catch (e) {
    console.error("Maps error", e);
    return "";
  }
};

export const analyzeModel = async (base64Image: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const cleanBase64 = base64Image.includes('base64,') 
      ? base64Image.split('base64,')[1] 
      : base64Image;

    const match = base64Image.match(/:(.*?);/);
    const mimeType = match ? match[1] : "image/jpeg";

    const response = await ai.models.generateContent({
      model: THINKING_MODEL,
      contents: {
        parts: [
          { inlineData: { mimeType: mimeType, data: cleanBase64 } },
          { text: "Analyze this fashion model. Describe the clothing style, colors, and pose in 2 sentences." }
        ]
      }
    });
    return response.text || "Could not analyze image.";
  } catch (e) {
    console.error("Analysis error", e);
    return "Image analysis failed.";
  }
};

export const getTraditionalClothing = async (
  country: string,
  city: string,
  gender: string,
  specificClothing?: string,
  useDeepResearch: boolean = false
): Promise<ClothingItem[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = useDeepResearch ? THINKING_MODEL : RESEARCH_MODEL;
  const prompt = `List 3 distinct ${specificClothing || "trending or traditional fashion clothing items"} popular in ${city ? city + ", " : ""}${country} for a ${gender}. 
  Be specific about materials, patterns, and style. 
  If specific clothing was requested, vary the styles or colors.`;

  const config: any = {
    responseMimeType: "application/json",
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        items: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "Name of the clothing item" },
              origin: { type: Type.STRING, description: "City or Region of origin" },
              description: { type: Type.STRING, description: "Visual description of the item" }
            },
            required: ["name", "origin"]
          }
        }
      }
    }
  };

  if (useDeepResearch) {
    // Config for thinking models
    config.thinkingConfig = { thinkingBudget: 32768 };
  } else {
    // Grounding with Google Search
    config.tools = [{ googleSearch: {} }];
  }

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: config
    });

    let text = response.text || "{}";
    if (text.trim().startsWith("```")) {
      text = text.replace(/^```(json)?\s*/, "").replace(/\s*```$/, "");
    }

    const json = JSON.parse(text);
    const items: ClothingItem[] = json.items || [];
    // Extract grounding URLs for search results as per guidelines
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const links = groundingChunks.map((c: any) => c.web?.uri).filter((uri: string) => uri);

    if (items.length > 0 && links.length > 0) {
      items[0].groundingLinks = links.slice(0, 3);
    }

    return items;
  } catch (error) {
    console.error("Error fetching clothing details:", error);
    return [{ name: "Traditional Attire", origin: country, description: "Standard traditional clothing" }];
  }
};

export const generateClothingImage = async (
  imageBase64: string | null,
  clothing: ClothingItem,
  config: GenerationConfig,
  customDescription?: string
): Promise<string | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = config.highQuality ? PRO_IMAGE_MODEL : STD_IMAGE_MODEL;

  const identityProtocol = imageBase64 ? `
  ### **Identity Preservation Protocol**
  CRITICAL:
  ✓ Face: 100% identical
  ✓ Hair: Exact length, texture, color
  ✓ Skin: Same tone and texture
  ✓ Body: Preserved proportions
  ` : "";

  const poseInstruction = config.poseReference 
    ? "MANDATORY: Transfer the EXACT pose, stance, and body orientation from the SECOND provided image (Pose Reference)." 
    : `POSE: ${config.pose || "Professional Fashion Model Pose"}. Ensure a natural and professional high-fashion posture.`;

  const subject = imageBase64 
    ? "The person from the FIRST provided image (strictly adhere to Identity Protocol)" 
    : `A photorealistic ${config.gender} fashion model`;

  const outfitDescription = customDescription 
    ? `USER INSTRUCTION: ${customDescription}` 
    : `Wearing a ${clothing.name} (${clothing.description}) typical of ${clothing.origin}`;

  const fullPrompt = `
    ${identityProtocol}
    TASK: Fashion Photography.
    SUBJECT: ${subject}.
    ${poseInstruction}
    INSTRUCTION: ${outfitDescription}.
    BACKGROUND: ${config.background || "Studio neutral background"}.
    STYLE: ${config.photoshootType || "High Fashion Photography"}.
    QUALITY: Highly detailed, realistic lighting, 8k resolution.
  `;

  const parts: any[] = [];

  // Part 1: Source Image (Identity)
  if (imageBase64) {
    const cleanSource = imageBase64.includes('base64,') ? imageBase64.split('base64,')[1] : imageBase64;
    const match = imageBase64.match(/:(.*?);/);
    parts.push({
      inlineData: {
        mimeType: match ? match[1] : "image/jpeg",
        data: cleanSource
      }
    });
  }

  // Part 2: Pose Reference Image (Visual Pose)
  if (config.poseReference) {
    const cleanPose = config.poseReference.includes('base64,') ? config.poseReference.split('base64,')[1] : config.poseReference;
    const match = config.poseReference.match(/:(.*?);/);
    parts.push({
      inlineData: {
        mimeType: match ? match[1] : "image/jpeg",
        data: cleanPose
      }
    });
  }

  // Part 3: Text Prompt
  parts.push({ text: fullPrompt });

  const genConfig: any = {
    imageConfig: {
      aspectRatio: config.aspectRatio || '3:4'
    }
  };

  if (config.highQuality) {
    // imageSize is only supported on gemini-3-pro-image-preview
    genConfig.imageConfig.imageSize = "2K";
  }

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: { parts },
      config: genConfig
    });

    // Iterate through parts to find the image, as per guidelines
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/jpeg;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};