const Promise = require('bluebird');
const moment = require('moment');
const {sequelize} = require('../models');

moment().format();

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
    test: async (data) => {
        try {
            const startOfMonth = moment().startOf('month').format('YYYY-MM-DD HH:mm:ss');
            const endOfMonth = moment().endOf('month').format('YYYY-MM-DD HH:mm:ss');

            const response = await sequelize.query(`
            SELECT 
              client_requests.id,
                 CONCAT('response',response_code) response_code,
              COUNT(case 
              when client_requests.response_code = 200 then 
              1 else 0
               end) 

--              (
--               SELECT SUM(case 
--               when client_requests.response_code = 200 then 
--               1 else 0
--                end) FROM client_requests)
                
                as resquest200,
              client_price_plan_id,
              client_requests.client_id, 
              response_code,
              client_requests.createdAt, 
              client_requests.updatedAt 
            FROM client_requests
            JOIN client_price_plans
            ON client_requests.client_price_plan_id = client_price_plans.id
            JOIN price_levels
            ON client_requests.client_price_plan_id = price_levels.price_plan_id
            WHERE client_requests.createdAt >= '${startOfMonth}'
            AND client_requests.createdAt <= '${endOfMonth}'
            AND client_requests.client_id = '${data.client_id}'
            GROUP BY client_requests.id
            `, {type: sequelize.QueryTypes.SELECT});
            return Promise.resolve(response);
        } catch (err) {
            return Promise.reject(err);
        }
    },
};
