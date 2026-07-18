"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const documentRequest_controller_1 = require("../controllers/documentRequest.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.protect);
// Hote actions
router.post('/request', (0, auth_middleware_1.authorize)('HOTE'), documentRequest_controller_1.requestDocumentFromClient);
router.get('/host-requests', (0, auth_middleware_1.authorize)('HOTE'), documentRequest_controller_1.listHostRequests);
router.patch('/:id/validate', (0, auth_middleware_1.authorize)('HOTE'), documentRequest_controller_1.validateClientDocument);
// Client actions
router.get('/my-requests', (0, auth_middleware_1.authorize)('CLIENT'), documentRequest_controller_1.listClientRequests);
router.post('/:id/respond', (0, auth_middleware_1.authorize)('CLIENT'), documentRequest_controller_1.respondToRequest);
exports.default = router;
