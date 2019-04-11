module.exports = (sequelize, type) => sequelize.define('price_plan', {
    id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    request_limit: type.INTEGER,
    name: type.STRING,
    status: type.STRING,
});
