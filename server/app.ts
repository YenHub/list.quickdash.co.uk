import express from 'express';
import createError from 'http-errors';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';

import { router as indexRouter } from './routes/index';
import { router as usersRouter } from './routes/users';
import { router as testRouter } from './routes/testAPI';

export interface HttpException extends Error {
    status: number;
};

require('dotenv').config();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/testAPI', testRouter);

// catch 404 and forward to error handler
app.use(function(_req, _res, next: express.NextFunction) {
    next(createError(404));
});

// error handler
app.use(function(err: HttpException, req: express.Request, res: express.Response) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

export {
    app
};