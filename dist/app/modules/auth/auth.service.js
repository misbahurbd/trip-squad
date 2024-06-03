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
exports.authService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("@prisma/client");
const prisma_client_1 = __importDefault(require("../../../utils/prisma-client"));
const app_error_1 = require("../../errors/app-error");
const config_1 = __importDefault(require("../../../config"));
const mailer_1 = __importDefault(require("../../../utils/mailer"));
const jwt_helper_1 = require("../../../helpers/jwt-helper");
const email_template_1 = require("../../../utils/email-template");
const userRegister = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield prisma_client_1.default.user.findFirst({
        where: {
            OR: [
                {
                    email: userData.email.toLowerCase(),
                },
                {
                    username: userData.username.toLowerCase(),
                },
            ],
        },
    });
    if (isUserExist) {
        throw new app_error_1.AppError(http_status_1.default.CONFLICT, "User already registered");
    }
    // hash password
    const hashedPassword = yield bcrypt_1.default.hash(userData.password, Number(config_1.default.hashRound));
    // create user
    const result = yield prisma_client_1.default.$transaction((tsx) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield tsx.user.create({
            data: {
                username: userData.username.toLowerCase(),
                email: userData.email.toLowerCase(),
                hashedPassword,
                profile: {
                    create: {
                        name: userData.name,
                        email: userData.email,
                    },
                },
            },
            select: {
                profile: true,
            },
        });
        if (!user.profile) {
            throw new app_error_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, "Something went wrong");
        }
        // create verification token
        const verificationToken = yield tsx.verificationToken.create({
            data: {
                email: user.profile.email.toLowerCase(),
                token: crypto.randomUUID().toString(),
                tokenType: client_1.TokenType.Verify,
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 6),
            },
        });
        // create verification link
        const verificationLink = `${config_1.default.clientUrl}/verify?token=${verificationToken.token}`;
        // send verification email
        (0, mailer_1.default)(user.profile.email, "Verify your account", (0, email_template_1.getVerifyTemplate)(user.profile.name, verificationLink, 6));
        return Object.assign({ verificationToken, verificationLink }, user.profile);
    }));
    return result;
});
const userLogin = (credentials) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_client_1.default.user.findFirst({
        where: {
            OR: [
                {
                    email: credentials.username.toLowerCase(),
                },
                {
                    username: credentials.username.toLowerCase(),
                },
            ],
            isDeleted: false,
        },
    });
    if (!user) {
        throw new app_error_1.AppError(http_status_1.default.NOT_FOUND, "User not found");
    }
    if (user.status === "Blocked") {
        throw new app_error_1.AppError(http_status_1.default.UNAUTHORIZED, "Your account is blocked");
    }
    const isPasswordValid = yield bcrypt_1.default.compare(credentials.password, user.hashedPassword);
    if (!isPasswordValid) {
        throw new app_error_1.AppError(http_status_1.default.UNAUTHORIZED, "Invalid credentials");
    }
    const jwtpayload = {
        id: user.id,
        email: user.email,
        role: user.role,
    };
    const accessToken = (0, jwt_helper_1.generateToken)(jwtpayload, config_1.default.jwt.accessSecret, "1d");
    const refreshToken = (0, jwt_helper_1.generateToken)(jwtpayload, config_1.default.jwt.refreshSecret, "7d");
    return {
        user,
        accessToken,
        refreshToken,
    };
});
const changePassword = (currentUser, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_client_1.default.user.findFirst({
        where: {
            id: currentUser.id,
            isDeleted: false,
        },
    });
    if (!user) {
        throw new app_error_1.AppError(http_status_1.default.NOT_FOUND, "User not found");
    }
    if (user.status === "Blocked") {
        throw new app_error_1.AppError(http_status_1.default.UNAUTHORIZED, "Your account is blocked");
    }
    const isPasswordValid = yield bcrypt_1.default.compare(payload.oldPassword, user.hashedPassword);
    if (!isPasswordValid) {
        throw new app_error_1.AppError(http_status_1.default.UNAUTHORIZED, "Wrong password");
    }
    const hashedPassword = yield bcrypt_1.default.hash(payload.newPassword, Number(config_1.default.hashRound));
    const result = yield prisma_client_1.default.user.update({
        where: {
            id: currentUser.id,
        },
        data: {
            hashedPassword,
        },
    });
    return result;
});
const verifyAccount = (token, currentUser) => __awaiter(void 0, void 0, void 0, function* () {
    const verificationToken = yield prisma_client_1.default.verificationToken.findFirst({
        where: {
            token,
            tokenType: client_1.TokenType.Verify,
            expiresAt: {
                gt: new Date(),
            },
        },
    });
    if (currentUser && currentUser.email) {
        if ((verificationToken === null || verificationToken === void 0 ? void 0 : verificationToken.email) !== currentUser.email) {
            throw new app_error_1.AppError(http_status_1.default.NOT_FOUND, "Varification token not valid");
        }
    }
    if (!verificationToken) {
        throw new app_error_1.AppError(http_status_1.default.NOT_FOUND, "Invalid verification token");
    }
    const result = yield prisma_client_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield tx.user.update({
            where: {
                email: verificationToken.email,
            },
            data: {
                emailVerified: new Date(),
            },
            select: {
                profile: true,
            },
        });
        if (!user) {
            throw new app_error_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, "Something went wrong");
        }
        yield tx.verificationToken.delete({
            where: {
                token: verificationToken.token,
                email: verificationToken.email,
            },
        });
        return user.profile;
    }));
    return result;
});
const resendVerificationLink = (currentUser) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_client_1.default.user.findFirst({
        where: {
            id: currentUser.id,
            isDeleted: false,
        },
        include: {
            profile: true,
        },
    });
    if (!user || !user.profile || !user.profile.email) {
        throw new app_error_1.AppError(http_status_1.default.NOT_FOUND, "User not found");
    }
    const isAlreadyVerified = yield prisma_client_1.default.user.findFirst({
        where: {
            id: user.id,
            emailVerified: {
                not: null,
            },
        },
    });
    if (isAlreadyVerified) {
        throw new app_error_1.AppError(http_status_1.default.CONFLICT, "Your account is already verified");
    }
    const result = yield prisma_client_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        yield tx.verificationToken.deleteMany({
            where: {
                email: user.email,
            },
        });
        const verificationToken = yield tx.verificationToken.create({
            data: {
                email: user.email.toLowerCase(),
                token: crypto.randomUUID().toString(),
                tokenType: client_1.TokenType.Verify,
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 6),
            },
        });
        // create verification link
        const verificationLink = `${config_1.default.clientUrl}/verify?token=${verificationToken.token}`;
        // send verification email
        (0, mailer_1.default)(user.email, "Verify your account", (0, email_template_1.getVerifyTemplate)(((_a = user === null || user === void 0 ? void 0 : user.profile) === null || _a === void 0 ? void 0 : _a.name) || "buddy", verificationLink, 6));
        return user.profile;
    }));
    return result;
});
const forgetPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_client_1.default.user.findFirst({
        where: {
            OR: [
                {
                    email: payload.identifer.toLowerCase(),
                },
                {
                    username: payload.identifer.toLowerCase(),
                },
            ],
            isDeleted: false,
        },
        include: {
            profile: true,
        },
    });
    if (!user) {
        throw new app_error_1.AppError(http_status_1.default.NOT_FOUND, "User not found");
    }
    const result = yield prisma_client_1.default.$transaction((tsx) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        const resetToken = yield tsx.verificationToken.create({
            data: {
                email: user.email.toLowerCase(),
                token: crypto.randomUUID().toString(),
                tokenType: client_1.TokenType.Reset,
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 2),
            },
        });
        const resetLink = `${config_1.default.clientUrl}/reset-password?token=${resetToken.token}`;
        yield (0, mailer_1.default)(user.email, "Reset your password", (0, email_template_1.getResetTemplate)(((_b = user.profile) === null || _b === void 0 ? void 0 : _b.name) || "buddy", resetLink, 1));
        return user.profile;
    }));
    return result;
});
const resetPassword = (token, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const verificationToken = yield prisma_client_1.default.verificationToken.findFirst({
        where: {
            token,
            tokenType: client_1.TokenType.Reset,
            expiresAt: {
                gt: new Date(),
            },
        },
    });
    if (!verificationToken) {
        throw new app_error_1.AppError(http_status_1.default.NOT_FOUND, "Invalid reset token");
    }
    const user = yield prisma_client_1.default.user.findFirst({
        where: {
            email: verificationToken.email,
            isDeleted: false,
        },
    });
    if ((user === null || user === void 0 ? void 0 : user.status) !== "Active") {
        throw new app_error_1.AppError(http_status_1.default.UNAUTHORIZED, "Your account is blocked");
    }
    const hashedPassword = yield bcrypt_1.default.hash(payload.password, Number(config_1.default.hashRound));
    const result = yield prisma_client_1.default.$transaction((tsx) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield tsx.user.update({
            where: {
                email: verificationToken.email,
            },
            data: {
                hashedPassword,
            },
        });
        yield tsx.verificationToken.delete({
            where: {
                token: verificationToken.token,
            },
        });
        return user;
    }));
    return result;
});
exports.authService = {
    userRegister,
    userLogin,
    changePassword,
    verifyAccount,
    forgetPassword,
    resetPassword,
    resendVerificationLink,
};
