import { Request, Response } from 'express';
import { z } from 'zod';
import { generateColivingImage, AI_PROMPT_TEMPLATES } from '../services/ai.service';

const generateSchema = z.object({
  prompt: z.string().min(3, 'Le prompt doit contenir au moins 3 caractères'),
  aspectRatio: z.enum(['16:9', '9:16', '1:1', '4:3']).default('16:9'),
});

/**
 * POST /api/ai/generate-image
 * Generate a coliving space image using Higgsfield AI
 */
export const generateImage = async (req: Request, res: Response) => {
  try {
    const parsed = generateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues });
    }

    const { prompt, aspectRatio } = parsed.data;
    const result = await generateColivingImage(prompt, aspectRatio);

    if (result.success) {
      res.json({
        message: 'Image générée avec succès',
        imageUrl: result.imageUrl,
        prompt,
      });
    } else {
      res.status(500).json({
        error: result.error || 'Erreur lors de la génération',
      });
    }
  } catch (error) {
    console.error('[AI Controller] Error:', error);
    res.status(500).json({ error: 'Erreur lors de la génération de l\'image' });
  }
};

/**
 * GET /api/ai/templates
 * Get predefined prompt templates for coliving spaces
 */
export const getTemplates = (_req: Request, res: Response) => {
  res.json(AI_PROMPT_TEMPLATES);
};
