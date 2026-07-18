"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const coliving_controller_1 = require("../controllers/coliving.controller");
const router = express_1.default.Router();
router.get('/available/search', coliving_controller_1.getAvailableChambres);
router.get('/', coliving_controller_1.getAllColivings);
router.get('/:id', coliving_controller_1.getColivingById);
exports.default = router;
