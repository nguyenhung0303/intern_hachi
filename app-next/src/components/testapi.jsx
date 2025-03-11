"use client"; // Cần thêm dòng này để dùng useEffect và useState

import { useContext, useEffect, useState } from "react";
import axios from "../util/axio.custiomzie";
import { AuthContext } from "./context/AuthContext";
export default function TestAPI() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { user } = useContext(AuthContext)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/v1/api/`);
                setData(response);
                console.log("checkk>>>resoxi", response)
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <p>Đang tải dữ liệu...</p>;
    if (error) return <p>Lỗi: {error}</p>;

    return (
        <div>
            <h1>Dữ liệu từ API:</h1>
            {user ? <h1>Xin chào, {user.name}!</h1> : <h1>Bạn chưa đăng nhập</h1>}
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
}
