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
exports.userController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catch_async_1 = require("../../../utils/catch-async");
const pick_query_1 = require("../../../utils/pick-query");
const send_response_1 = require("../../../utils/send-response");
const app_error_1 = require("../../errors/app-error");
const user_constant_1 = require("./user.constant");
const user_service_1 = require("./user.service");
const createUser = (0, catch_async_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    const data = JSON.parse(req.body.data);
    if (!file) {
        throw new app_error_1.AppError(http_status_1.default.BAD_REQUEST, "Please upload an image");
    }
    const result = yield user_service_1.userService.createUser(file, data);
    (0, send_response_1.sendResponse)(res, {
        statusCode: http_status_1.default.CREATED,
        message: "User created successfully",
        data: result,
    });
}));
const currentUser = (0, catch_async_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const currentUser = req.user;
    const result = yield user_service_1.userService.currentUser(currentUser);
    (0, send_response_1.sendResponse)(res, {
        statusCode: 200,
        message: "Current user fetched successfully",
        data: result,
    });
}));
const getAllUsers = (0, catch_async_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const query = (0, pick_query_1.pickQueryTerms)(req.query, user_constant_1.userQueryFields);
    const options = (0, pick_query_1.pickQueryTerms)(req.query, [
        "limit",
        "page",
        "sortBy",
        "sortOrder",
    ]);
    const result = yield user_service_1.userService.getAllUsers(user, query, options);
    (0, send_response_1.sendResponse)(res, {
        message: "Users data retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
}));
const updateRole = (0, catch_async_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield user_service_1.userService.updateRole(req.params.userId, req.body);
    (0, send_response_1.sendResponse)(res, {
        message: "User role updated successfully",
        data: null,
    });
}));
const updateStatus = (0, catch_async_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const result = yield user_service_1.userService.updateStatus(req.params.userId, req.body);
    (0, send_response_1.sendResponse)(res, {
        message: "User status updated successfully",
        data: result,
    });
}));
exports.userController = {
    createUser,
    currentUser,
    getAllUsers,
    updateRole,
    updateStatus,
};
