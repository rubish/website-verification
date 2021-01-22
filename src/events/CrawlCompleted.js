import BackgroundEvent from './core/BackgroundEvent.js';

import { CrawlEntity, WebsiteVerificationEntity } from '../models/index.js';
import EnrichWebsite from '../commands/EnrichWebsite.js';

class CrawlCompleted extends BackgroundEvent {
  constructor(entity) {
    super();
    this.crawl = entity;
  }

  async toQueueData() {
    return { crawlId: this.crawl._id };
  }

  static async fromQueueData({ crawlId }) {
    return new this(await CrawlEntity.findById(crawlId));
  }

  async process() {
    const website = await WebsiteVerificationEntity.findById(
      this.crawl.website._id
    ).exec();
    new EnrichWebsite(website).execute();
  }
}

CrawlCompleted.register();
export default CrawlCompleted;
