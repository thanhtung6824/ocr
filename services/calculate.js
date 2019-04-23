const Promise = require('bluebird');
const query = require('../query');

module.exports = {
    calculateMoney: async (data) => {
        try {
            const requests = await query.countRequest(data);
            let totalAmount = 0;
            let dataReport = {};
            if (requests.length) {
                let totalRequestRemaining = requests[0].totalAll;
                const requestCountMoney = requests
                    .filter(v => v.from < totalRequestRemaining && v.to > totalRequestRemaining);
                console.log(requestCountMoney)
                requestCountMoney.forEach((request) => {
                    if (totalRequestRemaining > request.to) {
                        totalAmount += (request.to - request.from + 1) * (+request.price);
                        totalRequestRemaining -= request.to;
                        if (totalRequestRemaining < 0) {
                            totalRequestRemaining = 0;
                        }
                    } else {
                        totalAmount += totalRequestRemaining * (+request.price);
                    }
                });
            }
            console.log(totalAmount);
            return Promise.resolve(requests);
        } catch (err) {
            return Promise.reject(err);
        }
    },
};
