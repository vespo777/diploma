import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import styles from "../styles/ProfilePage.module.css";  // Import as CSS module
import avatarImage from "../imgs/download.png";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const ProfilePage = () => {
  // console.log("ProfilePage loaded");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  if (!user) return <p>Loading...</p>;

  return (
    <motion.div 
      className={styles["profile-container"]}  // Use styles object
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1>User Profile</h1>
      <motion.div 
        className={styles["profile-card"]}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <img 
          src={avatarImage} 
          alt="Avatar" 
          className={styles.avatar}
        />
        <h2>{user.name}</h2>
        <p>Email: {user.email}</p>
      </motion.div>
    </motion.div>
  );
};

export default ProfilePage;
