import httpStatus from "http-status"
import { catchAsync } from "../../../utils/catch-async"
import { sendResponse } from "../../../utils/send-response"
import { tripService } from "./trip.service"
import { pickQueryTerms } from "../../../utils/pick-query"
import { tripQueryFields } from "./trip.constant"
import { AppError } from "../../errors/app-error"

const createTrip = catchAsync(async (req, res) => {
  const files = req.files as Express.Multer.File[]
  const data = JSON.parse(req.body.data)

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
}
