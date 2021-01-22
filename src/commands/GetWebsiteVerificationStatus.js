import Joi from 'joi';

import { WebsiteVerificationEntity } from '../models/index.js';

const WebsiteStatusRequest = Joi.object({
  id: Joi.string().empty('').default(null).required(),
});

class GetWebsiteVerificationStatus {
  constructor(req) {
    this.req = req;
  }

  async execute() {
    const req = await WebsiteStatusRequest.validateAsync(this.req);
    return WebsiteVerificationEntity.findById(req.id).exec();
  }
}

export default GetWebsiteVerificationStatus;
