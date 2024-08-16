import express, { Router } from "express"
import { authRoutes } from "../modules/auth/auth.routes"
import { userRoutes } from "../modules/user/user.routes"
import { tripRoutes } from "../modules/trip/trip.routes"
import { profileRoutes } from "../modules/profile/profile.routes"
import { tripBuddyRoutes } from "../modules/trip-buddy/trip-buddy.routes"
import { subscriberRoutes } from "../modules/subscriber/subscriber.routes"

const router = express.Router()

const routers: { path: string; router: Router }[] = [
  {
    path: "/auth",
    router: authRoutes,
  },
  {
    path: "/users",
    router: userRoutes,
  },
  {
    path: "/trips",
    router: tripRoutes,
  },
  {
    path: "/profiles",
    router: profileRoutes,
  },
  {
    path: "/trip-buddies",
    router: tripBuddyRoutes,
  },
  {
    path: "/subscribe",
    router: subscriberRoutes,
  },
]

routers.forEach(route => {
  router.use(route.path, route.router)
})

export const moduleRoutesd = router
