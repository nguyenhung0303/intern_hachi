
require("dotenv").config
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { name } = require("ejs");
const jwt = require("jsonwebtoken")
const getUserServive = async () => {
    try {

        let result = await User.find({}).select("-password");
        return result;

    } catch (error) {
        console.log(error);
        return null;
    }
}
const LoginServive = async (email, password) => {
    try {
        console.log("check mail>>>", email)
        const user = await User.findOne({ email });
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return {
                    EC: 2,
                    EM: "email/pass ko đúng",
                }
            } else {

                ////acccsettoke
                payload = {
                    _id: user._id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                }
                const access_token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE })
                return {
                    EC: 0,
                    access_token,
                    user: {
                        _id: user._id,
                        email: user.email,
                        name: user.name,
                        role: user.role,
                    }
                };
            }
        } else {
            return {
                EC: 1,
                EM: "email/pass ko đúng"
            }
        }

    } catch (error) {
        return { success: false, message: error.message };
    }
}
const saltRouds = 10
const createUserService = async (userData) => {
    try {
        const { name, email, password, role } = userData;

        const hashPassword = await bcrypt.hash(password, saltRouds)

        const newUser = new User({
            name,
            email,
            password: hashPassword,
            role
        });


        await newUser.save();

        return { success: true, message: "Tạo user thành công", user: newUser };
    } catch (error) {
        console.error("Lỗi:", error);
        return { success: false, message: "Lỗi máy chủ" };
    }
};

module.exports = {
    getUserServive, createUserService, LoginServive

}