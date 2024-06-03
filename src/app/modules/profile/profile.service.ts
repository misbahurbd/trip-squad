import { JwtPayload } from "jsonwebtoken"
import prisma from "../../../utils/prisma-client"
import { IUpdateProfile } from "./profile.interface"
import uploadOnCloudinary from "../../../utils/cloudinary"
import { AppError } from "../../errors/app-error"
import httpStatus from "http-status"

const updateProfile = async (user: JwtPayload, profileData: IUpdateProfile) => {
  const { username, email, ...profileUpdateData } = profileData

  const profile = await prisma.profile.update({
    where: {
      email: user.email,
    },
    data: {
      ...profileUpdateData,
      user: {
        update: {
          username,
          email,
        },
      },
    },
  })

  return profile
}

const updateProfilePhoto = async (
  user: JwtPayload,
  photo: Express.Multer.File
) => {
  const b64 = Buffer.from(photo.buffer).toString("base64")
  const dataURI = "data:" + photo.mimetype + ";base64," + b64

  const response = await uploadOnCloudinary(dataURI)

  if (!response || !response.secure_url) {
    throw new AppError(httpStatus.BAD_REQUEST, "Unable to upload photo")
  }

  const profile = await prisma.profile.update({
    where: {
      email: user.email,
    },
    data: {
      profilePhoto: response.secure_url,
    },
  })

  return profile
}

export const profileService = {
  updateProfilePhoto,
  updateProfile,
}
