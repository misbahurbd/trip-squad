"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
const http_status_1 = __importDefault(require("http-status"));
class AppError extends Error {
    constructor(statusCode, message, stack) {
        super(message);
        this.statusCode = statusCode || http_status_1.default.INTERNAL_SERVER_ERROR;
        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
exports.AppError = AppError;
