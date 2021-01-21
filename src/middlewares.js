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
  logger.error(err);
  let error = err;

  if (Joi.isError(err)) {
    error = boom.badRequest(err);
  } else if (!boom.isBoom(err)) {
    error = boom.boomify(err);
  }

  res.status(error.output.statusCode).json(error.output.payload);
}

export default {
  notFound,
  errorHandler,
};
