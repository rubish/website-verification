import dotenv from 'dotenv';

dotenv.config();

const appConfig = {};

appConfig.nodeEnv = process.env.NODE_ENV || 'development';
appConfig.mongodbURL =
  process.env.MONGODB_URL || 'mongodb://localhost:27017/website-verification';

export default appConfig;
