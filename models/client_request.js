module.exports = (sequelize, type) => sequelize.define('client_request', {
    id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    client_price_plan_id: {
        type: type.INTEGER,
        references: {
            // This is a reference to another model
            model: 'client_price_plans',

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
    request_no: {
        type: type.INTEGER,
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
    response_code: type.INTEGER,
    using_status: type.INTEGER,
});
