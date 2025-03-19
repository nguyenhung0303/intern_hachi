const express = require('express');
const { GetUser, CreateUser, Login, } = require('../controllers/userController.js');
const auth = require('../middelware/auth.js')
const { createProductController, getProducts, getProductsById, updateProduct, deleteProduct, getProductsBySlug } = require('../controllers/productController.js');
const routerAPI = express.Router();
const multer = require('multer');
const upload = require('../middelware/multer.js');
const { createCategoryController, getCategorys, updateCategoryController, deleteCategory } = require('../controllers/category.js');

// routerAPI.all("*", auth)


routerAPI.get('/', (req, res) => {
    return res.status(200).json("Hello api OKss")
});


routerAPI.post("/sigup", CreateUser);
routerAPI.get("/user", GetUser)
routerAPI.post("/login", Login)
routerAPI.get("/dash", auth, (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Bạn không có quyền truy cập trang Dashboard" });
    }
    return res.status(200).json({ message: "Chào mừng Admin đến với Dashboard!" });
});
routerAPI.post("/create_product", (req, res, next) => {
    upload.array('images', 10)(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ error: "Ảnh không được vượt quá 2MB!" });
            }
        } else if (err) {
            return res.status(400).json({ error: err.message });
        }
        next();
    });
}, createProductController)
routerAPI.get("/Product", getProducts)
// routerAPI.get("/Product/:id", getProductsById)
routerAPI.get("/Product/:slug", getProductsBySlug);
routerAPI.post("/UpdateProduct/:id", upload.array('images', 10), updateProduct)
routerAPI.delete("/deleteProduct/:id", deleteProduct)
routerAPI.post("/create_category", (req, res, next) => {
    upload.array('images', 10)(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ error: "Ảnh không được vượt quá 2MB!" });
            }
        } else if (err) {
            return res.status(400).json({ error: err.message });
        }
        next();
    });
}, createCategoryController)
routerAPI.get("/get_category", getCategorys)
routerAPI.post("/update_category/:id", upload.array('images', 10), updateCategoryController)
routerAPI.delete("/delete_category/:id", deleteCategory)
module.exports = routerAPI; 