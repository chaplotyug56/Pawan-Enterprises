const express = require("express");
const router = express.Router();
const Image = require("../models/Image");

router.get("/:id", async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image || !image.data) {
      return res.status(404).json({ message: "Image not found" });
    }

    res.set("Content-Type", image.contentType);
    res.set("Cache-Control", "public, max-age=31536000"); // Cache for 1 year
    res.send(image.data);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
