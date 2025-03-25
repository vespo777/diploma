import React, { useEffect, useState, useRef, useCallback} from "react";
import {Link, useNavigate} from "react-router-dom";
import { motion } from 'framer-motion';

import "../styles/addListingPage.css";

const API_URL = 'http://localhost:8080';

const TeamDetail = () => {
    const navigate = useNavigate();
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;

    const [members, setMembers] = useState([]);
    const [invitedUser, setInvitedUser] = useState("");
    const [userTeam] = useState(null);
    const [allTeams, setAllTeams] = useState([]);

    const hasFetched = useRef(false);




    const fetchAllTeams = useCallback(async () => {
        if (hasFetched.current) return;

        hasFetched.current = true;
        try {
            const response = await fetch(`${API_URL}/teams/get-all-teams`, {
                headers: { Authorization: localStorage.getItem("token") },
            });

            if (response.ok) {
                const data = await response.json();
                setAllTeams(Object.values(data)); // Преобразуем объект в массив
            }
        } catch (error) {
            console.error("Ошибка при загрузке списка команд:", error);
        }
    }, []);



    const handleInviteUser = async () => {
        if (!invitedUser) return alert("Введите ID пользователя");

        try {
            const response = await fetch(`${API_URL}/teams/invite`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("token"),
                },
                body: JSON.stringify({ teamName: userTeam.teamName, invitedUserId: invitedUser }),
            });

            if (!response.ok) throw new Error("Ошибка при приглашении");

            setMembers([...members, invitedUser]);
            setInvitedUser("");
            alert("Приглашение отправлено!");
        } catch (error) {
            console.error("Ошибка:", error);
        }
    };


    useEffect(() => {
        if (!user) {
            navigate("/login");
        } else {
            fetchAllTeams();
        }
    }, [user, navigate, fetchAllTeams]);

    return (
        <div className="auth-container">
            <motion.div
                className="auth-box listing-box"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {userTeam ? (
                    <>
                        <h2 className="team-header">Ваша команда: {userTeam.teamName}</h2>

                        <h3 className="team-subheader">Участники</h3>
                        <ul className="team-members">
                            {members.length > 0 ? (
                                members.map((member, index) => (
                                    <li key={index} className="team-member">
                                        {member}
                                    </li>
                                ))
                            ) : (
                                <p className="no-members">Пока нет участников</p>
                            )}
                        </ul>

                        <h3 className="team-subheader">Пригласить пользователя</h3>
                        <div className="invite-form">
                            <input
                                type="text"
                                placeholder="Введите ID пользователя"
                                value={invitedUser}
                                onChange={(e) => setInvitedUser(e.target.value)}
                                className="invite-input"
                            />
                            <button onClick={handleInviteUser} className="invite-button">
                                Пригласить
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <h2 className="team-header">Все команды</h2>
                        <div className="team-form">

                        </div>
                    </>
                )}

                <ul className="all-teams">
                    {allTeams.map((team) => (
                        <li key={team.id}>
                            <h5>{team.name}</h5>

                            <ul className="team-members">
                                {team.members.map((member, index) => (
                                    <li key={index} className="team-member">
                                        {member.personalInfo.name} {member.personalInfo.surname}
                                    </li>
                                ))}
                            </ul>

                            <Link to={`/teams/${team.id}`}>Посмотреть команду</Link>
                        </li>
                    ))}
                </ul>

            </motion.div>
        </div>
    );
};

export default TeamDetail;
