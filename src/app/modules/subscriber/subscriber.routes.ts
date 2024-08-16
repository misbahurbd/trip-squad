import express from "express"
import { subscriberController } from "./subscriber.controller"

const router = express.Router()

router.post("/", subscriberController.addSubscroiber)

export const subscriberRoutes = router
