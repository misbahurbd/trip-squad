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

export const authController = {
  userRegister,
}
