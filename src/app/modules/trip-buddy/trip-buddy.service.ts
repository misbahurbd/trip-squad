import httpStatus from "http-status"
import prisma from "../../../utils/prisma-client"
import { AppError } from "../../errors/app-error"
import { IOptions, parseOptions } from "../../../helpers/query-helpers"

const tripBuddyRequest = async (userId: string, tripId: string) => {
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
    },
  })

  return tripBuddy
}

const tripBuddyRequestByUserId = async (userId: string, options: IOptions) => {
  const { page, limit, skip, sortBy, sortOrder } = parseOptions(options)

  const requests = await prisma.tripBuddy.findMany({
    where: {
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
      userId,
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

export const tripBuddyService = {
  tripBuddyRequest,
  tripBuddyRequestByUserId,
  tripBuddyResponse,
}
