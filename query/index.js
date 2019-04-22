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
            SELECT cr.id,
                SUM(cr.response_code = 200) AS cnt200,
                SUM(cr.response_code = 500) AS cnt500,
                SUM(cr.response_code = 503) AS cnt503,
                MIN(cr.createdAt),
                MAX(cr.updatedAt)
            FROM client_requests cr 
                INNER JOIN 
                 (
                 SELECT * FROM  
                  client_price_plans cpp 
                  GROUP BY cpp.id
                 ) ON cr.client_price_plan_id = cpp.id AND cr.client_id = cpp.client_id
                INNER JOIN price_levels pl ON cpp.id = pl.price_plan_id
            WHERE cr.createdAt BETWEEN '${startOfMonth}' AND '${endOfMonth}'
                AND cr.client_id = '${data.client_id}'
            GROUP BY cr.id
            `, {type: sequelize.QueryTypes.SELECT});
            return Promise.resolve(response);
        } catch (err) {
            return Promise.reject(err);
        }
    },
};
