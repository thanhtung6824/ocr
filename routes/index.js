const express = require('express');
const clientService = require('../services/client');
const uploadController = require('../controllers/uploadController');
const calculateController = require('../controllers/calculateController');
const viewController = require('../controllers/viewController');
const constants = require('../constants/constants');

const router = express.Router();


router.get('/', (req, res) => {
    res.render('index', {title: 'Express'});
});


router.use(async (req, res, next) => {
    try {
        const apiKey = req.headers['api-key'];
        if (!apiKey) {
            return res.json({
                result_code: 405,
                message: 'Not found api key',
            });
        }
        const {isApiKeyValid, clientId} = await clientService.isApiKeyValid(apiKey);
        if (!isApiKeyValid) {
            return res.json({
                result_code: 405,
                message: 'Api key not valid',
            });
        }
        req.currentClient = clientId;
        return next();
    } catch (err) {
        return res.json({
            result_code: 500,
            message: 'Some error occurred. Please try again',
            error: err.message,
        });
    }
});


router.get('/listDocument', (req, res) => {
    try {
        const response = {
            result_code: 200,
            web_page: constants.WEB_PAGE,
            document: [
                {
                    id: 1,
                    name: 'ID card',
                    url: constants.OCR_UPLOAD_API_APP,
                    image: 'https://tenten.smartocr.vn/images/cmt.png',
                    has_back: true,
                    active: true,
                    language: 'VN',
                },
                {
                    id: 2,
                    name: 'Passport',
                    image: 'https://tenten.smartocr.vn/images/passport.png',
                    has_back: false,
                    active: true,
                    url: constants.OCR_PASSPORT_VN,
                    language: 'VN',
                },
                {
                    id: 3,
                    name: 'Document',
                    image: 'https://tenten.smartocr.vn/images/hoadon.jpg',
                    has_back: true,
                    active: false,
                    inactive_msg: constants.INACTIVE_MSG_VN,
                    inactive_msg_en: 'This function will available at xxxx',
                    inactive_msg_jp: constants.INACTIVE_MSG_JP,
                    language: 'VN',
                },
                {
                    id: 4,
                    name: 'Written document',
                    image: 'https://tenten.smartocr.vn/images/viettay.jpg',
                    has_back: true,
                    active: false,
                    inactive_msg: constants.INACTIVE_MSG_VN,
                    inactive_msg_en: 'This function will available at xxxx',
                    inactive_msg_jp: constants.INACTIVE_MSG_JP,
                    language: 'VN',
                },
                {
                    id: 5,
                    name: 'IMEI',
                    image: 'https://tenten.smartocr.vn/images/imei-good.jpg',
                    has_back: true,
                    active: false,
                    inactive_msg: constants.INACTIVE_MSG_VN,
                    inactive_msg_en: 'This function will available at xxxx',
                    inactive_msg_jp: constants.INACTIVE_MSG_JP,
                    language: 'VN',
                },
                {
                    id: 6,
                    name: '運転免許証',
                    has_back: false,
                    url: constants.OCR_BLX_JP,
                    image: 'https://tenten.smartocr.vn/images/blx_jp.png',
                    active: true,
                    language: 'JP',
                },
                {
                    id: 7,
                    name: 'パスポート',
                    image: 'https://tenten.smartocr.vn/images/passport_jp.png',
                    has_back: false,
                    active: true,
                    url: constants.OCR_PASSPORT_JP,
                    language: 'JP',
                },
                {
                    id: 8,
                    name: '保険証',
                    has_back: false,
                    active: true,
                    image: 'https://tenten.smartocr.vn/images/baohiem_jp.png',
                    url: constants.OCR_BAOHIEM_JP,
                    language: 'JP',
                },
                {
                    id: 9,
                    name: 'マイナンバーカード',
                    has_back: true,
                    active: false,
                    inactive_msg: constants.INACTIVE_MSG_VN,
                    inactive_msg_en: 'This function will available at xxxx',
                    inactive_msg_jp: constants.INACTIVE_MSG_JP,
                    language: 'JP',
                },
                {
                    id: 10,
                    name: '在留カード',
                    has_back: true,
                    active: false,
                    inactive_msg: constants.INACTIVE_MSG_VN,
                    inactive_msg_en: 'This function will available at xxxx',
                    inactive_msg_jp: constants.INACTIVE_MSG_JP,
                    language: 'JP',
                },
                {
                    id: 11,
                    name: 'Driving license',
                    has_back: false,
                    image: 'https://tenten.smartocr.vn/images/blx_vn.png',
                    active: true,
                    url: constants.OCR_BLX_VN,
                    language: 'VN',
                },
            ],
        };
        return res.json(response);
    } catch (err) {
        return res.json({
            result_code: 500,
            message: 'Some error occurred. Please try again',
            error: err.message,
        });
    }
});


router.post('/upload_single', uploadController.uploadSingleTenTen);
router.post('/upload_multiple', uploadController.uploadMultipleTenTen);
router.post('/calculateMoney', calculateController.calMoney);
router.get('/viewRequests', viewController.viewRequests);

module.exports = router;
