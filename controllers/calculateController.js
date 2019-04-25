const moment = require('moment');
const calculateServices = require('../services/calculate');

moment().format();

module.exports = {
    calMoney: async (req, res) => {
        try {
            req.body.client_id = req.currentClient;
            req.body.startOfMonth = moment().startOf('month').format('YYYY-MM-DD HH:mm:ss');
            req.body.endOfMonth = moment().endOf('month').format('YYYY-MM-DD HH:mm:ss');

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
