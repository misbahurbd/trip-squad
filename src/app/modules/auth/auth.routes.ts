import express from "express"
import { authController } from "./auth.controller"
import { validateRequest } from "../../middlewares/validate-request"
import { authValidation } from "./auth.validation"

const router = express.Router()

router.post(
  "/register",
  validateRequest(authValidation.registerSchema),
  authController.userRegister
)

export const authRoutes = router
