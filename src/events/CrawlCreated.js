import logger from '../common/logger.js';
import BaseEvent from './core/BaseEvent.js';
import CrawlCreatedBg from './CrawlCreatedBg.js';

import { STATUS_CRAWLING } from '../models/websititeVerificationSchema.js';
import { WebsiteVerificationEntity } from '../models/index.js';

class CrawlCreated extends BaseEvent {
  constructor(entity) {
    super();
    this.crawl = entity;
  }

  async process() {
    await this.updateWebsiteStatus();
    new CrawlCreatedBg(this.crawl).trigger();
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
