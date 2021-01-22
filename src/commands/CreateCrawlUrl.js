import UrlUtility from '../util/UrlUtility.js';
import logger from '../common/logger.js';

import { CrawlUrlEntity, CrawlEntity } from '../models/index.js';

// eslint-disable-next-line import/no-cycle
import CrawlUrlCreated from '../events/CrawlUrlCreated.js';

class CreateCrawlUrl {
  constructor(crawlUrlObj) {
    this.crawlUrlObj = crawlUrlObj;
  }

  async execute() {
    const url = UrlUtility.normalize(this.crawlUrlObj.url);
    const crawlId = this.crawlUrlObj.crawl;
    const { depth } = this.crawlUrlObj;

    const crawl = await CrawlEntity.findById(crawlId).exec();
    if (depth > crawl.maxDepth) return null;

    const crawlUrlCount = await CrawlUrlEntity.count({ crawl: crawlId }).exec();
    if (crawlUrlCount >= crawl.maxPages) return null;

    const existing = await CrawlUrlEntity.findOne({
      crawl: crawlId,
      url,
    }).exec();
    if (existing) return existing;

    const crawlUrl = new CrawlUrlEntity({
      crawl: crawlId,
      url,
      depth,
    });
    await crawlUrl.save();

    logger.info({
      message: `Crawl url created ${crawlUrl._id}`,
      crawl: crawlUrl,
    });

    await new CrawlUrlCreated(crawlUrl).trigger();
    logger.info({
      message: 'CrawlUrl created',
      crawlUrl,
    });
    return crawlUrl;
  }
}

export default CreateCrawlUrl;
