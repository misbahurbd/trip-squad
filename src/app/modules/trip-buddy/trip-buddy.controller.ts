import { catchAsync } from "../../../utils/catch-async"
import { pickQueryTerms } from "../../../utils/pick-query"
import { sendResponse } from "../../../utils/send-response"
import { tripBuddyService } from "./trip-buddy.service"

const tripBuddyRequest = catchAsync(async (req, res) => {
  const user = req.user
  const tripId = req.params.tripId

  const result = await tripBuddyService.tripBuddyRequest(
    user.id,
    tripId,
    req.body
  )

  sendResponse(res, {
    message: "Trip buddy request sent successfully",
    data: result,
  })
})

const tripBuddyRequestByUserId = catchAsync(async (req, res) => {
  const user = req.user
  const options = pickQueryTerms(req.query, [
    "limit",
    "page",
    "sortBy",
    "sortOrder",
  ])
  const result = await tripBuddyService.tripBuddyRequestByUserId(
    user.id,
    options
  )

  sendResponse(res, {
    message: "Trip buddy requests retrieved successfully",
    data: result.data,
    meta: result.meta,
  })
})

const tripBuddyResponse = catchAsync(async (req, res) => {
  const buddyId = req.params.buddyId
  const result = await tripBuddyService.tripBuddyResponse(buddyId, req.body)

  sendResponse(res, {
    message: "Trip buddy response sent successfully",
    data: result,
  })
})

export const tripBuddyController = {
  tripBuddyRequest,
  tripBuddyRequestByUserId,
  tripBuddyResponse,
}
