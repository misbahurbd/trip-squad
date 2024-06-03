"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileValidation = void 0;
const zod_1 = require("zod");
const profileSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, { message: "Name is required" }),
    mobile: zod_1.z.string().min(1, { message: "Mobile is required" }),
    profilePhoto: zod_1.z.string(),
    dateOfBirth: zod_1.z.string(),
    bio: zod_1.z.string(),
});
exports.profileValidation = {
    profileSchema,
};
