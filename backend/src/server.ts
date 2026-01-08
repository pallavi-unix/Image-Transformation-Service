import dotenv from "dotenv";
dotenv.config(); 
import express from "express";
import cors from "cors";
import imageRoutes from "./routes/image.routes";

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 THIS LINE IS CRITICAL
app.use("/api/image", imageRoutes);

// Serve uploaded images
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

