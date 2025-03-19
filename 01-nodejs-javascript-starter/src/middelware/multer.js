const multer = require('multer');
const path = require('path');

// Cấu hình nơi lưu file

const uploadDir = path.join(__dirname, '..', 'public', 'Upload');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Lưu file vào thư mục uploads/
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
    }

});

// Kiểm tra file có hợp lệ không
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'jpg', 'webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Chỉ hỗ trợ các định dạng ảnh JPG, PNG, GIF!'), false);
    }
};

// Cấu hình multers
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }
});

module.exports = upload; 
