
const { getUserServive, createUserService, LoginServive } = require('../services/UserServive')

const CreateUser = async (req, res) => {
    const result = await createUserService(req.body);

    if (result.success) {
        res.status(201).json(result);
    } else {
        res.status(400).json(result);
    }
};
const Login = async (req, res) => {
    const { email, password } = req.body;
    const data = await LoginServive(email, password);

    if (data.EC === 0) {
        return res.status(200).json(data);
    } else {
        return res.status(401).json(data);
    }
};
const GetUser = async (req, res) => {
    const data = await getUserServive()
    return res.status(200).json(data)
}
module.exports = {
    GetUser, CreateUser, Login
}