"use client";
import { useEffect, useState } from "react";
import { getProductApi, createProductApi, updateProductApi, deleteProductApi } from "@/util/api"; // Thêm updateProductApi
import "@/css/dashProduct.css";

export default function ProductTable() {
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [newProduct, setNewProduct] = useState({
        name: "",
        oldPrice: "",
        newPrice: "",
        rating: "",
        colors: "",
        sizes: "",
        images: []
    });

    const fetchProducts = () => {
        getProductApi()
            .then((response) => {
                setProducts(response.data);
            })
            .catch((error) => {
                console.error("Lỗi khi lấy sản phẩm:", error);
            });
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setNewProduct((prev) => ({
            ...prev,
            images: files // Giữ nguyên ảnh cũ và thêm ảnh mới
        }));
    };

    const handleAddProduct = async () => {
        const formData = new FormData();
        formData.append("name", newProduct.name);
        formData.append("oldPrice", newProduct.oldPrice);
        formData.append("newPrice", newProduct.newPrice);
        formData.append("rating", newProduct.rating);
        formData.append("colors", newProduct.colors);
        formData.append("sizes", newProduct.sizes);

        newProduct.images.forEach((file) => {
            formData.append("images", file);
        });

        if (isEditing) {
            // Cập nhật sản phẩm

            try {

                const response = await updateProductApi(selectedProductId, formData);
                console.log("Sản phẩm đã được cập nhật:", response);

                // Cập nhật lại danh sách sản phẩm
                fetchProducts();
                resetForm();
            } catch (error) {
                console.error("Lỗi khi cập nhật sản phẩm:", error);
            }
        } else {
            // Thêm sản phẩm mới
            createProductApi(formData)
                .then((response) => {
                    console.log("check res prd>>>>", response);
                    setProducts((prev) => [...prev, response.product]);
                    resetForm();
                })
                .catch((error) => {
                    console.error("Lỗi khi tạo sản phẩm:", error);
                });
        }
    };
    const handleDeleteProduct = async (product) => {
        if (!product || !product._id) {
            console.error("Không tìm thấy ID sản phẩm để xóa.");
            return;
        }

        const confirmDelete = window.confirm(`Bạn có chắc muốn xóa sản phẩm "${product.name}" không?`);

        if (!confirmDelete) return;

        try {
            const response = await deleteProductApi(product._id);
            console.log("check pro>>>", response)
            console.log("Sản phẩm đã bị xóa:", response);

            // Cập nhật danh sách sản phẩm sau khi xóa
            fetchProducts();
        } catch (error) {
            console.error("Lỗi khi xóa sản phẩm:", error.message);
        }
    };
    const handleEditProduct = (product) => {
        setIsEditing(true);
        setSelectedProductId(product._id); // Giả sử rằng ID của sản phẩm là _id

        // Đặt giá trị hiện tại của sản phẩm vào form
        setNewProduct({
            name: product.name,
            oldPrice: product.oldPrice,
            newPrice: product.newPrice,
            rating: product.rating,
            colors: product.colors,
            sizes: product.sizes,
            images: [] // Không thể set file objects từ URL, chỉ hiển thị ảnh hiện tại
        });

        setShowModal(true);
    };

    const resetForm = () => {
        setNewProduct({
            name: "",
            oldPrice: "",
            newPrice: "",
            rating: "",
            colors: "",
            sizes: "",
            images: []
        });
        setIsEditing(false);
        setSelectedProductId(null);
        setShowModal(false);
    };

    const handleCloseModal = (e) => {
        if (e.target.classList.contains("modal")) {
            resetForm();
        }
    };

    return (
        <div className="table-container">
            <h2 className="table-title">Danh sách sản phẩm</h2>
            <button className="add-btn" onClick={() => setShowModal(true)}>Thêm sản phẩm</button>
            <div className="table-wrapper">
                <table className="product-table">
                    <thead>
                        <tr className="table-header">
                            <th>Ảnh</th>
                            <th>Tên sản phẩm</th>
                            <th>Giá cũ</th>
                            <th>Giá mới</th>
                            <th>Đánh giá</th>
                            <th>Màu sắc</th>
                            <th>Size</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, index) => (
                            <tr key={index} className="table-row">
                                <td className="image-cell">
                                    {product.images.map((image, imgIndex) => (
                                        <img key={imgIndex}
                                            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${image}`}
                                            alt="Sản phẩm"
                                            style={{ width: "50px", height: "50px" }} />
                                    ))}
                                </td>
                                <td>{product.name}</td>
                                <td className="old-price">{product.oldPrice}</td>
                                <td className="new-price">{product.newPrice}</td>
                                <td>{product.rating}</td>
                                <td>{product.colors}</td>
                                <td>{product.sizes}</td>
                                <td>
                                    <button
                                        className="edit-btn"
                                        onClick={() => handleEditProduct(product)}
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDeleteProduct(product)}
                                    >
                                        xoá
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal" onClick={handleCloseModal}>
                    <div className="modal-content">
                        <h3>{isEditing ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}</h3>
                        <input
                            type="text"
                            name="name"
                            placeholder="Tên sản phẩm"
                            value={newProduct.name}
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            name="oldPrice"
                            placeholder="Giá cũ"
                            value={newProduct.oldPrice}
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            name="newPrice"
                            placeholder="Giá mới"
                            value={newProduct.newPrice}
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            name="rating"
                            placeholder="Đánh giá"
                            value={newProduct.rating}
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            name="colors"
                            placeholder="Màu sắc"
                            value={newProduct.colors}
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            name="sizes"
                            placeholder="Size"
                            value={newProduct.sizes}
                            onChange={handleInputChange}
                        />
                        <input type="file" multiple onChange={handleImageUpload} />

                        {isEditing && (
                            <div className="current-images">
                                <p>Ảnh hiện tại:</p>
                                <div className="image-preview">
                                    {products.find(p => p._id === selectedProductId)?.images.map((image, imgIndex) => (
                                        <img
                                            key={imgIndex}
                                            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${image}`}
                                            alt="Ảnh hiện tại"
                                            style={{ width: "50px", height: "50px", margin: "5px" }}
                                        />
                                    ))}
                                </div>
                                <p className="note">Lưu ý: Tải lên ảnh mới sẽ thay thế ảnh cũ</p>
                            </div>
                        )}

                        <div className="modal-actions">
                            <button onClick={handleAddProduct}>
                                {isEditing ? "Cập nhật" : "Thêm"}
                            </button>
                            <button onClick={resetForm} className="cancel-btn">Hủy</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}