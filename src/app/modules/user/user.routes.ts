import express from "express"
import { checkAuth } from "../../middlewares/check-auth"
import { userController } from "./user.controller"

const router = express.Router()

router.get("/current-user", checkAuth(), userController.currentUser)

export const userRoutes = router
