import httpStatus from "http-status"
import { catchAsync } from "../../../utils/catch-async"
import { sendResponse } from "../../../utils/send-response"
import { AppError } from "../../errors/app-error"
import { profileService } from "./profile.service"

const updateProfile = catchAsync(async (req, res) => {
  const result = await profileService.updateProfile(req.user, req.body)

  sendResponse(res, {
    message: "Profile data updated successfully",
    data: result,
  })
})

const updateProfilePhoto = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new AppError(httpStatus.BAD_REQUEST, "Please upload an image")
  }

  const result = await profileService.updateProfilePhoto(req.user, req.file)

  sendResponse(res, {
    message: "Profile photo updated successfully",
    data: result,
  })
})

export const profileController = {
  updateProfile,
  updateProfilePhoto,
}
