"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const allowedOrigins_1 = require("../allowedOrigins");
exports.default = (req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins_1.default.includes[origin]) {
        res.header('Access-Control-Allow-Credentials', 'true');
    }
    next();
};
//# sourceMappingURL=handleCorsCredentials.js.map