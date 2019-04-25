const Promise = require('bluebird');
const query = require('../query');

const countMoneyNoCampaigns = async (data, requestLevel, amountInfo) => {
    try {
        const requestsNoCampaign = await query.countRequestNoCampaign(data);
        let totalAmount = 0;
        requestsNoCampaign.forEach((value) => {
            const levelOfRequest = requestLevel
                .find(o => o.from <= value.request_no && o.to >= value.request_no);
            let totalAmountOfThisLevel = 0;
            if (value.response_code === 200) {
                totalAmount += +levelOfRequest.price;
                totalAmountOfThisLevel = +levelOfRequest.price;
            }
            amountInfo[`level${requestLevel.indexOf(levelOfRequest) + 1}`].totalAmount += totalAmountOfThisLevel; // eslint-disable-line
        });
        return Promise.resolve(totalAmount);
    } catch (err) {
        return Promise.reject(err);
    }
};

const countMoneyHaveCampaigns = async (data, requestLevel, amountInfo) => {
    const requestHaveCampaigns = await query.countRequestHaveCampaign(data);
    let totalAmount = 0;
    requestHaveCampaigns.forEach((value) => {
        const levelOfRequest = requestLevel
            .find(o => o.from <= value.request_no && o.to >= value.request_no);
        let totalAmountOfThisLevel = 0;
        if (value.response_code === 200) {
            if (value.type === '%') {
                totalAmount += +levelOfRequest.price - (+levelOfRequest.price * (+value.discount)) / 100; // eslint-disable-line
                totalAmountOfThisLevel = +levelOfRequest.price - (+levelOfRequest.price * (+value.discount)) / 100; // eslint-disable-line
            } else {
                totalAmount += +levelOfRequest.price - (+value.discount);
                totalAmountOfThisLevel = +levelOfRequest.price - (+value.discount);
            }
        }
        amountInfo[`level${requestLevel.indexOf(levelOfRequest) + 1}`].totalAmount += totalAmountOfThisLevel; // eslint-disable-line
    });
    return Promise.resolve(totalAmount);
};

module.exports = {
    calculateMoney: async (data) => {
        try {
            const requestLevel = await query.findRequestLevel(data);
            const amountInfo = {};
            requestLevel.forEach((val, idx) => {
                amountInfo[`level${idx + 1}`] = {
                    totalAmount: 0,
                    request200: 0,
                    request500: 0,
                    request503: 0,
                    from: val.from,
                    to: val.to,
                };
            });
            const moneyNoCampaign = await countMoneyNoCampaigns(data, requestLevel, amountInfo);
            const moneyHaveCampaign = await countMoneyHaveCampaigns(data, requestLevel, amountInfo); //eslint-disable-line
            const totalAmount = moneyNoCampaign + moneyHaveCampaign;
            const reportData = await query.findReportData(requestLevel, data.client_id);
            Object.keys(amountInfo).forEach((key) => {
                amountInfo[key].request200 = reportData.length ? +reportData[0][`${key}_request200`] : 0;
                amountInfo[key].request500 = reportData.length ? +reportData[0][`${key}_request500`] : 0;
                amountInfo[key].request503 = reportData.length ? +reportData[0][`${key}_request503`] : 0;
            });
            const reportDataInsert = {
                client_id: data.client_id,
                client_price_plan_id: requestLevel[0].client_price_plan_id,
                totalAmount,
                total200: reportData.length ? +reportData[0].total200 : 0,
                total500: reportData.length ? +reportData[0].total500 : 0,
                total503: reportData.length ? +reportData[0].total503 : 0,
                totalAll: reportData.length ? +reportData[0].totalAll : 0,
                amount_info: amountInfo,
            };
            return Promise.resolve(reportDataInsert);
        } catch (err) {
            console.log(err);
            return Promise.reject(err);
        }
    },
};
