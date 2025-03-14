"use client";

import React, { useEffect, useState } from "react";
import { Table, Button, Space, Typography, Modal, Form, Input, message, Popconfirm, Image, Select } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { getProductApi, createProductApi, updateProductApi, deleteProductApi } from "@/util/api";
import { getCategoryApi } from "@/util/api";

const { Title } = Typography;
const { Option } = Select;

export default function ProductTable() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [imageFiles, setImageFiles] = useState([]);
    const [form] = Form.useForm();
    const [submitLoading, setSubmitLoading] = useState(false);

    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await getProductApi();
            if (response.data) {
                setProducts(response.data);
            }
        } catch (error) {
            message.error("Không thể tải danh sách sản phẩm");
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await getCategoryApi();
            if (response.data) {
                setCategories(response.data);
            }
        } catch (error) {
            message.error("Không thể tải danh sách danh mục");
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const handleImageUpload = (e) => {
        setImageFiles(Array.from(e.target.files));
    };

    const showModal = (product = null) => {
        if (product) {
            setIsEditing(true);
            setSelectedProductId(product._id);
            form.setFieldsValue({
                name: product.name,
                oldPrice: product.oldPrice,
                newPrice: product.newPrice,
                rating: product.rating,
                colors: product.colors,
                sizes: product.sizes,
                categoryIds: product.categoryIds ? product.categoryIds.map(cat =>
                    typeof cat === 'object' ? cat._id : cat) : [],
            });
        } else {
            setIsEditing(false);
            setSelectedProductId(null);
            form.resetFields();
        }
        setImageFiles([]);
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        form.resetFields();
        setImageFiles([]);
        setIsModalOpen(false);
        setIsEditing(false);
        setSelectedProductId(null);
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setSubmitLoading(true);

            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("oldPrice", values.oldPrice);
            formData.append("newPrice", values.newPrice);
            formData.append("rating", values.rating || "0");
            formData.append("colors", values.colors || "");
            formData.append("sizes", values.sizes || "");

            // Thêm categoryIds vào formData
            if (values.categoryIds && values.categoryIds.length > 0) {
                values.categoryIds.forEach(categoryId => {
                    formData.append("categoryIds", categoryId);
                });
            }

            imageFiles.forEach((file) => {
                formData.append("images", file);
            });

            let response;
            if (isEditing) {
                response = await updateProductApi(selectedProductId, formData);
                console.log("Update response:", response); // Thêm log để debug

                // Kiểm tra kỹ hơn response
                if (response && (response.success !== false)) {
                    message.success("Cập nhật sản phẩm thành công!");
                    handleCancel(); // Đóng modal
                    fetchProducts();
                } else {
                    message.error("Cập nhật sản phẩm thất bại!");
                }
            } else {
                response = await createProductApi(formData);
                if (response.success || response.product) {
                    message.success("Thêm sản phẩm thành công!");
                    handleCancel();
                    fetchProducts();
                } else {
                    message.error("Thêm sản phẩm thất bại!");
                }
            }
        } catch (error) {
            message.error(`Có lỗi xảy ra khi ${isEditing ? "cập nhật" : "thêm"} sản phẩm!`);
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleDelete = async (productId) => {
        try {
            setLoading(true);
            const response = await deleteProductApi(productId);

            if (response.success) {
                message.success("Xóa sản phẩm thành công!");
                fetchProducts();
            } else {
                message.error("Xóa sản phẩm thất bại!");
            }
        } catch (error) {
            message.error("Có lỗi xảy ra khi xóa sản phẩm!");
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: "Ảnh",
            dataIndex: "images",
            key: "images",
            render: (images) => (
                <Space>
                    {images && images.length > 0 ? (
                        <Image.PreviewGroup>
                            {images.slice(0, 2).map((image, index) => (
                                <Image
                                    key={index}
                                    src={`${BACKEND_URL}/${image}`}
                                    alt={`Sản phẩm ${index + 1}`}
                                    width={40}
                                    height={40}
                                />
                            ))}
                            {images.length > 2 && (
                                <span>+{images.length - 2}</span>
                            )}
                        </Image.PreviewGroup>
                    ) : (
                        <span>Không có ảnh</span>
                    )}
                </Space>
            ),
        },
        {
            title: "Tên sản phẩm",
            dataIndex: "name",
            key: "name",
            ellipsis: true,
        },
        {
            title: "Giá cũ",
            dataIndex: "oldPrice",
            key: "oldPrice",
            render: (value) => `${value}đ`,
        },
        {
            title: "Giá mới",
            dataIndex: "newPrice",
            key: "newPrice",
            render: (value) => `${value}đ`,
        },
        {
            title: "Đánh giá",
            dataIndex: "rating",
            key: "rating",
        },
        {
            title: "Danh mục",
            dataIndex: "categoryIds",
            key: "categoryIds",
            render: (categoryIds) => (
                <span>
                    {categoryIds && categoryIds.length > 0
                        ? categoryIds.map(cat => {
                            const category = typeof cat === 'object' ? cat : categories.find(c => c._id === cat);
                            return category ? category.name : '';
                        }).filter(Boolean).join(', ')
                        : "Chưa phân loại"}
                </span>
            ),
        },
        {
            title: "Màu sắc",
            dataIndex: "colors",
            key: "colors",
            ellipsis: true,
        },
        {
            title: "Size",
            dataIndex: "sizes",
            key: "sizes",
            ellipsis: true,
        },
        {
            title: "Thao tác",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Button
                        icon={<EditOutlined />}
                        type="link"
                        onClick={() => showModal(record)}
                    />
                    <Popconfirm
                        title="Xóa sản phẩm?"
                        description={`Bạn có chắc chắn muốn xóa sản phẩm "${record.name}"?`}
                        onConfirm={() => handleDelete(record._id)}
                        okText="Xóa"
                        cancelText="Hủy"
                    >
                        <Button icon={<DeleteOutlined />} type="link" danger />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                <Title level={3}>Quản lý Sản phẩm</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
                    Thêm sản phẩm
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={products}
                rowKey="_id"
                loading={loading}
                pagination={{ pageSize: 10 }}
            />

            <Modal
                title={isEditing ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
                open={isModalOpen}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Hủy
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        loading={submitLoading}
                        onClick={handleSubmit}
                    >
                        {isEditing ? "Cập nhật" : "Thêm"}
                    </Button>,
                ]}
            >
                <Form form={form} layout="vertical" name="productForm">
                    <Form.Item
                        name="name"
                        label="Tên sản phẩm"
                        rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
                    >
                        <Input placeholder="Nhập tên sản phẩm" />
                    </Form.Item>

                    <Form.Item
                        name="oldPrice"
                        label="Giá cũ"
                        rules={[{ required: true, message: "Vui lòng nhập giá cũ!" }]}
                    >
                        <Input placeholder="Nhập giá cũ" suffix="đ" />
                    </Form.Item>

                    <Form.Item
                        name="newPrice"
                        label="Giá mới"
                        rules={[{ required: true, message: "Vui lòng nhập giá mới!" }]}
                    >
                        <Input placeholder="Nhập giá mới" suffix="đ" />
                    </Form.Item>

                    <Form.Item name="rating" label="Đánh giá">
                        <Input placeholder="Nhập đánh giá" />
                    </Form.Item>

                    <Form.Item
                        name="categoryIds"
                        label="Danh mục sản phẩm"
                    >
                        <Select
                            mode="multiple"
                            placeholder="Chọn danh mục sản phẩm"
                            style={{ width: '100%' }}
                            optionFilterProp="children"
                        >
                            {categories.map(category => (
                                <Option key={category._id} value={category._id}>
                                    {category.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="colors" label="Màu sắc">
                        <Input placeholder="Nhập màu sắc (VD: Đỏ, Xanh, Đen)" />
                    </Form.Item>

                    <Form.Item name="sizes" label="Size">
                        <Input placeholder="Nhập size (VD: S, M, L, XL)" />
                    </Form.Item>

                    <Form.Item label="Hình ảnh">
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                        />

                        {isEditing && products.find((p) => p._id === selectedProductId)?.images && (
                            <div style={{ marginTop: "10px" }}>
                                <p>Ảnh hiện tại:</p>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                                    {products.find((p) => p._id === selectedProductId)?.images.map((image, index) => (
                                        <Image
                                            key={index}
                                            src={`${BACKEND_URL}/${image}`}
                                            alt={`Ảnh ${index + 1}`}
                                            width={60}
                                            height={60}
                                        />
                                    ))}
                                </div>
                                <p style={{ color: "red", fontSize: "12px" }}>
                                    Lưu ý: Tải lên ảnh mới sẽ thay thế tất cả ảnh cũ
                                </p>
                            </div>
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}