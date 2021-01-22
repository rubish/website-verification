/* eslint-disable class-methods-use-this */
import logger from '../common/logger.js';

import { CrawlUrlEntity, CrawlEntity } from '../models/index.js';
import {
  STATUS_ENRICHING,
  STATUS_COMPLETED,
} from '../models/websititeVerificationSchema.js';
import { STATUS_COMPLETED as URL_COMPLETED } from '../models/crawlUrlSchema.js';
import UrlUtility from '../util/UrlUtility.js';

class EnrichWebsite {
  constructor(entity) {
    this.website = entity;
  }

  async execute() {
    if (this.website.staus === STATUS_COMPLETED) return;
    this.website.status = STATUS_ENRICHING;
    await this.website.save();

    logger.info(`Enriching website#${this.website._id}, ${this.website.url}`);

    const crawlUrlsMap = await this.getCrawlUrlsMap();

    this.website.results.homePage = this.findHomePage(
      crawlUrlsMap,
      this.website.url
    );
    this.website.results.isRedirecting = !UrlUtility.isSameUrl(
      this.website.results.homePage,
      this.website.url
    );
    this.website.results.redirectAcceptable = !!this.website.results.homePage;
    this.website.results.privacyPage = this.findInterestingPage(
      crawlUrlsMap,
      'privacy'
    );
    this.website.results.contactPage = this.findInterestingPage(
      crawlUrlsMap,
      'contact'
    );
    this.website.results.termsPage = this.findInterestingPage(
      crawlUrlsMap,
      'terms'
    );
    this.website.results.refundPolicyPage = this.findInterestingPage(
      crawlUrlsMap,
      'refund'
    );
    this.website.results.shippingPolicyPage = this.findInterestingPage(
      crawlUrlsMap,
      'shipping'
    );

    this.website.status = STATUS_COMPLETED;
    await this.website.save();
  }

  findInterestingPage(crawlUrlsMap, term) {
    const urlScores = {};
    // eslint-disable-next-line no-unused-vars
    Object.entries(crawlUrlsMap).forEach(([_urlKey, urlObj]) => {
      urlObj.urlsFound.forEach(({ url, text }) => {
        if (!(url in urlScores)) {
          urlScores[url] = 0;
          if (url.toLowerCase().includes(term.toLowerCase()))
            urlScores[url] += 5;
        }
        if (text.toLowerCase().includes(term.toLowerCase()))
          urlScores[url] += 1;
      });
    });

    const bestUrl = Object.entries(urlScores)
      // eslint-disable-next-line no-unused-vars
      .filter(([_, score]) => score > 0)
      // eslint-disable-next-line no-unused-vars
      .sort(([_, score]) => -score)
      .shift();

    if (bestUrl) return bestUrl[0]; // [url, score]
    return null;
  }

  findHomePage(crawlUrlsMap, seedUrl) {
    let currentUrl = seedUrl;
    while (currentUrl && crawlUrlsMap[currentUrl]) {
      const urlObj = crawlUrlsMap[currentUrl];
      currentUrl = urlObj.redirectUrl;

      if (!urlObj.redirectUrl && urlObj.status === URL_COMPLETED) {
        return urlObj.url;
      }
    }
    return null;
  }

  /**
   * {
   *   [url]: {
   *     url: url,
   *     urlsFound: [{url, text}],
   *     redirectUrl: url,
   *     status: status,
   *   }
   * }
   */
  async getCrawlUrlsMap() {
    const crawl = await CrawlEntity.findOne({
      website: this.website._id,
    }).exec();
    const crawlUrls = await CrawlUrlEntity.find({
      crawl: crawl._id,
    }).exec();

    const crawlUrslMap = {};
    const crawledUrls = crawlUrls.map((crawlUrl) => crawlUrl.url);
    crawlUrls.forEach((crawlUrl) => {
      const processedUrls = crawlUrl.extractedData.urls
        .toObject()
        .filter((urlObj) => crawledUrls.includes(urlObj.url));
      crawlUrslMap[crawlUrl.url] = {
        url: crawlUrl.url,
        urlsFound: processedUrls,
        redirectUrl: crawlUrl.response.redirectUrl,
        status: crawlUrl.status,
      };
    });

    return crawlUrslMap;
  }
}

export default EnrichWebsite;
