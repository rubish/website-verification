import _ from './common/preInitSetup.js';

import queueManager from './events/core/queueManager.js';
import BackgroundEvent from './events/core/BackgroundEvent.js';

// load up all the events to be registered successfully
import __ from './events/index.js';

queueManager.startConsuming((jobData) => BackgroundEvent.process(jobData));

console.log('Starting consuming jobs');
