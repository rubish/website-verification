import BaseEvent from './BaseEvent.js';
import queueManager from './queueManager.js';

class BackgroundEvent extends BaseEvent {
  constructor() {
    super();

    if (new.target === BackgroundEvent) {
      throw new TypeError(
        'Cannot construct BackgroundEvent instances directly'
      );
    }

    if (typeof this.toQueueData !== 'function') {
      throw new TypeError('Must override method `toQueueData`');
    }

    if (typeof this.constructor.fromQueueData !== 'function') {
      throw new TypeError('Must override static method `fromQueueData`');
    }
  }

  static async fromQueueParams({ eventName, eventData }) {
    const eventClass = this.getEventKlass(eventName);
    const event = await eventClass.fromQueueData(eventData);
    return event;
  }

  static async process(jobData) {
    const event = await this.fromQueueParams(jobData);
    await event.process();
  }

  async toQueueParams() {
    const eventName = this.constructor.name;
    const eventData = await this.toQueueData();
    return { eventName, eventData };
  }

  async enqueue() {
    const queueParams = await this.toQueueParams();
    queueManager.produceJob(queueParams);
    return queueParams;
  }

  async trigger() {
    await this.enqueue();
  }
}

export default BackgroundEvent;
