import logger from '../common/logger.js';
import BackgroundEvent from './core/BackgroundEvent.js';

import { CrawlEntity, CrawlUrlEntity } from '../models/index.js';
import { STATUS_INIT } from '../models/crawlUrlSchema.js';
import CompleteCrawl from '../commands/CompleteCrawl.js';

class CrawlUrlCompleted extends BackgroundEvent {
  constructor(entity) {
    super();
    this.crawlUrl = entity;
  }

  async toQueueData() {
    return { crawlUrlId: this.crawlUrl._id };
  }

  static async fromQueueData({ crawlUrlId }) {
    return new this(await CrawlUrlEntity.findById(crawlUrlId));
  }

  async process() {
    const crawlUrlPendingCount = await CrawlUrlEntity.countDocuments({
      crawl: this.crawlUrl.crawl._id,
      status: STATUS_INIT,
    }).exec();

    if (crawlUrlPendingCount === 0) {
      logger.info(`Crawl completed crawl#${this.crawlUrl.crawl._id}`);

      const crawl = await CrawlEntity.findById(this.crawlUrl.crawl._id).exec();
      await new CompleteCrawl(crawl).execute();
    }
  }
}

CrawlUrlCompleted.register();
export default CrawlUrlCompleted;
