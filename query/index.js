const Promise = require('bluebird');
const moment = require('moment');
const {sequelize} = require('../models');

moment().format();

module.exports = {
    insertClientRequest: async (data) => {
        try {
            const startOfMonth = moment().startOf('month').format('YYYY-MM-DD HH:mm:ss');
            const endOfMonth = moment().endOf('month').format('YYYY-MM-DD HH:mm:ss');
            const response = await sequelize.query(`
                INSERT INTO client_requests(client_price_plan_id, campaign_id, request_no, using_status, client_id, response_code, createdAt, updatedAt) 
                VALUES 
                 (
                   (
                     SELECT client_price_plans.id FROM client_price_plans 
                     WHERE client_id = '${data.client_id}'
                     AND using_status = '1'
                   ),
                   (
                     SELECT client_price_plans.campaign_id FROM client_price_plans 
                     WHERE client_id = '${data.client_id}'
                     AND using_status = '1'
                   ),
                   (
                     SELECT COUNT(*)
                     FROM client_requests cr 
                     WHERE cr.createdAt BETWEEN '${startOfMonth}' AND '${endOfMonth}'
                     AND cr.client_id = '${data.client_id}'
                   ) + 1,
                   1,
                  ${data.client_id},
                  ${data.resultOcr.result_code},
                  now(), 
                  now()
                )
            `, {type: sequelize.QueryTypes.INSERT});
            return Promise.resolve(response);
        } catch (err) {
            return Promise.reject(err);
        }
    },
    insertOcrRequest: async (data) => {
        try {
            const response = await sequelize.query(`
            INSERT INTO ocr_requests(client_request_id, client_id, result_code, file_path, ocr_text, using_status, createdAt, updatedAt)
            VALUES 
              (
                ${data.lastInsertId}, 
                ${data.client_id}, 
                ${data.resultOcr.result_code}, 
                '${data.image}', 
                '${data.ocr_text}',
                1,
                now(), 
                now()
              )
            `, {type: sequelize.QueryTypes.INSERT});
            return Promise.resolve(response);
        } catch (err) {
            return Promise.reject(err);
        }
    },
    countRequestNoCampaign: async (data) => {
        try {
            const startOfMonth = moment().startOf('month').format('YYYY-MM-DD HH:mm:ss');
            const endOfMonth = moment().endOf('month').format('YYYY-MM-DD HH:mm:ss');
            const response = await sequelize.query(`
               SELECT 
                   pl.from,
                   pl.to,
                   pl.price,
                   cpp.id as client_price_plan_id,
                   (
                     SELECT
                       SUM(cr.response_code = 200)
                       FROM client_requests cr 
                       WHERE cr.createdAt BETWEEN '${startOfMonth}' AND '${endOfMonth}'
                       AND cr.client_id = '${data.client_id}'
                       AND cr.campaign_id IS NULL
                   )  AS total200NoCampaign,
                   (
                     SELECT
                       SUM(cr.response_code = 500)
                       FROM client_requests cr 
                       WHERE cr.createdAt BETWEEN '${startOfMonth}' AND '${endOfMonth}'
                       AND cr.client_id = '${data.client_id}'
                       AND cr.campaign_id IS NULL
                   )  AS total500NoCampaign,
                   (
                     SELECT
                       SUM(cr.response_code = 503)
                       FROM client_requests cr 
                       WHERE cr.createdAt BETWEEN '${startOfMonth}' AND '${endOfMonth}'
                       AND cr.client_id = '${data.client_id}'
                       AND cr.campaign_id IS NULL
                   )  AS total503NoCampaign,
                   (
                     SELECT
                       COUNT(cr.response_code)
                       FROM client_requests cr 
                       WHERE cr.createdAt BETWEEN '${startOfMonth}' AND '${endOfMonth}'
                       AND cr.client_id = '${data.client_id}'
                       AND cr.campaign_id IS NULL
                   )  AS totalAllNoCampaign,
                   (
                     SELECT
                       SUM(cr.response_code = 200)
                       FROM client_requests cr 
                       WHERE cr.createdAt BETWEEN '${startOfMonth}' AND '${endOfMonth}'
                       AND cr.client_id = '${data.client_id}'
                   )  AS total200,
                   (
                     SELECT
                       SUM(cr.response_code = 500)
                       FROM client_requests cr 
                       WHERE cr.createdAt BETWEEN '${startOfMonth}' AND '${endOfMonth}'
                       AND cr.client_id = '${data.client_id}'
                   )  AS total500,
                   (
                     SELECT
                       SUM(cr.response_code = 503)
                       FROM client_requests cr 
                       WHERE cr.createdAt BETWEEN '${startOfMonth}' AND '${endOfMonth}'
                       AND cr.client_id = '${data.client_id}'
                   )  AS total503,
                   (
                     SELECT
                       COUNT(cr.response_code)
                       FROM client_requests cr 
                       WHERE cr.createdAt BETWEEN '${startOfMonth}' AND '${endOfMonth}'
                       AND cr.client_id = '${data.client_id}'
                   )  AS totalAll
               FROM price_levels pl
                   JOIN client_price_plans cpp ON cpp.price_plan_id = pl.price_plan_id AND cpp.client_id = '${data.client_id}'
                 
            `, {type: sequelize.QueryTypes.SELECT});
            return Promise.resolve(response);
        } catch (err) {
            return Promise.reject(err);
        }
    },
    countRequestHaveCampaign: async (data) => {
        try {
            const startOfMonth = moment().startOf('month').format('YYYY-MM-DD HH:mm:ss');
            const endOfMonth = moment().endOf('month').format('YYYY-MM-DD HH:mm:ss');
            const response = await sequelize.query(`
                SELECT 
                    cr.request_no,
                    cr.response_code,
                    cp.discount,
                    cp.type
                 FROM client_requests cr
                     JOIN campaigns cp ON cp.id = cr.campaign_id
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
