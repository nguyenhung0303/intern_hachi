// pages/products/index.js
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

// Dữ liệu sản phẩm mẫu
const productData = [
    {
        id: 1,
        name: "T-SHIRT WITH TAPE DETAILS",
        image: "/assets/img/product/Frame 32.png",
        rating: "1/5",
        price: 240,
        oldPrice: 260,
        discount: 20,
        category: "xuan"
    },
    {
        id: 2,
        name: "SLIM FIT JEANS",
        image: "/assets/img/product/Frame 32.png",
        rating: "2/5",
        price: 180,
        oldPrice: 200,
        discount: 10,
        category: "ha"
    },

];

// Số sản phẩm mỗi trang
const ITEMS_PER_PAGE = 4;

export default function ProductPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredProducts, setFilteredProducts] = useState(productData);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [totalPages, setTotalPages] = useState(Math.ceil(productData.length / ITEMS_PER_PAGE));

    // Lọc sản phẩm theo danh mục
    useEffect(() => {
        if (selectedCategory) {
            const filtered = productData.filter(product => product.category === selectedCategory);
            setFilteredProducts(filtered);
            setTotalPages(Math.ceil(filtered.length / ITEMS_PER_PAGE));
            setCurrentPage(1); // Reset về trang 1 khi thay đổi bộ lọc
        } else {
            setFilteredProducts(productData);
            setTotalPages(Math.ceil(productData.length / ITEMS_PER_PAGE));
        }
    }, [selectedCategory]);

    // Tính toán sản phẩm hiển thị trên trang hiện tại
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

    // Xử lý thay đổi trang
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0); // Cuộn về đầu trang khi chuyển trang
    };

    // Xử lý chọn danh mục
    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    return (
        <>
            <Head>
                <title>Products</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>
            <div className="container">
                <div className="product-page-box">
                    <div className="product-filter">
                        <h2 className="header-filter">Filters</h2>
                        <div className="line-ft"></div>
                        <div className="filter-category-item">
                            <ul>
                                <li>
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleCategoryChange('xuan');
                                        }}
                                        className={selectedCategory === 'xuan' ? 'active' : ''}
                                    >
                                        Xuân
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleCategoryChange('ha');
                                        }}
                                        className={selectedCategory === 'ha' ? 'active' : ''}
                                    >
                                        Hạ
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleCategoryChange('thu');
                                        }}
                                        className={selectedCategory === 'thu' ? 'active' : ''}
                                    >
                                        Thu
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="line-ft"></div>
                    </div>
                    <div className="product-box">
                        <div className="product product-p">
                            {currentItems.length > 0 ? (
                                currentItems.map((product) => (
                                    <ProductItem key={product.id} product={product} />
                                ))
                            ) : (
                                <div className="product-empty">Không tìm thấy sản phẩm phù hợp</div>
                            )}
                        </div>
                        <div className="line-ft"></div>
                        {filteredProducts.length > 0 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

// Components/ProductItem.js
function ProductItem({ product }) {
    return (
        <div className="product-item product-item-page">
            <Image
                src={product.image}
                alt={product.name}
                width={250}
                height={250}
            />
            <div className="froduct-name">{product.name}</div>
            <div className="froduct-rate">
                <span className="rate-start">
                    <Image src="/assets/img/start.svg" alt="Rating" width={16} height={16} />
                </span>
                <span className="rate-number">{product.rating}</span>
            </div>
            <div className="froduct-price">
                <span className="price-new">${product.price}</span>
                <span className="price-old">${product.oldPrice}</span>
                <span className="sale">-{product.discount}%</span>
            </div>
        </div>
    );
}

// Components/Pagination.js
function Pagination({ currentPage, totalPages, onPageChange }) {
    // Tạo mảng các số trang để hiển thị
    const getPageNumbers = () => {
        const pageNumbers = [];
        pageNumbers.push(1);
        if (currentPage > 3) {
            pageNumbers.push('...');
        }
        if (currentPage > 2 && currentPage < totalPages) {
            pageNumbers.push(currentPage - 1);
        }
        if (currentPage !== 1 && currentPage !== totalPages) {
            pageNumbers.push(currentPage);
        }
        if (currentPage < totalPages - 1 && currentPage !== 1) {
            pageNumbers.push(currentPage + 1);
        }
        if (currentPage < totalPages - 2) {
            pageNumbers.push('...');
        }
        if (totalPages > 1) {
            pageNumbers.push(totalPages);
        }
        return pageNumbers;
    };

    return (
        <div className="pagination">
            <button
                className="arrow"
                title="Previous"
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
                Previous
            </button>

            {getPageNumbers().map((pageNumber, index) => (
                pageNumber === '...' ? (
                    <span key={`dots-${index}`} className="dots">...</span>
                ) : (
                    <button
                        key={pageNumber}
                        className={`page-number ${currentPage === pageNumber ? 'active' : ''}`}
                        onClick={() => onPageChange(pageNumber)}
                    >
                        {pageNumber}
                    </button>
                )
            ))}

            <button
                className="arrow"
                title="Next"
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
            >
                Next
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            </button>
        </div>
    );
}