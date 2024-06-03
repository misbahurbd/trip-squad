import config from "../../../config"
import { catchAsync } from "../../../utils/catch-async"
import { sendResponse } from "../../../utils/send-response"
import { authService } from "./auth.service"

const userRegister = catchAsync(async (req, res) => {
  const result = await authService.userRegister(req.body)

  sendResponse(res, {
    statusCode: 201,
    message: "User registered successfully",
    data: result,
  })
})

const userLogin = catchAsync(async (req, res) => {
  const result = await authService.userLogin(req.body)

  res.cookie("refreshToken", result.refreshToken, {
    secure: config.env === "production",
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 * 7,
    sameSite: "lax",
  })

  sendResponse(res, {
    statusCode: 200,
    message: "User logged in successfully",
    data: {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    },
  })
})

const verifyAccount = catchAsync(async (req, res) => {
  const user = req.user
  const token = req.params.token
  await authService.verifyAccount(token, user)

  sendResponse(res, {
    message: "Account verified successfully",
    data: null,
  })
})

const resendVerificationLink = catchAsync(async (req, res) => {
  const user = req.user
  await authService.resendVerificationLink(user)

  sendResponse(res, {
    message: "Verification link sent successfully",
    data: null,
  })
})

const changePassword = catchAsync(async (req, res) => {
  const currentUser = req.user
  const result = await authService.changePassword(currentUser, req.body)

  sendResponse(res, {
    statusCode: 200,
    message: "Password changed successfully",
    data: result,
  })
})

const forgetPassword = catchAsync(async (req, res) => {
  await authService.forgetPassword(req.body)

  sendResponse(res, {
    statusCode: 200,
    message: "Password reset link sent successfully",
    data: null,
  })
})

const resetPassword = catchAsync(async (req, res) => {
  const { token } = req.params

  await authService.resetPassword(token, req.body)

  sendResponse(res, {
    message: "Password reset successfully",
    data: null,
  })
})

export const authController = {
  userRegister,
  userLogin,
  verifyAccount,
  changePassword,
  forgetPassword,
  resetPassword,
  resendVerificationLink,
}
