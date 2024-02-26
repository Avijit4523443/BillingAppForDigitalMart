const multer = require('multer');

const uploadFile = multer({limits:{fileSize:1024*500}}).single('file');

module.exports = uploadFile;