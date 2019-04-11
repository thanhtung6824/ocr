module.exports = (sequelize, type) => sequelize.define('client', {
    id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: type.STRING,
    address: type.STRING,
    email: type.STRING,
    phone: type.STRING,
    api_key: type.STRING,
    status: type.STRING,
    price: type.DECIMAL(15, 2),
});
