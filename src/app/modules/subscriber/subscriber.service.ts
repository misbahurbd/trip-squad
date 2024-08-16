import prisma from "../../../utils/prisma-client"
import { ISubscriber } from "./subscriber.interface"

const addSubscriber = async (payload: ISubscriber) => {
  const isExist = await prisma.subscriber.findUnique({
    where: {
      email: payload.email,
    },
  })

  if (isExist) {
    return isExist
  }

  const subscriber = await prisma.subscriber.create({
    data: {
      email: payload.email,
    },
  })

  return subscriber
}

export const subscriberService = {
  addSubscriber,
}
