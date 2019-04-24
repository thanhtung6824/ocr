module.exports = (sequelize, type) => sequelize.define('client_report', {
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
    total_200: type.INTEGER,
    total_500: type.INTEGER,
    total_503: type.INTEGER,
    total_all: type.INTEGER,
    total_amount: type.INTEGER,
    amount_info: type.JSON,
    using_status: type.INTEGER,
});
