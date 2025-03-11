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
export { LoginApi, getProductApi, getProductByIdApi, createProductApi, updateProductApi, deleteProductApi }