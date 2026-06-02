import express from "express";
import Note from "../models/Note.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET ALL NOTES
router.get("/", verifyToken, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// CREATE NOTE
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content)
      return res.status(400).json({ msg: "Title and content are required" });

    const note = await Note.create({ title, content, userId: req.user.id });
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// UPDATE NOTE
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { title: req.body.title, content: req.body.content },
      { new: true }
    );
    if (!note) return res.status(404).json({ msg: "Note not found" });
    res.json(note);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// DELETE NOTE
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!note) return res.status(404).json({ msg: "Note not found" });
    res.json({ msg: "Note deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

export default router;
