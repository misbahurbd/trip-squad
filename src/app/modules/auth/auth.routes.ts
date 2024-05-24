import express from "express"
import { authController } from "./auth.controller"
import { validateRequest } from "../../middlewares/validate-request"
import { authValidation } from "./auth.validation"
import { reqLimiter } from "../../middlewares/rate-limiter"
import { checkAuth } from "../../middlewares/check-auth"

const router = express.Router()

router.post(
  "/register",
  validateRequest(authValidation.registerSchema),
  authController.userRegister
)
router.post("/login", reqLimiter(5), authController.userLogin)

router.post("/verify/:token", authController.verifyAccount)

router.post("/change-password", checkAuth(), authController.changePassword)

router.post(
  "/forget-password",
  reqLimiter(3),
  validateRequest(authValidation.forgetPasswordSchema),
  authController.forgetPassword
)

router.post("/reset-password/:token", authController.resetPassword)

export const authRoutes = router
