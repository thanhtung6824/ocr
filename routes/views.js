const express = require('express');

const router = express.Router();

router.get('/uploads', (req, res) => {
    res.render('uploads/index', {
        layout: 'uploads',
    });
});

module.exports = router;
