export const fileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|pdf)$/)) {
        return callback(new Error('Only image files are allowed!'), false);
    }
    callback(null, true);
};
export const pdfFileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(pdf)$/)) {
        return callback(new Error('Only pdf files are allowed!'), false);
    }
    callback(null, true);
};
