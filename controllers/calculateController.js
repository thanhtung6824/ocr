const calculateServices = require('../services/calculate');

module.exports = {
    calMoney: async (req, res) => {
        try {
            req.body.client_id = req.currentClient;
            const money = await calculateServices.calculateMoney(req.body);
            return res.json(money);
        } catch (err) {
            return res.json({
                result_code: 500,
                message: 'Some error occurred. Please try again',
                error: err.message,
            });
        }
    },
};
