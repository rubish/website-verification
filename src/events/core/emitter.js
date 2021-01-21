import Emiiter from 'events';

import logger from '../../common/logger.js';

import BaseEvent from './BaseEvent.js';
import BackgroundEvent from './BackgroundEvent.js';

class EventEmitter extends Emiiter {}

const emitter = new EventEmitter({ captureRejections: true });

async function enqueueEvent(event) {
  if (event instanceof BackgroundEvent) {
    await event.enqueue();
  } else {
    throw new Error('Can only background `BackgroundEvent');
  }
}

async function processEvent(event) {
  if (event instanceof BaseEvent) {
    await event.process();
  } else {
    throw new Error('Can only handle `BaseEvent');
  }
}

emitter.on('error', (err) => logger.error(err));

emitter.on('process', processEvent);

emitter.on('background', enqueueEvent);

async function emit(event) {
  if (event instanceof BackgroundEvent) {
    emitter.emit('background', event);
  } else if (event instanceof BaseEvent) {
    emitter.emit('process', event);
  } else {
    throw new Error('Unkown event received for emit');
  }
}

export default emit;
