import express from "express";
import cors from "cors";
import path from "path";
import imageRoutes from "./routes/image.routes";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/images", imageRoutes);

export default app;
