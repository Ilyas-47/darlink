"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const ai_controller_1 = require("../controllers/ai.controller");
const router = express_1.default.Router();
// Templates are public
router.get('/templates', ai_controller_1.getTemplates);
// Image generation requires authentication
router.post('/generate-image', auth_middleware_1.protect, ai_controller_1.generateImage);
exports.default = router;
