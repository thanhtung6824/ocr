const Promise = require('bluebird');
const query = require('../query');

const countMoneyNoCampaigns = async (data) => {
    try {
        const requestsNoCampaign = await query.countRequestNoCampaign(data);
        let totalAmount = 0;
        const amountInfo = {};
        if (requestsNoCampaign.length) {
            let totalRequestRemaining = +requestsNoCampaign[0].total200NoCampaign;
            const requestNotCountMoney = [];
            const requestCountMoney = requestsNoCampaign
                .filter((v) => {
                    if (v.from <= totalRequestRemaining && v.to >= totalRequestRemaining) {
                        return true;
                    }
                    requestNotCountMoney.push(v);
                    return false;
                });
            requestCountMoney.forEach((request, index) => {
                let totalAmountLevel = 0;
                let totalRequestOfThisLevel = 0;
                if (totalRequestRemaining > request.to) {
                    totalAmount += (request.to - request.from + 1) * (+request.price);
                    totalAmountLevel = (request.to - request.from + 1) * (+request.price);
                    totalRequestRemaining -= request.to;
                    if (totalRequestRemaining < 0) {
                        totalRequestRemaining = 0;
                    }
                    totalRequestOfThisLevel = (request.to - request.from + 1);
                } else {
                    totalAmount += totalRequestRemaining * (+request.price);
                    totalAmountLevel = totalRequestRemaining * (+request.price);
                    totalRequestOfThisLevel = totalRequestRemaining;
                }
                amountInfo[`level${index + 1}`] = {
                    from: request.from,
                    to: request.to,
                    totalAmount: totalAmountLevel,
                    totalRequest: totalRequestOfThisLevel,
                };
                request.level = `level${index + 1}`;
            });
            requestNotCountMoney.forEach((request, index) => {
                amountInfo[`level${requestCountMoney.length + index + 1}`] = {
                    from: request.from,
                    to: request.to,
                    totalAmount: 0,
                    totalRequest: 0,
                };
                request.level = `level${requestCountMoney.length + index + 1}`;
            });
        }
        return Promise.resolve({moneyNoCampaign: totalAmount, requestsNoCampaign, amountInfo});
    } catch (err) {
        return Promise.reject(err);
    }
};

const countMoneyHaveCampaigns = async (data, requestsNoCampaign, amountInfo) => {
    const response = await query.countRequestHaveCampaign(data);
    let totalAmount = 0;
    response.forEach((value) => {
        const levelOfRequest = requestsNoCampaign
            .find(o => o.from <= value.request_no && o.to >= value.request_no);
        let totalAmountOfThisLevel = 0;
        let totalRequestOfThisLevel = 0;
        if (value.response_code === 200) {
            if (value.type === '%') {
                totalAmount += +levelOfRequest.price - (+levelOfRequest.price * (+value.discount)) / 100; // eslint-disable-line
                totalAmountOfThisLevel = +levelOfRequest.price - (+levelOfRequest.price * (+value.discount)) / 100; // eslint-disable-line
            } else {
                totalAmount += +levelOfRequest.price - (+value.discount);
                totalAmountOfThisLevel = +levelOfRequest.price - (+value.discount);
            }
            totalRequestOfThisLevel += 1;
        }
        amountInfo[levelOfRequest.level].totalAmount += totalAmountOfThisLevel; // eslint-disable-line
        amountInfo[levelOfRequest.level].totalRequest += totalRequestOfThisLevel; // eslint-disable-line
    });
    return Promise.resolve(totalAmount);
};

module.exports = {
    calculateMoney: async (data) => {
        try {
            const {
                moneyNoCampaign,
                requestsNoCampaign,
                amountInfo,
            } = await countMoneyNoCampaigns(data);
            const moneyHaveCampaign = await countMoneyHaveCampaigns(data, requestsNoCampaign, amountInfo); //eslint-disable-line
            const totalAmount = moneyNoCampaign + moneyHaveCampaign;
            const reportData = {
                client_id: data.client_id,
                client_price_plan_id: requestsNoCampaign[0].client_price_plan_id,
                total200: +requestsNoCampaign[0].total200,
                total500: +requestsNoCampaign[0].total500,
                total503: +requestsNoCampaign[0].total503,
                totalAll: requestsNoCampaign[0].totalAll,
                totalAmount,
                amount_info: amountInfo,
            };
            // console.log(moneyHaveCampaign);
            return Promise.resolve(reportData);
        } catch (err) {
            return Promise.reject(err);
        }
    },
};
