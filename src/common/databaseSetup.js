import mongoose from 'mongoose';

import appConfig from './appConfig.js';
import logger from './logger.js';

// setup logger
mongoose.set('debug', (coll, method, query, doc, options, ...other) => {
  const set = {
    coll,
    method,
    query,
    doc,
    options,
    other,
  };

  logger.debug({
    db: set,
  });
});

mongoose.connect(appConfig.mongodbURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export default { _: true };
