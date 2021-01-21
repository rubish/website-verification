import logger from '../common/logger.js';
import BackgroundEvent from './core/BackgroundEvent.js';

import { CrawlEntity, CrawlUrlEntity } from '../models/index.js';

class CrawlCreatedBg extends BackgroundEvent {
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
    await this.createSeedUrlCrawling();
  }

  async createSeedUrlCrawling() {
    const { _id: crawl, seedUrl: url } = this.crawl;
    const crawlUrl = new CrawlUrlEntity({ crawl, url });
    await crawlUrl.save();

    logger.info({ message: 'Crawl url created', crawlUrl });
  }
}

CrawlCreatedBg.register();
export default CrawlCreatedBg;
