import React, {Component, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import WalkingAssistant from "../components/pixi/Extensions";

import "../styles/AncetaPage.css";


const API_URL = 'http://localhost:8080';

const MLQPage = () => {
    const navigate = useNavigate();
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;


    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);


    return (
        <div className="page">
            <h1>ML Question</h1>

        </div>
    );

}


export default MLQPage;
