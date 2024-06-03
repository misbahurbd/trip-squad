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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_client_1 = __importDefault(require("../../../utils/prisma-client"));
const query_helpers_1 = require("../../../helpers/query-helpers");
const user_constant_1 = require("./user.constant");
const cloudinary_1 = __importDefault(require("../../../utils/cloudinary"));
const app_error_1 = require("../../errors/app-error");
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../../config"));
const createUser = (file, userData) => __awaiter(void 0, void 0, void 0, function* () {
    const b64 = Buffer.from(file.buffer).toString("base64");
    const dataURI = "data:" + file.mimetype + ";base64," + b64;
    const response = yield (0, cloudinary_1.default)(dataURI);
    if (!response || !response.secure_url) {
        throw new app_error_1.AppError(http_status_1.default.BAD_REQUEST, "Unable to upload photo");
    }
    if (userData.password !== userData.confirmPassword) {
        throw new app_error_1.AppError(http_status_1.default.BAD_REQUEST, "Password does not match");
    }
    const hashedPassword = yield bcrypt_1.default.hash(userData.password, Number(config_1.default.hashRound));
    const user = yield prisma_client_1.default.user.create({
        data: {
            username: userData.username,
            email: userData.email,
            hashedPassword,
            role: userData.role,
            profile: {
                create: {
                    name: userData.name,
                    email: userData.email,
                    profilePhoto: response.secure_url,
                },
            },
        },
        include: {
            profile: true,
        },
    });
    return user.profile;
});
const currentUser = (currentUser) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_client_1.default.user.findFirst({
        where: {
            id: currentUser.id,
            isDeleted: false,
        },
        include: {
            profile: true,
        },
    });
    const resposne = Object.assign(Object.assign({}, user === null || user === void 0 ? void 0 : user.profile), { username: user === null || user === void 0 ? void 0 : user.username, emailVerified: user === null || user === void 0 ? void 0 : user.emailVerified, status: user === null || user === void 0 ? void 0 : user.status, role: user === null || user === void 0 ? void 0 : user.role });
    return resposne;
});
const getAllUsers = (currentUser, query, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = (0, query_helpers_1.parseOptions)(options);
    const filterCondition = (0, query_helpers_1.parseUserFilterOptions)(query, user_constant_1.userSearchFields);
    const users = yield prisma_client_1.default.user.findMany({
        where: {
            AND: filterCondition,
            isDeleted: false,
            NOT: {
                id: currentUser.id,
            },
        },
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
        include: {
            profile: true,
        },
    });
    console.log({ users });
    const total = yield prisma_client_1.default.user.count({
        where: {
            AND: filterCondition,
            isDeleted: false,
        },
    });
    return {
        data: users.map(user => {
            const { id, hashedPassword, profile } = user, remainUserData = __rest(user, ["id", "hashedPassword", "profile"]);
            return Object.assign(Object.assign(Object.assign({}, profile), remainUserData), { id });
        }),
        meta: {
            page,
            limit,
            total,
        },
    };
});
const updateRole = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_client_1.default.user.update({
        where: {
            id: userId,
            isDeleted: false,
        },
        data: {
            role: payload.role,
        },
    });
    return user;
});
const updateStatus = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_client_1.default.user.update({
        where: {
            id: userId,
            isDeleted: false,
        },
        data: {
            status: payload.status,
        },
    });
    return user;
});
exports.userService = {
    createUser,
    currentUser,
    getAllUsers,
    updateRole,
    updateStatus,
};
