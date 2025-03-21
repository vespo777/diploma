import React, {Component, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import { motion } from 'framer-motion';

import "../styles/addListingPage.css";


const API_URL = 'http://localhost:8080';

const Teams = () => {
    const navigate = useNavigate();
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;


    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);


    return (
        <div className="auth-container">
            <motion.div
                className="auth-box listing-box"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >

            </motion.div>
        </div>
    );

}


export default Teams;
