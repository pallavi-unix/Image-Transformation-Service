import sharp from "sharp";

export async function flipImage(inputPath: string, outputPath: string) {
  try {
    await sharp(inputPath)
      .flip(false)    // vertical flip (false = no)
      .flop(true)     // horizontal flip
      .toFile(outputPath);

    return outputPath;
  } catch (error) {
    console.error("Image flipping failed:", error);
    throw error;
  }
}
