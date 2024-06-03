import {
  UploadApiOptions,
  UploadApiResponse,
  v2 as cloudinary,
} from "cloudinary"
import fs from "fs"
import config from "../config"

cloudinary.config({
  cloud_name: config.cloudinary.name,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
})

const uploadOnCloudinary = async (
  imgSrc: string
): Promise<UploadApiResponse | null> => {
  try {
    if (!imgSrc) return null

    const options: UploadApiOptions = {
      folder: "trip-squad",
    }

    const response = await cloudinary.uploader.upload(imgSrc, options)

    return response
  } catch (error) {
    fs.unlinkSync(imgSrc)
    return null
  }
}

export default uploadOnCloudinary
