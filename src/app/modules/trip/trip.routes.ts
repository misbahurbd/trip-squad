import express from "express"
import { checkAuth } from "../../middlewares/check-auth"
import { tripController } from "./trip.controller"
import { upload } from "../../middlewares/multer"

const router = express.Router()

router.post(
  "/",
  checkAuth(),
  upload.array("images", 10),
  tripController.createTrip
)
router.get("/", tripController.getTrips)
router.get("/trip-types", tripController.tripTypes)
router.get("/top-trip-types", tripController.topTripTypes)
router.get("/get-my-trips", checkAuth("User"), tripController.getMyTrips)
router.get("/:tripId", tripController.getTripById)

export const tripRoutes = router
