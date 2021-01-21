import { AsyncRouter } from 'express-async-router';

import CreateWebsiteVerificationRequest from '../commands/CreateWebsiteVerificationRequest.js';

const router = AsyncRouter();

router.post('/', async (req, res) => {
  // throw new Error('test error');
  const command = new CreateWebsiteVerificationRequest(req.body);
  res.json(await command.execute());
});

export default router;
