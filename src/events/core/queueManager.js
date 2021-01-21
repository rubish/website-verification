import Queue from 'bull';

import logger from '../../common/logger.js';

const eventQueue = new Queue('eventQueue');

eventQueue.on('error', (error) => {
  logger.error(error);
});

eventQueue.on('completed', (job) => {
  const { eventName } = job.data;
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

  async produceJob(data) {
    this.queue.add(data);
  }

  async startConsuming(handler) {
    this.queue.process(async (job) => {
      await handler(job.data);
    });
  }
}

const queueManager = new EventQueueManager(eventQueue);
export default queueManager;
