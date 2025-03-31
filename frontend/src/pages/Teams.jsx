import React, { useEffect, useState, useRef, useCallback} from "react";
import {Link, useNavigate} from "react-router-dom";
import { motion } from 'framer-motion';

import "../styles/addListingPage.css";

const API_URL = 'http://localhost:8080';

const TeamDetail = () => {
    const navigate = useNavigate();
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;

    const [userTeam, setUserTeam] = useState(null);
    const [allTeams, setAllTeams] = useState([]);


    const hasFetchedAllTeams = useRef(false);
    const hasFetchedUserTeam = useRef(false);

    const fetchMemberProfiles = useCallback(async (memberIds) => {
        try {
            const memberRequests = memberIds.map(id =>
                fetch(`${API_URL}/profile/${id}`, {
                    headers: { Authorization: localStorage.getItem("token") },
                }).then(res => res.ok ? res.json() : null)
            );

            const profiles = await Promise.all(memberRequests);
            return profiles.filter(Boolean);
        } catch (error) {
            console.error("Ошибка загрузки участников:", error);
            return [];
        }
    }, []);



    const fetchUserTeam = useCallback(async () => {
        if (!user?.userId || hasFetchedUserTeam.current) return;

        try {
            const response = await fetch(`http://localhost:8080/teams/get-team-by-userId?userId=${user?.userId}`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    Authorization: localStorage.getItem("token"),
                }
            });

            if (!response.ok) {
                console.log(response);
            }
            const data = await response.json();
            setUserTeam(data);
            hasFetchedUserTeam.current = true;
            if (data && data.members) {
                const memberProfiles = await fetchMemberProfiles(data.members);
                setUserTeam({ ...data, memberProfiles });
            }
        } catch (error) {
            console.log(error);
        }
    }, [user?.userId, fetchMemberProfiles]);




    const fetchAllTeams = useCallback(async () => {
        if (hasFetchedAllTeams.current) return;

        hasFetchedAllTeams.current = true;
        try {
            const response = await fetch(`${API_URL}/teams/get-all-teams`, {
                headers: { Authorization: localStorage.getItem("token") },
            });

            if (response.ok) {
                const data = await response.json();

                const teamsWithMembers = await Promise.all(
                    Object.values(data).map(async (team) => {
                        const memberProfiles = await fetchMemberProfiles(team.members);
                        return { ...team, memberProfiles };
                    })
                );

                setAllTeams(teamsWithMembers);
            }
        } catch (error) {
            console.error("Ошибка при загрузке списка команд:", error);
        }
    }, [fetchMemberProfiles]);



    useEffect(() => {
        if (!user) {
            navigate("/login");
        } else {
            fetchAllTeams();
            fetchUserTeam();
        }
    }, [user, navigate, fetchAllTeams, fetchUserTeam]);


    return (
        <div className="auth-container">
            <motion.div
                className="auth-box listing-box"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {userTeam && userTeam.name ? (
                    <>
                        <h2>Ваша команда: {userTeam.name}</h2>
                        <div className="all-teams">
                            <ul className="team-details">
                                {userTeam.members && userTeam.members.length > 1 ? (
                                    userTeam.members.map((member, index) => (
                                        <li key={index} className="team-member">
                                            <p>{member.personalInfo?.name} {member.personalInfo?.surname}</p>
                                            <i>{member.socialDetails?.profession}</i>
                                        </li>
                                    ))


                                ) : (
                                    <p className="no-members">Пока нет участников</p>
                                )}
                                <Link to={`/teams/${user.userId}`}>Посмотреть команду</Link>
                            </ul>
                        </div>
                    </>
                ) : (
                    <p>Вы не состоите в команде</p>
                )}
                        <h1>All Teams</h1>
                        <ul className="all-teams">
                            {allTeams.map((team) => (
                                <li className="team-details" key={team.id}>
                                    <h3 className="link-owner">{team.name}</h3>

                                    <ul className="team-members">
                                        {team.memberProfiles.length > 0 ? (
                                            team.memberProfiles.map((member, index) => (
                                                <li key={index} className="team-member">
                                                    <p>{member.personalInfo?.name} {member.personalInfo?.surname}</p>
                                                    <i>{member.socialDetails?.profession}</i>
                                                </li>
                                            ))
                                        ) : (
                                            <p className="no-members">Нет участников</p>
                                        )}
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
