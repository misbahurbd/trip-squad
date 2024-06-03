import { UserRole } from "@prisma/client"
import { catchAsync } from "../../utils/catch-async"
import { verifyToken } from "../../helpers/jwt-helper"
import config from "../../config"
import { AppError } from "../errors/app-error"
import httpStatus from "http-status"

export const checkAuth = (...roles: UserRole[]) => {
  return catchAsync(async (req, res, next) => {
    const token = req.headers.authorization
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!")
    }

    const payload = await verifyToken(token, config.jwt.accessSecret!)
    if (!payload) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized!")
    }

    if (roles.length && !roles.includes(payload.role))
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "You are not authorized to access!"
      )

    req.user = payload

    next()
  })
}
