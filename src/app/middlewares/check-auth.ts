import { USER_ROLE } from '@prisma/client'
import { catchAsync } from '../utils/catch-async'
import { verifyToken } from '../helpers/jwt-helpers'

export const checkAuth = (...roles: USER_ROLE[]) => {
  return catchAsync(async (req, res, next) => {
    const token = req.headers.authorization
    if (!token) throw new Error('Token not found')

    const payload = await verifyToken(token, process.env.JWT_ACCESS_SECRET!)
    if (!payload) throw new Error('You are unauthorized')

    if (roles.length && !roles.includes(payload.role))
      throw new Error("You don't have permission to access")

    req.user = payload

    next()
  })
}
