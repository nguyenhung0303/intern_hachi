"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Pagination } from 'antd';

const ProductPageUI = ({ products, categories }) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [filteredProducts, setFilteredProducts] = useState(products);
    const [activeCategory, setActiveCategory] = useState(null);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(9); // Default number of products per page
    const [displayedProducts, setDisplayedProducts] = useState([]);

    // Function to filter products by category
    const filterProductsByCategory = (categoryId) => {
        if (!categoryId) {
            setFilteredProducts(products);
            setActiveCategory(null);
        } else {
            const filtered = products.filter(product =>
                product.categoryIds && product.categoryIds.includes(categoryId)
            );
            setFilteredProducts(filtered);
            setActiveCategory(categoryId);
        }
        setCurrentPage(1); // Reset to first page when changing category
    };

    // Update page size based on window width
    const updatePageSize = () => {
        if (typeof window !== 'undefined') {
            setPageSize(window.innerWidth < 820 ? 4 : 9);
        }
    };

    // Handle initial load, URL changes, and window resize
    useEffect(() => {
        const categoryParam = searchParams.get('category');
        const pageParam = searchParams.get('page');

        if (categoryParam) {
            filterProductsByCategory(categoryParam);
        } else {
            filterProductsByCategory(null);
        }

        if (pageParam) {
            setCurrentPage(parseInt(pageParam));
        }

        // Set initial page size
        updatePageSize();

        // Add resize event listener
        window.addEventListener('resize', updatePageSize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', updatePageSize);
        };
    }, [searchParams, products]);

    // Update displayed products when filtered products or page changes
    useEffect(() => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        setDisplayedProducts(filteredProducts.slice(startIndex, endIndex));
    }, [filteredProducts, currentPage, pageSize]);

    // Handle category click
    const handleCategoryClick = (categoryId, e) => {
        e.preventDefault();

        // Create new URL with updated search params
        const newSearchParams = new URLSearchParams(searchParams.toString());
        if (categoryId) {
            newSearchParams.set('category', categoryId);
        } else {
            newSearchParams.delete('category');
        }
        newSearchParams.delete('page'); // Reset page parameter

        // Update URL without full page reload
        router.push(`${pathname}?${newSearchParams.toString()}`, { scroll: false });
    };

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);

        // Update URL with page parameter
        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.set('page', page.toString());

        // Update URL without full page reload
        router.push(`${pathname}?${newSearchParams.toString()}`, { scroll: false });
    };

    return (
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
                                    onClick={(e) => handleCategoryClick(null, e)}
                                    className={activeCategory === null ? "active" : ""}
                                >
                                    All Products
                                </a>
                            </li>
                            {categories.map((category) => (
                                <li key={category._id}>
                                    <a
                                        href="#"
                                        onClick={(e) => handleCategoryClick(category._id, e)}
                                        className={activeCategory === category._id ? "active" : ""}
                                    >
                                        {category.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="line-ft"></div>
                </div>
                <div className="product-box">
                    <div className="product product-p">
                        {displayedProducts.length > 0 ? (
                            displayedProducts.map((product, index) => (
                                <Link
                                    href={`/Product/${product._id}`}
                                    key={product._id || index}
                                    className="product-item product-item-page cursor-pointer"
                                >
                                    <Image
                                        className='product-item-page-img'
                                        src={product.images?.[0] ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/${product.images[0]}` : "/assets/img/product/Frame 32.png"}
                                        alt={product.name}
                                        width={300}
                                        height={300}
                                        priority={true}
                                    />
                                    <div className="froduct-name">{product.name}</div>
                                    <div className="froduct-rate">
                                        <span className="rate-start">
                                            <Image src="/assets/img/start.svg" alt="rating" width={16} height={16} />
                                        </span>
                                        <span className="rate-number">{product.rating}/5</span>
                                    </div>
                                    <div className="froduct-price">
                                        <span className="price-new">${product.newPrice}</span>
                                        {product.oldPrice && (
                                            <>
                                                <span className="price-old">${product.oldPrice}</span>
                                                <span className="sale">
                                                    -{Math.round((1 - product.newPrice / product.oldPrice) * 100)}%
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <p>No products found in this category.</p>
                        )}
                    </div>
                    <div className="line-ft"></div>
                    <div className="pagination">
                        <Pagination
                            current={currentPage}
                            total={filteredProducts.length}
                            pageSize={pageSize}
                            onChange={handlePageChange}
                            showSizeChanger={false}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPageUI;