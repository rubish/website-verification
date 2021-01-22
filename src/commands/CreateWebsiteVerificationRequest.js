import Joi from 'joi';
import boom from '@hapi/boom';

import { WebsiteVerificationEntity } from '../models/index.js';
import WebsiteVerificationRequestCreated from '../events/WebsiteVerificationRequestCreated.js';

import logger from '../common/logger.js';
import UrlUtility from '../util/UrlUtility.js';

const noDuplicateRequestId = async (id) => {
  if (id) {
    const entity = await WebsiteVerificationEntity.findById(id).exec();
    if (entity) {
      throw boom.forbidden('Verification request already exists for id');
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

    const verificationRequest = new WebsiteVerificationEntity({
      url: UrlUtility.normalize(req.url),
    });

    if (req.id) verificationRequest._id = req.id;
    await verificationRequest.save();

    logger.info({
      message: 'website verification request created',
      verificationRequest,
    });

    await new WebsiteVerificationRequestCreated(verificationRequest).trigger();

    return WebsiteVerificationEntity.findById(verificationRequest._id).exec();
  }
}

export default CreateWebsiteVerificationRequest;
