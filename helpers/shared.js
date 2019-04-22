const fs = require('fs');
const destroy = require('destroy');
const crypto = require('crypto');

const algorithm = 'aes256'; // or any other algorithm supported by OpenSSL
const keyEncode = 'OIUK1VUAR63SCTO4L4Q9UVMWOWIR2UEZ';
const IV = Buffer.from(crypto.randomBytes(16));


module.exports = {
    deleteFile: (filePath) => {
        if (fs.existsSync(filePath)) {
            const stream = fs.unlinkSync(filePath);
            destroy(stream);
        }
    },
    enCrypted: (data) => {
        const cipher = crypto.createCipheriv(algorithm, keyEncode, IV);
        return cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
    },
    deCrypted: (encrypted) => {
        const decipher = crypto.createDecipheriv(algorithm, keyEncode, IV);
        return decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
    },
    generatedDataClient: async (models) => {
        await models.client.create({ //eslint-disable-line
            name: Math.random().toString(36).substr(2, 5),
            address: Math.random().toString(36).substr(2, 5) + ' ' + Math.random().toString(36).substr(2, 5), //eslint-disable-line
            email: Math.random().toString(36).substr(2, 5) + '@gmail.com', //eslint-disable-line
            phone: Math.floor(Math.random() * 1000000000),
            api_key: 'a08eb42a-4a57-449b-84f4-1f67219f2679',
            status: 'active',
            price: Math.floor(Math.random() * 1000000000),
        });

        for (let i = 0; i <= 10; i += 1) {
            await models.client.create({ //eslint-disable-line
                name: Math.random().toString(36).substr(2, 5),
                address: Math.random().toString(36).substr(2, 5) + ' ' + Math.random().toString(36).substr(2, 5), //eslint-disable-line
                email: Math.random().toString(36).substr(2, 5) + '@gmail.com', //eslint-disable-line
                phone: Math.floor(Math.random() * 1000000000),
                api_key: Math.random().toString(36).substring(2),
                status: 'active',
                price: Math.floor(Math.random() * 1000000000),
            });
        }
    },
    generatedDataPricePlan: async (models) => {
        for (let i = 0; i <= 5; i += 1) {
            await models.price_plan.create({ //eslint-disable-line
                name: `plan${i}`,
                status: 'active',
            });
        }
    },
    generatedDataPriceLevel: async (models) => {
        for (let i = 1; i <= 6; i += 1) {
            await models.price_level.create({ //eslint-disable-line
                price_plan_id: i,
                from: 1,
                to: 100,
                price: Math.floor(Math.random() * 90000) + 100000,
                status: 'active',
            });
            await models.price_level.create({ //eslint-disable-line
                price_plan_id: i,
                from: 101,
                to: 200,
                price: Math.floor(Math.random() * 90000) + 100000,
                status: 'active',
            });
            await models.price_level.create({ //eslint-disable-line
                price_plan_id: i,
                from: 201,
                to: 300,
                price: Math.floor(Math.random() * 90000) + 100000,
                status: 'active',
            });
            await models.price_level.create({ //eslint-disable-line
                price_plan_id: i,
                from: 301,
                to: 400,
                price: Math.floor(Math.random() * 90000) + 100000,
                status: 'active',
            });
            await models.price_level.create({ //eslint-disable-line
                price_plan_id: i,
                from: 401,
                to: 500,
                price: Math.floor(Math.random() * 90000) + 100000,
                status: 'active',
            });
        }
    },
    generatedDataCampaign: async (models) => {
        await models.campaign.create({
            from: '2019-04-09T04:21:18.000Z',
            to: '2019-04-09T05:21:18.000Z',
            type: '%',
            discount: 10,
            status: 'active',
        });
    },
    generatedDataClientPrice: async (models) => {
        for (let i = 1; i <= 12; i += 1) {
            await models.client_price_plan.create({ //eslint-disable-line
                price_plan_id: Math.floor(Math.random() * 5) + 1,
                client_id: i,
                campaign_id: 1,
                using_status: true,
            });
        }
    },
    generatedDataClientContract: async (models) => {
        for (let i = 1; i <= 12; i += 1) {
            await models.client_contract.create({ //eslint-disable-line
                client_price_plan_id: i,
                client_id: i,
                status: 'active',
                from_time: '2019-04-09T04:21:18.000Z',
                to_time: '2019-04-09T05:21:18.000Z',
                using_status: true,
                payment_status: true,
            });
        }
    },
    timeout: ms => new Promise(resolve => setTimeout(resolve, ms)),
};
