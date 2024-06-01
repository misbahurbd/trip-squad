import bcrypt from "bcrypt"
import { PrismaClient } from "@prisma/client"
import config from "../src/config"
const prisma = new PrismaClient()

async function main() {
  const isAdminExist = await prisma.user.findFirst({
    where: {
      role: "Admin",
    },
  })

  if (isAdminExist) {
    console.log("Admin already exist")
    return
  }

  const hashedPassword = await bcrypt.hash(
    config.seed.password!,
    Number(config.hashRound)
  )

  const admin = await prisma.user.create({
    data: {
      email: config.seed.email!,
      username: config.seed.username!,
      hashedPassword,
      role: "Admin",
      profile: {
        create: {
          name: config.seed.name!,
          email: config.seed.email!,
        },
      },
    },
  })
  console.log("Admin Created Successfully", admin)
  return
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async e => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
