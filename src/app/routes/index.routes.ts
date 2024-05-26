import express, { Router } from "express"
import { authRoutes } from "../modules/auth/auth.routes"
import { userRoutes } from "../modules/user/user.routes"
import { tripRoutes } from "../modules/trip/trip.routes"
import { profileRoutes } from "../modules/profile/profile.routes"

const router = express.Router()

const routers: { path: string; router: Router }[] = [
  {
    path: "/auth",
    router: authRoutes,
  },
  {
    path: "/user",
    router: userRoutes,
  },
  {
    path: "/trip",
    router: tripRoutes,
  },
  {
    path: "/profile",
    router: profileRoutes,
  },
]

routers.forEach(route => {
  router.use(route.path, route.router)
})

export const moduleRoutesd = router
