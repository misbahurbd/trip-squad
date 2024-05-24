import { JwtPayload } from "jsonwebtoken"
import prisma from "../../../utils/prisma-client"

const currentUser = async (currentUser: JwtPayload) => {
  const user = await prisma.user.findFirst({
    where: {
      id: currentUser.id,
      isDeleted: false,
    },
    include: {
      profile: true,
    },
  })

  const resposne = {
    ...user?.profile,
    username: user?.username,
    emailVerified: user?.emailVerified,
    status: user?.status,
    role: user?.role,
  }

  return resposne
}

export const userService = {
  currentUser,
}
