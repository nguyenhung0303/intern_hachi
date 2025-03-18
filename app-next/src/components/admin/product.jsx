"use client";

import React, { useEffect, useState } from "react";
import { Table, Button, Space, Typography, Modal, Form, Input, message, Popconfirm, Image, Select, Upload } from "antd";
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
    const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
    const [form] = Form.useForm();
    const [submitLoading, setSubmitLoading] = useState(false);

    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

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
        const files = Array.from(e.target.files);
        setImageFiles(files);

        // Tạo URL xem trước cho các ảnh đã chọn
        const previewUrls = files.map(file => URL.createObjectURL(file));
        setImagePreviewUrls(previewUrls);
    };

    // Xóa các URL xem trước khi component unmount để tránh rò rỉ bộ nhớ
    useEffect(() => {
        return () => {
            imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [imagePreviewUrls]);

    const showModal = (product = null) => {
        if (product) {
            setIsEditing(true);
            setSelectedProductId(product._id);

            // Kiểm tra nếu sizes là chuỗi trước khi thực hiện split
            let sizesArray = [];
            if (product.sizes) {
                sizesArray = typeof product.sizes === 'string'
                    ? product.sizes.split(',').map(size => size.trim())
                    : Array.isArray(product.sizes) ? product.sizes : [];
            }

            form.setFieldsValue({
                name: product.name,
                oldPrice: product.oldPrice,
                newPrice: product.newPrice,
                rating: product.rating,
                sizes: sizesArray,
                categoryIds: product.categoryIds ? product.categoryIds.map(cat =>
                    typeof cat === 'object' ? cat._id : cat) : [],
            });
        } else {
            setIsEditing(false);
            setSelectedProductId(null);
            form.resetFields();
        }
        setImageFiles([]);
        setImagePreviewUrls([]);
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        form.resetFields();
        setImageFiles([]);
        // Xóa các URL xem trước để tránh rò rỉ bộ nhớ
        imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
        setImagePreviewUrls([]);
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

            // Chuyển đổi sizes từ array sang string trước khi lưu
            const sizesString = values.sizes ? values.sizes.join(", ") : "";
            formData.append("sizes", sizesString);

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
                    message.error(response?.message || "Cập nhật sản phẩm thất bại!");
                }
            } else {
                response = await createProductApi(formData);
                if (response.success || response.product) {
                    message.success("Thêm sản phẩm thành công!");
                    handleCancel();
                    fetchProducts();
                } else {
                    message.error(response?.message || "Thêm sản phẩm thất bại!");
                }
            }
        } catch (error) {
            if (error.errorFields) {
                // Form validation errors
                message.error(`Vui lòng kiểm tra lại thông tin nhập!`);
            } else {
                message.error(`Có lỗi xảy ra khi ${isEditing ? "cập nhật" : "thêm"} sản phẩm: ${error.message || ""}`);
            }
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
                        rules={[
                            { required: true, message: "Vui lòng nhập tên sản phẩm!" },
                            { min: 5, message: "Tên sản phẩm phải có ít nhất 5 ký tự!" },
                            { max: 30, message: "Tên sản phẩm không được vượt quá 30 ký tự!" }
                        ]}
                    >
                        <Input placeholder="Nhập tên sản phẩm" />
                    </Form.Item>

                    <Form.Item
                        name="oldPrice"
                        label="Giá cũ"
                        rules={[
                            { required: true, message: "Vui lòng nhập giá cũ!" },
                            {
                                pattern: /^\d+(\.\d+)?$/,
                                message: "Giá cũ chỉ được nhập số!"
                            },
                            {
                                validator: (_, value) => {
                                    if (value && value.toString().replace(/\D/g, '').length > 9) {
                                        return Promise.reject("Giá cũ không được vượt quá 9 chữ số!");
                                    }
                                    return Promise.resolve();
                                }
                            }
                        ]}
                    >
                        <Input placeholder="Nhập giá cũ" suffix="đ" />
                    </Form.Item>

                    <Form.Item
                        name="newPrice"
                        label="Giá mới"
                        rules={[
                            { required: true, message: "Vui lòng nhập giá mới!" },
                            {
                                pattern: /^\d+(\.\d+)?$/,
                                message: "Giá mới chỉ được nhập số!"
                            },
                            {
                                validator: (_, value) => {
                                    if (value && value.toString().replace(/\D/g, '').length > 9) {
                                        return Promise.reject("Giá mới không được vượt quá 9 chữ số!");
                                    }
                                    return Promise.resolve();
                                }
                            }
                        ]}
                    >
                        <Input placeholder="Nhập giá mới" suffix="đ" />
                    </Form.Item>

                    <Form.Item
                        name="rating"
                        label="Đánh giá"
                        rules={[
                            {
                                pattern: /^\d+(\.\d+)?$/,
                                message: "Đánh giá chỉ được nhập số!",
                                validateTrigger: 'onBlur'
                            }
                        ]}
                    >
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

                    <Form.Item
                        name="sizes"
                        label="Size"
                    >
                        <Select
                            mode="multiple"
                            placeholder="Chọn size"
                            style={{ width: '100%' }}
                            optionFilterProp="children"
                        >
                            {SIZE_OPTIONS.map(size => (
                                <Option key={size} value={size}>
                                    {size}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    // Replace the existing Form.Item for image upload with this one

                    <Form.Item label="Hình ảnh">
                        <Upload
                            listType="picture-card"
                            fileList={imageFiles.map((file, index) => ({
                                uid: `-${index}`,
                                name: file.name,
                                status: 'done',
                                url: imagePreviewUrls[index],
                                originFileObj: file,
                            }))}
                            beforeUpload={(file) => {
                                const isImage = file.type.startsWith('image/');
                                if (!isImage) {
                                    message.error('Chỉ có thể tải lên tệp hình ảnh!');
                                    return false;
                                }

                                // Add to state without actually uploading
                                setImageFiles(prev => [...prev, file]);
                                setImagePreviewUrls(prev => [...prev, URL.createObjectURL(file)]);
                                return false; // Prevent automatic upload
                            }}
                            onRemove={(file) => {
                                const index = imageFiles.findIndex((item, i) =>
                                    i === Number(file.uid.replace('-', '')));

                                if (index !== -1) {
                                    // Release object URL to prevent memory leaks
                                    URL.revokeObjectURL(imagePreviewUrls[index]);

                                    const newFiles = [...imageFiles];
                                    newFiles.splice(index, 1);
                                    setImageFiles(newFiles);

                                    const newUrls = [...imagePreviewUrls];
                                    newUrls.splice(index, 1);
                                    setImagePreviewUrls(newUrls);
                                }
                                return false;
                            }}
                        >
                            <div>
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>Tải ảnh</div>
                            </div>
                        </Upload>

                        {/* Hiển thị ảnh hiện tại khi chỉnh sửa */}
                        {isEditing && products.find((p) => p._id === selectedProductId)?.images && imagePreviewUrls.length === 0 && (
                            <div style={{ marginTop: "10px" }}>
                                <p>Ảnh hiện tại:</p>
                                <Image.PreviewGroup>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                                        {products.find((p) => p._id === selectedProductId)?.images.map((image, index) => (
                                            <Image
                                                key={index}
                                                src={`${BACKEND_URL}/${image}`}
                                                alt={`Ảnh ${index + 1}`}
                                                width={80}
                                                height={80}
                                            />
                                        ))}
                                    </div>
                                </Image.PreviewGroup>
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