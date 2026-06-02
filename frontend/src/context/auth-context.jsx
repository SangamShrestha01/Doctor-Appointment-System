import React, { createContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // ================= INIT =================
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("authToken");

      if (storedUser && storedToken) {
        const parsedUser = JSON.parse(storedUser);

        setUser(parsedUser);
        setToken(storedToken);
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error("Auth error:", err);
      localStorage.clear();
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

  // ================= UPDATE USER (FIXED IMAGE ISSUE) =================
  const updateUser = (updatedFields) => {
    setUser((prev) => {
      if (!prev) return prev;

      const merged = {
        ...prev,
        ...updatedFields,
      };

      // ✅ CLEAN IMAGE (remove old query params)
      const cleanImage = merged.image
        ? merged.image.split("?")[0]
        : null;

      // ✅ FORCE UI REFRESH WITH CACHE BUSTER
      const finalUser = {
        ...merged,
        image: cleanImage
          ? `${cleanImage}?t=${Date.now()}`
          : null,
      };

      // ✅ SAVE CLEAN VERSION TO LOCALSTORAGE (NO CACHE PARAM)
      const storageUser = {
        ...merged,
        image: cleanImage,
      };

      localStorage.setItem("user", JSON.stringify(storageUser));

      return finalUser;
    });
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
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;