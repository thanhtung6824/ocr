const Promise = require('bluebird');
const {client, sequelize} = require('../models');

module.exports = {
    isApiKeyValid: async (data) => {
        try {
            const apiKey = await client.findAll({
                where: {
                    api_key: data,
                },
                attributes: ['api_key'],
                raw: true,
            });
            return Promise.resolve(!!apiKey.length);
        } catch (err) {
            return Promise.reject(err);
        }
    },
    checkAllowUsing: async (data) => {
        try {
            const response = await sequelize.query(`
                SELECT using_status, client_id FROM client_contracts
                JOIN clients
                ON clients.id = client_contracts.client_id
                WHERE clients.api_key = '${data.api_key}'
            `, {type: sequelize.QueryTypes.SELECT});
            return Promise.resolve(response);
        } catch (err) {
            return Promise.reject(err);
        }
    },
};
