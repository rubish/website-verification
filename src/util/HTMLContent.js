import { URL } from 'url';
import cheerio from 'cheerio';

import UrlUtility from './UrlUtility.js';

class HTMLContent {
  constructor(htmlContent, baseUrl) {
    this.htmlContent = htmlContent;
    this.baseUrl = baseUrl;
  }

  async extractUrls() {
    const $ = cheerio.load(this.htmlContent);
    const urls = [];
    $('a[href]').each((_, elem) => {
      const url = new URL($(elem).attr('href'), this.baseUrl).href;
      urls.push({
        url: UrlUtility.normalize(url),
        text: $(elem).text().trim(),
      });
    });

    return urls;
  }
}

export default HTMLContent;
