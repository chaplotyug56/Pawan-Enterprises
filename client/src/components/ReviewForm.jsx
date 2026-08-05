import { useState } from "react";
import api from "../services/api";

function ReviewForm({ productId, onReviewAdded }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const submitReview = async (e) => {
    e.preventDefault();

    try {
      await api.post(`/reviews/${productId}`, {
        rating,
        comment,
      });

      alert("Review Added Successfully");

      setRating(5);
      setComment("");

      if (onReviewAdded) {
        onReviewAdded();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add review");
    }
  };

  return (
    <form onSubmit={submitReview}>
      <h3>Write a Review</h3>

      <select
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
      >
        <option value={5}>⭐⭐⭐⭐⭐</option>
        <option value={4}>⭐⭐⭐⭐</option>
        <option value={3}>⭐⭐⭐</option>
        <option value={2}>⭐⭐</option>
        <option value={1}>⭐</option>
      </select>

      <br />
      <br />

      <textarea
        rows="4"
        placeholder="Write your review..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <br />
      <br />

      <button type="submit">
        Submit Review
      </button>
    </form>
  );
}

export default ReviewForm;