"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.logEvents = void 0;
const date_fns_1 = require("date-fns");
const fs = require("fs");
const path = require("path");
const uuid_1 = require("uuid");
const fsPromises = fs.promises;
const logEvents = (message, logName) => __awaiter(void 0, void 0, void 0, function* () {
    const dateAndTime = `${(0, date_fns_1.format)(new Date(), 'dd-MM-yyyy\tHH:mm:ss')}`;
    const logItem = `${dateAndTime}\t${(0, uuid_1.v4)()}\t${message}\n`;
    try {
        if (!fs.existsSync(path.join(__dirname, '../', '../', 'logs'))) {
            yield fsPromises.mkdir(path.join(__dirname, '../', '../', 'logs'));
        }
        yield fsPromises.appendFile(path.join(__dirname, '../', '../', 'logs', logName), logItem);
    }
    catch (error) { }
});
exports.logEvents = logEvents;
const logger = (req, res, next) => {
    const origin = req.headers.origin || '';
    logEvents(`${req.method}\t${origin}\t${req.url}`, 'reqLog.txt');
    next();
};
exports.logger = logger;
//# sourceMappingURL=logger.js.map