import dotenv from 'dotenv';

dotenv.config();

const appConfig = {};

appConfig.nodeEnv = process.env.WV_NODE_ENV || 'development';
appConfig.mongodbURL =
  process.env.WV_MONGODB_URL ||
  'mongodb://localhost:27017/website-verification';
appConfig.browserWSEndpoint =
  process.env.WV_BROWSER_WS_ENDPOINT || 'ws://localhost:3000/';
appConfig.redisUrl = process.env.WV_REDIS_URL || 'redis://localhost:6379';

export default appConfig;
