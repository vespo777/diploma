import { React } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles/HomePage.css';
import '../styles/HelpPage.css';

const Help = () => {
    return (
        <div className="home-container">
            {/* Hero Section with a slight slide-down animation */}
            <div className="hero-section">
                <h1>Help &amp; Support</h1>
                <p>Get familiar with Teams, Apartment listings, and User connections.</p>
            </div>

            {/* Section explaining Teams and Connections */}
            <section className="teams-section">
                <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                >
                    Teams &amp; Connections
                </motion.h2>
                <div className="help-section-container">
                    <motion.div
                        className="help-info-card"
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h3>What is a Team?</h3>
                        <p>
                            A <strong>Team</strong> represents the group of roommates you currently live with.
                            Once you create or join a team, you’ll see your teammates’ profiles, share
                            apartment details, and manage household tasks together.
                        </p>
                    </motion.div>
                    <motion.div
                        className="help-info-card"
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h3>Inviting &amp; Joining Teammates</h3>
                        <p>
                            To invite someone into your team, visit your <strong>Team</strong> page and click
                            “Invite Member.” They’ll receive a notification to accept and become part of
                            your household. To join an existing team, use the unique team code shared by
                            your roommate.
                        </p>
                    </motion.div>
                    <motion.div
                        className="help-info-card"
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h3>Friend Connections</h3>
                        <p>
                            Besides roommates, you can build a network of friends through the <strong>Connections</strong> feature.
                            These aren’t tied to your living situation but let you chat, share recommendations, and
                            refer friends to apartments.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Section explaining Apartments */}
            <section className="apartments-section">
                <motion.h2
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                >
                    Apartments
                </motion.h2>
                <div className="help-section-container">
                    <motion.div
                        className="help-info-card"
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Link to={'/apartments'}>Apartments Page</Link>
                        <p>
                            On the Apartments page, you’ll find all available listings where roommates
                            are needed. Browse by location, rent, and amenities. When you find a suitable listing,
                            click “Request to Join” to connect with the current residents.
                        </p>
                    </motion.div>
                    <motion.div
                        className="help-info-card"
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h3>Posting an Apartment</h3>
                        <p>
                            If you have a free room, go to “Add an Announcement” and fill in details like rent,
                            utilities, house rules, and preferences. Once published, potential roommates will see
                            your listing and can send join requests.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Section explaining User Connections */}
            <section className="users-section">
                <motion.h2
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                >
                    User Connections
                </motion.h2>
                <div className="help-section-container">
                    <motion.div
                        className="help-info-card"
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Link to={'/roommates'}>Roommates Page</Link>
                        <p>
                            The Roommates page recommends users with similar profiles and interests based
                            on your questionnaire results. You can send a friend request to start chatting or invite
                            them to join an apartment listing.
                        </p>
                    </motion.div>
                    <motion.div
                        className="help-info-card"
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h3>How Matching Works</h3>
                        <p>
                            After registration, you complete a quick personality and lifestyle survey. Our
                            matching algorithm then suggests users and apartments that align with your habits,
                            budget, and preferences, ensuring a comfortable living situation.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Contact Support Section */}
            <section className="contact-section">
                <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                >
                    Contact Support
                </motion.h2>
                <div className="help-section-container">
                    <motion.div
                        className="help-solution-card"
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h3>Email Support</h3>
                        <p>support@roommates.com</p>
                    </motion.div>
                    <motion.div
                        className="help-solution-card"
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h3>Phone Support</h3>
                        <p>+7 999 999 99 99</p>
                    </motion.div>
                    <motion.div
                        className="help-solution-card"
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h3>Live Chat</h3>
                        <p>Available 24/7 via the chat icon at the bottom-right corner</p>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Help;
