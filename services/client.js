const Promise = require('bluebird');
const {sequelize} = require('../models');

module.exports = {
    isApiKeyValid: async (data) => {
        try {
            const response = await sequelize.query(`
                SELECT clients.id, api_key FROM clients
                WHERE api_key = '${data}'
            `, {type: sequelize.QueryTypes.SELECT});
            return Promise.resolve({
                isApiKeyValid: response.length ? !!response[0].api_key : false,
                clientId: response.length ? response[0].id : null,
            });
        } catch (err) {
            return Promise.reject(err);
        }
    },
    checkAllowUsing: async (data) => {
        try {
            const response = await sequelize.query(`
                SELECT using_status FROM client_contracts
                WHERE client_contracts.client_id = '${data.client_id}'
            `, {type: sequelize.QueryTypes.SELECT});
            return Promise.resolve(response);
        } catch (err) {
            return Promise.reject(err);
        }
    },
};
