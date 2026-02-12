import express, { Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// File type validation - accept common file types
const ALLOWED_MIME_TYPES = [
  // Images
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  // Videos
  "video/mp4",
  "video/mpeg",
  "video/webm",
  "video/quicktime",
  "video/x-msvideo",
  // Documents
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  // Text
  "text/plain",
  "text/csv",
  "text/html",
  "text/markdown",
  // Archives
  "application/zip",
  "application/x-rar-compressed",
];

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Sanitize filename and add timestamp
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9]/g, "_")
      .substring(0, 50); // Limit filename length
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${baseName}_${uniqueSuffix}${ext}`);
  },
});

// File filter for validation
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `File type not allowed. Uploaded: ${file.mimetype}. Please upload images, videos, PDFs, or documents.`
      ),
      false
    );
  }
};

// Configure multer with limits and file filter
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max file size
  },
});

// Upload endpoint with comprehensive error handling
router.post("/", (req: Request, res: Response, next: NextFunction) => {
  upload.single("file")(req, res, (err: any) => {
    // Handle multer errors
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: "File too large. Maximum size is 50MB.",
        });
      }
      return res.status(400).json({
        success: false,
        message: `Upload error: ${err.message}`,
      });
    } else if (err) {
      // Handle other errors (like file type validation)
      return res.status(400).json({
        success: false,
        message: err.message || "File upload failed",
      });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded. Please select a file.",
      });
    }

    try {
      // Construct URL
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;

      res.json({
        success: true,
        url: fileUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimeType: req.file.mimetype,
      });
    } catch (error) {
      // Clean up uploaded file if URL construction fails
      if (req.file?.path) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({
        success: false,
        message: "Failed to process upload",
      });
    }
  });
});

// Health check endpoint
router.get("/health", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Upload service is running",
    uploadDir: uploadDir,
    maxFileSize: "50MB",
  });
});

export default router;

