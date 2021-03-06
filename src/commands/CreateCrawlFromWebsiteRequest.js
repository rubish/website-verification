import CrawlCreated from '../events/CrawlCreated.js';

import { CrawlEntity } from '../models/index.js';

import logger from '../common/logger.js';

class CreateCrawlFromWebsiteRequest {
  constructor(verificationRequestEntity) {
    this.request = verificationRequestEntity;
  }

  async execute() {
    const { _id: website, url: seedUrl } = this.request;
    const crawl = new CrawlEntity({ website, seedUrl });
    await crawl.save();

    logger.info({
      message: 'crawl created',
      crawl,
    });

    await new CrawlCreated(crawl).trigger();
    return crawl;
  }
}

export default CreateCrawlFromWebsiteRequest;
