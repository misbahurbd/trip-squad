import { catchAsync } from "../../../utils/catch-async"
import { sendResponse } from "../../../utils/send-response"
import { subscriberService } from "./subscriber.service"

export const addSubscroiber = catchAsync(async (req, res) => {
  const result = await subscriberService.addSubscriber(req.body)

  sendResponse(res, {
    message: "Email successfully added!",
    data: result,
  })
})

export const subscriberController = {
  addSubscroiber,
}
