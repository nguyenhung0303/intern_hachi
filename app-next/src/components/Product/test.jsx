// pages/products/index.js
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

// Fetch sản phẩm
const fetchProducts = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/Product`, {
            cache: "no-store",
            next: { revalidate: 0 },
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        console.log("check>>>respro", response);
        if (!response.ok) {
            throw new Error("Lỗi khi tải dữ liệu sản phẩm");
        }
        return response.json();
    } catch (error) {
        console.error("Lỗi fetch products:", error);
        return { data: [] };
    }
};

// Fetch categories
const fetchCategories = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/get_category`, {
            cache: "no-store",
            next: { revalidate: 0 },
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        console.log("check>>>rescat", response);
        if (!response.ok) {
            throw new Error("Lỗi khi tải dữ liệu danh mục");
        }
        return response.json();
    } catch (error) {
        console.error("Lỗi fetch categories:", error);
        return { data: [] };
    }
};

// Số sản phẩm mỗi trang
const ITEMS_PER_PAGE = 6;

export default function ProductPage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);

    // Lấy dữ liệu khi component được tạo
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);

            // Lấy dữ liệu sản phẩm
            const productData = await fetchProducts();
            const productList = productData.data || [];
            console.log("check>>>products loaded", productList.length);
            setProducts(productList);
            setFilteredProducts(productList);
            setTotalPages(Math.ceil(productList.length / ITEMS_PER_PAGE));

            // Lấy dữ liệu danh mục
            const categoryData = await fetchCategories();
            const categoryList = categoryData.data || [];
            console.log("check>>>categories loaded", categoryList.length);
            setCategories(categoryList);

            setLoading(false);
        };

        loadData();
    }, []);

    // Lọc sản phẩm theo danh mục
    useEffect(() => {
        if (selectedCategory) {
            const filtered = products.filter(product =>
                product.categoryIds && product.categoryIds.includes(selectedCategory._id)
            );
            setFilteredProducts(filtered);
            setTotalPages(Math.ceil(filtered.length / ITEMS_PER_PAGE));
            setCurrentPage(1); // Reset về trang 1 khi thay đổi bộ lọc
        } else {
            setFilteredProducts(products);
            setTotalPages(Math.ceil(products.length / ITEMS_PER_PAGE));
        }
    }, [selectedCategory, products]);

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
        setSelectedCategory(category === selectedCategory ? null : category);
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
                            {loading ? (
                                <div>Đang tải danh mục...</div>
                            ) : categories.length > 0 ? (
                                <ul>
                                    {categories.map((category) => (
                                        <li key={category._id}>
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleCategoryChange(category);
                                                }}
                                                className={selectedCategory && selectedCategory._id === category._id ? 'active' : ''}
                                            >
                                                {category.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div>Không có danh mục nào</div>
                            )}
                        </div>
                        <div className="line-ft"></div>
                    </div>
                    <div className="product-box">
                        {/* Đã xóa phần hiển thị tên category và nút xóa bộ lọc */}
                        <div className="product product-p">
                            {loading ? (
                                <div>Đang tải dữ liệu...</div>
                            ) : currentItems.length > 0 ? (
                                currentItems.map((product) => (
                                    <ProductItem key={product._id} product={product} />
                                ))
                            ) : (
                                <div className="product-empty">Không tìm thấy sản phẩm phù hợp</div>
                            )}
                        </div>
                        <div className="line-ft"></div>
                        {filteredProducts.length > 0 && !loading && (
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
    console.log("check>>>pro", product.images);
    const firstImage = Array.isArray(product.images)
        ? product.images[0]
        : typeof product.images === "string"
            ? product.images.split(",")[0]
            : "";

    // Sửa cách tạo URL hình ảnh
    const imageUrl = firstImage
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/${firstImage.replace(/^\/+/, '')}`
        : "/assets/img/placeholder.jpg";

    // Sử dụng newPrice thay vì price nếu có trong model
    const currentPrice = product.newPrice || product.price;
    const oldPrice = product.oldPrice;
    const discount = oldPrice ? Math.round((oldPrice - currentPrice) / oldPrice * 100) : 0;

    return (
        <Link href={`/Product/${product._id}`}>
            <div className="product-item product-item-page">
                <Image
                    className='product-item-page-img'
                    src={imageUrl}
                    alt={product.name}
                    width={250}
                    height={250}
                    priority
                />
                <div className="froduct-name">{product.name}</div>
                <div className="froduct-rate">
                    <span className="rate-start">
                        <Image src="/assets/img/start.svg" alt="Rating" width={16} height={16} />
                    </span>
                    <span className="rate-number">{product.rating}</span>
                </div>
                <div className="froduct-price">
                    <span className="price-new">${currentPrice}</span>
                    {oldPrice && (
                        <>
                            <span className="price-old">${oldPrice}</span>
                            <span className="sale">-{discount}%</span>
                        </>
                    )}
                </div>
            </div>
        </Link>
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