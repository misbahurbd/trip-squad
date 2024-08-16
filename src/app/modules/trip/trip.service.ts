import { JwtPayload } from "jsonwebtoken"
import { IReview, ITrip } from "./trip.interface"
import prisma from "../../../utils/prisma-client"
import {
  IOptions,
  parseFilterOptions,
  parseOptions,
} from "../../../helpers/query-helpers"
import { Prisma, Review, Trip, TripBuddy, UserRole } from "@prisma/client"
import { tripSearchFields } from "./trip.constant"
import uploadOnCloudinary from "../../../utils/cloudinary"
import { AppError } from "../../errors/app-error"
import httpStatus from "http-status"
import { endOfWeek, format, getMonth, startOfWeek, subDays } from "date-fns"

const createTrip = async (
  user: JwtPayload,
  files: Express.Multer.File[],
  tripData: ITrip
) => {
  const uploadImages = files.map(async file => {
    const b64 = Buffer.from(file.buffer).toString("base64")
    const dataURI = "data:" + file.mimetype + ";base64," + b64
    const result = await uploadOnCloudinary(dataURI)
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
              trip: {
                where: {
                  isDeleted: false,
                },
              },
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
      reviews: {
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

const postReview = async (
  user: JwtPayload,
  tripId: string,
  reviewData: IReview
) => {
  const review = await prisma.review.create({
    data: {
      rating: Number(reviewData.rating),
      content: reviewData.content,
      userId: user.id,
      tripId: tripId,
    },
  })

  return review
}

const getTopReviews = async () => {
  const reviews = await prisma.review.findMany({
    include: {
      user: {
        select: {
          profile: true,
        },
      },
    },
    orderBy: {
      rating: "desc",
    },
  })

  const response = reviews.reduce<Review[]>((acc, crr) => {
    if (!acc.some((rev: Review) => rev.userId === crr.userId)) {
      acc.push(crr)
    }
    return acc
  }, [])

  return response
}

const getOverview = async (currentUser: JwtPayload, query: any) => {
  const user = await prisma.user.findUnique({
    where: {
      id: currentUser.id,
    },
  })

  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authrozied")
  }

  const range =
    query?.range === "weekly"
      ? 7
      : query?.range === "monthly"
      ? 30
      : query?.range === "yearly"
      ? 365
      : 365

  const startDate = subDays(new Date(), range)

  const tripCondition =
    user.role === "User"
      ? {
          creatorId: user.id,
          createdAt: {
            gte: startDate,
          },
        }
      : {
          createdAt: {
            gte: startDate,
          },
        }

  // trip data fatching
  const trips = await prisma.trip.findMany({
    where: tripCondition,
    select: {
      createdAt: true,
      id: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  })

  interface TripSummary {
    label: string
    trip: number
  }

  const tripSummary = trips.reduce<TripSummary[]>((acc, crr) => {
    const dateLabel = format(crr.createdAt, "d MMM, yyyy")
    const existingDate = acc.find(p => p.label === dateLabel)

    if (existingDate) {
      existingDate.trip += 1
    } else {
      acc.push({
        label: dateLabel,
        trip: 1,
      })
    }

    return acc
  }, [])

  const buddyCondition: Prisma.TripBuddyWhereInput =
    user.role === "User"
      ? {
          OR: [
            {
              userId: user.id,
            },
            {
              trip: {
                creatorId: user.id,
              },
            },
          ],
          status: "Approved",
          updatedAt: {
            gte: startDate,
          },
        }
      : {
          status: "Approved",
          updatedAt: {
            gte: startDate,
          },
        }

  // buddyes date fatching
  const booking = await prisma.tripBuddy.findMany({
    where: buddyCondition,
    select: {
      id: true,
      createdAt: true,
      trip: {
        select: {
          budget: true,
        },
      },
    },
    orderBy: {
      updatedAt: "asc",
    },
  })
  interface BuddySummary {
    label: string
    buddy: number
    budget: number
  }
  const buddySummary = booking.reduce<BuddySummary[]>((acc, crr) => {
    const dateLabel = format(crr.createdAt, "d MMM, yyyy")
    const existingDate = acc.find(p => p.label === dateLabel)

    if (existingDate) {
      existingDate.buddy += 1
      existingDate.budget += crr.trip.budget
    } else {
      acc.push({
        label: dateLabel,
        buddy: 1,
        budget: crr.trip.budget,
      })
    }

    return acc
  }, [])

  const uniqueLabels = Array.from(
    new Set([
      ...tripSummary.map(item => item.label),
      ...buddySummary.map(item => item.label),
    ])
  )

  const summary = uniqueLabels.map(label => {
    const trip = tripSummary.find(item => item.label === label)?.trip || 0
    const buddy = buddySummary.find(item => item.label === label)?.buddy || 0
    const budget = buddySummary.find(item => item.label === label)?.budget || 0

    return {
      label,
      trip,
      buddy,
      budget,
    }
  })

  interface IChart {
    label: string
    trip: number
    buddy: number
  }

  const chartData = summary.reduce<IChart[]>((acc: IChart[], crr) => {
    const date = new Date(crr.label)
    let label: string

    const range = query?.range || "yearly"

    switch (range) {
      case "weekly":
        label = format(date, "EEE, MMM d")
        break
      case "monthly":
        label = format(date, "d MMM")
        break
      case "yearly":
        label = format(date, "MMM yyyy")
        break
      default:
        label = format(date, "MMM d, yyyy")
        break
    }

    const existing = acc.find(chart => chart.label === label)
    if (existing) {
      existing.trip += crr.trip
      existing.buddy += crr.buddy
    } else {
      acc.push({
        label,
        trip: 1,
        buddy: crr.buddy,
      })
    }

    return acc
  }, [])

  // Fetch and prepare trip types data
  const tripTypes = await prisma.trip.groupBy({
    by: ["tripType"],
    _count: {
      tripType: true,
    },
  })

  const typeChart = tripTypes
    .map(type => ({
      type: type.tripType,
      count: type._count.tripType,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  return {
    summary: {
      trip: summary.reduce((acc, crr) => acc + crr.trip, 0),
      buddy: summary.reduce((acc, crr) => acc + crr.buddy, 0),
      budget: summary.reduce((acc, crr) => acc + crr.budget, 0),
    },
    chartData,
    typeChart,
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
  postReview,
  getTopReviews,
  getOverview,
}
