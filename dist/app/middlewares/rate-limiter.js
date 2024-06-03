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
exports.verifyTokenLimit = exports.reqLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const catch_async_1 = require("../../utils/catch-async");
const send_response_1 = require("../../utils/send-response");
const http_status_1 = __importDefault(require("http-status"));
const reqLimiter = (limit) => {
    return (0, express_rate_limit_1.default)({
        windowMs: 15 * 60 * 1000, // 15 minutes
        limit: limit, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
        handler: (0, catch_async_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
            (0, send_response_1.sendResponse)(res, {
                statusCode: http_status_1.default.TOO_MANY_REQUESTS,
                success: false,
                message: "Too many requests from this IP, please try again after 15 minutes",
                data: null,
            });
        })),
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    });
};
exports.reqLimiter = reqLimiter;
const verifyTokenLimit = () => {
    return (0, express_rate_limit_1.default)({
        windowMs: 3 * 60 * 1000, // 3 minutes
        limit: 1, // Limit each IP to 1 requests per `window` (here, per 15 minutes)
        handler: (0, catch_async_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
            (0, send_response_1.sendResponse)(res, {
                statusCode: http_status_1.default.TOO_MANY_REQUESTS,
                success: false,
                message: "Please try again after 3 minutes",
                data: null,
            });
        })),
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    });
};
exports.verifyTokenLimit = verifyTokenLimit;
