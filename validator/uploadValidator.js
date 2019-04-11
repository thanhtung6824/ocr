const uploadValidator = {
    image: {
        notEmpty: true,
        errorMessage: 'Image is required',
    },
    encode: {
        notEmpty: true,
        errorMessage: 'Encode is required',
    },
};

module.exports = {
    uploadValidator,
};
