"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth.controller");
const validate_request_1 = require("../../middlewares/validate-request");
const auth_validation_1 = require("./auth.validation");
const rate_limiter_1 = require("../../middlewares/rate-limiter");
const check_auth_1 = require("../../middlewares/check-auth");
const router = express_1.default.Router();
router.post("/register", (0, validate_request_1.validateRequest)(auth_validation_1.authValidation.registerSchema), auth_controller_1.authController.userRegister);
router.post("/login", (0, rate_limiter_1.reqLimiter)(10), auth_controller_1.authController.userLogin);
router.post("/resend-verification-link", (0, check_auth_1.checkAuth)(), (0, rate_limiter_1.verifyTokenLimit)(), auth_controller_1.authController.resendVerificationLink);
router.post("/verify/:token", (0, rate_limiter_1.reqLimiter)(10), auth_controller_1.authController.verifyAccount);
router.post("/forget-password", (0, rate_limiter_1.reqLimiter)(5), (0, validate_request_1.validateRequest)(auth_validation_1.authValidation.forgetPasswordSchema), auth_controller_1.authController.forgetPassword);
router.put("/change-password", (0, check_auth_1.checkAuth)(), (0, rate_limiter_1.reqLimiter)(5), (0, validate_request_1.validateRequest)(auth_validation_1.authValidation.changePasswordSchema), auth_controller_1.authController.changePassword);
router.post("/reset-password/:token", (0, rate_limiter_1.reqLimiter)(5), auth_controller_1.authController.resetPassword);
exports.authRoutes = router;
