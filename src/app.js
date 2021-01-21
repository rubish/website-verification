import express, { json } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

import _ from './common/preInitSetup.js';

import logger from './common/logger.js';
import middlewares from './middlewares.js';
import api from './api/index.js';

const app = express();

app.use(morgan('dev', { stream: logger.stream.write }));
app.use(helmet());
app.use(cors());
app.use(json());

app.get('/', (req, res) => {
  res.json({
    description:
      'This is the website verification service, checking if the website seems a authentic one.',
  });
});

app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
