"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const zod_1 = require("zod");
const globalErrorHandler = (err, req, res, next) => {
    var _a, _b;
    let statusCode = err.statusCode || http_status_1.default.INTERNAL_SERVER_ERROR;
    let message = err.message || "Something went wrong";
    let errorDetails = err || null;
    if (err instanceof zod_1.ZodError) {
        statusCode = http_status_1.default.BAD_REQUEST;
        message = err.issues
            .map(issue => issue.message == "Required"
            ? `${issue.path[0]} is ${issue.message}`.toLowerCase()
            : issue.message)
            .join(", ");
        errorDetails = err.issues;
    }
    else if (err.code && err.code === 11000) {
        statusCode = http_status_1.default.BAD_REQUEST;
        message = "Duplicate Entry";
        if (err.keyValue) {
            message = `${Object.keys(err.keyValue)} is already exist`;
        }
    }
    else if (err.code && err.code === "P2002") {
        statusCode = http_status_1.default.BAD_REQUEST;
        message = "Duplicate Entry";
        if ((_a = err === null || err === void 0 ? void 0 : err.meta) === null || _a === void 0 ? void 0 : _a.target) {
            message = `This ${(_b = err === null || err === void 0 ? void 0 : err.meta) === null || _b === void 0 ? void 0 : _b.target[0]} already used!`;
        }
    }
    else {
        errorDetails = null;
    }
    res.status(statusCode).json({
        statusCode,
        success: false,
        message,
        errorDetails,
    });
    next();
};
exports.default = globalErrorHandler;
