"use client";

import React, { useContext } from "react";
import { useRouter } from "next/navigation";

const Header = () => {

    const router = useRouter();
    const handelLogOut = () => {
        localStorage.removeItem("access_token");
        router.replace("/login");
    };
    return (
        <header>
            <div className="container">
                <div className="header-h">
                    <div className="menu-tag">
                        <img src="/assets/img/3-line.svg" alt="menu tag" />
                    </div>
                    <div className="header-logo">
                        <img src="/assets/img/SHOP.CO.png" alt="Shop Logo" />
                    </div>
                    <div className="header-menu">
                        <nav className="menu-item">
                            <ul>
                                <li>Shop</li>
                                <li>On Sale</li>
                                <li>Product</li>
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

                        <div onClick={handelLogOut} style={{ cursor: "pointer" }}>
                            <img src="/assets/img/accout.svg" alt="Account Icon" />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
