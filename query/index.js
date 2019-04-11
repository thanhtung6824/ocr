const Promise = require('bluebird');
const {sequelize} = require('../models');

module.exports = {
    insertClientRequest: async (data) => {
        try {
            const response = await sequelize.query(`
                INSERT INTO client_requests(client_price_plan_id, client_id, response_code, createdAt, updatedAt) 
                VALUES (
                (SELECT client_price_plans.id FROM client_price_plans 
                 WHERE client_id = '${data.client_id}'),
                  ${data.client_id},
                  ${data.resultOcr.result_code},
                now(), now())
            `, {type: sequelize.QueryTypes.INSERT});
            return Promise.resolve(response);
        } catch (err) {
            return Promise.reject(err);
        }
    },
    insertOcrRequest: async (data) => {
        try {
            const response = await sequelize.query(`
            INSERT INTO ocr_requests(client_request_id, client_id, result_code, file_path, ocr_text, createdAt, updatedAt)
            VALUES (
            LAST_INSERT_ID(), ${data.client_id}, ${data.resultOcr.result_code}, '${data.image}', '${data.ocr_text}', now(), now()
            )
            `, {type: sequelize.QueryTypes.INSERT});
            return Promise.resolve(response);
        } catch (err) {
            return Promise.reject(err);
        }
    },
};
