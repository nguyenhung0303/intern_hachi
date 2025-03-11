const multer = require('multer');
const path = require('path');

// Cấu hình nơi lưu file

const uploadDir = path.join(__dirname, '..', 'public', 'Upload');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Lưu file vào thư mục uploads/
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Đổi tên file tránh trùng
    }
});

// Kiểm tra file có hợp lệ không
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Chỉ hỗ trợ các định dạng ảnh JPG, PNG, GIF!'), false);
    }
};

// Cấu hình multer
const upload = multer({
    storage,
    fileFilter
});

module.exports = upload; 
