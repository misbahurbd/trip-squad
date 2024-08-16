import httpStatus from "http-status"
import { catchAsync } from "../../../utils/catch-async"
import { sendResponse } from "../../../utils/send-response"
import { tripService } from "./trip.service"
import { pickQueryTerms } from "../../../utils/pick-query"
import { overviewQueryFields, tripQueryFields } from "./trip.constant"
import { AppError } from "../../errors/app-error"
import { tripValidation } from "./trip.validation"

const createTrip = catchAsync(async (req, res) => {
  const files = req.files as Express.Multer.File[]
  const data = JSON.parse(req.body.data)

  tripValidation.tripSchema.parseAsync(data)

  if (!files || files.length == 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Trip image is required")
  }

  const currentUser = req.user
  const result = await tripService.createTrip(currentUser, files, data)

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Trip created successfully",
    data: result,
  })
})

const updateTrip = catchAsync(async (req, res) => {
  const currentUser = req.user
  const result = await tripService.updateTrip(
    currentUser,
    req.params.tripId,
    req.body
  )

  sendResponse(res, {
    message: "Trip update successfully",
    data: result,
  })
})

const getTrips = catchAsync(async (req, res) => {
  const query = pickQueryTerms(req.query, tripQueryFields)
  const options = pickQueryTerms(req.query, [
    "limit",
    "page",
    "sortBy",
    "sortOrder",
  ])
  const result = await tripService.getTrips(query, options)

  sendResponse(res, {
    message: "Trips data retrieved successfully",
    meta: result.meta,
    data: result.data,
  })
})

const getMyTrips = catchAsync(async (req, res) => {
  const currentUser = req.user
  const query = pickQueryTerms(req.query, tripQueryFields)
  const options = pickQueryTerms(req.query, [
    "limit",
    "page",
    "sortBy",
    "sortOrder",
  ])
  const result = await tripService.getMyTrips(currentUser, query, options)

  sendResponse(res, {
    message: "Trips data retrieved successfully",
    meta: result.meta,
    data: result.data,
  })
})

const getTripById = catchAsync(async (req, res) => {
  const result = await tripService.getTripById(req.params.tripId)

  sendResponse(res, {
    message: "Trip data retrieved successfully",
    data: result,
  })
})

const tripTypes = catchAsync(async (req, res) => {
  const result = await tripService.tripTypes()

  sendResponse(res, {
    message: "Trip types retrieved successfully",
    data: result,
  })
})

const topTripTypes = catchAsync(async (req, res) => {
  const result = await tripService.topTripTypes()

  sendResponse(res, {
    message: "Top trip types retrieved successfully",
    data: result,
  })
})

const tripPhotos = catchAsync(async (req, res) => {
  const result = await tripService.tripsPhotos()

  sendResponse(res, {
    message: "Trip photos retrieved successfully",
    data: result,
  })
})

const deleteTrip = catchAsync(async (req, res) => {
  const user = req.user
  await tripService.deleteTrip(user, req.params.tripId)

  sendResponse(res, {
    message: "Trip deleted successfully",
    data: null,
  })
})

const postReview = catchAsync(async (req, res) => {
  const user = req.user
  const { tripId } = req.params
  const result = await tripService.postReview(user, tripId, req.body)

  sendResponse(res, {
    message: "Review posted successfully!",
    data: result,
  })
})

const getTopReviews = catchAsync(async (req, res) => {
  const result = await tripService.getTopReviews()

  sendResponse(res, {
    message: "Top reviews retrive successfully!",
    data: result,
  })
})

const getOverview = catchAsync(async (req, res) => {
  const currentUser = req.user
  const query = pickQueryTerms(req.query, overviewQueryFields)
  const result = await tripService.getOverview(currentUser, query)

  sendResponse(res, {
    message: "Overview data retrive successfully!",
    data: result,
  })
})

export const tripController = {
  createTrip,
  updateTrip,
  getTrips,
  getMyTrips,
  getTripById,
  tripTypes,
  topTripTypes,
  tripPhotos,
  deleteTrip,
  postReview,
  getTopReviews,
  getOverview,
}
