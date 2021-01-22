import logger from '../common/logger.js';
import BackgroundEvent from './core/BackgroundEvent.js';

import { CrawlUrlEntity } from '../models/index.js';
// eslint-disable-next-line import/no-cycle
import FetchAndProcessUrlContent from '../commands/FetchAndProcessUrlContent.js';

class CrawlUrlCreated extends BackgroundEvent {
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
    logger.debug(
      `Fetching url content: CrawlUrl#${this.crawlUrl._id} URL[${this.crawlUrl.url}]`
    );
    await new FetchAndProcessUrlContent(this.crawlUrl).execute();
  }
}

CrawlUrlCreated.register();
export default CrawlUrlCreated;
