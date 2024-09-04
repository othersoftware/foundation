type EventName = string;
type EventHandler = (event?: any) => boolean | undefined | void;
type EventHandlerRegistry = EventHandler[];
type EventSubscriptions = Record<EventName, EventHandlerRegistry>;

const subscriptions: EventSubscriptions = {};

export const EventBus = {

  addEventListener(name: EventName, callback: EventHandler) {
    if (subscriptions[name]) {
      subscriptions[name].push(callback);
    } else {
      subscriptions[name] = [callback];
    }
  },

  remoteEventListener(name: EventName, callback: EventHandler) {
    if (!subscriptions[name]) {
      return;
    }

    subscriptions[name] = subscriptions[name].filter((handler) => {
      return handler !== callback;
    });

    if (subscriptions[name].length === 0) {
      delete subscriptions[name];
    }
  },

  dispatch<T>(name: EventName, event?: T): T | undefined {
    if (subscriptions[name]) {
      subscriptions[name].forEach((handler) => handler(event));
    }

    return event;
  },

};
