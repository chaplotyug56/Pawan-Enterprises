import { useEffect, useState } from "react";
import api from "../services/api";

function AdminReviews() {
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    const res = await api.get("/reviews");
    setReviews(res.data.data);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const removeReview = async (id) => {
    if (!window.confirm("Delete review?")) return;

    await api.delete(`/reviews/${id}/delete`);

    fetchReviews();
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>Reviews</h1>

      {reviews.map((review) => (
        <div
          key={review._id}
          style={{
            border: "1px solid #ddd",
            padding: 20,
            marginBottom: 20,
            borderRadius: 10,
          }}
        >
          <h3>{review.product?.name}</h3>

          <p>
            <strong>User:</strong> {review.user?.name}
          </p>

          <p>
            <strong>Rating:</strong> ⭐ {review.rating}
          </p>

          <p>{review.comment}</p>

          <button onClick={() => removeReview(review._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default AdminReviews;
