import mongoose from 'mongoose';

import appConfig from './appConfig.js';

mongoose.connect(appConfig.mongodbURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export default { _: true };
