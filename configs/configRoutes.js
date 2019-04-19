exports.checkApiKey = (req, res, next) => {
    try {
        const apiKey = req.headers['api-key'];
        if (!apiKey) {
            return res.json({
                result_code: 405,
                message: 'Not found api key',
            });
        }
        if (apiKey !== 'a08eb42a-4a57-449b-84f4-1f67219f2679') {
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
};
