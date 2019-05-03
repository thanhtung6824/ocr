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
            web_page: 'https://smartocr.vn/',
            document: [
                {
                    id: 1,
                    name: 'CMND/CCCD',
                    url: constants.OCR_UPLOAD_API_APP,
                    image: 'https://tenten.smartocr.vn/images/cmt.png',
                    has_back: true,
                    active: true,
                    language: 'VN',
                },
                {
                    id: 2,
                    name: 'Văn bản từ giấy tờ',
                    image: 'https://tenten.smartocr.vn/images/hoadon.jpg',
                    has_back: true,
                    active: false,
                    inactive_msg: constants.INACTIVE_MSG_VN,
                    inactive_msg_en: 'This function will available at xxxx',
                    inactive_msg_jp: constants.INACTIVE_MSG_JP,
                    language: 'VN',
                },
                {
                    id: 3,
                    name: 'Văn bản viết tay',
                    image: 'https://tenten.smartocr.vn/images/viettay.jpg',
                    has_back: true,
                    active: false,
                    inactive_msg: constants.INACTIVE_MSG_VN,
                    inactive_msg_en: 'This function will available at xxxx',
                    inactive_msg_jp: constants.INACTIVE_MSG_JP,
                    language: 'VN',
                },
                {
                    id: 4,
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
                    id: 5,
                    name: '運転免許証',
                    has_back: true,
                    active: false,
                    inactive_msg: constants.INACTIVE_MSG_VN,
                    inactive_msg_en: 'This function will available at xxxx',
                    inactive_msg_jp: constants.INACTIVE_MSG_JP,
                    language: 'JP',
                },
                {
                    id: 6,
                    name: '保険証',
                    has_back: true,
                    active: false,
                    inactive_msg: constants.INACTIVE_MSG_VN,
                    inactive_msg_en: 'This function will available at xxxx',
                    inactive_msg_jp: constants.INACTIVE_MSG_JP,
                    language: 'JP',
                },
                {
                    id: 7,
                    name: 'マイナンバーカード',
                    has_back: true,
                    active: false,
                    inactive_msg: constants.INACTIVE_MSG_VN,
                    inactive_msg_en: 'This function will available at xxxx',
                    inactive_msg_jp: constants.INACTIVE_MSG_JP,
                    language: 'JP',
                },
                {
                    id: 8,
                    name: '在留カード',
                    has_back: true,
                    active: false,
                    inactive_msg: constants.INACTIVE_MSG_VN,
                    inactive_msg_en: 'This function will available at xxxx',
                    inactive_msg_jp: constants.INACTIVE_MSG_JP,
                    language: 'JP',
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
