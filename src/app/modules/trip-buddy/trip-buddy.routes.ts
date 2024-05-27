import express from "express"
import { checkAuth } from "../../middlewares/check-auth"
import { tripBuddyController } from "./trip-buddy.controller"

const router = express.Router()

router.post("/:tripId", checkAuth("User"), tripBuddyController.tripBuddyRequest)

export const tripBuddyRoutes = router
