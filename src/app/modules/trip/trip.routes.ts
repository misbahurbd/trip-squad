import express from "express"
import { checkAuth } from "../../middlewares/check-auth"
import { tripController } from "./trip.controller"

const router = express.Router()

router.post("/", checkAuth(), tripController.createTrip)

export const tripRoutes = router
