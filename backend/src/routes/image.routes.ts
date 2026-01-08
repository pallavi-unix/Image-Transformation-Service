import { Router } from "express";
import multer from "multer";
import { processImage } from "../utils/processImage";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";

const router = Router();
const upload = multer({ dest: "uploads/" });

// Temporary in-memory map: uuid -> processed file path
const processedImageMap: Record<string, string> = {};

router.post("/process", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const result = await processImage(req.file.path);

    // Generate a unique UUID for the processed image
    const uniqueId = uuidv4();
    processedImageMap[uniqueId] = result.processed;

    res.json({
      original: result.original,
      processed: result.processed,
      url: `http://localhost:5000/api/image/view/${uniqueId}` // <-- new unique URL
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || "Image processing failed" });
  }
});

router.delete("/delete", async (req, res) => {
  try {
    const { original, processed } = req.body;

    if (!original || !processed) {
      return res.status(400).json({ error: "Missing image paths" });
    }

    const originalPath = path.join(process.cwd(), original);
    const processedPath = path.join(process.cwd(), processed);

    if (fs.existsSync(originalPath)) {
      fs.unlinkSync(originalPath);
    }

    if (fs.existsSync(processedPath)) {
      fs.unlinkSync(processedPath);
    }

    res.json({ message: "Images deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete images" });
  }
});

// New route to serve processed image via UUID
router.get("/view/:id", (req, res) => {
  const id = req.params.id;
  const filePath = processedImageMap[id];
  if (!filePath) {
    return res.status(404).json({ error: "Image not found" });
  }
  res.sendFile(filePath, { root: process.cwd() }); // send the actual file
});

export default router;
