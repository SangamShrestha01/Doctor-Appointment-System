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
        const parsed = JSON.parse(storedUser);

        // ✅ On load, append a fresh ?t= so the browser doesn't serve
        // a cached image from a previous session
        if (parsed?.image) {
          parsed.image = `${parsed.image.split("?")[0]}?t=${Date.now()}`;
        }

        setUser(parsed);
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
    // ✅ Cache-bust image on login too
    const userWithFreshImage = { ...userData };
    if (userWithFreshImage?.image) {
      userWithFreshImage.image = `${userWithFreshImage.image.split("?")[0]}?t=${Date.now()}`;
    }

    setUser(userWithFreshImage);
    setToken(authToken);
    setIsAuthenticated(true);

    localStorage.setItem("authToken", authToken);
    // ✅ Save clean URL (no ?t=) to localStorage so it stays portable
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

  // ================= UPDATE USER =================
  const updateUser = (updatedFields) => {
    // ✅ Strip any old ?t= from image before merging
    const cleanFields = { ...updatedFields };
    if (cleanFields?.image) {
      cleanFields.image = cleanFields.image.split("?")[0];
    }

    // Save clean URL to localStorage (no timestamp — it would go stale)
    const userForStorage = { ...user, ...cleanFields };
    localStorage.setItem("user", JSON.stringify(userForStorage));

    // Keep cache-busted version in React state for the current session
    const userForState = { ...user, ...updatedFields };
    if (updatedFields?.image) {
      // Ensure the in-memory image always has a fresh ?t=
      userForState.image = `${cleanFields.image}?t=${Date.now()}`;
    }
    setUser(userForState);
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