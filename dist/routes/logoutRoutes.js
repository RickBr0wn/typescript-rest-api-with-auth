"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const logoutController_1 = require("../controllers/logoutController");
const router = express.Router();
router.get('/', logoutController_1.default.logout);
exports.default = router;
//# sourceMappingURL=logoutRoutes.js.map