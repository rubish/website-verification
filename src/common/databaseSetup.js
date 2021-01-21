import { connect } from 'mongoose';

import { mongodbURL } from './appConfig';

connect(mongodbURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
