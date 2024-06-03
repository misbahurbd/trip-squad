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
exports.checkAuth = void 0;
const catch_async_1 = require("../../utils/catch-async");
const jwt_helper_1 = require("../../helpers/jwt-helper");
const config_1 = __importDefault(require("../../config"));
const app_error_1 = require("../errors/app-error");
const http_status_1 = __importDefault(require("http-status"));
const checkAuth = (...roles) => {
    return (0, catch_async_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const token = req.headers.authorization;
        if (!token) {
            throw new app_error_1.AppError(http_status_1.default.UNAUTHORIZED, "You are not authorized!");
        }
        const payload = yield (0, jwt_helper_1.verifyToken)(token, config_1.default.jwt.accessSecret);
        if (!payload) {
            throw new app_error_1.AppError(http_status_1.default.UNAUTHORIZED, "You are not authorized!");
        }
        if (roles.length && !roles.includes(payload.role))
            throw new app_error_1.AppError(http_status_1.default.UNAUTHORIZED, "You are not authorized to access!");
        req.user = payload;
        next();
    }));
};
exports.checkAuth = checkAuth;
