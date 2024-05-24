import { NextFunction, Request, Response } from "express"
import multer from "multer"

// **Validation Considerations:**
const allowedExtensions = [".jpg", ".jpeg", ".png", ".pdf", ".docx"] // Adjust as needed

// **Configure Storage (Optional):**
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/") // Replace with your desired upload directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  },
})

// Create the upload middleware (single file by default)
const upload = multer({ storage })

// Middleware with progress tracking
const uploadWithProgress = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const uploadMiddleware = upload.single("file") // Field name should match the form field

  uploadMiddleware(req, res, err => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({ error: "File size exceeds limit" }) // Customize error message
      }
      return res.status(500).json({ error: err.message })
    }

    // Access uploaded file details from req.file (if storage is used)
    // Access progress information from req.file.cloudStorage (if unavailable with `memoryStorage`)

    next()
  })

  uploadMiddleware.on("progress", progressData => {
    const percentage = Math.round(
      (progressData.loaded * 100) / progressData.total
    )
    console.log(`Upload progress: ${percentage}%`) // Log progress to console
    // You can send progress updates to the client using websockets or other methods
  })
}

export default { upload, uploadWithProgress }
