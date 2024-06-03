"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), ".env") });
exports.default = {
    port: process.env.PORT || 4600,
    env: process.env.NODE_ENV || "development",
    hashRound: process.env.HASH_ROUND,
    clientUrl: process.env.CLIENT_URL,
    jwt: {
        accessSecret: process.env.JWT_ACCESS_SECRET,
        refreshSecret: process.env.JWT_ACCESS_SECRET,
    },
    mailer: {
        email: process.env.MAILER_EMAIL,
        pass: process.env.MAILER_PASS,
    },
    cloudinary: {
        name: process.env.CLOUD_NAME,
        apiKey: process.env.CLOUD_API_KEY,
        apiSecret: process.env.CLOUD_API_SECRET,
    },
    seed: {
        name: process.env.SEED_ADMIN_NAME,
        username: process.env.SEED_ADMIN_USERNAME,
        email: process.env.SEED_ADMIN_EMAIL,
        password: process.env.SEED_ADMIN_PASSWORD,
    },
};
