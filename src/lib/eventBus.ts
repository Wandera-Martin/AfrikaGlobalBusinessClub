// Cross-Module Event Bus

type EventCallback = (data: any) => void;

class EventBus {
  private events: Map<string, EventCallback[]> = new Map();

  subscribe(eventName: string, callback: EventCallback): () => void {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }
    
    const callbacks = this.events.get(eventName)!;
    callbacks.push(callback);

    // Return unsubscribe function
    return () => {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    };
  }

  publish(eventName: string, data?: any): void {
    const callbacks = this.events.get(eventName);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  clear(eventName?: string): void {
    if (eventName) {
      this.events.delete(eventName);
    } else {
      this.events.clear();
    }
  }
}

export const eventBus = new EventBus();

// Event Types
export const EVENTS = {
  // Authentication
  USER_LOGGED_IN: 'user:logged_in',
  USER_LOGGED_OUT: 'user:logged_out',
  USER_PROFILE_UPDATED: 'user:profile_updated',
  
  // Marketplace
  ORDER_CREATED: 'marketplace:order_created',
  ORDER_COMPLETED: 'marketplace:order_completed',
  REVIEW_SUBMITTED: 'marketplace:review_submitted',
  
  // Index
  LISTING_CREATED: 'index:listing_created',
  LISTING_UPDATED: 'index:listing_updated',
  RANKING_CHANGED: 'index:ranking_changed',
  
  // Community
  POST_CREATED: 'community:post_created',
  OPPORTUNITY_APPLIED: 'community:opportunity_applied',
  MESSAGE_SENT: 'community:message_sent',
  
  // Cross-module
  TRADE_ACTIVITY_RECORDED: 'trade:activity_recorded',
  NOTIFICATION_CREATED: 'notification:created',
} as const;

// Cross-module event handlers
export const setupEventHandlers = () => {
  // When marketplace order completes, update trade activity
  eventBus.subscribe(EVENTS.ORDER_COMPLETED, (data) => {
    eventBus.publish(EVENTS.TRADE_ACTIVITY_RECORDED, {
      type: 'marketplace_order',
      ...data,
    });
  });

  // When review is submitted, update supplier rating and index ranking
  eventBus.subscribe(EVENTS.REVIEW_SUBMITTED, (data) => {
    eventBus.publish(EVENTS.RANKING_CHANGED, {
      userId: data.supplierId,
      factor: 'review',
      value: data.rating,
    });
  });

  // When opportunity is applied, track engagement
  eventBus.subscribe(EVENTS.OPPORTUNITY_APPLIED, (data) => {
    eventBus.publish(EVENTS.TRADE_ACTIVITY_RECORDED, {
      type: 'opportunity_application',
      ...data,
    });
  });
};
