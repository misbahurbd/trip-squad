"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
const sendResponse = (res, jsonObj) => {
    res.status(jsonObj.statusCode || 200).json(Object.assign({ statusCode: jsonObj.statusCode || 200, success: jsonObj.success || true }, jsonObj));
};
exports.sendResponse = sendResponse;
