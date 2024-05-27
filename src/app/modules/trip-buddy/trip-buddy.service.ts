import httpStatus from "http-status"
import prisma from "../../../utils/prisma-client"
import { AppError } from "../../errors/app-error"

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

export const tripBuddyService = {
  tripBuddyRequest,
}
