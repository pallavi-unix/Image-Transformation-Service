import { Router } from "express";
import multer from "multer";
import path from "path";
import { removeBackground } from "../utils/removeBackground";
import { flipImage } from "../utils/flipImage";

const router = Router();

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../uploads")); // store in backend/uploads
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Upload endpoint
router.post("/upload", upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const originalPath = path.join(__dirname, "../../uploads", req.file.filename);
  const bgRemovedFilename = "bg-removed-" + req.file.filename;
  const bgRemovedPath = path.join(__dirname, "../../uploads", bgRemovedFilename);

  const flippedFilename = "flipped-" + req.file.filename;
  const flippedPath = path.join(__dirname, "../../uploads", flippedFilename);

  try {
    // Step 1: Remove background
    await removeBackground(originalPath, bgRemovedPath);

    // Step 2: Flip horizontally
    await flipImage(bgRemovedPath, flippedPath);

    res.json({
      message: "Image uploaded, background removed, and flipped successfully",
      original: `/uploads/${req.file.filename}`,
      processed: `/uploads/${flippedFilename}`,
    });
  } catch (error) {
    res.status(500).json({ error: "Image processing failed" });
  }
});

router.delete("/:id", (req, res) => {
  res.json({ message: "Image deleted" });
});

export default router;
