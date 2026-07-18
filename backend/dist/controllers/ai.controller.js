"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTemplates = exports.generateImage = void 0;
const zod_1 = require("zod");
const ai_service_1 = require("../services/ai.service");
const generateSchema = zod_1.z.object({
    prompt: zod_1.z.string().min(3, 'Le prompt doit contenir au moins 3 caractères'),
    aspectRatio: zod_1.z.enum(['16:9', '9:16', '1:1', '4:3']).default('16:9'),
});
/**
 * POST /api/ai/generate-image
 * Generate a coliving space image using Higgsfield AI
 */
const generateImage = async (req, res) => {
    try {
        const parsed = generateSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: parsed.error.issues });
        }
        const { prompt, aspectRatio } = parsed.data;
        const result = await (0, ai_service_1.generateColivingImage)(prompt, aspectRatio);
        if (result.success) {
            res.json({
                message: 'Image générée avec succès',
                imageUrl: result.imageUrl,
                prompt,
            });
        }
        else {
            res.status(500).json({
                error: result.error || 'Erreur lors de la génération',
            });
        }
    }
    catch (error) {
        console.error('[AI Controller] Error:', error);
        res.status(500).json({ error: 'Erreur lors de la génération de l\'image' });
    }
};
exports.generateImage = generateImage;
/**
 * GET /api/ai/templates
 * Get predefined prompt templates for coliving spaces
 */
const getTemplates = (_req, res) => {
    res.json(ai_service_1.AI_PROMPT_TEMPLATES);
};
exports.getTemplates = getTemplates;
