"use client";

import Link from "next/link";
import "@/css/layoutdash.css";

export default function Header() {
    return (
        <header className="sidebar">
            <Link href={"/"}><div className="logo">ADMIN</div></Link>
            <nav>
                <ul className="menu">
                    <li>
                        <Link href="/">Home</Link>
                    </li>
                    <li>
                        <Link href="/dash">Product</Link>
                    </li>
                    <li>
                        <Link href="/dash/category">Category</Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
}