"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const reservation_controller_1 = require("../controllers/reservation.controller");
const router = express_1.default.Router();
router.post('/', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('CLIENT'), reservation_controller_1.createReservation);
router.post('/:id/paiement', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('CLIENT'), reservation_controller_1.createPaiementAfterConfirmation);
router.get('/me', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('CLIENT'), reservation_controller_1.listMyReservations);
exports.default = router;
