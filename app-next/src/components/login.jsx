"use client";
import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { LoginApi } from "@/util/api";
import "@/css/login.css";
import { toast } from "react-toastify";


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const router = useRouter(); // Next.js router


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Reset lỗi trước khi gọi API

        try {
            const response = await LoginApi(email, password);
            console.log("check res>>>", response)
            if (response && response.EC == 0) {
                localStorage.setItem("access_token", response.access_token)

                toast.success("ok")

                if (response.user.role === "admin") {
                    router.push("/dash");
                } else {
                    router.push("/");
                }
            }

        } catch (err) {
            toast.error("errr")
            setError(err.response?.data?.message || "Lỗi đăng nhập!");
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input

                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input

                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
            <p>Don't have an account? <a href="/register">Register</a></p>
        </div>
    );
};

export default Login;
