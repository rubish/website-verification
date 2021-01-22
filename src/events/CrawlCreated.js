import logger from '../common/logger.js';
import BaseEvent from './core/BaseEvent.js';

import { STATUS_CRAWLING } from '../models/websititeVerificationSchema.js';
import { WebsiteVerificationEntity } from '../models/index.js';
import CreateCrawlUrl from '../commands/CreateCrawlUrl.js';

class CrawlCreated extends BaseEvent {
  constructor(entity) {
    super();
    this.crawl = entity;
  }

  async process() {
    await this.updateWebsiteStatus();
    new CreateCrawlUrl({
      crawl: this.crawl._id,
      url: this.crawl.seedUrl,
      depth: 0,
    }).execute();
  }

  async updateWebsiteStatus() {
    const website = await WebsiteVerificationEntity.findById(
      this.crawl.website._id
    );
    website.status = STATUS_CRAWLING;
    await website.save();

    logger.info({ message: 'Website status updated', id: website.id });
  }
}

CrawlCreated.register();
export default CrawlCreated;
