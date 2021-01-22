import Queue from 'bull';

import appConfig from '../../common/appConfig.js';
import logger from '../../common/logger.js';

const eventQueue = new Queue('eventQueue', appConfig.redisUrl);

eventQueue.on('error', (error) => {
  logger.error(error);
});

eventQueue.on('completed', (job) => {
  const { eventName } = job.data;
  job.remove();
  logger.info(`Job ${eventName}#${job.id} completed`);
});

eventQueue.on('failed', (job, err) => {
  const { eventName } = job.data;
  logger.error(`Job ${eventName}#${job.id} failed: reason[${err}]`);
  logger.error(err);
});

class EventQueueManager {
  constructor(queue) {
    this.queue = queue;
  }

  async produceJob(data, options = {}) {
    this.queue.add(data, options);
  }

  async startConsuming(handler, concurrency = 1) {
    this.queue.process(concurrency, async (job) => {
      await handler(job.data);
    });
  }
}

const queueManager = new EventQueueManager(eventQueue);
export default queueManager;
