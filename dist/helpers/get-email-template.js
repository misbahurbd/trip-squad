"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const fs = __importStar(require("fs/promises")); // Use promises for cleaner async/await handling
const http_status_1 = __importDefault(require("http-status"));
const app_error_1 = require("../app/errors/app-error");
const getEmailTemplate = (template, replacements) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const templateContent = yield fs.readFile(`${process.cwd()}/src/mail/${template}`, "utf-8");
        // Use a regular expression for more robust and flexible replacement
        const regex = new RegExp(/{{([^}]+)}}/g); // Match occurrences of {{ variable }}
        const replacedContent = templateContent.replace(regex, (match, key) => {
            const replacement = replacements.find(replacementObj => replacementObj.replaceKey === key);
            return replacement ? replacement.replaceValue : ""; // Replace with value or empty string if not found
        });
        return replacedContent;
    }
    catch (error) {
        throw new app_error_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, "Something went wrong");
        console.log(error);
    }
});
exports.default = getEmailTemplate;
