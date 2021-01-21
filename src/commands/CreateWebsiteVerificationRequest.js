import Joi from 'joi';
import boom from '@hapi/boom';
import _ from 'lodash';

import { WebsiteVerificationEntity } from '../models/index.js';
import WebsiteVerificationRequestCreated from '../events/WebsiteVerificationRequestCreated.js';

import logger from '../common/logger.js';

const noDuplicateRequestId = async (value) => {
  if (value) {
    const entity = await WebsiteVerificationEntity.findById(value).exec();
    if (entity) {
      throw boom.forbidden(
        `Verification request already exists for [id:${value}]`
      );
    }
  }
};

const WebsiteVerificationRequest = Joi.object({
  url: Joi.string().uri().required(),
  id: Joi.string().empty('').default(null).external(noDuplicateRequestId),
});

class CreateWebsiteVerificationRequest {
  constructor(req) {
    this.req = req;
  }

  async execute() {
    const req = await WebsiteVerificationRequest.validateAsync(this.req);

    const verificationRequest = new WebsiteVerificationEntity({ url: req.url });

    if (req.id) verificationRequest._id = req.id;
    await verificationRequest.save();

    logger.info({
      message: 'website verification request created',
      verificationRequest,
    });

    new WebsiteVerificationRequestCreated(verificationRequest).process();

    return verificationRequest;
  }
}

export default CreateWebsiteVerificationRequest;
