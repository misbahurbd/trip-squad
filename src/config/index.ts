import dotenv from "dotenv"
import path from "path"

dotenv.config({ path: path.join(process.cwd(), ".env") })

export default {
  port: process.env.PORT || 4600,
  env: process.env.NODE_ENV || "development",
  hashRound: process.env.HASH_ROUND,
  clientUrl: process.env.CLIENT_URL,
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_ACCESS_SECRET,
  },
  mailer: {
    email: process.env.MAILER_EMAIL,
    pass: process.env.MAILER_PASS,
  },
}
