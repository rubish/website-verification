import { router as bullRouter, setQueues, BullAdapter } from 'bull-board';

import queueManager from '../events/core/queueManager.js';

setQueues([new BullAdapter(queueManager.queue)]);

export default bullRouter;
