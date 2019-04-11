module.exports = (sequelize, type) => sequelize.define('client_charge', {
    id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
    price: type.DECIMAL(15, 2),
    status: type.STRING,
});
