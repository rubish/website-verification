import CreateCrawlFromWebsiteRequest from '../commands/CreateCrawlFromWebsiteRequest.js';
import BaseEvent from './core/BaseEvent.js';

class WebsiteVerificationRequestCreated extends BaseEvent {
  constructor(entity) {
    super();

    this.entity = entity;
  }

  async process() {
    await new CreateCrawlFromWebsiteRequest(this.entity).execute();
  }
}

WebsiteVerificationRequestCreated.register();
export default WebsiteVerificationRequestCreated;
