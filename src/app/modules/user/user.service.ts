import { JwtPayload } from "jsonwebtoken"
import bcrypt from "bcrypt"
import prisma from "../../../utils/prisma-client"
import {
  IOptions,
  parseOptions,
  parseUserFilterOptions,
} from "../../../helpers/query-helpers"
import { Prisma, UserRole, UserStatus } from "@prisma/client"
import { userSearchFields } from "./user.constant"
import { ICreateUser } from "./user.interface"
import uploadOnCloudinary from "../../../utils/cloudinary"
import { AppError } from "../../errors/app-error"
import httpStatus from "http-status"
import config from "../../../config"

const createUser = async (file: Express.Multer.File, userData: ICreateUser) => {
  const b64 = Buffer.from(file.buffer).toString("base64")
  const dataURI = "data:" + file.mimetype + ";base64," + b64

  const response = await uploadOnCloudinary(dataURI)

  if (!response || !response.secure_url) {
    throw new AppError(httpStatus.BAD_REQUEST, "Unable to upload photo")
  }

  if (userData.password !== userData.confirmPassword) {
    throw new AppError(httpStatus.BAD_REQUEST, "Password does not match")
  }

  const hashedPassword = await bcrypt.hash(
    userData.password,
    Number(config.hashRound)
  )

  const user = await prisma.user.create({
    data: {
      username: userData.username,
      email: userData.email,
      hashedPassword,
      role: userData.role,
      profile: {
        create: {
          name: userData.name,
          email: userData.email,
          profilePhoto: response.secure_url,
        },
      },
    },
    include: {
      profile: true,
    },
  })

  return user.profile
}

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
  const filterCondition = parseUserFilterOptions(
    query,
    userSearchFields
  ) as Prisma.UserWhereInput[]

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

  console.log({ users })

  const total = await prisma.user.count({
    where: {
      AND: filterCondition,
      isDeleted: false,
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
  createUser,
  currentUser,
  getAllUsers,
  updateRole,
  updateStatus,
}
