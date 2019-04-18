const query = require('../query');

module.exports = {
    calMoney: async (req, res) => {
        try {
            req.body.client_id = req.currentClient;
            const testTime = await query.test(req.body);
            res.json(testTime);
        } catch (err) {
            return res.json({
                result_code: 500,
                message: 'Some error occurred. Please try again',
                error: err.message,
            });
        }
    },
};
