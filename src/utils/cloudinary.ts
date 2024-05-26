import { UploadApiResponse, v2 as cloudinary } from "cloudinary"
import fs from "fs"
import config from "../config"

cloudinary.config({
  cloud_name: config.cloudinary.name,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
})

const uploadOnCloudinary = async (
  localFilePath: string
): Promise<UploadApiResponse | null> => {
  try {
    if (!localFilePath) return null
    const response = await cloudinary.uploader.upload(localFilePath)

    return response
  } catch (error) {
    console.log({ error })
    fs.unlinkSync(localFilePath)
    return null
  }
}

export default uploadOnCloudinary
