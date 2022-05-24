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
const user_1 = require("../models/user");
const server = (req, res) => {
    return res.status(200).json({ message: 'finally!!' });
};
const database = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const randomUser = new user_1.default({
        email: 'bbb@bbb.com',
        password: 'stupid_password'
    });
    yield randomUser.save();
    return res.status(200).json({ message: 'random user created.' });
});
exports.default = { server, database };
//# sourceMappingURL=healthController.js.map