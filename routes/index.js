const express = require('express');
const clientService = require('../services/client');
const uploadController = require('../controllers/uploadController');
const calculateController = require('../controllers/calculateController');

const router = express.Router();


router.get('/', (req, res) => {
    res.render('index', {title: 'Express'});
});

router.get('/listDocument', (req, res) => {
    console.log(req.headers);
    try {
        const response = {
            result_code: 200,
            web_page: '...',
            document: [
                {
                    id: 1,
                    name: 'CMND/CCCD',
                    name_en: 'CMND/CCCD',
                    name_jp: 'CMND/CCCD',
                    url: 'http://apitenten.smartocr.vn/id/v1/recognition',
                    image: '',
                    has_back: true,
                    active: true,
                    language: 'VN',
                },
                {
                    id: 2,
                    name: 'GPLX',
                    name_en: 'GPLX',
                    name_jp: 'GPLX',
                    has_back: true,
                    active: false,
                    inactive_msg: 'Chức năng sẽ hoạt động vào ngày xxxx',
                    inactive_msg_en: 'This function will available at xxxx',
                    inactive_msg_jp: '機能はその日に動作します xxxx',
                    language: 'VN',
                },
                {
                    id: 3,
                    name: 'HK',
                    name_en: 'HK',
                    name_jp: 'HK',
                    has_back: true,
                    active: false,
                    inactive_msg: 'Chức năng sẽ hoạt động vào ngày xxxx',
                    inactive_msg_en: 'This function will available at xxxx',
                    inactive_msg_jp: '機能はその日に動作します xxxx',
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


// router.use(async (req, res, next) => {
//     try {
//         const apiKey = req.headers.api_key || req.body.api_key || req.query.api_key;
//         if (!apiKey) {
//             return res.json({
//                 result_code: 405,
//                 message: 'Not found api key',
//             });
//         }
//         const {isApiKeyValid, clientId} = await clientService.isApiKeyValid(apiKey);
//         if (!isApiKeyValid) {
//             return res.json({
//                 result_code: 405,
//                 message: 'Api key not valid',
//             });
//         }
//         req.currentClient = clientId;
//         return next();
//     } catch (err) {
//         return res.json({
//             result_code: 500,
//             message: 'Some error occurred. Please try again',
//             error: err.message,
//         });
//     }
// });
//
// router.post('/test', uploadController.upload);
//
// router.post('/calculateMoney', calculateController.calMoney);

module.exports = router;
