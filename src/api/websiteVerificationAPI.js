import { AsyncRouter } from 'express-async-router';

import CreateWebsiteVerificationRequest from '../commands/CreateWebsiteVerificationRequest.js';

const router = AsyncRouter();

router.post('/', async (req, res) => {
  const command = new CreateWebsiteVerificationRequest(req.body);
  const verificationEntity = await command.execute();

  res.json(verificationEntity);
});

export default router;
