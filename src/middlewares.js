import boom from '@hapi/boom';
import Joi from 'joi';

import logger from './common/logger.js';

function notFound(req, res, next) {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  let error = err;

  if (Joi.isError(err)) {
    error = boom.badRequest(err);
  } else if (!boom.isBoom(err)) {
    error = boom.boomify(err);
  }

  const statusCode =
    res.statusCode !== 200 ? res.statusCode : error.output.statusCode;
  res.status(statusCode).json(error.output.payload);
  logger.error(error);
}

export default {
  notFound,
  errorHandler,
};
