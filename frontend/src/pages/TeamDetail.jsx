import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/addListingPage.css";

const API_URL = "http://localhost:8080";

const TeamDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user] = useState(() => {
        const userStr = localStorage.getItem("user");
        return userStr ? JSON.parse(userStr) : null;
    });
    const [status, setStatus] = useState(null);
    const [connections, setConnections] = useState([]);
    const [showConnections, setShowConnections] = useState(false);
    const [team, setTeam] = useState(null);
    const [members, setMembers] = useState([]);
    const hasFetched = useRef(false);

    const fetchMemberProfiles = useCallback(async (memberIds) => {
        try {
            const memberRequests = memberIds.map(id =>
                fetch(`${API_URL}/profile/${id}`, {
                    headers: { Authorization: localStorage.getItem("token") },
                }).then(res => res.ok ? res.json() : null)
            );
            const profiles = await Promise.all(memberRequests);
            setMembers(profiles.filter(Boolean));
        } catch (error) {
            console.error("Ошибка загрузки участников:", error);
        }
    }, []);

    const fetchConnections = useCallback(async () => {
        if (!user?.userId) return;
        try {
            const response = await fetch(`${API_URL}/connections/my-connections?userId=${user?.userId}`, {
                headers: { Authorization: localStorage.getItem("token") },
            });
            if (!response.ok) throw new Error("Ошибка загрузки коннекшнов");
            const data = await response.json();
            const cleanedData = data.filter(item => typeof item === "object");
            setConnections(cleanedData);
        } catch (error) {
            console.error("Ошибка при загрузке коннекшнов:", error);
        }
    }, [user?.userId]);

    const fetchTeamDetails = useCallback(async () => {
        if (!id || hasFetched.current) return;
        hasFetched.current = true;
        try {
            const response = await fetch(`${API_URL}/teams/get-team-by-teamId?teamId=${id}`, {
                headers: { Authorization: localStorage.getItem("token") },
            });

            if (response.ok) {
                const data = await response.json();
                setTeam(data);
                if (data.members?.length) {
                    fetchMemberProfiles(data.members);
                }
            } else {
                throw new Error("Ошибка загрузки команды");
            }
        } catch (error) {
            console.error("Ошибка при загрузке команды:", error);
        }
    }, [id, fetchMemberProfiles]);

    const checkIfRequestSent = useCallback(async () => {
        if (!user?.userId || !id) return;
        try {
            const response = await fetch(`${API_URL}/teams/is-user-team-request-sent?userId=${user.userId}&teamId=${id}`, {
                headers: { Authorization: localStorage.getItem("token") },
            });

            if (!response.ok) throw new Error("Ошибка проверки статуса заявки");
            const result = await response.text();
            setStatus(result === "true" ? "PENDING" : null);
        } catch (error) {
            console.error("Ошибка при проверке статуса заявки:", error);
        }
    }, [user?.userId, id]);

    const handleJoinRequest = async () => {
        if (!user) return alert("You are not authorized to join this team!");

        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Ошибка: нет токена");

            const response = await fetch(`${API_URL}/teams/send-join-request?senderId=${user.userId}&teamId=${id}`, {
                method: "POST",
                headers: { Authorization: token },
            });

            if (!response.ok) throw new Error("Ошибка при отправке запроса");

            setStatus("PENDING");
            alert("Request to join successfully sent!");
        } catch (error) {
            console.error("Ошибка:", error);
        }
    };

    const handleExitTeam = async () => {
        if (!user?.userId) return alert("Вы не авторизованы!");
        if (!window.confirm("Are you sure you want to leave this team?")) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/teams/exit-team?userId=${user.userId}`, {
                method: "POST",
                headers: { Authorization: token },
            });

            if (!response.ok) throw new Error("Failed to exit team");
            alert("You have left the team successfully");
            navigate("/teams");
        } catch (error) {
            console.error("Error exiting team:", error);
            alert("Failed to leave team");
        }
    };

    const handleInvite = async (receiverId) => {
        if (!user) return alert("Вы не авторизованы!");

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/teams/send-invite?senderId=${user.userId}&receiverId=${receiverId}`, {
                method: "POST",
                headers: { Authorization: token },
            });

            if (!response.ok) throw new Error("Ошибка при отправке инвайта");
            alert("Приглашение успешно отправлено!");
            setShowConnections(false);
        } catch (error) {
            console.error("Ошибка:", error);
        }
    };

    useEffect(() => {
        if (!user) {
            navigate("/login");
        } else {
            fetchTeamDetails();
            fetchConnections();
            checkIfRequestSent();
        }
    }, [user?.userId, navigate, fetchTeamDetails, fetchConnections, checkIfRequestSent]);

    const isTeamMember = members.some(member => member.userId === user?.userId);

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
                        <h5>Owner:</h5>
                        <Link className="link-owner" to={`/profile/${team.owner.userId}`}>
                            {team.owner.personalInfo.name} {team.owner.personalInfo.surname}
                        </Link>

                        <ul className="team-members">
                            {members.length > 0 ? (
                                members.map((member, index) => (
                                    <li key={index} className="team-member">
                                        {member?.userId ? (
                                            <>
                                                <Link className="team-member-link" to={`/profile/${member.userId}`}>
                                                    {member.personalInfo.name} {member.personalInfo.surname}
                                                </Link>
                                                <p><i>{member.socialDetails.profession}</i> at <strong>{member.socialDetails.company}</strong></p>
                                            </>
                                        ) : (
                                            <p>Loading...</p>
                                        )}
                                    </li>
                                ))
                            ) : (
                                <p className="no-members">Пока нет участников</p>
                            )}

                            {isTeamMember && (
                                <li className="team-member">
                                    <button
                                        onClick={() => setShowConnections(!showConnections)}
                                        className="invite-button"
                                    >
                                        Invite Connections
                                    </button>
                                    {showConnections && (
                                        <div className="connections-dropdown">
                                            {connections.length > 0 ? (
                                                connections.map((conn) => (
                                                    <div key={conn.userId} className="connection-item">
                                                        <Link
                                                            to={`/profile/${conn.userId}`}
                                                            className="connection-link"
                                                        >
                                                            {conn.personalInfo.name} {conn.personalInfo.surname}
                                                        </Link>
                                                        <button
                                                            onClick={() => handleInvite(conn.userId)}
                                                            className="invite-action-button"
                                                        >
                                                            Invite
                                                        </button>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="no-connections">No connections found</p>
                                            )}
                                        </div>
                                    )}
                                </li>
                            )}
                        </ul>

                        <div className="team-actions">
                            {isTeamMember ? (
                                <button
                                    onClick={handleExitTeam}
                                    className="exit-team-button"
                                >
                                    Exit Team
                                </button>
                            ) : status === "PENDING" ? (
                                <button className="pending-button" disabled>
                                    ⏳ Заявка отправлена
                                </button>
                            ) : (
                                <button
                                    onClick={handleJoinRequest}
                                    className="join-button"
                                >
                                    Подать заявку
                                </button>
                            )}
                        </div>
                    </>
                ) : (
                    <p>Загрузка...</p>
                )}
            </motion.div>
        </div>
    );
};

export default TeamDetail;
