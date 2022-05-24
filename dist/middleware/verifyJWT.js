"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
exports.default = (req, res, next) => {
    const authenticationHeader = req.headers['authorization'];
    if (!authenticationHeader) {
        return res
            .status(401)
            .json({ message: 'no authentication header supplied.' });
    }
    const token = authenticationHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET),
        (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'invalid jwt token.' });
            }
            req.user = decoded.username;
        };
    next();
};
//# sourceMappingURL=verifyJWT.js.map