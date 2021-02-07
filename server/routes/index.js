const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
    res.status(403);
    res.render('index', { title: 'Nothing to see here 😁' });
});

module.exports = router;