import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ConnectionButton from "../components/Connection";
import "../styles/ProfilePage.css";

const API_URL = "http://localhost:8080";

const Profile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const userMe = JSON.parse(localStorage.getItem("user"));
  const myId = userMe?.userId;
  const navigate = useNavigate();
  const [areTeammates, setAreTeammates] = useState(false);
  const [teamsLoading, setTeamsLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // Fetch user profile
  useEffect(() => {
    if (!myId) {
      navigate("/login");
    } else if (myId === Number(id)) {
      navigate("/profile");
    }
  }, [id, myId, navigate]);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;

      try {
        const response = await fetch(`${API_URL}/profile/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });

        if (!response.ok) throw new Error("Error loading profile");

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, token]);

  // Check if users are teammates
  useEffect(() => {
    const checkIfTeammates = async () => {
      if (!token || !myId || !id) return false;

      try {
        const responseReviewer = await fetch(`${API_URL}/teams/get-team-by-userId?userId=${myId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });

        const responseRoommate = await fetch(`${API_URL}/teams/get-team-by-userId?userId=${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });

        if (!responseReviewer.ok || !responseRoommate.ok) {
          throw new Error("Failed to fetch team data");
        }

        const teamReviewer = await responseReviewer.json();
        const teamRoommate = await responseRoommate.json();

        return teamReviewer?.id && teamRoommate?.id && teamReviewer.id === teamRoommate.id;
      } catch (error) {
        console.error("Error checking teammates:", error);
        return false;
      } finally {
        setTeamsLoading(false);
      }
    };

    const fetchTeamData = async () => {
      const result = await checkIfTeammates();
      setAreTeammates(result);
    };

    fetchTeamData();
  }, [id, myId, token]);

  // Fetch reviews and average rating
  useEffect(() => {
    const fetchReviews = async () => {
      if (!token || !id) return;

      try {
        // Fetch received reviews
        const reviewsResponse = await fetch(`${API_URL}/ratings/received?userId=${id}`, {
          headers: {
            Authorization: token,
          },
        });

        // Fetch average rating
        const avgRatingResponse = await fetch(`${API_URL}/ratings/overall?userId=${id}`, {
          headers: {
            Authorization: token,
          },
        });

        if (!reviewsResponse.ok || !avgRatingResponse.ok) {
          throw new Error("Failed to fetch rating data");
        }

        const reviewsData = await reviewsResponse.json();
        const avgRatingData = await avgRatingResponse.json();

        setReviews(reviewsData);
        setAverageRating(avgRatingData.averageRating || 0);
      } catch (error) {
        console.error("Error fetching ratings:", error);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [id, token]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/ratings/leave-review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          reviewerId: myId,
          roommateId: id,
          rating: rating,
          comment: comment,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit review");

      alert("Review submitted successfully!");
      setShowReviewForm(false);
      setRating(0);
      setComment("");

      // Refresh reviews after submission
      const reviewsResponse = await fetch(`${API_URL}/ratings/received?userId=${id}`, {
        headers: { Authorization: token },
      });
      const reviewsData = await reviewsResponse.json();
      setReviews(reviewsData);

      const avgRatingResponse = await fetch(`${API_URL}/ratings/overall?userId=${id}`, {
        headers: { Authorization: token },
      });
      const avgRatingData = await avgRatingResponse.json();
      setAverageRating(avgRatingData.averageRating || 0);
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review");
    }
  };

  if (loading) {
    return (
        <p style={{ textAlign: "center", color: "white" }}>
          Loading...
        </p>
    );
  }

  if (!user) return <p>User not found</p>;

  return (
      <div className="profile-container">
        <h1>Profile {user.personalInfo.name}</h1>
        <div className="profile-content">
          <div className="profile-section">
            <h2>Basic Information</h2>
            <p>Email: {user.email}</p>
            <p>Date of Birth: {user.personalInfo.birthDate}</p>
            <p>City: {user.locationDetails.currentCity}</p>
            <p>Region From: {user.locationDetails.regionFrom}</p>
          </div>

          <div className="profile-section">
            <h3>Preferences</h3>
            <p>Wake Up Time: {user.roommatePreferences.wakeTime}</p>
            <p>Sleep Time: {user.roommatePreferences.sleepTime}</p>
          </div>

          <div className="profile-section">
            <h3>Rating</h3>
            {!reviewsLoading && (
                <>
                  <div className="rating-summary">
                    <h4>Average Rating: {averageRating.toFixed(1)}/5</h4>
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < Math.round(averageRating) ? "star-filled" : "star-empty"}>
                      ★
                    </span>
                      ))}
                    </div>
                  </div>

                  <h4>Reviews ({reviews.length})</h4>
                  {reviews.length > 0 ? (
                      <div className="reviews-list">
                        {reviews.map((review, index) => (
                            <div key={index} className="review-item">
                              <div className="review-header">
                        <span className="review-rating">
                          {[...Array(5)].map((_, i) => (
                              <span key={i} className={i < review.rating ? "star-filled" : "star-empty"}>
                              ★
                            </span>
                          ))}
                        </span>
                                <span className="review-date">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                              </div>
                              <p className="review-comment">{review.comment}</p>
                              <p className="review-author">- {review.reviewerName}</p>
                            </div>
                        ))}
                      </div>
                  ) : (
                      <p>No reviews yet</p>
                  )}
                </>
            )}
          </div>

          {myId && myId !== id && (
              <>
                <ConnectionButton currentUserId={myId} otherUserId={id} />

                {!teamsLoading && areTeammates && (
                    <div className="profile-section">
                      <h3>Leave a Review</h3>
                      {showReviewForm ? (
                          <form onSubmit={handleSubmitReview} className="review-form">
                            <div className="form-group">
                              <label>Rating (1-5):</label>
                              <input
                                  type="number"
                                  min="1"
                                  max="5"
                                  value={rating}
                                  onChange={(e) => setRating(parseInt(e.target.value))}
                                  required
                              />
                            </div>
                            <div className="form-group">
                              <label>Comment:</label>
                              <textarea
                                  value={comment}
                                  onChange={(e) => setComment(e.target.value)}
                                  required
                              />
                            </div>
                            <div className="form-actions">
                              <button type="submit" className="submit-btn">Submit Review</button>
                              <button
                                  type="button"
                                  onClick={() => setShowReviewForm(false)}
                                  className="cancel-btn"
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                      ) : (
                          <button
                              onClick={() => setShowReviewForm(true)}
                              className="review-btn"
                          >
                            Write a Review
                          </button>
                      )}
                    </div>
                )}
              </>
          )}
        </div>
      </div>
  );
};

export default Profile;
