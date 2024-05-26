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
router.get("/:tripId", tripController.getTripById)

export const tripRoutes = router
