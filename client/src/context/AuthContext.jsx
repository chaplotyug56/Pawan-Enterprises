import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }

    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [user, token]);

  const login = async (identifier, password) => {
    const res = await api.post("/users/login", {
      identifier,
      password,
    });

    setUser(res.data.user);
    setToken(res.data.token);

    return res.data;
  };

  const firebaseAuth = async (firebaseToken) => {
    const res = await api.post("/users/firebase-auth", {
      token: firebaseToken,
    });
    setUser(res.data.user);
    setToken(res.data.token);
    return res.data;
  };

  const register = async (data) => {
    const res = await api.post("/users/register", data);

    return res.data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        firebaseAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
