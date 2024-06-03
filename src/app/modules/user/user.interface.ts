import { UserRole } from "@prisma/client"

export interface ICreateUser {
  name: string
  username: string
  email: string
  role: UserRole
  password: string
  confirmPassword: string
}
