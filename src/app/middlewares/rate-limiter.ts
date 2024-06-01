import rateLimit from "express-rate-limit"
import { catchAsync } from "../../utils/catch-async"
import { sendResponse } from "../../utils/send-response"
import httpStatus from "http-status"

export const reqLimiter = (limit: number) => {
  return rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: limit, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    handler: catchAsync(async (req, res) => {
      sendResponse(res, {
        statusCode: httpStatus.TOO_MANY_REQUESTS,
        success: false,
        message:
          "Too many requests from this IP, please try again after 15 minutes",
        data: null,
      })
    }),
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  })
}

export const verifyTokenLimit = () => {
  return rateLimit({
    windowMs: 3 * 60 * 1000, // 3 minutes
    limit: 1, // Limit each IP to 1 requests per `window` (here, per 15 minutes)
    handler: catchAsync(async (req, res) => {
      sendResponse(res, {
        statusCode: httpStatus.TOO_MANY_REQUESTS,
        success: false,
        message: "Please try again after 3 minutes",
        data: null,
      })
    }),
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  })
}
