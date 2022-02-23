import express, { json, urlencoded, static as _static } from 'express'
import { join } from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import { __dirname, __filename } from './app/utils.mjs'

import indexRouter from './routes/index.mjs'
import apiRouter from './routes/api.mjs'
import obsidianRouter from './routes/obsidian.mjs'
import downloadRouter from './routes/download.mjs'

var app = express();

app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(_static(join(__dirname, 'public')));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

const timeout = 20 * 1000;
app.use((req, res, next) => {
  // Set the timeout for all HTTP requests
  req.setTimeout(timeout, () => {
    let err = new Error('Request Timeout');
    err.status = 408;
    next(err);
  });
  // Set the server response timeout for all HTTP requests
  res.setTimeout(timeout, () => {
    let err = new Error('Service Unavailable');
    err.status = 503;
    next(err);
  });
  next();
});

app.use('/', indexRouter);
app.use('/api/v1/', apiRouter);
app.use('/obsidian/', obsidianRouter);
app.use('/download/', downloadRouter);

export default app;
