import { AsyncRouter } from 'express-async-router';

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

  res.json(verificationEntity);
});

export default router;
