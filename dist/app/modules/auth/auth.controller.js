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
exports.authController = void 0;
const config_1 = __importDefault(require("../../../config"));
const catch_async_1 = require("../../../utils/catch-async");
const send_response_1 = require("../../../utils/send-response");
const auth_service_1 = require("./auth.service");
const userRegister = (0, catch_async_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.authService.userRegister(req.body);
    (0, send_response_1.sendResponse)(res, {
        statusCode: 201,
        message: "User registered successfully",
        data: result,
    });
}));
const userLogin = (0, catch_async_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.authService.userLogin(req.body);
    res.cookie("refreshToken", result.refreshToken, {
        secure: config_1.default.env === "production",
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 * 7,
        sameSite: "lax",
    });
    (0, send_response_1.sendResponse)(res, {
        statusCode: 200,
        message: "User logged in successfully",
        data: {
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
        },
    });
}));
const verifyAccount = (0, catch_async_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const token = req.params.token;
    yield auth_service_1.authService.verifyAccount(token, user);
    (0, send_response_1.sendResponse)(res, {
        message: "Account verified successfully",
        data: null,
    });
}));
const resendVerificationLink = (0, catch_async_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    yield auth_service_1.authService.resendVerificationLink(user);
    (0, send_response_1.sendResponse)(res, {
        message: "Verification link sent successfully",
        data: null,
    });
}));
const changePassword = (0, catch_async_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const currentUser = req.user;
    const result = yield auth_service_1.authService.changePassword(currentUser, req.body);
    (0, send_response_1.sendResponse)(res, {
        statusCode: 200,
        message: "Password changed successfully",
        data: result,
    });
}));
const forgetPassword = (0, catch_async_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield auth_service_1.authService.forgetPassword(req.body);
    (0, send_response_1.sendResponse)(res, {
        statusCode: 200,
        message: "Password reset link sent successfully",
        data: null,
    });
}));
const resetPassword = (0, catch_async_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    yield auth_service_1.authService.resetPassword(token, req.body);
    (0, send_response_1.sendResponse)(res, {
        message: "Password reset successfully",
        data: null,
    });
}));
exports.authController = {
    userRegister,
    userLogin,
    verifyAccount,
    changePassword,
    forgetPassword,
    resetPassword,
    resendVerificationLink,
};
