const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
const shared = require('../helpers/shared');

const db = {};
const models = fs.readdirSync(path.join(__dirname));
const sequelize = new Sequelize('mysql://tungnpt:Run@1234@localhost:3306/test', {
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
        await shared.generatedDataClient(db);
        await shared.generatedDataPricePlan(db);
        await shared.generatedDataPriceLevel(db);
        await shared.generatedDataCampaign(db);
        await shared.generatedDataClientPrice(db);
        await shared.generatedDataClientContract(db);
    });

module.exports = db;
