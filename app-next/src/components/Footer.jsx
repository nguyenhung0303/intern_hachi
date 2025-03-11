"use client";

import React from "react";

const Footer = () => {
    return (
        <footer>
            <div className="container">
                <div className="about">
                    <div className="about-box">
                        {/* Left Section */}
                        <div className="about-left">
                            <h2>STAY UP TO DATE ABOUT OUR LATEST OFFERS</h2>
                        </div>

                        {/* Right Section */}
                        <div className="about-right">
                            <div className="ip-about">
                                <img src="/assets/img/mail.svg" alt="Mail Icon" />
                                <input type="text" placeholder="Enter your email address" />
                            </div>
                            <button className="product-button banner-button about-button">
                                Subscribe to Newsletter
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="box-footer">
                    <div className="footer-main">
                        {/* SHOP.CO Section */}
                        <div className="footer-main-item-one">
                            <h2>SHOP.CO</h2>
                            <p>We have clothes that suit your style and which you’re proud to wear. From women to men.</p>
                            <div className="footer-main-item-icon">
                                <img src="/assets/img/tw.svg" alt="Twitter Icon" />
                                <img src="/assets/img/tw.svg" alt="Twitter Icon" />
                                <img src="/assets/img/tw.svg" alt="Twitter Icon" />
                                <img src="/assets/img/tw.svg" alt="Twitter Icon" />
                            </div>
                        </div>

                        {/* Company Section */}
                        <div className="footer-main-item">
                            <h2>Company</h2>
                            <ul className="footer-main-item-menu">
                                <li><p>About</p></li>
                                <li><p>Features</p></li>
                                <li><p>Works</p></li>
                                <li><p>Career</p></li>
                            </ul>
                        </div>

                        {/* Help Section */}
                        <div className="footer-main-item">
                            <h2>HELP</h2>
                            <ul className="footer-main-item-menu">
                                <li><p>Customer Support</p></li>
                                <li><p>Delivery Details</p></li>
                                <li><p>Terms & Conditions</p></li>
                                <li><p>Privacy Policy</p></li>
                            </ul>
                        </div>

                        {/* FAQ Section */}
                        <div className="footer-main-item">
                            <h2>FAQ</h2>
                            <ul className="footer-main-item-menu">
                                <li><p>Account</p></li>
                                <li><p>Manage Deliveries</p></li>
                                <li><p>Orders</p></li>
                                <li><p>Payments</p></li>
                            </ul>
                        </div>

                        {/* Resources Section */}
                        <div className="footer-main-item">
                            <h2>RESOURCES</h2>
                            <ul className="footer-main-item-menu">
                                <li><p>Free eBooks</p></li>
                                <li><p>Development Tutorial</p></li>
                                <li><p>How to - Blog</p></li>
                                <li><p>Youtube Playlist</p></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
