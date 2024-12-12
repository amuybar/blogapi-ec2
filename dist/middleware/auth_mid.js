"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var authMiddleware = function (req, res, next) {
    var _a;
    var token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            message: 'Authorization token missing',
        });
    }
    try {
        var decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'default_secret');
        req.user = decoded;
        next();
    }
    catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({
            message: 'Invalid or expired token',
        });
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=auth_mid.js.map