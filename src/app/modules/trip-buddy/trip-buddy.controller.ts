import { catchAsync } from "../../../utils/catch-async"
import { sendResponse } from "../../../utils/send-response"
import { tripBuddyService } from "./trip-buddy.service"

const tripBuddyRequest = catchAsync(async (req, res) => {
  const user = req.user
  const tripId = req.params.tripId

  const result = await tripBuddyService.tripBuddyRequest(user.id, tripId)

  sendResponse(res, {
    message: "Trip buddy request sent successfully",
    data: result,
  })
})

export const tripBuddyController = {
  tripBuddyRequest,
}
