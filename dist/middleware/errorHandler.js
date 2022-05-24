"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./logger");
exports.default = (err, req, res, next) => {
    (0, logger_1.logEvents)(`${err.name}: ${err.message}`, 'errorLog.txt');
    console.log(err.stack);
    res.status(500).send(err.message);
    next();
};
//# sourceMappingURL=errorHandler.js.map