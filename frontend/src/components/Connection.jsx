import { useState, useEffect } from "react";
import LoadingRabbit from "./pixi/Loading";
import "../styles/Connection.css"





const API_URL = "http://localhost:8080";

const ConnectionButton = ({ currentUserId, otherUserId }) => {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!currentUserId || !otherUserId) return;
        if (!currentUserId) {
            setStatus(null);
        }

        const controller = new AbortController();
        const signal = controller.signal;

        (async () => {
            try {
                setLoading(true);
                const res = await fetch(
                    `${API_URL}/connections/is-connected?userId1=${currentUserId}&userId2=${otherUserId}`,
                    {
                        headers: {
                            Authorization: `${localStorage.getItem("token")}`,
                        },
                        signal,
                    }
                );
                if (!res.ok) throw new Error(`Ошибка проверки статуса: ${res.status}`);

                const data = await res.text();
                setStatus(data.split(": ")[1]);

            } catch (error) {
                if (error.name === "AbortError") return;
                console.error("Ошибка при проверке статуса:", error);
            }finally{
                setLoading(false);
            }
        })();


        return () => controller.abort(); // Отмена запроса при изменении зависимостей
    }, [currentUserId, otherUserId]);


    const sendRequest = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/connections/send?senderId=${currentUserId}&receiverId=${otherUserId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${localStorage.getItem("token")}`,
                },
            });

            if (!response.ok) throw new Error("Ошибка при обработке запроса");
            setStatus("PENDING");
        } catch (error) {
            console.error("Ошибка при отправке запроса:", error);
        } finally {
            setLoading(false);
        }
    };

    const answerRequest = async (accepted) => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/connections/answer`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ userId: otherUserId, accepted }),
            });

            if (!res.ok) throw new Error("Ошибка при ответе на запрос");
            setStatus(accepted ? "connected" : "none");
        } catch (error) {
            console.error("Ошибка при ответе на запрос:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) <LoadingRabbit />;

    return (
        <div className="connection-section">
            {status === "ACCEPTED" ? (
                <button className="mdc-button mdc-button--raised" disabled>
                    <span className="mdc-button__label">✔ Connected</span>
                </button>
            ) : status === "PENDING" ? (
                <button className="bg-yellow-400 text-white px-4 py-2 rounded" disabled>
                    ⏳ Request Sent
                </button>
            ) : status === "RECEIVED" ? (
                <div>
                    <button
                        onClick={() => answerRequest(true)}
                        className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                        disabled={loading}
                    >
                        ✅ Accept
                    </button>
                    <button
                        onClick={() => answerRequest(false)}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                        disabled={loading}
                    >
                        ❌ Decline
                    </button>
                </div>
            ) : (
                <button
                    onClick={sendRequest}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    disabled={loading}
                >
                    ➕  Connect
                </button>
            )}
        </div>
    );
};

export default ConnectionButton;
