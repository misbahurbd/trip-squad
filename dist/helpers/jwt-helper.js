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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_client_1 = __importDefault(require("../utils/prisma-client"));
const http_status_1 = __importDefault(require("http-status"));
const app_error_1 = require("../app/errors/app-error");
const generateToken = (payload, secret, expiresIn) => {
    return jsonwebtoken_1.default.sign(payload, secret, { expiresIn });
};
exports.generateToken = generateToken;
const verifyToken = (token, secret) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decode = jsonwebtoken_1.default.verify(token, secret);
        if (!decode || !decode.exp)
            throw new app_error_1.AppError(http_status_1.default.UNAUTHORIZED, "Invalid token");
        const isTokenValid = decode.exp > Date.now() / 1000;
        if (!isTokenValid)
            throw new app_error_1.AppError(http_status_1.default.UNAUTHORIZED, "Token expired");
        const user = yield prisma_client_1.default.user.findUnique({
            where: {
                id: decode.id,
                email: decode.email,
                role: decode.role,
                status: "Active",
                isDeleted: false,
            },
        });
        if (!user)
            throw new app_error_1.AppError(http_status_1.default.UNAUTHORIZED, "You are unauthorized");
        return {
            id: user.id,
            email: user.email,
            role: user.role,
        };
    }
    catch (error) {
        throw new app_error_1.AppError(http_status_1.default.UNAUTHORIZED, "You are unauthorized");
    }
});
exports.verifyToken = verifyToken;
