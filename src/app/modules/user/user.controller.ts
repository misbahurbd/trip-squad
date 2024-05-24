import { catchAsync } from "../../../utils/catch-async"
import { sendResponse } from "../../../utils/send-response"
import { userService } from "./user.service"

const currentUser = catchAsync(async (req, res) => {
  const currentUser = req.user
  const result = await userService.currentUser(currentUser)

  sendResponse(res, {
    statusCode: 200,
    message: "Current user fetched successfully",
    data: result,
  })
})

export const userController = {
  currentUser,
}
