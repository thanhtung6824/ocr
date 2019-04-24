module.exports = (sequelize, type) => sequelize.define('price_level', {
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
    from: type.INTEGER,
    to: type.INTEGER,
    price: type.DECIMAL(15, 2),
    using_status: type.INTEGER,
});
