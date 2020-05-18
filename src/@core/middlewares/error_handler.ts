import { ErrorRequestHandler } from 'express';

import { Err } from '../errors';

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let error = err;

  if (!(err.family === 'base_error')) {
    error = new Err.InternalError();
  }

  res.contentType('application/json');
  res.status(Number(error.status || 501)).send(JSON.stringify({
    message: error.message || '',
    status: error.status || '',
    code: error.code || '',
  }));

  next();
};

export default errorHandler;