import { createContext, useContext, useState, useEffect } from "react";
import axios from 'axios';
import { BASE_URL } from "../config/url";

const UserAuthContext = createContext();

export const UserAuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyUser = async () => {
            const token = localStorage.getItem("token");
            const storedUser = localStorage.getItem("user");
            
            if (!token || !storedUser) {
                setLoading(false);
                return;
            }

            try {
                const res = await axios.get(`${BASE_URL}/auth/verifyToken`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                if (res.status === 200 && res.data.user) {
                    const verifiedUser = res.data.user;
                    if (verifiedUser.role === "admin") {
                        setUser(verifiedUser);
                        localStorage.setItem("user", JSON.stringify(verifiedUser));
                    } else {
                        // Not an admin, clear storage
                        localStorage.removeItem("user");
                        localStorage.removeItem("token");
                    }
                }
            } catch (error) {
                console.error("Token verification failed:", error);
                // Token invalid, clear storage
                localStorage.removeItem("user");
                localStorage.removeItem("token");
            } finally {
                setLoading(false);
            }
        };

        verifyUser();
    }, []);

    const login = async (email, password) => {
        try {
            const res = await axios.post(`${BASE_URL}/auth/login`, { email, password });
            if (res.status === 200) {
                const { user, token } = res.data;
                if (user.role !== "admin") {
                    return { success: false, message: "Access denied. Admins only." };
                }
                setUser(user);
                localStorage.setItem("user", JSON.stringify(user));
                localStorage.setItem("token", token);
                return { success: true };
            }
        } catch (error) {
            console.error("Login error:", error);
            return {
                success: false,
                message: error.response?.data?.message || "Login failed"
            };
        }
        return { success: false, message: "Unexpected error" };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };

    return (
        <UserAuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </UserAuthContext.Provider>
    );
};

export const useUserAuth = () => {
    return useContext(UserAuthContext);
};
