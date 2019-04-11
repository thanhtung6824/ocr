const path = require('path');
const multer = require('multer');
const rp = require('request-promise');
const fs = require('fs');
const uploadService = require('../services/upload');
const clientService = require('../services/client');
const query = require('../query');
const {
    deleteFile,
    endCrypted,
    deCrypted,
} = require('../helpers/shared');
const constants = require('../constants/constants');
const {uploadValidator} = require('../validator/uploadValidator');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/uploads/'));
    },
    filename: (req, file, cb) => {
        const PhotoCode = Math.random();
        const fileName = PhotoCode + Date.now() + path.extname(file.originalname);
        cb(null, fileName);
    },
});

const fileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/)) {
        return cb(new Error('Only image is allow'));
    }
    return cb(null, true);
};

const upload = multer({storage, fileFilter}).any();

const beforeUpload = (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            if (req.files.length) {
                deleteFile(req.files[0].path);
            }
            return res.json({
                result_code: 500,
                message: 'Some error occurred. Please try again',
                err: err.message,
            });
        }
        if (req.files.length && req.files[0].size > 25411800) {
            deleteFile(req.files[0].path);
            return res.json({
                result_code: 422,
                message: 'Image is too large',
                err: err.message,
            });
        }
        return next();
    });
};

module.exports = {
    upload: async (req, res) => {
        beforeUpload(req, res, async () => { // eslint-disable-line
            try {
                if (!req.files.length) {
                    req.body.image = '';
                } else {
                    req.body.image = `/uploads/${req.files[0].filename}`;
                }
                req.checkBody(uploadValidator);
                const errors = req.validationErrors();
                if (errors) {
                    if (req.files.length) {
                        deleteFile(req.files[0].path);
                    }
                    return res.json({
                        result_code: 422,
                        errors,
                    });
                }
                req.body.api_key = req.headers.api_key || req.body.api_key || req.query.api_key;
                const allowUsing = await clientService.checkAllowUsing(req.body);
                if (allowUsing[0].using_status !== 1) {
                    return res.json({
                        result_code: 500,
                        message: 'Please recharge to continue using',
                    });
                }
                req.body.client_id = allowUsing[0].client_id;
                const formData = {};
                const stream = fs.createReadStream(req.files[0].path);
                formData.image = stream;
                formData.encode = req.body.encode;
                stream.on('end', () => stream.destroy());
                const options = {
                    uri: constants.OCR_UPLOAD_API,
                    method: 'POST',
                    headers: {
                        'api-key': req.headers.api_key,
                    },
                    formData,
                    json: true,
                };
                deleteFile(req.files[0].path);
                req.body.resultOcr = await rp(options);
                await query.insertClientRequest(req.body);
                req.body.ocr_text = endCrypted(JSON.stringify(req.body.resultOcr));
                await query.insertOcrRequest(req.body);
            } catch (err) { // eslint-disable-line
                if (req.files.length) {
                    deleteFile(req.files[0].path);
                }
                return res.json({
                    result_code: 500,
                    message: 'Some error occurred. Please try again',
                    error: err.message,
                });
            }
        });
    },
};
