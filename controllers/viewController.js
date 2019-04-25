const moment = require('moment');
const query = require('../query');

moment().format();

module.exports = {
    viewRequests: async (req, res) => {
        try {
            req.query.client_id = req.currentClient;
            req.query.from = moment(req.query.from).format('YYYY-MM-DD 00:00:00');
            req.query.to = moment(req.query.to).format('YYYY-MM-DD 23:59:59');
            const response = await query.viewRequests(req.query);
            return res.json(response);
        } catch (err) {
            return res.json({
                result_code: 500,
                message: 'Some error occurred. Please try again',
                error: err.message,
            });
        }
    },
};
