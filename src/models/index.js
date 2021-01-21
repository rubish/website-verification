import mongoose from 'mongoose';

import {
  WEBSITE_MODEL,
  CRAWL_MODEL,
  CRAWL_URL_MODEL,
  CRAWL_URL_CONTENT_MODEL,
} from './constants.js';

import websiteVerificationSchema from './websititeVerificationSchema.js';
import crawlSchema from './crawlSchema.js';
import crawlUrlSchema from './crawlUrlSchema.js';
import crawlUrlContentSchema from './crawlUrlContentSchema.js';

const WebsiteVerificationEntity = mongoose.model(
  WEBSITE_MODEL,
  websiteVerificationSchema,
  'website_verifications'
);

const CrawlEntity = mongoose.model(CRAWL_MODEL, crawlSchema, 'crawls');

const CrawlUrlEntity = mongoose.model(
  CRAWL_URL_MODEL,
  crawlUrlSchema,
  'crawls_urls'
);

const CrawlUrlContentEntity = mongoose.model(
  CRAWL_URL_CONTENT_MODEL,
  crawlUrlContentSchema,
  'crawl_url_contents'
);

export {
  WebsiteVerificationEntity,
  CrawlEntity,
  CrawlUrlEntity,
  CrawlUrlContentEntity,
};
