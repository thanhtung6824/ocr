const uploadValidator = {
    image: {
        notEmpty: true,
        errorMessage: 'Image is required',
    },
    encode: {
        notEmpty: true,
        errorMessage: 'Encode is required',
        isIn: {
            options: [[1, 2]],
            errorMessage: 'Encode must be 1 or 2 (raw, base64)',
        },
    },
};

module.exports = {
    uploadValidator,
};
