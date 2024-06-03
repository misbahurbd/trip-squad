import express from "express"
import { profileController } from "./profile.controller"
import { checkAuth } from "../../middlewares/check-auth"
import { validateRequest } from "../../middlewares/validate-request"
import { profileValidation } from "./profile.validation"
import { upload } from "../../middlewares/multer"

const router = express.Router()

router.put(
  "/",
  checkAuth(),
  validateRequest(profileValidation.profileSchema.partial()),
  profileController.updateProfile
)

router.put(
  "/profile-photo",
  checkAuth(),
  upload.single("profilePhoto"),
  profileController.updateProfilePhoto
)

export const profileRoutes = router
