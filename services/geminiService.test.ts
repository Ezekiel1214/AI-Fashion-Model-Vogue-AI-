import { describe, expect, it } from "vitest";
import { buildImageConfig, buildImagePrompt } from "./geminiService";
import { ClothingItem, GenerationConfig } from "../types";

const baseConfig: GenerationConfig = {
  country: "Japan",
  city: "Tokyo",
  gender: "female",
  photoshootType: "Editorial / High Fashion",
  background: "Studio Noir",
  pose: "Standard: Standing Confidence",
  poseReference: null,
  aspectRatio: "3:4",
  useDeepResearch: false,
  highQuality: false
};

const clothing: ClothingItem = {
  name: "Kimono",
  origin: "Kyoto",
  description: "Silk kimono with floral embroidery"
};

describe("buildImagePrompt", () => {
  it("prioritizes pose reference instructions when provided", () => {
    const prompt = buildImagePrompt(null, clothing, {
      ...baseConfig,
      poseReference: "data:image/jpeg;base64,pose"
    });

    expect(prompt).toContain(
      "MANDATORY: Transfer the EXACT pose, stance, and body orientation from the SECOND provided image (Pose Reference)."
    );
  });

  it("uses the custom description when provided", () => {
    const customDescription = "USER INSTRUCTION: Neon-lit streetwear remix";
    const prompt = buildImagePrompt(null, clothing, baseConfig, customDescription);

    expect(prompt).toContain(customDescription);
  });
});

describe("buildImageConfig", () => {
  it("adds image size for high quality generations", () => {
    const config = buildImageConfig({ ...baseConfig, highQuality: true });

    expect(config.imageConfig.imageSize).toBe("2K");
  });
});
