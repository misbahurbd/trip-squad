import { AnyZodObject } from "zod"
import { catchAsync } from "../../utils/catch-async"

export const validateRequest = (ZodObj: AnyZodObject) => {
  return catchAsync(async (req, res, next) => {
    await ZodObj.parseAsync(req.body)
    next()
  })
}
