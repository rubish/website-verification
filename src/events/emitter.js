import { ENOMEM } from 'constants';
import Emiiter from 'events';

import logger from '../common/logger.js';

import BaseEvent from './BaseEvent.js';
import BackgroundEvent from './BackgroundEvent.js';

class EventEmitter extends Emiiter {}

const emitter = new EventEmitter({ captureRejections: true });

async function handleEvent(event) {
  if (event instanceof BackgroundEvent) {
    await event.enqueue();
  } else if (event instanceof BaseEvent) {
    await event.process();
  }
}

emitter.on('error', logger.error);

emitter.on('event', handleEvent);
