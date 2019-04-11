module.exports = (sequelize, type) => sequelize.define('client_price_plan', {
    id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    price_plan_id: {
        type: type.INTEGER,
        references: {
            // This is a reference to another model
            model: 'price_plans',

            // This is the column name of the referenced model
            key: 'id',
        },
    },
    client_id: {
        type: type.INTEGER,
        references: {
            // This is a reference to another model
            model: 'clients',

            // This is the column name of the referenced model
            key: 'id',
        },
    },
    campaign_id: {
        type: type.INTEGER,
        references: {
            // This is a reference to another model
            model: 'campaigns',

            // This is the column name of the referenced model
            key: 'id',
        },
    },
    status: type.STRING,
});
