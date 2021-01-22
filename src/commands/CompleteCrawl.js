import logger from '../common/logger.js';

import CrawlCompleted from '../events/CrawlCompleted.js';
import { STATUS_COMPLETED } from '../models/crawlSchema.js';

class CompleteCrawl {
  constructor(entity) {
    this.crawl = entity;
  }

  async execute() {
    this.crawl.status = STATUS_COMPLETED;
    await this.crawl.save();
    logger.info(
      `Crawl completed crawl#${this.crawl._id}, ${this.crawl.seedUrl}`
    );
    await new CrawlCompleted(this.crawl).trigger();
  }
}

export default CompleteCrawl;
