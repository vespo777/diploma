import React, { useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import { motion } from 'framer-motion';

import "../styles/addListingPage.css";


const API_URL = 'http://localhost:8080';

const Teams = () => {
    const navigate = useNavigate();
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;

    const [teamName, setTeamName] = useState("");
    const [members, setMembers] = useState([]);
    const [invitedUser, setInvitedUser] = useState("");


    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const handleCreateTeam = async () => {
        if (!teamName) return alert("Введите название команды");

        try {
            const response = await fetch(`${API_URL}/teams/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("token"),
                },
                body: JSON.stringify({ teamName, ownerId: user.userId }),
            });

            if (!response.ok) throw new Error("Ошибка при создании команды");

            alert("Команда создана!");
        } catch (error) {
            console.error("Ошибка:", error);
        }
    };

    const handleInviteUser = async () => {
        if (!invitedUser) return alert("Введите ID пользователя");

        try {
            const response = await fetch(`${API_URL}/teams/invite`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("token"),
                },
                body: JSON.stringify({ teamName, invitedUserId: invitedUser }),
            });

            if (!response.ok) throw new Error("Ошибка при приглашении");

            setMembers([...members, invitedUser]);
            setInvitedUser("");
            alert("Приглашение отправлено!");
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
                <h2 className="team-header">Создание команды</h2>

                <div className="team-form">
                    <input
                        type="text"
                        placeholder="Название команды"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        className="team-input"
                    />
                    <button onClick={handleCreateTeam} className="team-button">
                        Создать команду
                    </button>
                </div>

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
            </motion.div>
        </div>
    );

}


export default Teams;
