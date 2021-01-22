import _ from './common/preInitSetup.js';

// load up all the events to be registered successfully
import __ from './events/index.js';

import queueManager from './events/core/queueManager.js';
import BackgroundEvent from './events/core/BackgroundEvent.js';

queueManager.startConsuming((jobData) => BackgroundEvent.process(jobData));

// eslint-disable-next-line no-console
console.log('Starting consuming jobs');
