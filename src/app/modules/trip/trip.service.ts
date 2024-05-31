import { Jwt, JwtPayload } from "jsonwebtoken"
import { ITrip } from "./trip.interface"
import prisma from "../../../utils/prisma-client"
import {
  IOptions,
  parseFilterOptions,
  parseOptions,
} from "../../../helpers/query-helpers"
import { Prisma, User, UserRole } from "@prisma/client"
import { tripSearchFields } from "./trip.constant"
import uploadOnCloudinary from "../../../utils/cloudinary"
import { AppError } from "../../errors/app-error"
import httpStatus from "http-status"

const createTrip = async (
  user: JwtPayload,
  files: Express.Multer.File[],
  tripData: ITrip
) => {
  const uploadImages = files.map(async file => {
    const result = await uploadOnCloudinary(file.path)
    return result
  })

  const images = await Promise.all(uploadImages)
  if (images.length == 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Unable to upload images")
  }
  const imgArray = images.map(img => {
    if (!img || !img.secure_url) return null
    return img.secure_url
  })

  const trip = await prisma.trip.create({
    data: {
      destination: tripData.destination,
      startDate: tripData.startDate,
      endDate: tripData.endDate,
      tripType: tripData.tripType,
      description: tripData.description,
      budget: Number(tripData.budget),
      photos: imgArray as string[],
      location: tripData.location,
      itinerary: tripData.itinerary,
      creatorId: user.id,
    },
  })

  return trip
}

const updateTrip = async (
  user: JwtPayload,
  tripId: string,
  tripData: ITrip
) => {
  switch (user.role as UserRole) {
    case "Admin":
      const tripAdmin = await prisma.trip.update({
        where: {
          id: tripId,
        },
        data: {
          destination: tripData.destination,
          description: tripData.description,
          startDate: tripData.startDate,
          endDate: tripData.endDate,
          tripType: tripData.tripType,
          budget: Number(tripData.budget),
          location: tripData.location,
          itinerary: tripData.itinerary,
        },
      })

      return tripAdmin
    case "User":
      const tripUser = await prisma.trip.update({
        where: {
          id: tripId,
          creatorId: user.id,
        },
        data: {
          destination: tripData.destination,
          startDate: tripData.startDate,
          endDate: tripData.endDate,
          tripType: tripData.tripType,
          description: tripData.description,
          budget: Number(tripData.budget),
          location: tripData.location,
          itinerary: tripData.itinerary,
          creatorId: user.id,
        },
      })

      if (!tripUser) {
        throw new AppError(httpStatus.NOT_FOUND, "Trip not found")
      }
      return tripUser

    default:
      break
  }
}

const getTrips = async (query: any, options: IOptions) => {
  const { page, limit, skip, sortBy, sortOrder } = parseOptions(options)
  const filterCondition: Prisma.TripWhereInput[] = parseFilterOptions(
    query,
    tripSearchFields
  )

  const trips = await prisma.trip.findMany({
    where: {
      AND: filterCondition,
      isDeleted: false,
    },
    include: {
      createdBy: {
        select: {
          username: true,
          profile: true,
        },
      },
    },
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  })

  const total = await prisma.trip.count({
    where: {
      AND: filterCondition,
      isDeleted: false,
    },
  })

  return {
    data: trips,
    meta: {
      page,
      limit,
      total,
    },
  }
}

const getMyTrips = async (user: JwtPayload, query: any, options: IOptions) => {
  const { page, limit, skip, sortBy, sortOrder } = parseOptions(options)
  const filterCondition: Prisma.TripWhereInput[] = parseFilterOptions(
    query,
    tripSearchFields
  )

  const trips = await prisma.trip.findMany({
    where: {
      AND: filterCondition,
      isDeleted: false,
      creatorId: user.id,
    },
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  })

  const total = await prisma.trip.count({
    where: {
      AND: filterCondition,
      isDeleted: false,
      creatorId: user.id,
    },
  })

  return {
    data: trips,
    meta: {
      page,
      limit,
      total,
    },
  }
}

const getTripById = async (id: string) => {
  const trip = await prisma.trip.findUnique({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      createdBy: {
        select: {
          username: true,
          email: true,
          profile: true,
          _count: {
            select: {
              trip: true,
            },
          },
        },
      },
      tripBuddy: {
        include: {
          user: {
            select: {
              profile: true,
            },
          },
        },
      },
    },
  })

  return trip
}

const topTripTypes = async () => {
  const tripTypes = await prisma.trip.groupBy({
    by: ["tripType"],
    _count: {
      tripType: true,
    },
    where: {
      isDeleted: false,
    },
  })

  // Filter out trip types with a count of 0
  const filteredTripTypeCounts = tripTypes.filter(
    tripType => tripType._count.tripType > 0
  )

  const formattedResults = filteredTripTypeCounts.map(tripType => ({
    label: tripType.tripType,
    count: tripType._count.tripType,
  }))

  const sortedResults = formattedResults.sort((a, b) => b.count - a.count)

  return sortedResults
}

const tripTypes = async () => {
  const tripTypes = await prisma.trip.groupBy({
    by: ["tripType"],
    _count: {
      tripType: true,
    },
    where: {
      isDeleted: false,
    },
  })

  // Filter out trip types with a count of 0
  const filteredTripTypeCounts = tripTypes.filter(
    tripType => tripType._count.tripType > 0
  )

  const formattedResults = filteredTripTypeCounts.map(tripType => ({
    label: tripType.tripType,
    count: tripType._count.tripType,
  }))

  const sortedResults = formattedResults.sort()

  return sortedResults
}

const tripsPhotos = async () => {
  const uniquePhotos = await prisma.trip.findMany({
    select: {
      photos: true,
    },
    distinct: ["photos"],
  })

  const tripPhotos = [...new Set(uniquePhotos.flatMap(item => item.photos))]
  return tripPhotos
}

const deleteTrip = async (user: JwtPayload, tripId: string) => {
  switch (user.role as UserRole) {
    case "Admin":
      const adminTrip = await prisma.trip.update({
        where: {
          id: tripId,
        },
        data: {
          isDeleted: true,
        },
      })

      return adminTrip
    case "User":
      const userTrip = await prisma.trip.update({
        where: {
          id: tripId,
          creatorId: user.id,
        },
        data: {
          isDeleted: true,
        },
      })

      if (!userTrip) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "You don't have permission to delete this trip."
        )
      }

      return userTrip

    default:
      return null
  }
}

export const tripService = {
  createTrip,
  updateTrip,
  getTrips,
  getMyTrips,
  getTripById,
  tripTypes,
  topTripTypes,
  tripsPhotos,
  deleteTrip,
}
