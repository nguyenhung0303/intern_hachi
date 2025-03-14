"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Table, Button, Space, Typography, message, Modal, Form, Input, Upload, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { getCategoryApi, createCategoryApi, updateCategoryApi, deleteCategoryApi } from '@/util/api';

const { Title } = Typography;
const { TextArea } = Input;

// Lấy URL backend từ biến môi trường
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Category() {
    // State lưu danh mục từ API
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [form] = Form.useForm();
    const [submitLoading, setSubmitLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);

    // Hàm gọi API để lấy danh mục
    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await getCategoryApi();
            if (response.success) {
                setCategories(response.data);
            } else {
                message.error("Lấy danh mục thất bại!");
            }
        } catch (error) {
            message.error("Lỗi khi gọi API!");
            console.error("API Error:", error);
        }
        setLoading(false);
    };

    // Gọi API khi component mount
    useEffect(() => {
        fetchCategories();
    }, []);

    // Mở modal thêm danh mục
    const showModal = (category = null) => {
        if (category) {
            // Chế độ chỉnh sửa
            setIsEditMode(true);
            setCurrentCategory(category);
            form.setFieldsValue({
                name: category.name,
                description: category.description,
            });
        } else {
            // Chế độ thêm mới
            setIsEditMode(false);
            setCurrentCategory(null);
            form.resetFields();
        }
        setImageFile(null);
        setIsModalOpen(true);
    };

    // Đóng modal và reset form
    const handleCancel = () => {
        form.resetFields();
        setImageFile(null);
        setIsModalOpen(false);
    };

    // Xử lý khi upload file
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
        }
    };

    // Xử lý khi submit form
    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setSubmitLoading(true);

            // Tạo FormData để gửi file ảnh
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('description', values.description);

            if (imageFile) {
                formData.append('images', imageFile);
            }

            let response;

            if (isEditMode) {
                // Gọi API cập nhật danh mục
                formData.append('id', currentCategory._id); // Thêm ID vào formData
                response = await updateCategoryApi(currentCategory._id, formData);

                if (response.success || response.category) {
                    message.success('Cập nhật danh mục thành công!');
                    handleCancel();
                    fetchCategories();
                } else {
                    message.error(response.message || 'Cập nhật danh mục thất bại!');
                }
            } else {
                // Gọi API tạo danh mục mới
                response = await createCategoryApi(formData);

                if (response.success || response.category) {
                    message.success('Thêm danh mục thành công!');
                    handleCancel();
                    fetchCategories();
                } else {
                    message.error(response.message || 'Thêm danh mục thất bại!');
                }
            }
        } catch (error) {
            console.error('Submit error:', error);
            message.error(`Có lỗi xảy ra khi ${isEditMode ? 'cập nhật' : 'thêm'} danh mục!`);
        } finally {
            setSubmitLoading(false);
        }
    };

    // Xử lý xóa danh mục
    const handleDelete = async (categoryId) => {
        try {
            setLoading(true);
            const response = await deleteCategoryApi(categoryId);

            if (response.success) {
                message.success('Xóa danh mục thành công!');
                fetchCategories();
            } else {
                message.error(response.message || 'Xóa danh mục thất bại!');
            }
        } catch (error) {
            console.error('Delete error:', error);
            message.error('Có lỗi xảy ra khi xóa danh mục!');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: 'Tên danh mục',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'image',
            key: 'image',
            width: 100,
            render: (_, record) => {
                // Kiểm tra có đường dẫn ảnh không
                if (!record.image) {
                    return <div>No image</div>;
                }

                // Kiểm tra nếu ảnh đã có đường dẫn đầy đủ
                const imageUrl = record.image?.startsWith('http')
                    ? record.image
                    : `${BACKEND_URL}/${record.image}`;

                return (
                    <Image
                        src={imageUrl}
                        alt={record.name}
                        width={50}
                        height={50}
                        style={{ borderRadius: "8px", objectFit: "cover" }}
                        onError={(e) => {
                            console.error("Image load error:", e);
                            e.target.src = "/placeholder.png"; // Optional fallback image
                        }}
                    />
                );
            },
        },
        {
            title: 'Thao tác',
            key: 'actions',
            width: 120,
            render: (_, record) => (
                <Space>
                    <Button
                        icon={<EditOutlined />}
                        type="link"
                        onClick={() => showModal(record)}
                    />
                    <Popconfirm
                        title="Xóa danh mục?"
                        description="Bạn có chắc chắn muốn xóa danh mục này?"
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
        <div style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <Title level={3}>Quản lý Danh mục</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
                    Thêm danh mục
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={categories}
                pagination={{ pageSize: 10 }}
                bordered
                rowKey="_id"
                loading={loading}
            />

            {/* Modal thêm/chỉnh sửa danh mục */}
            <Modal
                title={isEditMode ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
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
                        {isEditMode ? "Cập nhật" : "Thêm"}
                    </Button>
                ]}
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="categoryForm"
                >
                    <Form.Item
                        name="name"
                        label="Tên danh mục"
                        rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}
                    >
                        <Input placeholder="Nhập tên danh mục" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Mô tả"
                        rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                    >
                        <TextArea rows={4} placeholder="Nhập mô tả danh mục" />
                    </Form.Item>

                    <Form.Item
                        label="Hình ảnh"
                    >
                        <Upload
                            beforeUpload={(file) => {
                                setImageFile(file);
                                return false; // Ngăn Upload component tự động upload
                            }}
                            maxCount={1}
                            listType="picture"
                        >
                            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                        </Upload>
                        {/* Phần hiển thị ảnh hiện tại */}
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}