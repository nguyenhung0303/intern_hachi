const express = require('express');
const { GetUser, CreateUser, Login, } = require('../controllers/userController.js');
const auth = require('../middelware/auth.js')
const { createProductController, getProducts, getProductsById, updateProduct, deleteProduct } = require('../controllers/productController.js');
const routerAPI = express.Router();
const upload = require('../middelware/multer.js')

routerAPI.all("*", auth)

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
routerAPI.post("/create_product", upload.array('images', 10), createProductController)
routerAPI.get("/Product", getProducts)
routerAPI.get("/Product/:id", getProductsById)
routerAPI.post("/UpdateProduct/:id", upload.array('images', 10), updateProduct)
routerAPI.delete("/deleteProduct/:id", deleteProduct)
module.exports = routerAPI; 