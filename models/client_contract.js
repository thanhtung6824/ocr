module.exports = (sequelize, type) => sequelize.define('client_contract', {
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
    from_time: type.DATE,
    to_time: type.DATE,
    using_status: type.INTEGER,
    payment_status: type.INTEGER,
});
