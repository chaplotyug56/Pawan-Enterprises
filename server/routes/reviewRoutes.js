const express = require("express");
const router = express.Router();

const {
  addReview,
  getProductReviews,
  getAllReviews,
  deleteReview,
} = require("../controllers/reviewController");

const { protect } = require("../middleware/authMiddleware");

router.post("/:id", protect, addReview);

router.get("/:id", getProductReviews);

router.get("/", protect, getAllReviews);

router.delete("/:id/delete", protect, deleteReview);

module.exports = router;