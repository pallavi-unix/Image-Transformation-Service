import axios from "axios";
import fs from "fs";
import path from "path";
import FormData from "form-data";

export async function removeBackground(inputPath: string, outputPath: string) {
  try {
    const apiKey = process.env.BACKGROUND_REMOVAL_API_KEY;
    if (!apiKey) throw new Error("Missing BACKGROUND_REMOVAL_API_KEY in .env");

    const form = new FormData();
    form.append("image_file", fs.createReadStream(inputPath));

    const response = await axios({
      method: "post",
      url: "https://api.remove.bg/v1.0/removebg",
      data: form as any, // ✅ cast to any for TypeScript
      headers: {
        ...form.getHeaders(),
        "X-Api-Key": apiKey,
      },
      responseType: "arraybuffer",
    });

    fs.writeFileSync(outputPath, response.data);
    return outputPath;
  } catch (error: any) {
    if (error.response?.data) {
      const msg = error.response.data.toString("utf-8");
      console.error("Background removal failed:", msg);
    } else {
      console.error("Background removal failed:", error.message);
    }
    throw error;
  }
}
