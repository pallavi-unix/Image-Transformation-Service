import { Router } from "express";

const router = Router();

router.post("/upload", (req, res) => {
  res.json({ message: "Image upload endpoint" });
});

router.delete("/:id", (req, res) => {
  res.json({ message: "Image deleted" });
});

export default router;
