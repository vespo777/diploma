import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
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

  const matchingLevelsMap = useRef({});
  const hasFetched = useRef(false);

  const connection_exists = useRef(false);

  const fetchMatchingLevels = async () => {
    if (!myId || hasFetched.current) return;
    hasFetched.current = true

    try {
      // задержка чтобы предотвратить concurrency exception
      // await new Promise(resolve => setTimeout(resolve, 100));

      const response = await fetch(`http://localhost:8080/get-matching-score?userId=${myId}`, {
        headers: { 'Authorization': token }
      });

      console.log("DEBUG -- response: ", response);
      console.log("DEBUG -- my id: ", myId);
      console.log("DEBUG -- user id: ", id);

      const isconnected_response = await fetch(`http://localhost:8080/connections/is-connected?userId1=${myId}&userId2=${id}`, {
        headers: { 'Authorization': token }
      });

      const isconnected_response_data = await isconnected_response.text();
      console.log("DEBUG -- isconnected_response_data:", isconnected_response_data);
      
      if (isconnected_response_data == "Connection exists with status: ACCEPTED") {
        connection_exists.current = true;
      }

      console.log("DEBUG -- connection_exists:", connection_exists);


      if (!response.ok) {
        throw new Error(`Failed to fetch matching levels: ${response.status}`);
      }

      const data = await response.json();

      console.log("\n\nDEBUG data: ", data, "\n\n");

      // Заполняем глобальную хешмапу
      const levelsMap = {};
      data.forEach(item => {
        if (item.user.userId && item.matchingScore) {
          levelsMap[item.user.userId] = item.matchingScore;
        }
      });


      matchingLevelsMap.current = levelsMap;

    } catch (error) {
      console.error("Error fetching matching levels:", error);
    }
  };

  // Функция для получения matching level по userId
  const getMatchingLevel = (userId) => {
    return matchingLevelsMap.current[userId];
  };

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

        await fetchMatchingLevels();


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
        { console.log("avgRatingData:", avgRatingData) }

        setReviews(reviewsData);
        setAverageRating(avgRatingData || 0);
        { console.log("Average rating updated:", averageRating) }

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
      setAverageRating(avgRatingData || 0);
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
     
      <div className="profile-header">
        <h1>
          {user.personalInfo.name} {user.personalInfo.surname}
        </h1>
      </div>

      <div className="profile-content">

        {/* Matching Score */}
        <div className="profile-section">
          <h2>Compatibilty:</h2>
          <div className="info-grid">
            <div>
              <strong>Matching Score:</strong> {getMatchingLevel(id)}
            </div>
            <div>
              <strong>Personality Type:</strong> {user.roommateSearch.scoreTest}
            </div>


          </div>
        </div>

        {/* Location Information */}
        <div className="profile-section">
          <h2>Location</h2>
          <div className="info-grid">
            <div>
              <strong>Current City:</strong> {user.locationDetails.currentCity}
            </div>
            <div>
              <strong>Region From:</strong> {user.locationDetails.regionFrom}
            </div>
          </div>
        </div>

        {/* Roommate Preferences */}
        <div className="profile-section">
          <h2>Roommate Preferences</h2>
          <div className="info-grid">
            <div>
              <strong>Wake Up Time:</strong> {user.roommatePreferences.wakeTime}
            </div>
            <div>
              <strong>Sleep Time:</strong> {user.roommatePreferences.sleepTime}
            </div>
            <div>
              <strong>Pets:</strong> {user.roommatePreferences.pets === 'have_cat' ? 'Has cat' :
                user.roommatePreferences.pets === 'have_dog' ? 'Has dog' :
                  user.roommatePreferences.pets === 'dont_have_baribir' ? "Doesn't have pets" :
                    'No preference'}
            </div>
          </div>
        </div>

        {/* Roommate Search Criteria */}
        <div className="profile-section">
          <h2>Search Criteria</h2>
          <div className="info-grid">
            <div>
              <strong>Budget:</strong> {user.roommateSearch.budgetMin} - {user.roommateSearch.budgetMax} KZT
            </div>
            <div>
              <strong>Available from:</strong> {user.roommateSearch.startDate}
            </div>
          </div>
        </div>


        


        {/* Social Details */}
        <div className="profile-section">
          <h2>Social & Education</h2>
          <div className="info-grid">
            <div>
                <strong>Gender:</strong> {user.personalInfo.gender === 'M' ? 'Male' : 'Female'}
              </div>
              <div>
                <strong>Date of Birth:</strong> {user.personalInfo.birthDate}
              </div>

            {user.socialDetails.profession && (
              <div>
                <strong>Profession:</strong> {user.socialDetails.profession}
              </div>
            )}
            {user.socialDetails.company && (
              <div>
                <strong>Company:</strong> {user.socialDetails.company}
              </div>
            )}
            {user.socialDetails.universityName && (
              <div>
                <strong>University:</strong> {user.socialDetails.universityName}
              </div>
            )}
            {user.socialDetails.universitySpecialty && (
              <div>
                <strong>Specialty:</strong> {user.socialDetails.universitySpecialty}
              </div>
            )}
            {user.socialDetails.schoolName && (
              <div>
                <strong>School:</strong> {user.socialDetails.schoolName}
              </div>
            )}
            <div>
              <strong>Smoking:</strong> {user.socialDetails.smoking ? 'Yes' : 'No'}
            </div>
            <div>
              <strong>Drinking:</strong> {user.socialDetails.drinking ? 'Yes' : 'No'}
            </div>
            <div>
              <strong>Religion:</strong> {user.personalInfo.religion || 'Not specified'}
            </div>
            <div>
              <strong>Language:</strong> {user.personalInfo.language || 'Not specified'}
            </div>
          </div>
        </div>

        {/* Interests */}
        {user.socialDetails.interests && user.socialDetails.interests.length > 0 && (
          <div className="profile-section">
            <h2>Interests</h2>
            <div className="interests-container">
              {user.socialDetails.interests.map((interest, index) => (
                      <div key={index} className="interest-item">
                        • {interest}{' '}
                      </div>
                    ))}
            </div>
          </div>
        )}


      {/* Team Information */}
        {user.team && (
          <div className="profile-section">
          <h2>Team</h2>
          <div className="info-grid">
          <div>
                <div>
                  <strong>Team Name:</strong>{" "}
                  <Link to={`/teams/${user.team.id}`} className="team-link">
                    {user.team.name}
                  </Link>
                </div>
              </div>
          </div>
        </div>
      )}





        {/* Contact Information */}
        {user.contacts && connection_exists.current && (
          <div className="profile-section">
            <h2>Contact Information</h2>
            <div className="info-grid">
              {user.email && (
                  <div>
                    <strong>Email:</strong> {user.email}
                  </div>
              )}
              {user.contacts.callNumber && (
                <div>
                  <strong>Phone:</strong> {user.contacts.callNumber}
                </div>
              )}
              {user.contacts.telegramNickname && (
                <div>
                  <strong>Telegram:</strong> @{user.contacts.telegramNickname}
                </div>
              )}
            </div>
          </div>
        )}


        <div className="profile-section">
          <h3>Rating</h3>
          {!reviewsLoading && (
            <>
              <div className="rating-summary">
                {console.log("Average rating updated:", averageRating)}
                <h4>Average Rating: {averageRating.toFixed(2)}/5</h4>
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
