import fs from "fs";
import path from "path";
import sharp from "sharp";
import axios from "axios";
import FormData from "form-data";

export async function processImage(inputPath: string) {
  if (!process.env.BACKGROUND_REMOVAL_API_KEY) {
    throw new Error("Background removal API key missing");
  }

  const uploadsDir = path.join(process.cwd(), "uploads");

  const originalOutput = path.join(
    uploadsDir,
    `original-${Date.now()}.png`
  );

  const processedOutput = path.join(
    uploadsDir,
    `processed-${Date.now()}.png`
  );

  // Ensure uploads directory exists
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
  }

  // Convert input image to PNG
  await sharp(inputPath).png().toFile(originalOutput);

  // Send to background removal API
  const formData = new FormData();
  formData.append("image_file", fs.createReadStream(originalOutput));

  const response = await axios.post(
    "https://api.remove.bg/v1.0/removebg",
    formData,
    {
      headers: {
        ...formData.getHeaders(),
        "X-Api-Key": process.env.BACKGROUND_REMOVAL_API_KEY,
      },
      responseType: "arraybuffer",
    }
  );

  const imageBuffer = Buffer.from(response.data as ArrayBuffer);

  await sharp(imageBuffer)
    .flop() // horizontal flip
    .ensureAlpha()
    .png({ force: true })
    .toFile(processedOutput);

  return {
    original: `/uploads/${path.basename(originalOutput)}`,
    processed: `/uploads/${path.basename(processedOutput)}`,
  };
}
