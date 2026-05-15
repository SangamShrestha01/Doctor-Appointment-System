import React, { createContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // ================= INIT FROM LOCALSTORAGE =================
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("authToken");

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ================= LOGIN =================
  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    setIsAuthenticated(true);

    localStorage.setItem("authToken", authToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // ================= LOGOUT =================
  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);

    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  };

  // ✅ NEW: Update user in context + localStorage after profile edit
  const updateUser = (updatedFields) => {
    const updatedUser = { ...user, ...updatedFields };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        logout,
        updateUser, // ✅ expose to components
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;