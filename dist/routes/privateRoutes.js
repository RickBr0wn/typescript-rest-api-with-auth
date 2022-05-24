"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const privateController_1 = require("../controllers/privateController");
const verifyJWT_1 = require("../middleware/verifyJWT");
const router = express.Router();
router.get('/data', verifyJWT_1.default, privateController_1.default.sensitive);
exports.default = router;
//# sourceMappingURL=privateRoutes.js.map