const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const logger = require('./common/logger')

require('dotenv').config();

const middlewares = require('./middlewares');
const api = require('./api');

const app = express();

app.use(morgan('dev', { stream: logger.stream.write }));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    description: "This is the website verification service, checking if the website seems a authentic one."
  });
});

app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
