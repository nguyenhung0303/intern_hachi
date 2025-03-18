require("dotenv").config
const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {

    const publicRoutes = ["/login", "/sigup", "/Product", "/get_category"];

    if (publicRoutes.includes(req.path)) {
        return next();
    }

    if (req?.headers?.authorization?.split(' ')?.[1]) {
        const token = req.headers.authorization.split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            console.log(">>check token:", decoded)
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(401).json({
                Message: "no access / hết hạn access"
            })
        }

    } else {
        return res.status(401).json({
            Message: "no access / hết hạn access"
        })
    }
}
module.exports = auth