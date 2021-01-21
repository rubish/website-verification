const EventNameKlassMap = {};

class BaseEvent {
  constructor() {
    if (new.target === BaseEvent) {
      throw new TypeError('Cannot construct BaseEvent instances directly');
    }

    if (typeof this.process !== 'function') {
      throw new TypeError('Must override method `process`');
    }
  }

  static register() {
    EventNameKlassMap[this.name] = this;
  }

  static getEventKlass(name) {
    if (EventNameKlassMap[name]) {
      return EventNameKlassMap[name];
    }
    throw new Error(`No such event ${name}`);
  }

  async trigger() {
    await this.process();
  }
}

export default BaseEvent;
