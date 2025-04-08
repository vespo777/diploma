import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoadingRabbit from "../components/pixi/Loading";
import { motion } from 'framer-motion';
import "../styles/addListingPage.css";

const API_URL = 'http://localhost:8080';

const TeamDetail = () => {
    const navigate = useNavigate();
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    const [loading, setLoading] = useState(true);
    const [userTeam, setUserTeam] = useState(null);
    const [allTeams, setAllTeams] = useState([]);
    const [error, setError] = useState(null);

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
            console.error("Error fetching member profiles:", error);
            return [];
        }
    }, []);

    const fetchUserTeam = useCallback(async () => {
        if (!user?.userId || hasFetchedUserTeam.current) return;

        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/teams/get-team-by-userId?userId=${user?.userId}`, {
                headers: { Authorization: localStorage.getItem("token") },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch user team");
            }

            const data = await response.json();
            if (data && data.members) {
                const memberProfiles = await fetchMemberProfiles(data.members);
                setUserTeam({ ...data, memberProfiles });
            }
            hasFetchedUserTeam.current = true;
        } catch (error) {
            console.error("Error fetching user team:", error);
            setError("Failed to load your team information");
        } finally {
            setLoading(false);
        }
    }, [user?.userId, fetchMemberProfiles]);

    const fetchAllTeams = useCallback(async () => {
        if (hasFetchedAllTeams.current) return;

        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/teams/get-all-teams`, {
                headers: { Authorization: localStorage.getItem("token") },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch teams");
            }

            const data = await response.json();
            const teamsWithMembers = await Promise.all(
                data.map(async (team) => {
                    const memberProfiles = await fetchMemberProfiles(team.members);
                    return { ...team, memberProfiles };
                })
            );

            setAllTeams(teamsWithMembers);
            hasFetchedAllTeams.current = true;
        } catch (error) {
            console.error("Error fetching all teams:", error);
            setError("Failed to load teams list");
        } finally {
            setLoading(false);
        }
    }, [fetchMemberProfiles]);

    useEffect(() => {
        if (!user) {
            navigate("/login");
        } else {
            Promise.all([fetchUserTeam(), fetchAllTeams()]).catch(error => {
                console.error("Error in useEffect:", error);
            });
        }
    }, [user, navigate, fetchAllTeams, fetchUserTeam]);

    if (loading) {
        return (
            <div className="loading-container">
                <LoadingRabbit ariaLabel="Loading team information" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="auth-container">
                <motion.div
                    className="auth-box listing-box"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="error-message">
                        <p>{error}</p>
                        <button onClick={() => window.location.reload()} className="retry-button">
                            Try Again
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <motion.div
                className="auth-box listing-box"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="team-section">
                    <h2>Your Team</h2>
                    {userTeam ? (
                        <div className="team-card">
                            <h3 className="team-name">{userTeam.name}</h3>
                            <div className="team-members">
                                <h4>Members:</h4>
                                <ul>
                                    {userTeam.memberProfiles.map((member, index) => (
                                        <li key={index} className="member-item">
                                            <Link to={`/profile/${member.userId}`} className="member-link">
                                                {member.personalInfo?.name} {member.personalInfo?.surname}
                                            </Link>
                                            <span className="member-profession">{member.socialDetails?.profession}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <Link to={`/teams/${userTeam.id}`} className="view-team-button">
                                View Team Details
                            </Link>
                        </div>
                    ) : (
                        <div className="no-team">
                            <p>You're not currently in a team</p>
                            <Link to="/teams/create" className="create-team-button">
                                Create New Team
                            </Link>
                        </div>
                    )}
                </div>

                <div className="all-teams-section">
                    <h2>All Teams</h2>
                    {allTeams.length > 0 ? (
                        <ul className="teams-list">
                            {allTeams.map((team) => (
                                <li key={team.id} className="team-card">
                                    <h3 className="team-name">{team.name}</h3>
                                    <div className="team-members">
                                        <h4>Members ({team.memberProfiles.length}):</h4>
                                        <ul>
                                            {team.memberProfiles.slice(0, 3).map((member, index) => (
                                                <li key={index} className="member-item">
                                                    <Link to={`/profile/${member.userId}`} className="member-link">
                                                        {member.personalInfo?.name} {member.personalInfo?.surname}
                                                    </Link>
                                                </li>
                                            ))}
                                            {team.memberProfiles.length > 3 && (
                                                <li className="more-members">+{team.memberProfiles.length - 3} more</li>
                                            )}
                                        </ul>
                                    </div>
                                    <Link to={`/teams/${team.id}`} className="view-team-button">
                                        View Team
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="no-teams">No teams found</p>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default TeamDetail;
