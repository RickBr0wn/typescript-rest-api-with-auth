"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const authController_1 = require("../controllers/authController");
const avoidDuplicateEmail_1 = require("../middleware/avoidDuplicateEmail");
const checkReqBody_1 = require("../middleware/checkReqBody");
const router = express.Router();
router.post('/register', checkReqBody_1.default, avoidDuplicateEmail_1.default, authController_1.default.register);
router.post('/login', checkReqBody_1.default, authController_1.default.login);
router.get('/logout', authController_1.default.logout);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map