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
exports.profileService = void 0;
const prisma_client_1 = __importDefault(require("../../../utils/prisma-client"));
const cloudinary_1 = __importDefault(require("../../../utils/cloudinary"));
const app_error_1 = require("../../errors/app-error");
const http_status_1 = __importDefault(require("http-status"));
const updateProfile = (user, profileData) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email } = profileData, profileUpdateData = __rest(profileData, ["username", "email"]);
    const profile = yield prisma_client_1.default.profile.update({
        where: {
            email: user.email,
        },
        data: Object.assign(Object.assign({}, profileUpdateData), { user: {
                update: {
                    username,
                    email,
                },
            } }),
    });
    return profile;
});
const updateProfilePhoto = (user, photo) => __awaiter(void 0, void 0, void 0, function* () {
    const b64 = Buffer.from(photo.buffer).toString("base64");
    const dataURI = "data:" + photo.mimetype + ";base64," + b64;
    const response = yield (0, cloudinary_1.default)(dataURI);
    if (!response || !response.secure_url) {
        throw new app_error_1.AppError(http_status_1.default.BAD_REQUEST, "Unable to upload photo");
    }
    const profile = yield prisma_client_1.default.profile.update({
        where: {
            email: user.email,
        },
        data: {
            profilePhoto: response.secure_url,
        },
    });
    return profile;
});
exports.profileService = {
    updateProfilePhoto,
    updateProfile,
};
