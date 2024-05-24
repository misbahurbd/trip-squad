import express, { Application } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { moduleRoutesd } from "./app/routes/index.routes"
import globalErrorHandler from "./app/middlewares/global-error-handler"

// initialize express application
const app: Application = express()

// initialize parsers
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(cookieParser())

// initialize application routes
app.use("/api/v1", moduleRoutesd)

// global error handler
app.use(globalErrorHandler)

export default app
