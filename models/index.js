const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');

const db = {};

const models = fs.readdirSync(path.join(__dirname));
const sequelize = new Sequelize('mysql://root:tungpro123@localhost:3306/test', {
    // Look to the next section for possible options
});
db.sequelize = sequelize;

models.forEach((file) => {
    const fileName = file.split('.')[0];
    if (fileName !== 'index') {
        const model = require(`./${fileName}`); // eslint-disable-line
        db[fileName] = model(sequelize, Sequelize);
    }
});

sequelize.sync({})
    .then(async () => {
        console.log('Database & tables created!');
        // await db.client.create({
        //     name: 'test',
        //     address: 'test',
        //     email: 'test@gmail.com',
        //     phone: '123456789',
        //     api_key: 'a08eb42a-4a57-449b-84f4-1f67219f2679',
        //     status: 'active',
        //     price: 5000000,
        // });
        // await db.price_plan.create({
        //     request_limit: 50,
        //     name: 'plan1',
        //     status: 'active',
        // });
        // await db.price_level.create({
        //     price_plan_id: 1,
        //     from: 1,
        //     to: 100,
        //     price: 100000,
        //     status: 'active',
        //     order: 1,
        // });
        // await db.price_level.create({
        //     price_plan_id: 1,
        //     from: 101,
        //     to: 200,
        //     price: 150000,
        //     status: 'active',
        //     order: 2,
        // });
        //
        // await db.campaign.create({
        //     from: '2019-04-09T04:21:18.000Z',
        //     to: '2019-04-09T05:21:18.000Z',
        //     type: '%',
        //     discount: 10,
        //     status: 'active',
        // });
        // await db.client_price_plan.create({
        //     price_level_id: 1,
        //     client_id: 1,
        //     campaign_id: 1,
        //     status: 'using',
        //     request_limit: 100,
        // });
        // await db.client_contract.create({
        //     client_price_plan_id: 1,
        //     client_id: 1,
        //     status: 'active',
        //     from_time: '2019-04-09T04:21:18.000Z',
        //     to_time: '2019-04-09T05:21:18.000Z',
        //     using_status: true,
        //     payment_status: true,
        // });
    });

module.exports = db;
