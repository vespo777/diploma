import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/addListingPage.css";

const API_URL = "http://localhost:8080";

const TeamDetail = () => {
    const { id} = useParams(); // Получаем idиз URL
    const navigate = useNavigate();
    const userStr = localStorage.getItem("user");
    const [user, setUser] = useState(() => {
        const userStr = localStorage.getItem("user");
        return userStr ? JSON.parse(userStr) : null;
    });    const [status, setStatus] = useState(null);
    const [connections, setConnections] = useState([]);
    const [showConnections, setShowConnections] = useState(false);
    const [isUserInTeam, setIsUserInTeam] = useState(false);

    const [InTeamStatus, setInTeamStatus] = useState(false);
    const [team, setTeam] = useState(null);
    const [members, setMembers] = useState([]);

    const hasFetched = useRef(false);

    const fetchMemberProfiles = useCallback(async (memberIds) => {
        try {
            const memberRequests = memberIds.map(id =>
                fetch(`${API_URL}/profile/${id}`, {
                    headers: { Authorization: localStorage.getItem("token")
                    },
                }).then(res => res.ok ? res.json() : null)
            );

            const profiles = await Promise.all(memberRequests);
            setMembers(profiles.filter(Boolean)); // Убираем null-значения
        } catch (error) {
            console.error("Ошибка загрузки участников:", error);
        }
    }, []);

    const checkIfUserInTeam = useCallback(async () => {
        if (!user?.userId) return;

        try {
            const response = await fetch(`${API_URL}/teams/check-is-user-already-in-team?userId=${user.userId}`, {
                headers: { Authorization: localStorage.getItem("token") },
            });

            if (!response.ok) throw new Error("Ошибка проверки статуса пользователя");

            const isInTeam = await response.json(); // Предполагаем, что бэкенд возвращает `true` или `false`
            setIsUserInTeam(isInTeam);
        } catch (error) {
            console.error("Ошибка проверки пользователя в команде:", error);
        }
    }, [user?.userId]);


    const fetchConnections = useCallback(async () => {
        if (!user?.userId) return;
        try {
            const response = await fetch(`${API_URL}/connections/my-connections?userId=${user?.userId}`, {
                headers: { Authorization: localStorage.getItem("token") },
            });
            if (!response.ok) throw new Error("Ошибка загрузки коннекшнов");

            const data = await response.json();
            setConnections(data);
        } catch (error) {
            console.error("Ошибка при загрузке коннекшнов:", error);
        }
    }, [user?.userId]);


    const fetchTeamDetails = useCallback(async () => {
        if (!id || hasFetched.current) return;
        hasFetched.current = true
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


    const handleJoinRequest = async () => {
        if (!user) return alert("Вы не авторизованы!");

        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Ошибка: нет токена");

            const response = await fetch(`${API_URL}/teams/send-join-request?senderId=${user.userId}&receiverId=${id}`, {
                method: "POST",
                headers: { Authorization: token },
            });

            if (!response.ok) throw new Error("Ошибка при отправке запроса");
            const data = await response.text();
            if (data === "Request already pending") {
                setStatus("PENDING")
            }
            alert("Request to join successfully sent!");
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
            checkIfUserInTeam();

        }
    }, [user?.userId]);


    const handleInvite = async (receiverId) => {
        if (!user) return alert("Вы не авторизованы!");

        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Ошибка: нет токена");

            const response = await fetch(`${API_URL}/teams/send-invite?senderId=${user.userId}&receiverId=${receiverId}`, {
                method: "POST",
                headers: { Authorization: token },
            });

            if (!response.ok) throw new Error("Ошибка при отправке инвайта");
            alert("Приглашение успешно отправлено!");
        } catch (error) {
            console.error("Ошибка:", error);
        }
    };

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
                        <Link className="link-owner" to={`/profile/${team.owner.userId}`}>{team.owner.personalInfo.name} {team.owner.personalInfo.surname}</Link>

                        <ul className="team-members">
                            {team.members.length > 1 ? (
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
                                            <p>
                                                Loading...
                                            </p>)}
                                    </li>
                                ))
                            ) : (
                                <p className="no-members">Пока нет участников</p>
                            )}
                            <li className="team-member">
                                <button onClick={() => setShowConnections(!showConnections)} className="invite-button">Invite</button>{showConnections && (
                                <div className="dropdown">
                                    {connections.length > 0 ? (
                                        connections.map((conn) => (
                                            <>
                                            <Link key={conn.userId} to={`/profile/${conn.userId}`} className="dropdown-item">
                                                {conn.personalInfo.name} {conn.personalInfo.surname}
                                            </Link>
                                            <button onClick={() => handleInvite(conn.userId)}>+</button>
                                            </>
                                        ))
                                    ) : (
                                        <p className="dropdown-item">No connections found</p>
                                    )}
                                </div>
                            )}
                            </li>
                        </ul>

                        {!members.some(member => member.userId === user?.userId) && (
                            status === "PENDING" ? (
                                <button className="bg-yellow-400 text-white px-4 py-2 rounded" disabled>
                                    ⏳ Request Sent
                                </button>
                            ) : status === null ? (
                                <button
                                    onClick={() => {
                                        handleJoinRequest();
                                        setStatus("PENDING");
                                    }}
                                    className="join-button"
                                >
                                    Подать заявку
                                </button>
                            ) : null
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
