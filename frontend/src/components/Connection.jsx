import { useState, useEffect } from "react";

const API_URL = "http://localhost:8080"; // Твой бэкенд

const ConnectionButton = ({ currentUserId, otherUserId }) => {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!currentUserId || !otherUserId) return;

        const fetchStatus = async () => {
            try {
                const res = await fetch(
                    `${API_URL}/connections/is-connected?userId1=${currentUserId}&userId2=${otherUserId}`,
                    {
                        headers: {
                            Authorization: `${localStorage.getItem("token")}`,
                        },
                    }
                );
                if (!res.ok) throw new Error("Ошибка проверки статуса");
                const data = await res.json();
                setStatus(data.status); // "connected", "pending", "received", "none"
            } catch (error) {
                console.error("Ошибка при проверке статуса:", error);
            }
        };

        fetchStatus();
    }, [currentUserId, otherUserId]);

    const sendRequest = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/connections/send`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ receiverId: Number(otherUserId), senderId: currentUserId }),
            });

            if (!res.ok) throw new Error("Ошибка при отправке запроса");
            setStatus("pending");
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

    return (
        <div>
            {status === "connected" ? (
                <button className="bg-gray-400 text-white px-4 py-2 rounded" disabled>
                    ✔ Connected
                </button>
            ) : status === "pending" ? (
                <button className="bg-yellow-400 text-white px-4 py-2 rounded" disabled>
                    ⏳ Request Sent
                </button>
            ) : status === "received" ? (
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
