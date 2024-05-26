import { z } from "zod"

const profileSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  mobile: z.string().min(1, { message: "Mobile is required" }),
  profilePhoto: z.string(),
  dateOfBirth: z.string(),
  bio: z.string(),
})

export const profileValidation = {
  profileSchema,
}
