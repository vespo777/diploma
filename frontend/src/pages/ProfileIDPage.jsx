import { useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import ConnectionButton from "../components/Connection";
import "../styles/ProfilePage.css"

const API_URL = "http://localhost:8080";

const Profile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const token  = localStorage.getItem("token");
  const userMe = JSON.parse(localStorage.getItem("user"));
  const myId = userMe?.userId;
  console.log(myId);


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

        if (!response.ok) throw new Error("Ошибка загрузки профиля");

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Ошибка при загрузке профиля:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, token]);

  if (loading) return <p style = {{
    textAlign: "center",
    color: "white",
  }}>Загрузка...</p>;
  if (!user) return <p>Пользователь не найден</p>;

  return (
      <div className="profile-container">
        <h1>Profile {user.personalInfo.name}</h1>
        <div className="profile-content">
          <p>Email: {user.email}</p>
          <p>Date of Birth: {user.personalInfo.birthDate}</p>
          <p>City: {user.locationDetails.currentCity}</p>
          <p>Region From: {user.locationDetails.regionFrom}</p>
          <h3>Preferences</h3>
          <p>Wake Up Time: {user.roommatePreferences.wakeTime}</p>
          <p>Sleep Time: {user.roommatePreferences.sleepTime}</p>
          {myId && myId !== id && (
              <ConnectionButton currentUserId={myId} otherUserId={id} />
          )}
        </div>
      </div>
  );
};

export default Profile;
