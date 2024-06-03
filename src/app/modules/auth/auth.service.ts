import httpStatus from "http-status"
import bcrypt from "bcrypt"
import { TokenType } from "@prisma/client"
import { IChangePassword, IUserLogin, IUserRegister } from "./auth.interface"
import prisma from "../../../utils/prisma-client"
import { AppError } from "../../errors/app-error"
import config from "../../../config"
import sendMail from "../../../utils/mailer"
import { generateToken } from "../../../helpers/jwt-helper"
import { JwtPayload } from "jsonwebtoken"
import {
  getResetTemplate,
  getVerifyTemplate,
} from "../../../utils/email-template"

const userRegister = async (userData: IUserRegister) => {
  const isUserExist = await prisma.user.findFirst({
    where: {
      OR: [
        {
          email: userData.email.toLowerCase(),
        },
        {
          username: userData.username.toLowerCase(),
        },
      ],
    },
  })
  if (isUserExist) {
    throw new AppError(httpStatus.CONFLICT, "User already registered")
  }

  // hash password
  const hashedPassword = await bcrypt.hash(
    userData.password,
    Number(config.hashRound)
  )

  // create user
  const result = await prisma.$transaction(async tsx => {
    const user = await tsx.user.create({
      data: {
        username: userData.username.toLowerCase(),
        email: userData.email.toLowerCase(),
        hashedPassword,
        profile: {
          create: {
            name: userData.name,
            email: userData.email,
          },
        },
      },
      select: {
        profile: true,
      },
    })

    if (!user.profile) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Something went wrong"
      )
    }

    // create verification token
    const verificationToken = await tsx.verificationToken.create({
      data: {
        email: user.profile.email.toLowerCase(),
        token: crypto.randomUUID().toString(),
        tokenType: TokenType.Verify,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 6),
      },
    })

    // create verification link
    const verificationLink = `${config.clientUrl}/verify?token=${verificationToken.token}`

    // send verification email
    sendMail(
      user.profile.email,
      "Verify your account",
      getVerifyTemplate(user.profile.name, verificationLink, 6)
    )

    return { verificationToken, verificationLink, ...user.profile }
  })
  return result
}

const userLogin = async (credentials: IUserLogin) => {
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        {
          email: credentials.username.toLowerCase(),
        },
        {
          username: credentials.username.toLowerCase(),
        },
      ],
      isDeleted: false,
    },
  })

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found")
  }

  if (user.status === "Blocked") {
    throw new AppError(httpStatus.UNAUTHORIZED, "Your account is blocked")
  }

  const isPasswordValid = await bcrypt.compare(
    credentials.password,
    user.hashedPassword
  )

  if (!isPasswordValid) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials")
  }

  const jwtpayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  }
  const accessToken = generateToken(jwtpayload, config.jwt.accessSecret!, "1d")
  const refreshToken = generateToken(
    jwtpayload,
    config.jwt.refreshSecret!,
    "7d"
  )

  return {
    user,
    accessToken,
    refreshToken,
  }
}

const changePassword = async (
  currentUser: JwtPayload,
  payload: IChangePassword
) => {
  const user = await prisma.user.findFirst({
    where: {
      id: currentUser.id,
      isDeleted: false,
    },
  })

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found")
  }

  if (user.status === "Blocked") {
    throw new AppError(httpStatus.UNAUTHORIZED, "Your account is blocked")
  }

  const isPasswordValid = await bcrypt.compare(
    payload.oldPassword,
    user.hashedPassword
  )

  if (!isPasswordValid) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Wrong password")
  }

  const hashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.hashRound)
  )

  const result = await prisma.user.update({
    where: {
      id: currentUser.id,
    },
    data: {
      hashedPassword,
    },
  })

  return result
}

const verifyAccount = async (token: string, currentUser: JwtPayload | null) => {
  const verificationToken = await prisma.verificationToken.findFirst({
    where: {
      token,
      tokenType: TokenType.Verify,
      expiresAt: {
        gt: new Date(),
      },
    },
  })

  if (currentUser && currentUser.email) {
    if (verificationToken?.email !== currentUser.email) {
      throw new AppError(httpStatus.NOT_FOUND, "Varification token not valid")
    }
  }

  if (!verificationToken) {
    throw new AppError(httpStatus.NOT_FOUND, "Invalid verification token")
  }

  const result = await prisma.$transaction(async tx => {
    const user = await tx.user.update({
      where: {
        email: verificationToken.email,
      },
      data: {
        emailVerified: new Date(),
      },
      select: {
        profile: true,
      },
    })

    if (!user) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Something went wrong"
      )
    }

    await tx.verificationToken.delete({
      where: {
        token: verificationToken.token,
        email: verificationToken.email,
      },
    })

    return user.profile
  })
  return result
}

const resendVerificationLink = async (currentUser: JwtPayload) => {
  const user = await prisma.user.findFirst({
    where: {
      id: currentUser.id,
      isDeleted: false,
    },
    include: {
      profile: true,
    },
  })

  if (!user || !user.profile || !user.profile.email) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found")
  }

  const isAlreadyVerified = await prisma.user.findFirst({
    where: {
      id: user.id,
      emailVerified: {
        not: null,
      },
    },
  })

  if (isAlreadyVerified) {
    throw new AppError(httpStatus.CONFLICT, "Your account is already verified")
  }

  const result = await prisma.$transaction(async tx => {
    await tx.verificationToken.deleteMany({
      where: {
        email: user.email,
      },
    })

    const verificationToken = await tx.verificationToken.create({
      data: {
        email: user.email.toLowerCase(),
        token: crypto.randomUUID().toString(),
        tokenType: TokenType.Verify,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 6),
      },
    })

    // create verification link
    const verificationLink = `${config.clientUrl}/verify?token=${verificationToken.token}`

    // send verification email
    sendMail(
      user.email,
      "Verify your account",
      getVerifyTemplate(user?.profile?.name || "buddy", verificationLink, 6)
    )

    return user.profile
  })
  return result
}

const forgetPassword = async (payload: { identifer: string }) => {
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        {
          email: payload.identifer.toLowerCase(),
        },
        {
          username: payload.identifer.toLowerCase(),
        },
      ],
      isDeleted: false,
    },
    include: {
      profile: true,
    },
  })

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found")
  }

  const result = await prisma.$transaction(async tsx => {
    const resetToken = await tsx.verificationToken.create({
      data: {
        email: user.email.toLowerCase(),
        token: crypto.randomUUID().toString(),
        tokenType: TokenType.Reset,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 2),
      },
    })

    const resetLink = `${config.clientUrl}/reset-password?token=${resetToken.token}`

    await sendMail(
      user.email,
      "Reset your password",
      getResetTemplate(user.profile?.name || "buddy", resetLink, 1)
    )
    return user.profile
  })

  return result
}

const resetPassword = async (
  token: string,
  payload: { password: string; confirmPassword: string }
) => {
  const verificationToken = await prisma.verificationToken.findFirst({
    where: {
      token,
      tokenType: TokenType.Reset,
      expiresAt: {
        gt: new Date(),
      },
    },
  })

  if (!verificationToken) {
    throw new AppError(httpStatus.NOT_FOUND, "Invalid reset token")
  }

  const user = await prisma.user.findFirst({
    where: {
      email: verificationToken.email,
      isDeleted: false,
    },
  })

  if (user?.status !== "Active") {
    throw new AppError(httpStatus.UNAUTHORIZED, "Your account is blocked")
  }

  if (payload.password !== payload.confirmPassword) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Confirm Password does not match!"
    )
  }

  const hashedPassword = await bcrypt.hash(
    payload.password,
    Number(config.hashRound)
  )

  const result = await prisma.$transaction(async tsx => {
    const user = await tsx.user.update({
      where: {
        email: verificationToken.email,
      },
      data: {
        hashedPassword,
      },
    })

    await tsx.verificationToken.delete({
      where: {
        token: verificationToken.token,
      },
    })
    return user
  })
  return result
}

export const authService = {
  userRegister,
  userLogin,
  changePassword,
  verifyAccount,
  forgetPassword,
  resetPassword,
  resendVerificationLink,
}
