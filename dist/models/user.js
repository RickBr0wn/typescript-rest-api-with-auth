"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    token: { type: String, required: false }
}, { timestamps: true });
UserSchema.methods = {
    encryptPassword: function (password) {
        if (!password) {
            return '';
        }
        else {
            const salt = bcrypt.genSaltSync(10);
            return bcrypt.hashSync(password, salt);
        }
    }
};
UserSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        this.password = this.encryptPassword(this.password);
    }
    next();
});
exports.default = mongoose.model('User', UserSchema, 'users');
//# sourceMappingURL=user.js.map