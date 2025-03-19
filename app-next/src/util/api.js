import axios from "./axio.custiomzie";
const LoginApi = (email, password) => {
    const URL_API = "/v1/api/login"
    const data = {
        email, password
    }
    return axios.post(URL_API, data)
}
const getProductApi = () => {
    const URL_API = "/v1/api/Product"
    return axios.get(URL_API)
}
const getProductByIdApi = (id) => {
    const URL_API = `/v1/api/Product/${id}`;
    return axios.get(URL_API);
};
const fetchProductsById = async (id) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/Product/${id}`, {
            cache: "no-store",
            next: { revalidate: 0 }, // Luôn lấy dữ liệu mới
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        console.log("check>>>respro", response)
        if (!response.ok) {
            throw new Error("Lỗi khi tải dữ liệu");
        }
        return response.json();
    } catch (error) {
        console.error("Lỗi fetch:", error);
        return { data: [] };
    }
};
const createProductApi = (productData) => {
    const URL_API = `/v1/api/create_product`;
    return axios.post(URL_API, productData);
};
const updateProductApi = (id, data) => {
    const URL_API = `/v1/api/updateProduct/${id}`;
    return axios.post(URL_API, data);
};
const deleteProductApi = (id) => {
    const URL_API = `/v1/api/deleteProduct/${id}`;
    return axios.delete(URL_API);
};
const getCategoryApi = () => {
    const URL_API = "/v1/api/get_category"
    return axios.get(URL_API)
}
const createCategoryApi = (data) => {
    const URL_API = `/v1/api/create_category`;
    return axios.post(URL_API, data);
};
const updateCategoryApi = (id, data) => {
    const URL_API = `/v1/api/update_category/${id}`;
    return axios.post(URL_API, data);
};
const deleteCategoryApi = (id) => {
    const URL_API = `/v1/api/delete_category/${id}`;
    return axios.delete(URL_API);
};
const fetchProducts = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/Product`, {
            cache: "no-store",
            next: { revalidate: 0 }, // Luôn lấy dữ liệu mới
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        console.log("check>>>respro", response)
        if (!response.ok) {
            throw new Error("Lỗi khi tải dữ liệu");
        }
        return response.json();
    } catch (error) {
        console.error("Lỗi fetch:", error);
        return { data: [] };
    }
};
const fetchCategorys = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/get_category`, {
            cache: "no-store",
            next: { revalidate: 0 }, // Luôn lấy dữ liệu mới
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        console.log("check>>>respro", response)
        if (!response.ok) {
            throw new Error("Lỗi khi tải dữ liệu");
        }
        return response.json();
    } catch (error) {
        console.error("Lỗi fetch:", error);
        return { data: [] };
    }
};
export { LoginApi, getProductApi, getProductByIdApi, createProductApi, updateProductApi, deleteProductApi, fetchProductsById, getCategoryApi, createCategoryApi, updateCategoryApi, deleteCategoryApi, fetchProducts, fetchCategorys }