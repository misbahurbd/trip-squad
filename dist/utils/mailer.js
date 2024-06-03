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
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config"));
const app_error_1 = require("../app/errors/app-error");
const http_status_1 = __importDefault(require("http-status"));
const transporter = nodemailer_1.default.createTransport({
    service: "email",
    host: "smtp.gmail.com",
    port: config_1.default.env === "production" ? 465 : 587,
    secure: config_1.default.env === "production", // Use `true` for port 465, `false` for all other ports
    auth: {
        user: config_1.default.mailer.email,
        pass: config_1.default.mailer.pass,
    },
});
const sendMail = (email, subject, emailTemplate) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mail = yield transporter.sendMail({
            from: {
                name: "Trip Squad",
                address: config_1.default.mailer.email,
            },
            to: email,
            subject: subject,
            html: emailTemplate,
        });
        return mail;
    }
    catch (error) {
        throw new app_error_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, "Unable to send mail");
    }
});
exports.default = sendMail;
