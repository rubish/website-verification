import { AsyncRouter } from 'express-async-router';
import boom from '@hapi/boom';

import CreateWebsiteVerificationRequest from '../commands/CreateWebsiteVerificationRequest.js';
import GetWebsiteVerificationStatus from '../commands/GetWebsiteVerificationStatus.js';

const router = AsyncRouter();

router.post('/', async (req, res) => {
  const command = new CreateWebsiteVerificationRequest(req.body);
  const verificationEntity = await command.execute();

  res.json(verificationEntity);
});

router.get('/', async (req, res) => {
  const command = new GetWebsiteVerificationStatus(req.body);
  const verificationEntity = await command.execute();

  if (!verificationEntity) {
    throw boom.notFound('Website verification request from found');
  }

  res.json(verificationEntity);
});

export default router;
