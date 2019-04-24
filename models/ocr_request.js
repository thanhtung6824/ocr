module.exports = (sequelize, type) => sequelize.define('ocr_request', {
    id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    client_request_id: {
        type: type.INTEGER,
        references: {
            // This is a reference to another model
            model: 'client_requests',

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
    result_code: type.INTEGER,
    file_path: type.STRING,
    ocr_text: type.TEXT,
    using_status: type.INTEGER,
});
