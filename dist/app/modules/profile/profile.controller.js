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
exports.profileController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catch_async_1 = require("../../../utils/catch-async");
const send_response_1 = require("../../../utils/send-response");
const app_error_1 = require("../../errors/app-error");
const profile_service_1 = require("./profile.service");
const updateProfile = (0, catch_async_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield profile_service_1.profileService.updateProfile(req.user, req.body);
    (0, send_response_1.sendResponse)(res, {
        message: "Profile data updated successfully",
        data: result,
    });
}));
const updateProfilePhoto = (0, catch_async_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        throw new app_error_1.AppError(http_status_1.default.BAD_REQUEST, "Please upload an image");
    }
    const result = yield profile_service_1.profileService.updateProfilePhoto(req.user, req.file);
    (0, send_response_1.sendResponse)(res, {
        message: "Profile photo updated successfully",
        data: result,
    });
}));
exports.profileController = {
    updateProfile,
    updateProfilePhoto,
};
