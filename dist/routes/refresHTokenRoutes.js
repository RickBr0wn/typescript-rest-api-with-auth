"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const refreshTokenController_1 = require("../controllers/refreshTokenController");
const router = express.Router();
router.get('/token', refreshTokenController_1.default.refreshToken);
exports.default = router;
//# sourceMappingURL=refreshTokenRoutes.js.map