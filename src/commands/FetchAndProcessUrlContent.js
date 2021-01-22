/* eslint-disable no-await-in-loop */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable class-methods-use-this */
import puppeteer from 'puppeteer-core';

import appConfig from '../common/appConfig.js';

import HTMLContent from '../util/HTMLContent.js';
import logger from '../common/logger.js';
import UrlUtility from '../util/UrlUtility.js';
import { STATUS_COMPLETED, STATUS_FAILED } from '../models/crawlUrlSchema.js';

// eslint-disable-next-line import/no-cycle
import CreateCrawlUrl from './CreateCrawlUrl.js';
import CrawlUrlCompleted from '../events/CrawlUrlCompleted.js';

const rejectedResourceTypes = [
  'stylesheet',
  'image',
  'media',
  'font',
  'texttrack',
];

class FetchAndProcessUrlContent {
  constructor(crawlUrl) {
    this.crawlUrl = crawlUrl;
  }

  async execute() {
    const content = await this.fetchContent();
    const urls = await new HTMLContent(content.data, content.url).extractUrls();

    const filteredUrls = urls.filter(({ url }) =>
      UrlUtility.isSameOrSubWebsite(url, this.crawlUrl.url)
    );
    await this.createCrawlUrls(filteredUrls);

    await this.completeCrawlUrl(content, urls);
  }

  async completeCrawlUrl(content, urls) {
    if (UrlUtility.isSameUrl(content.url, this.crawlUrl.url)) {
      this.crawlUrl.status = STATUS_COMPLETED;
      this.crawlUrl.extractedData.urls = urls;
      this.crawlUrl.response.redirected = false;
      await this.crawlUrl.save();
    } else {
      if (UrlUtility.isSameOrSubWebsite(content.url, this.crawlUrl.url)) {
        this.crawlUrl.status = STATUS_COMPLETED;
      } else {
        this.crawlUrl.status = STATUS_FAILED;
      }

      const redirectUrl = UrlUtility.normalize(content.url);
      logger.info(
        `Crawl url redirected from ${this.crawlUrl.url} to ${redirectUrl}, STATUS=${this.crawlUrl.status}`
      );

      this.crawlUrl.response.redirected = true;
      this.crawlUrl.response.redirectUrl = redirectUrl;
      await this.crawlUrl.save();

      await new CreateCrawlUrl({
        crawl: this.crawlUrl.crawl._id,
        url: content.url,
        depth: this.crawlUrl.depth,
      }).execute();
    }

    await new CrawlUrlCompleted(this.crawlUrl).trigger();
  }

  async createCrawlUrls(urls) {
    urls.forEach(async (urlObj) => {
      await new CreateCrawlUrl({
        crawl: this.crawlUrl.crawl._id,
        url: urlObj.url,
        depth: this.crawlUrl.depth + 1,
      }).execute();
    });
  }

  async fetchContent() {
    const browser = await puppeteer.connect({
      browserWSEndpoint: appConfig.browserWSEndpoint,
    });

    const page = await browser.newPage();
    await page.goto(this.crawlUrl.url);
    const content = await this.content({
      page,
      context: {
        url: this.crawlUrl.url,
        rejectResourceTypes: rejectedResourceTypes,
      },
    });
    browser.close();

    logger.info(`Fetched content for URL: ${this.crawlUrl.url}`);
    return content;
  }

  // copied from https://github.com/browserless/chrome/blob/7b8f7b1ed309c15084b1351469b3974cc886fb69/functions/content.js
  async content({ page, context }) {
    const {
      addScriptTag = [],
      addStyleTag = [],
      authenticate = null,
      url = null,
      html,
      gotoOptions,
      rejectRequestPattern = [],
      rejectResourceTypes = [],
      requestInterceptors = [],
      cookies = [],
      setExtraHTTPHeaders = null,
      setJavaScriptEnabled = null,
      userAgent = null,
      waitFor,
    } = context;

    if (authenticate) {
      await page.authenticate(authenticate);
    }

    if (setExtraHTTPHeaders) {
      await page.setExtraHTTPHeaders(setExtraHTTPHeaders);
    }

    if (setJavaScriptEnabled !== null) {
      await page.setJavaScriptEnabled(setJavaScriptEnabled);
    }

    if (
      rejectRequestPattern.length ||
      requestInterceptors.length ||
      rejectResourceTypes.length
    ) {
      await page.setRequestInterception(true);

      page.on('request', (req) => {
        if (
          !!rejectRequestPattern.find((pattern) => req.url().match(pattern)) ||
          rejectResourceTypes.includes(req.resourceType())
        ) {
          return req.abort();
        }
        const interceptor = requestInterceptors.find((r) =>
          req.url().match(r.pattern)
        );
        if (interceptor) {
          return req.respond(interceptor.response);
        }
        return req.continue();
      });
    }

    if (cookies.length) {
      await page.setCookie(...cookies);
    }

    if (userAgent) {
      await page.setUserAgent(userAgent);
    }

    if (url !== null) {
      await page.goto(url, gotoOptions);
    } else {
      // Whilst there is no way of waiting for all requests to finish with setContent,
      // you can simulate a webrequest this way
      // see issue for more details: https://github.com/GoogleChrome/puppeteer/issues/728

      await page.setRequestInterception(true);
      page.once('request', (request) => {
        request.respond({ body: html });
        page.on('request', (req) => req.continue());
      });

      await page.goto('http://localhost', gotoOptions);
    }

    if (addStyleTag.length) {
      for (const tag in addStyleTag) {
        await page.addStyleTag(addStyleTag[tag]);
      }
    }

    if (addScriptTag.length) {
      for (const script in addScriptTag) {
        await page.addScriptTag(addScriptTag[script]);
      }
    }

    if (waitFor) {
      if (typeof waitFor === 'string') {
        const isSelector = await page.evaluate((s) => {
          try {
            // eslint-disable-next-line no-undef
            document.createDocumentFragment().querySelector(s);
          } catch (e) {
            return false;
          }
          return true;
        }, waitFor);

        await (isSelector
          ? page.waitForSelector(waitFor)
          : page.evaluate(`(${waitFor})()`));
      } else {
        await new Promise((r) => setTimeout(r, waitFor));
      }
    }

    return {
      data: await page.content(),
      url: await page.url(),
      type: 'html',
    };
  }
}

export default FetchAndProcessUrlContent;
