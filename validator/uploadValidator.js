const uploadSingleValidator = {
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

const uploadMultipleValidator = {
    image_front: {
        notEmpty: true,
        errorMessage: 'Image front is required',
    },
    image_back: {
        notEmpty: true,
        errorMessage: 'Image back is required',
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
    uploadSingleValidator,
    uploadMultipleValidator,
};
