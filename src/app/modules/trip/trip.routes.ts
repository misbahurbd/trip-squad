import express from "express"
import { checkAuth } from "../../middlewares/check-auth"
import { tripController } from "./trip.controller"
import { upload } from "../../middlewares/multer"
import { validateRequest } from "../../middlewares/validate-request"
import { tripValidation } from "./trip.validation"

const router = express.Router()

router.post(
  "/",
  checkAuth(),
  upload.array("images", 10),
  tripController.createTrip
)
router.post("/:tripId/review", checkAuth("User"), tripController.postReview)
router.get("/", tripController.getTrips)
router.get("/trip-types", tripController.tripTypes)
router.get("/top-trip-types", tripController.topTripTypes)
router.get("/get-my-trips", checkAuth("User"), tripController.getMyTrips)
router.get("/photos", tripController.tripPhotos)
router.get("/reviews", tripController.getTopReviews)
router.get("/:tripId", tripController.getTripById)
router.put(
  "/:tripId",
  checkAuth(),
  validateRequest(tripValidation.tripSchema.partial()),
  tripController.updateTrip
)
router.delete("/:tripId", checkAuth(), tripController.deleteTrip)

export const tripRoutes = router
