import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const API_BASE = "http://localhost:2345/api/auth";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  // -------------------------------
  // REGISTER (REAL BACKEND)
  // -------------------------------
  const register = async (name, email, password, role) => {
    try {
      const body = {
        fullName: name,
        email: email,
        password: password
      };

      const res = await axios.post(`${API_BASE}/signup`, body);

      const userData = {
        userId: res.data.userId,
        email: res.data.email,
        fullName: res.data.fullName
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      return true;
    } catch (err) {
      console.error(err);
      throw new Error(err.response?.data || "Signup failed");
    }
  };

  // -------------------------------
  // LOGIN (REAL BACKEND)
  // -------------------------------
  const login = async (email, password) => {
    try {
      const body = { email, password };
      const res = await axios.post(`${API_BASE}/login`, body);

      const userData = {
        userId: res.data.userId,
        email: res.data.email,
        fullName: res.data.fullName
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
