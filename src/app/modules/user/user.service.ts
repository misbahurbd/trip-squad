import { JwtPayload } from "jsonwebtoken"
import prisma from "../../../utils/prisma-client"
import {
  IOptions,
  parseFilterOptions,
  parseOptions,
} from "../../../helpers/query-helpers"
import { Prisma, UserRole, UserStatus } from "@prisma/client"
import { userSearchFields } from "./user.constant"

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

const getAllUsers = async (
  currentUser: JwtPayload,
  query: any,
  options: IOptions
) => {
  const { page, limit, skip, sortBy, sortOrder } = parseOptions(options)
  const filterCondition: Prisma.UserWhereInput[] = parseFilterOptions(
    query,
    userSearchFields
  )

  const users = await prisma.user.findMany({
    where: {
      AND: filterCondition,
      isDeleted: false,
      NOT: {
        id: currentUser.id,
      },
    },
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      profile: true,
    },
  })

  const total = await prisma.user.count({
    where: {
      AND: filterCondition,
      isDeleted: false,
      role: UserRole.User,
    },
  })

  return {
    data: users.map(user => {
      const { id, hashedPassword, profile, ...remainUserData } = user
      return { ...profile, ...remainUserData, id }
    }),
    meta: {
      page,
      limit,
      total,
    },
  }
}

const updateRole = async (userId: string, payload: { role: UserRole }) => {
  const user = await prisma.user.update({
    where: {
      id: userId,
      isDeleted: false,
    },
    data: {
      role: payload.role,
    },
  })

  return user
}

const updateStatus = async (
  userId: string,
  payload: { status: UserStatus }
) => {
  const user = await prisma.user.update({
    where: {
      id: userId,
      isDeleted: false,
    },
    data: {
      status: payload.status,
    },
  })

  return user
}

export const userService = {
  currentUser,
  getAllUsers,
  updateRole,
  updateStatus,
}
