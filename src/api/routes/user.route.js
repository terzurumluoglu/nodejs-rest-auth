const express = require('express');
const router = express.Router();

router.route('/').get((req, res, next) => {
    const data = {
        success: true,
        message: 'Success',
    };
    res.status(200).send(data);
});

module.exports = router;
