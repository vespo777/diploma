import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import "../../styles/Extensions.css"

import happypng from "../../imgs/happy.png"
import sadpng from "../../imgs/sad.png"


export default function WalkingAssistant() {
    const [position] = useState({ x: 800, y: 50 });
    const [mood, setMood] = useState("happy"); // "happy" или "sad"
    const [idleTime, setIdleTime] = useState(0);

    // Обновляем idleTime каждую секунду
    useEffect(() => {
        const idleInterval = setInterval(() => {
            setIdleTime((prev) => prev + 1);
        }, 1000);

        return () => clearInterval(idleInterval);
    }, []);

    // Если прошло 10+ секунд без кликов → становится грустным
    useEffect(() => {
        if (idleTime >= 10) setMood("sad");
    }, [idleTime]);

    // Клик возвращает помощника в "happy" и сбрасывает idleTime
    const handleClick = useCallback(() => {
        setMood("happy");
        setIdleTime(0);
    }, []);

    return (
        <motion.div
            onClick={handleClick}
            className="assistant"
            animate={{ x: position.x, y: position.y }}
            transition={{ type: "spring", stiffness: 50 }}
            style={{
                position: "absolute",
                width: "80px",
                height: "80px",
                cursor: "pointer",
                zIndex: 100,
            }}
        >
            <img
                src={mood === "happy" ? happypng : sadpng}
                alt="Assistant"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
        </motion.div>
    );
}
