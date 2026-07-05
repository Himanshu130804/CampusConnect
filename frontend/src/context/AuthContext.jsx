import React, { createContext, useEffect, useState } from "react";
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  useEffect(() => { const saved = localStorage.getItem("campus_user"); if (saved) setUser(JSON.parse(saved)); }, []);
  const login = (data) => { localStorage.setItem("campus_token", data.token); localStorage.setItem("campus_user", JSON.stringify(data)); setUser(data); };
  const logout = () => { localStorage.removeItem("campus_token"); localStorage.removeItem("campus_user"); setUser(null); };
  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};
export default AuthProvider;
