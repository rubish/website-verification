import normalizeUrl from 'normalize-url';

const IgnoredDomainPrefixParts = ['www'];

class UrlUtility {
  static normalize(url) {
    return new URL(
      normalizeUrl(url, {
        stripHash: true,
        removeSingleSlash: false,
        sortQueryParameters: true,
        removeTrailingSlash: false,
        stripWWW: false,
      })
    ).href;
  }

  static isValid(url) {
    try {
      return new URL(url).href;
    } catch (e) {
      return false;
    }
  }

  static isSameUrl(url, baseUrl) {
    return this.normalize(url) === this.normalize(baseUrl);
  }

  static isSameOrSubWebsite(url, baseUrl) {
    const urlHostParts = new URL(url).hostname.split('.');
    const baseUrlHostParts = new URL(baseUrl).hostname.split('.');

    while (IgnoredDomainPrefixParts.includes(urlHostParts[0])) {
      urlHostParts.shift();
    }

    while (IgnoredDomainPrefixParts.includes(baseUrlHostParts[0])) {
      baseUrlHostParts.shift();
    }

    baseUrlHostParts.reverse();
    urlHostParts.reverse();

    while (
      baseUrlHostParts.length > 0 &&
      baseUrlHostParts[0] === urlHostParts[0]
    ) {
      baseUrlHostParts.shift();
      urlHostParts.shift();
    }

    if (baseUrlHostParts.length === 0) {
      return true;
    }

    return false;
  }
}

export default UrlUtility;
