import { useNavigate } from 'react-router-dom';
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();
const API_URL = 'http://localhost:8080';

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // При загрузке приложения проверяем localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (storedUser && token && userId) {
      setUser(JSON.parse(storedUser));
    } else {
      // Clear everything if either token or user is missing
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Login failed');
      }

      const token = await response.text();
      // Убираем префикс Bearer перед сохранением
      const cleanToken = token.replace(/^Bearer\s+/i, '');
      console.log('Clean token:', cleanToken); // Debug log

      const userObject = {
        email: email,
        userId: null
      };

      localStorage.setItem('token', cleanToken); // Сохраняем чистый токен
      localStorage.setItem('user', JSON.stringify(userObject));

      setUser(userObject);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const requestData = {
        name: userData.name,
        surname: userData.surname,
        email: userData.email,
        rawPassword: userData.rawPassword
      };

      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Registration failed');
      }

      const data = await response.json();
      
      // Сразу делаем логин после регистрации
      const loginResponse = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: userData.email,
          password: userData.rawPassword
        }),
      });

      if (!loginResponse.ok) {
        throw new Error('Auto login after registration failed');
      }

      const token = await loginResponse.text();
      const cleanToken = token.replace(/^Bearer\s+/i, '');

      // Создаем объект пользователя с userId из регистрации
      const userObject = {
        email: userData.email,
        userId: data.userId
      };

      // Сохраняем данные
      localStorage.setItem('token', cleanToken);
      localStorage.setItem('user', JSON.stringify(userObject));
      localStorage.setItem('userId', data.userId.toString());

      // Проверяем сохраненные данные
      console.log('Stored after registration:', {
        token: cleanToken,
        user: userObject,
        userId: data.userId
      });

      setUser(userObject);
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
