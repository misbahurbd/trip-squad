"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const check_auth_1 = require("../../middlewares/check-auth");
const user_controller_1 = require("./user.controller");
const multer_1 = require("../../middlewares/multer");
const router = express_1.default.Router();
router.post("/create-user", (0, check_auth_1.checkAuth)("Admin"), multer_1.upload.single("photo"), user_controller_1.userController.createUser);
router.get("/", (0, check_auth_1.checkAuth)("Admin"), user_controller_1.userController.getAllUsers);
router.get("/current-user", (0, check_auth_1.checkAuth)(), user_controller_1.userController.currentUser);
router.put("/update-status/:userId", (0, check_auth_1.checkAuth)("Admin"), user_controller_1.userController.updateStatus);
router.put("/update-role/:userId", (0, check_auth_1.checkAuth)("Admin"), user_controller_1.userController.updateRole);
exports.userRoutes = router;
