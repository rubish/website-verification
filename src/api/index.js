import { Router } from 'express';

import websiteVerification from './websiteVerificationAPI.js';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    version: 'v1',
  });
});

router.use('/website-verification', websiteVerification);

export default router;
