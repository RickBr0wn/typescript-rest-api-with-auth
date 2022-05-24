"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const healthController_1 = require("../controllers/healthController");
const checkReqBody_1 = require("../middleware/checkReqBody");
const router = express.Router();
router.get('/server', healthController_1.default.server);
router.post('/database', checkReqBody_1.default, healthController_1.default.database);
exports.default = router;
//# sourceMappingURL=healthRoutes.js.map