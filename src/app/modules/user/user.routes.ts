import express from "express"
import { checkAuth } from "../../middlewares/check-auth"
import { userController } from "./user.controller"

const router = express.Router()

router.get("/", checkAuth("Admin"), userController.getAllUsers)
router.get("/current-user", checkAuth(), userController.currentUser)
router.put(
  "/update-status/:userId",
  checkAuth("Admin"),
  userController.updateStatus
)
router.put(
  "/update-role/:userId",
  checkAuth("Admin"),
  userController.updateRole
)

export const userRoutes = router
