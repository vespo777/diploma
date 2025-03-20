import { useState, useEffect } from "react";

const API_URL = "http://localhost:8080"; // Твой бэкенд

const ConnectionButton = ({ currentUserId, otherUserId }) => {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!currentUserId || !otherUserId) return;

        const controller = new AbortController();
        const signal = controller.signal;

        (async () => {
            try {
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
                const data = await res.json();
                setStatus(data);
            } catch (error) {
                if (error.name === "AbortError") return; // Если запрос отменён — игнорируем ошибку
                console.error("Ошибка при проверке статуса:", error);
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
            {status === true ? (
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
