"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Header = () => {
    const router = useRouter();
    const [showDropdown, setShowDropdown] = useState(false);
    const [showMenuDropdown, setShowMenuDropdown] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const dropdownRef = useRef(null);
    const menuDropdownRef = useRef(null);

    // Check if user is logged in when component mounts
    useEffect(() => {
        const token = localStorage.getItem("access_token");
        setIsLoggedIn(!!token);
    }, []);

    const handleLogOut = () => {
        localStorage.removeItem("access_token");
        setIsLoggedIn(false);
        router.replace("/");
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
            if (menuDropdownRef.current && !menuDropdownRef.current.contains(event.target)) {
                setShowMenuDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <header>
            <div className="container">
                <div className="header-h">
                    <div
                        className="menu-tag"
                        onClick={() => setShowMenuDropdown(!showMenuDropdown)}
                        ref={menuDropdownRef}
                    >
                        <img src="/assets/img/3-line.svg" alt="menu tag" />

                        {showMenuDropdown && (
                            <div className="menu-dropdown">
                                <ul>
                                    <li><Link href="/">Home</Link></li>
                                    <li><Link href="/ProductP">Product</Link></li>
                                </ul>
                            </div>
                        )}
                    </div>
                    <div className="header-logo">
                        <Link href="/">
                            <img src="/assets/img/SHOP.CO.png" alt="Shop Logo" />
                        </Link>
                    </div>
                    <div className="header-menu">
                        <nav className="menu-item">
                            <ul>
                                <li>Shop</li>
                                <li>On Sale</li>
                                <li><Link href="/ProductP">Product</Link></li>
                                <li>Category</li>
                            </ul>
                        </nav>
                    </div>
                    <div className="header-search">
                        <div className="search-container">
                            <img className="search-icon" src="/assets/img/search.svg" alt="Search Icon" />
                            <input className="search-input" type="text" placeholder="Search..." />
                        </div>
                    </div>
                    <div className="header-icon">
                        <div>
                            <img className="icon-search" src="/assets/img/icon-shear-b.svg" alt="Shears Icon" />
                        </div>
                        <div>
                            <img src="/assets/img/cart.svg" alt="Cart Icon" />
                        </div>

                        <div className="account-dropdown-container" ref={dropdownRef}>
                            <div
                                onClick={() => setShowDropdown(!showDropdown)}
                                style={{ cursor: "pointer", position: "relative" }}
                                className="account-icon-wrapper"
                            >
                                <img src="/assets/img/accout.svg" alt="Account Icon" />
                                {isLoggedIn && <span className="admin-hint">Admin</span>}
                            </div>

                            {showDropdown && (
                                <div className="account-dropdown">
                                    <ul>
                                        {isLoggedIn ? (
                                            <>
                                                <li><Link href="/profile">Profile</Link></li>
                                                <li><Link href="/dash">Admin</Link></li>
                                                <li onClick={handleLogOut}>Logout</li>
                                            </>
                                        ) : (
                                            <li><Link href="/login">Login</Link></li>
                                        )}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;