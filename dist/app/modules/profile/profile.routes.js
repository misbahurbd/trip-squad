"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileRoutes = void 0;
const express_1 = __importDefault(require("express"));
const profile_controller_1 = require("./profile.controller");
const check_auth_1 = require("../../middlewares/check-auth");
const validate_request_1 = require("../../middlewares/validate-request");
const profile_validation_1 = require("./profile.validation");
const multer_1 = require("../../middlewares/multer");
const router = express_1.default.Router();
router.put("/", (0, check_auth_1.checkAuth)(), (0, validate_request_1.validateRequest)(profile_validation_1.profileValidation.profileSchema.partial()), profile_controller_1.profileController.updateProfile);
router.put("/profile-photo", (0, check_auth_1.checkAuth)(), multer_1.upload.single("profilePhoto"), profile_controller_1.profileController.updateProfilePhoto);
exports.profileRoutes = router;
