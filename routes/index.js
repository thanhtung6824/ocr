const express = require('express');
const clientService = require('../services/client');
const uploadController = require('../controllers/uploadController');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
    res.render('index', {title: 'Express'});
});

router.use(async (req, res, next) => {
    try {
        const apiKey = req.headers.api_key || req.body.api_key || req.query.api_key;
        if (!apiKey) {
            return res.json({
                result_code: 405,
                message: 'Not found api key',
            });
        }
        const isApiKeyValid = await clientService.isApiKeyValid(apiKey);
        if (!isApiKeyValid) {
            return res.json({
                result_code: 405,
                message: 'Api key not valid',
            });
        }
        return next();
    } catch (err) {
        return res.json({
            result_code: 500,
            message: 'Some error occurred. Please try again',
            error: err.message,
        });
    }
});

router.post('/test', uploadController.upload);


module.exports = router;
