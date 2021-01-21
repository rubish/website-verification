import BaseEvent from './BaseEvent.js';

class BackgroundEvent extends BaseEvent {
  constructor() {
    super();

    if (new.target === BackgroundEvent) {
      throw new TypeError(
        'Cannot construct BackgroundEvent instances directly'
      );
    }

    if (typeof this.process !== 'function') {
      throw new TypeError('Must override method `process`');
    }

    if (typeof this.serialize !== 'function') {
      throw new TypeError('Must override method `serialize`');
    }

    if (typeof this.deserialize !== 'function') {
      throw new TypeError('Must override method `deserialize`');
    }
  }
}

export default BackgroundEvent;
