import { higgsfield, config } from '@higgsfield/client/v2';

// Initialize with credentials from environment
const credentials = process.env.HIGGSFIELD_CREDENTIALS;
if (credentials) {
  config({ credentials });
}

export interface AIGenerationResult {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

/**
 * Generate a professional coliving space image using Higgsfield AI
 */
export async function generateColivingImage(
  prompt: string,
  aspectRatio: string = '16:9'
): Promise<AIGenerationResult> {
  if (!credentials) {
    // Fallback: return a demo/placeholder when no API key is configured
    return generateFallbackImage(prompt);
  }

  try {
    const jobSet: any = await higgsfield.subscribe('flux-pro/kontext/max/text-to-image', {
      input: {
        aspect_ratio: aspectRatio,
        prompt: buildColivingPrompt(prompt),
        safety_tolerance: 2,
      },
      withPolling: true,
    });

    if (jobSet.isCompleted && jobSet.jobs?.[0]?.results?.raw?.url) {
      return {
        success: true,
        imageUrl: jobSet.jobs[0].results.raw.url,
      };
    }

    return { success: false, error: 'La génération a échoué. Réessayez.' };
  } catch (error) {
    console.error('[AI Service] Higgsfield error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur lors de la génération',
    };
  }
}

/**
 * Build an optimized prompt for coliving space imagery
 */
function buildColivingPrompt(userPrompt: string): string {
  return `Professional interior photography of a Moroccan coliving space: ${userPrompt}. 
Style: modern riad, warm lighting, terracotta accents, lush plants, cozy communal areas, 
architectural digest quality, golden hour natural light, 8k resolution, photorealistic`;
}

/**
 * Fallback image generation when no API key is available (demo mode)
 * Returns curated high-quality Unsplash images based on keywords
 */
function generateFallbackImage(prompt: string): AIGenerationResult {
  const lower = prompt.toLowerCase();

  const imageMap: Record<string, string> = {
    salon: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
    chambre: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=80',
    cuisine: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80',
    terrasse: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
    piscine: 'https://images.unsplash.com/photo-1572331165267-854da2b021b1?w=1200&q=80',
    coworking: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
    jardin: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&q=80',
    riad: 'https://images.unsplash.com/photo-1548018560-c7196e4e23a7?w=1200&q=80',
    yoga: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1200&q=80',
    surf: 'https://images.unsplash.com/photo-1502680390548-bdbac40e4ce3?w=1200&q=80',
  };

  const defaultImg = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80';
  const matchedKey = Object.keys(imageMap).find((k) => lower.includes(k));

  return {
    success: true,
    imageUrl: matchedKey ? imageMap[matchedKey] : defaultImg,
  };
}

/**
 * Predefined prompt templates for common coliving spaces
 */
export const AI_PROMPT_TEMPLATES = [
  { label: 'Salon Moderne', prompt: 'spacious modern living room with moroccan zellige tiles, plush sofas, and warm ambient lighting' },
  { label: 'Chambre Cozy', prompt: 'cozy private bedroom with handwoven berber rug, minimalist wooden furniture, and soft bedding' },
  { label: 'Espace Coworking', prompt: 'bright open coworking space with large desks, fast wifi setup, ergonomic chairs, and green plants' },
  { label: 'Terrasse Rooftop', prompt: 'stunning rooftop terrace with panoramic views, lounge seating, lanterns, and moroccan tea setup' },
  { label: 'Cuisine Communautaire', prompt: 'spacious communal kitchen with modern appliances, breakfast bar, hanging herbs, and moroccan tiles' },
  { label: 'Riad Traditionnel', prompt: 'traditional moroccan riad courtyard with fountain, mosaic tiles, orange trees, and arched doorways' },
  { label: 'Salle de Yoga', prompt: 'serene yoga and meditation room with bamboo flooring, natural light, cushions, and incense' },
  { label: 'Piscine', prompt: 'inviting swimming pool surrounded by palm trees, sun loungers, and a traditional moroccan pavilion' },
];
