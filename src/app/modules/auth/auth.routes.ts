import express from "express"
import { authController } from "./auth.controller"
import { validateRequest } from "../../middlewares/validate-request"
import { authValidation } from "./auth.validation"
import { reqLimiter, verifyTokenLimit } from "../../middlewares/rate-limiter"
import { checkAuth } from "../../middlewares/check-auth"

const router = express.Router()

router.post(
  "/register",
  validateRequest(authValidation.registerSchema),
  authController.userRegister
)
router.post("/login", reqLimiter(10), authController.userLogin)

router.post("/verify/:token", reqLimiter(10), authController.verifyAccount)
router.post("/refresh-token", authController.refreshToken)

router.post(
  "/resend-verification-link",
  checkAuth(),
  verifyTokenLimit(),
  authController.resendVerificationLink
)

router.put(
  "/change-password",
  checkAuth(),
  reqLimiter(5),
  validateRequest(authValidation.changePasswordSchema),
  authController.changePassword
)

router.post(
  "/forget-password",
  reqLimiter(5),
  validateRequest(authValidation.forgetPasswordSchema),
  authController.forgetPassword
)

router.post(
  "/reset-password/:token",
  reqLimiter(5),
  authController.resetPassword
)

export const authRoutes = router
