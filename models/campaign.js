module.exports = (sequelize, type) => sequelize.define('campaign', {
    id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    from: type.DATE,
    to: type.DATE,
    type: type.STRING,
    discount: type.DECIMAL(15, 2),
    using_status: type.INTEGER,
});
