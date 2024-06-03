import httpStatus from "http-status"
import { catchAsync } from "../../../utils/catch-async"
import { pickQueryTerms } from "../../../utils/pick-query"
import { sendResponse } from "../../../utils/send-response"
import { AppError } from "../../errors/app-error"
import { userQueryFields } from "./user.constant"
import { userService } from "./user.service"

const createUser = catchAsync(async (req, res) => {
  const file = req.file as Express.Multer.File
  const data = JSON.parse(req.body.data)
  if (!file) {
    throw new AppError(httpStatus.BAD_REQUEST, "Please upload an image")
  }

  const result = await userService.createUser(file, data)
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "User created successfully",
    data: result,
  })
})

const currentUser = catchAsync(async (req, res) => {
  const currentUser = req.user
  const result = await userService.currentUser(currentUser)

  sendResponse(res, {
    statusCode: 200,
    message: "Current user fetched successfully",
    data: result,
  })
})

const getAllUsers = catchAsync(async (req, res) => {
  const user = req.user
  const query = pickQueryTerms(req.query, userQueryFields)
  const options = pickQueryTerms(req.query, [
    "limit",
    "page",
    "sortBy",
    "sortOrder",
  ])
  const result = await userService.getAllUsers(user, query, options)

  sendResponse(res, {
    message: "Users data retrieved successfully",
    data: result.data,
    meta: result.meta,
  })
})

const updateRole = catchAsync(async (req, res) => {
  await userService.updateRole(req.params.userId, req.body)

  sendResponse(res, {
    message: "User role updated successfully",
    data: null,
  })
})

const updateStatus = catchAsync(async (req, res) => {
  const result = await userService.updateStatus(req.params.userId, req.body)

  sendResponse(res, {
    message: "User status updated successfully",
    data: result,
  })
})

export const userController = {
  createUser,
  currentUser,
  getAllUsers,
  updateRole,
  updateStatus,
}
