const path = require('path');
const multer = require('multer');
const rp = require('request-promise');
const sharp = require('sharp');
const fs = require('fs');
const uploadService = require('../services/upload');
const clientService = require('../services/client');
const query = require('../query');
const {
    deleteFile,
    enCrypted,
    timeout,
} = require('../helpers/shared');
const constants = require('../constants/constants');
const {uploadSingleValidator, uploadMultipleValidator} = require('../validator/uploadValidator');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/uploads/'));
    },
    filename: (req, file, cb) => {
        const photoCode = Math.random();
        const fileName = photoCode + Date.now() + path.extname(file.originalname);
        cb(null, fileName);
    },
});

const fileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/)) {
        return cb(new Error('Only image is allow'));
    }
    return cb(null, true);
};

const multerOptions = {
    storage,
    fileFilter,
    limits: {fileSize: 1024 * 1024 * 3},
};

const uploadSingle = multer(multerOptions).single('image');
const uploadMultiple = multer(multerOptions).fields([
    {name: 'image_back', maxCount: 1},
    {name: 'image_front', maxCount: 1}]);

module.exports = {
    upload: async (req, res) => {
        uploadSingle(req, res, async (err) => { // eslint-disable-line
            try {
                if (err) {
                    console.log(err);
                    if (req.file) {
                        deleteFile(req.file.path);
                    }
                    return res.json({
                        result_code: 500,
                        message: 'Some error occurred. Please try again',
                        err: err.message,
                    });
                }
                // if (+req.body.encode === 2) {
                //     const PhotoCode = Math.random();
                //     const fileName = PhotoCode + Date.now() + '.jpg';
                //     filePath = path.join(__dirname, '../public/uploads/' + fileName);
                //     req.body.image = Buffer.from(req.body.image).toString('base64')
                //     var buf = Buffer.from(req.body.image, 'base64');
                //
                //     fs.writeFile(filePath, buf, function (error) {
                //         if (error) {
                //             throw error;
                //         } else {
                //             console.log('File created from base64 string!');
                //             return true;
                //         }
                //     });
                //     req.body.image = `/uploads/${fileName}`;
                // }

                if (!req.file) {
                    req.body.image = '';
                } else {
                    req.body.image = `/uploads/${req.files[0].filename}`;
                }
                req.checkBody(uploadSingleValidator);
                const errors = req.validationErrors();
                if (errors) {
                    if (req.files.length) {
                        deleteFile(req.file.path);
                    }
                    return res.json({
                        result_code: 422,
                        errors,
                    });
                }
                req.body.api_key = req.headers.api_key || req.body.api_key || req.query.api_key;
                req.body.client_id = req.currentClient;
                const allowUsing = await clientService.checkAllowUsing(req.body);
                if (allowUsing[0].using_status !== 1) {
                    return res.json({
                        result_code: 500,
                        message: 'Please recharge to continue using',
                    });
                }
                const formData = {};
                if (req.body.encode === 1) {
                    const stream = fs.createReadStream(req.file.path);
                    formData.image = stream;
                    formData.encode = req.body.encode;
                    stream.on('end', () => stream.destroy());
                }
                const options = {
                    uri: constants.OCR_UPLOAD_API,
                    method: 'POST',
                    headers: {
                        'api-key': req.headers.api_key,
                    },
                    formData,
                    json: true,
                };
                deleteFile(req.file.path);
                const resultOcr = await rp(options);
                req.body.resultOcr = resultOcr;
                await query.insertClientRequest(req.body);
                req.body.ocr_text = enCrypted(JSON.stringify(req.body.resultOcr));
                await query.insertOcrRequest(req.body);
                return res.json(resultOcr);
            } catch (err) { // eslint-disable-line
                if (req.files) {
                    deleteFile(req.file.path);
                }
                return res.json({
                    result_code: 500,
                    message: 'Some error occurred. Please try again',
                    error: err.message,
                });
            }
        });
    },
    uploadSingleTenTen: (req, res) => {
        uploadSingle(req, res, async (err) => {
            try {
                if (err) {
                    console.log(err);
                    if (req.file) {
                        deleteFile(req.file.path);
                    }
                    return res.json({
                        result_code: 500,
                        message: 'Some error occurred. Please try again',
                        err: err.message,
                    });
                }
                if (!req.file) {
                    req.body.image = '';
                } else {
                    req.body.image = `/uploads/${req.file.filename}`;
                }
                req.checkBody(uploadSingleValidator);
                const errors = req.validationErrors();
                if (errors) {
                    if (req.file) {
                        deleteFile(req.file.path);
                    }
                    return res.json({
                        result_code: 422,
                        errors,
                    });
                }
                req.body.client_id = req.currentClient;
                const allowUsing = await clientService.checkAllowUsing(req.body);
                if (allowUsing[0].using_status !== 1) {
                    if (req.file) {
                        deleteFile(req.file.path);
                    }
                    return res.json({
                        result_code: 500,
                        message: 'Please recharge to continue using',
                    });
                }
                if (req.file.size > 1024 * 1024 * 3) {
                    const photoCode = Math.random();
                    const fileName = photoCode + Date.now();
                    const imageResize = await sharp(req.file.path)
                        .resize({width: 1980})
                        .toFile(path.join(__dirname, `../public/uploads/${fileName}.jpg`));
                    if (imageResize.size > 1024 * 1024 * 3) {
                        deleteFile(req.file.path);
                        deleteFile(path.join(__dirname, `../public/uploads/${fileName}.jpg`));
                        return res.json({
                            result_code: 500,
                            message: 'Image too large',
                        });
                    }
                    deleteFile(req.file.path);
                    req.file.path = path.join(__dirname, `../public/uploads/${fileName}.jpg`);
                    req.body.image = `/uploads/${fileName}.jpg`;
                }
                const formData = {};
                const stream = fs.createReadStream(req.file.path);
                formData.image = stream;
                formData.encode = req.body.encode;
                stream.on('end', () => stream.destroy());
                const options = {
                    uri: constants.OCR_LOCAL_UPLOAD_API,
                    method: 'POST',
                    headers: {
                        'api-key': req.headers['api-key'],
                    },
                    formData,
                    json: true,
                };
                const resultOcr = await rp(options);
                req.body.resultOcr = resultOcr;
                await query.insertClientRequest(req.body);
                req.body.ocr_text = enCrypted(JSON.stringify(req.body.resultOcr));
                await query.insertOcrRequest(req.body);
                return res.json(resultOcr);
            } catch (err) { // eslint-disable-line
                console.log(err);
                req.body.resultOcr = {};
                req.body.resultOcr.result_code = 503;
                await query.insertClientRequest(req.body);
                if (req.file) {
                    deleteFile(req.file.path);
                }
                return res.json({
                    result_code: 500,
                    message: 'Some error occurred. Please try again',
                    error: err.message,
                });
            }
        });
    },
    uploadMultipleTenTen: (req, res) => {
        uploadMultiple(req, res, async (err) => {
            try {
                if (err) {
                    console.log(err);
                    if (req.file) {
                        deleteFile(req.file.path);
                    }
                    return res.json({
                        result_code: 500,
                        message: 'Some error occurred. Please try again',
                        err: `${err.message} ${err.field}`,
                    });
                }
                if (!req.files.image_front) {
                    req.body.image_front = '';
                } else {
                    req.body.image_front = `/uploads/${req.files.image_front[0].filename}`;
                }
                if (!req.files.image_back) {
                    req.body.image_back = '';
                } else {
                    req.body.image_back = `/uploads/${req.files.image_back[0].filename}`;
                }
                req.checkBody(uploadMultipleValidator);
                const errors = req.validationErrors();
                if (errors) {
                    if (req.files.image_front) {
                        deleteFile(req.files.image_front[0].path);
                    }
                    if (req.files.image_back) {
                        deleteFile(req.files.image_back[0].path);
                    }
                    return res.json({
                        result_code: 422,
                        errors,
                    });
                }
                req.body.client_id = req.currentClient;
                const allowUsing = await clientService.checkAllowUsing(req.body);
                if (allowUsing[0].using_status !== 1) {
                    if (req.files.image_front) {
                        deleteFile(req.files.image_front[0].path);
                    }
                    if (req.files.image_back) {
                        deleteFile(req.files.image_back[0].path);
                    }
                    return res.json({
                        result_code: 500,
                        message: 'Please recharge to continue using',
                    });
                }
                if (req.files.image_front[0].size > 1024 * 1024) {
                    const photoCode = Math.random();
                    const fileName = photoCode + Date.now();
                    const imageResizeFront = await sharp(req.files.image_front[0].path)
                        .resize({width: 1980})
                        .toFile(path.join(__dirname, `../public/uploads/${fileName}.jpg`));
                    if (imageResizeFront.size > 1024 * 1024 * 3) {
                        deleteFile(req.files.image_front[0].path);
                        deleteFile(path.join(__dirname, `../public/uploads/${fileName}.jpg`));
                        return res.json({
                            result_code: 500,
                            message: 'Image front too large',
                        });
                    }
                    deleteFile(req.files.image_front[0].path);
                    req.files.image_front[0].path = path.join(__dirname, `../public/uploads/${fileName}.jpg`);
                }

                if (req.files.image_back[0].size > 1024 * 1024) {
                    const photoCode = Math.random();
                    const fileName = photoCode + Date.now();
                    const imageResizeBack = await sharp(req.files.image_back[0].path)
                        .resize({width: 1980})
                        .toFile(path.join(__dirname, `../public/uploads/${fileName}.jpg`));
                    if (imageResizeBack.size > 1024 * 1024 * 3) {
                        deleteFile(req.files.image_back[0].path);
                        deleteFile(path.join(__dirname, `../public/uploads/${fileName}.jpg`));
                        return res.json({
                            result_code: 500,
                            message: 'Image back too large',
                        });
                    }
                    deleteFile(req.files.image_back[0].path);
                    req.files.image_back[0].path = path.join(__dirname, `../public/uploads/${fileName}.jpg`);
                }
                const response = [];
                await Promise.all([0, 1].map(async (val) => {
                    req.body.image = req.body.image_front;
                    if (val === 1) {
                        await timeout(2000);
                        req.body.image = req.body.image_back;
                    }
                    const formData = {};
                    const stream = val === 0 ? fs.createReadStream(req.files.image_front[0].path)
                        : fs.createReadStream(req.files.image_back[0].path);
                    formData.image = stream;
                    formData.encode = req.body.encode;
                    stream.on('end', () => stream.destroy());
                    const options = {
                        uri: constants.OCR_LOCAL_UPLOAD_API,
                        method: 'POST',
                        headers: {
                            'api-key': req.headers['api-key'],
                        },
                        formData,
                        json: true,
                    };
                    const resultOcr = await rp(options);
                    req.body.resultOcr = resultOcr;
                    await query.insertClientRequest(req.body);
                    req.body.ocr_text = enCrypted(JSON.stringify(req.body.resultOcr));
                    await query.insertOcrRequest(req.body);
                    response.push(resultOcr);
                }));
                return res.json(response);
            } catch (err) { // eslint-disable-line
                console.log(err);
                req.body.resultOcr = {};
                req.body.resultOcr.result_code = 503;
                await query.insertClientRequest(req.body);
                if (req.files.image_front) {
                    deleteFile(req.files.image_front[0].path);
                }
                if (req.files.image_back) {
                    deleteFile(req.files.image_back[0].path);
                }
                req.body.resultOcr.result_code = 503;
                await query.insertClientRequest(req.body);
                return res.json({
                    result_code: 500,
                    message: 'Some error occurred. Please try again',
                    error: err.message,
                });
            }
        });
    },
};
