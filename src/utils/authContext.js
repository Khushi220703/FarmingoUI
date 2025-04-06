import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("farmingoToken") ? true : false;
  });

  const login = (token) => {
    localStorage.setItem("farmingoToken", token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("farmingoToken");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
