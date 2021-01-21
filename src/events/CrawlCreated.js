import logger from '../common/logger.js';
import BaseEvent from './BaseEvent.js';

import { STATUS_CRAWLING } from '../models/websititeVerificationSchema.js';
import { WebsiteVerificationEntity, CrawlUrlEntity } from '../models/index.js';

class CrawlCreated extends BaseEvent {
  constructor(entity) {
    super();

    this.crawl = entity;
  }

  async process() {
    await this.updateWebsiteStatus();
    await this.createSeedUrlCrawling();
  }

  async updateWebsiteStatus() {
    const website = await WebsiteVerificationEntity.findById(
      this.crawl.website._id
    );
    website.status = STATUS_CRAWLING;
    await website.save();

    logger.info({ message: 'Website status updated', id: website.id });
  }

  async createSeedUrlCrawling() {
    const { _id: crawl, seedUrl: url } = this.crawl;
    const crawlUrl = new CrawlUrlEntity({ crawl, url });
    await crawlUrl.save();

    logger.info({ message: 'Crawl url created', crawlUrl });
  }
}

export default CrawlCreated;
