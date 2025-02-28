import { jwtDecode } from "jwt-decode";


const getUserFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        const decoded = jwtDecode(token);
        return decoded; // Возвращает объект с данными пользователя
    } catch (error) {
        console.error("Invalid token", error);
        return null;
    }
};

export default getUserFromToken;
