require('dotenv').config();
const express = require('express'); //commonjs
const configViewEngine = require('./config/viewEngine');
const apiRoutes = require('./routes/api');
const connection = require('./config/database');
const { getHomepage } = require('./controllers/homeController');
var cors = require('cors')
const multer = require('multer');
const path = require("path");


const app = express();
app.use(cors())
const port = process.env.PORT || 8888;

//config req.body
app.use(express.json()) // for json
app.use(express.urlencoded({ extended: true })) // for form data
app.use("/Upload", express.static(path.join(__dirname, "..", "public", "Upload")));
//config template engine
configViewEngine(app);

//khai báo route
app.use('/v1/api/', apiRoutes);


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Uploads/'); // Lưu vào thư mục uploads
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

(async () => {
    try {
        //using mongoose
        await connection();

        app.listen(port, '0.0.0.0', () => {
            console.log(`Backend Nodejs App listening on port ${port}`)
        })
    } catch (error) {
        console.log(">>> Error connect to DB: ", error)
    }
})()
