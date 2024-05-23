import express, { Application } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

// initialize express application
const app: Application = express()

// initialize parsers
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(cookieParser())

export default app
