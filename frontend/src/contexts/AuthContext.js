import { createContext, useState } from "react";

export const AuthContext = createContext(null); // Создаём контекст

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({ name: "John Doe", email: "john@example.com" });

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
