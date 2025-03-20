import { useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { jwtDecode } from "jwt-decode";

const useAuthCheck = () => {
    const { logout } = useContext(AuthContext);
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const currentTime = Date.now() / 1000;

                if (decoded.exp < currentTime) {
                    logout();
                }
            } catch (error) {
                console.error("Ошибка при декодировании токена:", error);
                logout();
            }
        }
    }, [logout]);
};

export default useAuthCheck;
