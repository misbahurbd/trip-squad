import { z } from "zod"

const registerSchema = z.object({
  name: z.string().min(1, { message: "Name is required!" }),
  username: z
    .string()
    .min(1, { message: "Username is required!" })
    .min(4, { message: "Username must be at least 4 characters!" })
    .regex(/^[a-zA-Z0-9-_]+$/gm, {
      message:
        "Username can only include letters, digits, hyphens, and underscores, with no spaces.!",
    }),
  email: z
    .string()
    .min(1, { message: "Email is required!" })
    .email({ message: "Invalid email address!" }),
  password: z
    .string()
    .min(1, { message: "Password is required!" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^\s]{8,}$/gm, {
      message:
        "Password must be at least 8 characters long, contain at least one lowercase letter, one uppercase letter, and one number.",
    }),
})

export const authValidation = {
  registerSchema,
}
