"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const hote_controller_1 = require("../controllers/hote.controller");
const router = express_1.default.Router();
router.use(auth_middleware_1.protect, (0, auth_middleware_1.authorize)('HOTE'));
router.post('/colivings', hote_controller_1.createColiving);
router.get('/colivings', hote_controller_1.listMyColivings);
router.put('/colivings/:id', hote_controller_1.updateColiving);
router.get('/reservations', hote_controller_1.listReservationsForHost);
router.patch('/reservations/:id', hote_controller_1.updateReservationDecision);
exports.default = router;
