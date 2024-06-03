"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authValidation = void 0;
const zod_1 = require("zod");
const registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, { message: "Name is required!" }),
    username: zod_1.z
        .string()
        .min(1, { message: "Username is required!" })
        .min(4, { message: "Username must be at least 4 characters!" })
        .regex(/^[a-zA-Z0-9-_]+$/gm, {
        message: "Username can only include letters, digits, hyphens, and underscores, with no spaces.!",
    }),
    email: zod_1.z
        .string()
        .min(1, { message: "Email is required!" })
        .email({ message: "Invalid email address!" }),
    password: zod_1.z
        .string()
        .min(1, { message: "Password is required!" })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^\s]{8,}$/gm, {
        message: "Password must be at least 8 characters long, contain at least one lowercase letter, one uppercase letter, and one number.",
    }),
});
const forgetPasswordSchema = zod_1.z.object({
    identifer: zod_1.z.string().min(1, { message: "Email or Username is required" }),
});
const changePasswordSchema = zod_1.z.object({
    oldPassword: zod_1.z.string().min(1, { message: "Old password is required" }),
    newPassword: zod_1.z
        .string()
        .min(1, { message: "Password is required!" })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^\s]{8,}$/gm, {
        message: "Password must be at least 8 characters long, contain at least one lowercase letter, one uppercase letter, and one number.",
    }),
});
exports.authValidation = {
    registerSchema,
    forgetPasswordSchema,
    changePasswordSchema,
};
