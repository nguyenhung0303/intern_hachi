"use client";

import TestAPI from "@/components/testapi";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/components/context/AuthContext";
import { useRouter } from "next/navigation";
import ProductTable from "@/components/admin/product"
import Category from "@/components/admin/category"

export default function Home() {
    const router = useRouter();
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        if (user === null) return; // Đợi user load xong

        setLoading(false);
        if (!user || user.role !== "admin") {
            router.push("/");
        }
    }, [user, router]);

    if (loading) return <p>Đang kiểm tra quyền truy cập...</p>;

    return (
        <div>
            <ProductTable />
        </div>
    );
}
