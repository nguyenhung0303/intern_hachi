import React, { useEffect, useState, useRef } from "react";
import { Table, Button, Space, Typography, Modal, Form, Input, message, Popconfirm, Image, Select, Upload } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, InboxOutlined } from "@ant-design/icons";
import { getProductApi, createProductApi, updateProductApi, deleteProductApi } from "@/util/api";
import { getCategoryApi } from "@/util/api";
import { toast } from "react-toastify";

const { Title } = Typography;
const { Option } = Select;
const { Dragger } = Upload;

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
    const fileInputRef = useRef(null);

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
        setImageFiles(prev => [...prev, ...files]);

        // Tạo URL xem trước cho các ảnh đã chọn
        const previewUrls = files.map(file => URL.createObjectURL(file));
        setImagePreviewUrls(prev => [...prev, ...previewUrls]);
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
            const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
            setSubmitLoading(true);

            let hasOversizedFile = false;
            for (const file of imageFiles) {
                if (!allowedTypes.includes(file.type)) {
                    toast.error(`Ảnhk hông đúng định dạng! Chỉ chấp nhận JPG, JPEG, PNG.`);
                    hasInvalidFile = true;
                } else if (file.size > 2 * 1024 * 1024) {
                    toast.error(`Ảnh vượt quá 2MB!`);
                    hasInvalidFile = true;
                }
            }

            // Nếu có file vượt quá kích thước, dừng xử lý
            if (hasOversizedFile) {
                setSubmitLoading(false);
                return;
            }

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
                // Kiểm tra kỹ hơn response
                if (response && (response.success !== false)) {

                    message.success("Cập nhật sản phẩm thành công!");
                    handleCancel();
                    toast.success("ok")
                    fetchProducts();
                } else {
                    toast.error("errr")
                    message.error(response?.message || "Cập nhật sản phẩm thất bại!");
                }
            } else {
                response = await createProductApi(formData);
                if (response.success || response.product) {
                    message.success("Thêm sản phẩm thành công!");

                    handleCancel();
                    toast.success("ok")
                    fetchProducts();
                } else {
                    message.error(response?.message || "Thêm sản phẩm thất bại!");
                    toast.error(response.error || "Có lỗi xảy ra!");

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

    const handleRemoveImage = (index) => {
        // Release object URL to prevent memory leaks
        URL.revokeObjectURL(imagePreviewUrls[index]);

        const newFiles = [...imageFiles];
        newFiles.splice(index, 1);
        setImageFiles(newFiles);

        const newUrls = [...imagePreviewUrls];
        newUrls.splice(index, 1);
        setImagePreviewUrls(newUrls);
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
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
                width={720}
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

                    <Form.Item label="Hình ảnh">
                        <div
                            style={{
                                border: '1px dashed #d9d9d9',
                                borderRadius: '8px',
                                padding: '20px',
                                textAlign: 'center',
                                cursor: 'pointer',
                                marginBottom: '16px',
                                background: '#fafafa'
                            }}
                            onClick={triggerFileInput}
                        >
                            <InboxOutlined style={{ fontSize: '48px', color: '#40a9ff' }} />
                            <p style={{ marginTop: '8px' }}>Nhấp để chọn ảnh hoặc kéo thả ảnh vào đây</p>
                            <p style={{ color: '#888' }}>Có thể chọn nhiều ảnh bằng cách giữ phím Ctrl</p>
                            <input
                                type="file"
                                ref={fileInputRef}
                                multiple
                                accept="image/*"
                                onChange={handleImageUpload}
                                style={{ display: 'none' }}
                            />
                        </div>

                        {/* Hiển thị xem trước các ảnh đã chọn */}
                        {imagePreviewUrls.length > 0 && (
                            <div style={{ marginTop: '16px' }}>
                                <p>Ảnh đã chọn ({imagePreviewUrls.length}):</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {imagePreviewUrls.map((url, index) => (
                                        <div key={index} style={{ position: 'relative' }}>
                                            <img
                                                src={url}
                                                alt={`Preview ${index}`}
                                                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
                                            />
                                            <Button
                                                size="small"
                                                type="text"
                                                danger
                                                icon={<DeleteOutlined />}
                                                style={{
                                                    position: 'absolute',
                                                    top: '-10px',
                                                    right: '-10px',
                                                    background: 'white',
                                                    borderRadius: '50%',
                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                                                }}
                                                onClick={() => handleRemoveImage(index)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

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