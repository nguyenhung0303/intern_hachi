"use client";
import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {  // <== Đảm bảo export default ở đây
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser(decoded);
                console.log("check decoded>>>>>", decoded)
            } catch (error) {
                console.error("Lỗi khi giải mã token:", error);
            }
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}
