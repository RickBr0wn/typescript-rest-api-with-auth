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
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const newUser = new user_1.default({
        email,
        password
    });
    yield newUser.save();
    return res.status(200).json({
        message: `new user with the email ${email} has been created in database.`
    });
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const existingUser = yield user_1.default.findOne({ email });
    if (!existingUser) {
        return res
            .status(403)
            .json({ message: 'user does not exist in the database.' });
    }
    const isMatch = yield bcrypt.compare(password, existingUser.password);
    if (isMatch) {
        const accessToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '5m'
        });
        const refreshToken = jwt.sign({ email }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1d'
        });
        const updateResult = yield user_1.default.updateOne({ _id: existingUser._id }, { $set: { token: refreshToken } });
        if (!updateResult) {
            return res
                .status(401)
                .json({ message: 'an error occured whilst saving to the database.' });
        }
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            sameSite: true,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });
        return res.status(200).json({
            loggedIn: true,
            message: `${email} successfully logged in.`,
            token: accessToken
        });
    }
    return res.status(200).json({
        loggedIn: true,
        message: `incorrect credentials.`
    });
});
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
exports.default = { login, register, logout };
//# sourceMappingURL=authController.js.map