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
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // at this point the client also needs to delete the access token.
    const cookies = req.cookies;
    if (!cookies) {
        return res.status(204).json({ message: 'no cookies' });
    }
    const refreshToken = cookies.jwt;
    const user = yield user_1.default.findOne({
        token: refreshToken
    });
    if (!user) {
        // here we have an refresh token (in cookie) but no access token.
        // so delete the cookie.
        // add `secure: true` to the object when in development.
        res.clearCookie('jwt', {
            httpOnly: true,
            sameSite: true,
            secure: true
        });
        return res.status(204).json({
            message: 'no refresh token found in database, but the cookie has been deleted.'
        });
    }
    // access token and refresh token (in cookie) found.
    yield user.update({ token: '' });
    yield user.save();
    // add `secure: true` to the object when in development.
    res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: true,
        secure: true
    });
    return res
        .status(200)
        .json({ message: `${user.email} has successfully logged out` });
});
exports.default = { logout };
//# sourceMappingURL=logoutController.js.map