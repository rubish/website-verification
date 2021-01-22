import { AsyncRouter } from 'express-async-router';
import ld from 'lodash';

import CreateWebsiteVerificationRequest from '../commands/CreateWebsiteVerificationRequest.js';

const router = AsyncRouter();

router.post('/', async (req, res) => {
  const command = new CreateWebsiteVerificationRequest(req.body);
  const verificationEntity = await command.execute();

  res.json(
    ld.pick(verificationEntity, ['_id', 'url', 'createdAt', 'updatedAt'])
  );
});

export default router;
