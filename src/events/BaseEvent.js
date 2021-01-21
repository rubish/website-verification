class BaseEvent {
  constructor() {
    if (new.target === BaseEvent) {
      throw new TypeError('Cannot construct BaseEvent instances directly');
    }

    if (typeof this.process !== 'function') {
      throw new TypeError('Must override method `process`');
    }
  }
}

export default BaseEvent;
