import { Router } from "express";
import multer from "multer";
import { processImage } from "../utils/processImage";

const router = Router();
const upload = multer({ dest: "uploads/" });

router.post("/process", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const result = await processImage(req.file.path);

    res.json({
      original: result.original,
      processed: result.processed,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || "Image processing failed" });
  }
});

export default router;
