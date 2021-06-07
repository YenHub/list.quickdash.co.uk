import express, { Response } from 'express';
let router = express.Router();

router.get('/', function(_req, res: Response, _next) {
    res.status(200);
    res.render('index', { title: 'Nothing to see here 😁' });
});

export {
    router
};