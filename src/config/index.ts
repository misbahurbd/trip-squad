import dotenv from "dotenv"
import path from "path"

dotenv.config({ path: path.join(process.cwd(), ".env") })

export default {
  port: process.env.PORT || 4600,
  env: process.env.NODE_ENV || "development",
  jwt: {
    accessSecret: process.env.JWT_SECRET || "secret",
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  },
}
