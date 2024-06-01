import express from "express"
import { checkAuth } from "../../middlewares/check-auth"
import { tripBuddyController } from "./trip-buddy.controller"

const router = express.Router()

router.get("/", checkAuth(), tripBuddyController.tripBuddyRequestByUserId)
router.get(
  "/history",
  checkAuth("User"),
  tripBuddyController.tripBuddyRequestHistory
)
router.get("/buddies", checkAuth("User"), tripBuddyController.tripBuddies)
router.post(
  "/request/:tripId",
  checkAuth(),
  tripBuddyController.tripBuddyRequest
)
router.put(
  "/response/:buddyId",
  checkAuth(),
  tripBuddyController.tripBuddyResponse
)

export const tripBuddyRoutes = router
