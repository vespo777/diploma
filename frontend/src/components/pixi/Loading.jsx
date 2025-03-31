import React from "react";
import "./LoadingRabbit.css";

const LoadingRabbit = () => {
    return (
        <div className="loading-container">
            <div className="spinner-container">
                <div className="spinner"></div>
                <div className="loading-text">Loading...</div>
            </div>
        </div>
    );
};

export default LoadingRabbit;
