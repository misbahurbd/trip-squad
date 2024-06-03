import httpStatus from "http-status"
import prisma from "../../../utils/prisma-client"
import { AppError } from "../../errors/app-error"
import {
  IOptions,
  parseOptions,
  parseTripBuddisSearchOptions,
  parseTripBuddyHistorySearchOptions,
  parseTripBuddySearchOptions,
} from "../../../helpers/query-helpers"
import { ITripBuddy } from "./trip-buddy.interface"
import { Prisma } from "@prisma/client"
import { tripBuddySearchFields } from "./trip-buddy.constant"

const tripBuddyRequest = async (
  userId: string,
  tripId: string,
  tripBuddyData: ITripBuddy
) => {
  const isTripBuddyExist = await prisma.tripBuddy.findFirst({
    where: {
      userId,
      tripId,
    },
  })

  if (isTripBuddyExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Your request already send!")
  }

  const tripBuddy = await prisma.tripBuddy.create({
    data: {
      userId,
      tripId,
      ...tripBuddyData,
    },
  })

  return tripBuddy
}

const tripBuddyRequestByUserId = async (
  userId: string,
  query: any,
  options: IOptions
) => {
  const { page, limit, skip, sortBy, sortOrder } = parseOptions(options)
  const searchFilter = parseTripBuddySearchOptions(
    query,
    tripBuddySearchFields
  ) as Prisma.TripBuddyWhereInput[]

  const requests = await prisma.tripBuddy.findMany({
    where: {
      AND: searchFilter,
      trip: {
        creatorId: userId,
      },
      status: "Pending",
    },
    include: {
      trip: true,
      user: {
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

  const total = await prisma.tripBuddy.count({
    where: {
      AND: searchFilter,
      trip: {
        creatorId: userId,
      },
      status: "Pending",
    },
  })

  return {
    data: requests,
    meta: {
      page,
      limit,
      total,
    },
  }
}

const tripBuddyResponse = async (
  buddyId: string,
  { status }: { status: "Approved" | "Rejected" }
) => {
  const tripBuddy = await prisma.tripBuddy.update({
    where: {
      id: buddyId,
      status: "Pending",
    },
    data: {
      status,
    },
  })

  return tripBuddy
}

const tripBuddyRequestHistory = async (
  userId: string,
  query: any,
  options: IOptions
) => {
  const { page, limit, skip } = parseOptions(options)
  const searchFilter = parseTripBuddyHistorySearchOptions(
    query,
    tripBuddySearchFields
  ) as Prisma.TripBuddyWhereInput[]

  const requests = await prisma.tripBuddy.findMany({
    where: {
      AND: searchFilter,
      userId,
    },
    include: {
      trip: {
        include: {
          createdBy: {
            select: {
              profile: true,
            },
          },
        },
      },
      user: {
        select: {
          username: true,
          profile: true,
        },
      },
    },
    skip,
    take: limit,
    orderBy: {
      updatedAt: "desc",
    },
  })

  const total = await prisma.tripBuddy.count({
    where: {
      AND: searchFilter,
      userId,
    },
  })

  return {
    data: requests,
    meta: {
      page,
      limit,
      total,
    },
  }
}

const tripBuddies = async (userId: string, query: any, options: IOptions) => {
  const { page, limit, skip, sortBy, sortOrder } = parseOptions(options)
  const searchFilter = parseTripBuddisSearchOptions(
    query,
    tripBuddySearchFields
  ) as Prisma.TripWhereInput[]

  const buddies = await prisma.trip.findMany({
    where: {
      AND: searchFilter,
      isDeleted: false,
      tripBuddy: {
        some: {
          AND: [
            {
              status: "Approved",
            },
            {
              OR: [
                {
                  userId,
                },
                {
                  trip: {
                    creatorId: userId,
                  },
                },
              ],
            },
          ],
        },
      },
    },
    select: {
      id: true,
      photos: true,
      destination: true,
      startDate: true,
      endDate: true,
      location: true,
      tripBuddy: {
        include: {
          user: {
            select: {
              profile: true,
            },
          },
        },
      },
      createdBy: {
        select: {
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
      AND: searchFilter,
      isDeleted: false,
      tripBuddy: {
        some: {
          AND: [
            {
              status: "Approved",
            },
            {
              OR: [
                {
                  userId,
                },
                {
                  trip: {
                    creatorId: userId,
                  },
                },
              ],
            },
          ],
        },
      },
    },
  })

  return {
    data: buddies,
    meta: {
      page,
      limit,
      total,
    },
  }
}

export const tripBuddyService = {
  tripBuddyRequest,
  tripBuddyRequestByUserId,
  tripBuddyResponse,
  tripBuddyRequestHistory,
  tripBuddies,
}
