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
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("@prisma/client");
const config_1 = __importDefault(require("../src/config"));
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const isAdminExist = yield prisma.user.findFirst({
            where: {
                role: "Admin",
            },
        });
        if (isAdminExist) {
            console.log("Admin already exist");
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(config_1.default.seed.password, Number(config_1.default.hashRound));
        const admin = yield prisma.user.create({
            data: {
                email: config_1.default.seed.email,
                username: config_1.default.seed.username,
                hashedPassword,
                role: "Admin",
                profile: {
                    create: {
                        name: config_1.default.seed.name,
                        email: config_1.default.seed.email,
                    },
                },
            },
        });
        console.log("Admin Created Successfully", admin);
        return;
    });
}
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}))
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(e);
    yield prisma.$disconnect();
    process.exit(1);
}));
