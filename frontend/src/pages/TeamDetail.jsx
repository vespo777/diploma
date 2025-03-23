import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/addListingPage.css";

const API_URL = "http://localhost:8080";

const TeamDetail = () => {
    const { id} = useParams(); // Получаем idиз URL
    const navigate = useNavigate();
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;

    const [team, setTeam] = useState(null);
    const [members, setMembers] = useState([]);

    const hasFetched = useRef(false);
    // const [invitedUser, setInvitedUser] = useState("");

    const fetchTeamDetails = useCallback(async () => {
        if (!id || hasFetched.current) return;
        hasFetched.current = true
        try {
            const response = await fetch(`${API_URL}/teams/get-team-by-userId?userId=${id}`, {
                headers: { Authorization: localStorage.getItem("token") },
            });

            if (response.ok) {
                const data = await response.json();
                setTeam(data);
                setMembers(data.members || []);
            } else {
                throw new Error("Ошибка загрузки команды");
            }
        } catch (error) {
            console.error("Ошибка при загрузке команды:", error);
        }
    }, [id]);


    const handleJoinRequest = async () => {
        if (!user) return alert("Вы не авторизованы!");

        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Ошибка: нет токена");

            const response = await fetch(`${API_URL}/teams/send-request-to-join-team?senderId=${user.userId}&receiverId=${id}`, {
                method: "POST",
                headers: { Authorization: token },
            });

            if (!response.ok) throw new Error("Ошибка при отправке запроса");

            alert("Запрос на вступление отправлен!");
        } catch (error) {
            console.error("Ошибка:", error);
        }
    };

    useEffect(() => {
        if (!user) {
            navigate("/login");
        } else {
            fetchTeamDetails();
        }
    }, [fetchTeamDetails, user, navigate]);


    return (
        <div className="auth-container">
            <motion.div
                className="auth-box listing-box"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {team ? (
                    <>
                        <h2 className="team-header">Команда: {team.name}</h2>

                        <h3 className="team-subheader">Участники:</h3>
                        <ul className="team-members">
                            {members.length > 0 ? (
                                members.map((member, index) => (
                                    <li key={index} className="team-member">
                                        <p><strong>Имя:</strong> {member.personalInfo?.name} {member.personalInfo?.surname}</p>
                                        <p><strong>Город:</strong> {member.locationDetails?.currentCity}</p>
                                        <p><strong>Telegram:</strong> {member.contacts?.telegramNickname}</p>
                                    </li>
                                ))
                            ) : (
                                <p className="no-members">Пока нет участников</p>
                            )}
                        </ul>
                        {!members.some(member => member.userId === user?.userId) && (
                            <button onClick={handleJoinRequest} className="join-button">
                                Подать заявку
                            </button>
                        )}
                    </>
                ) : (
                    <p>Загрузка...</p>
                )}
            </motion.div>
        </div>
    );
};

export default TeamDetail;
