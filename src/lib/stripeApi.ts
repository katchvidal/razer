export const STRIPE_OBJECTS = {
  CUSTOMERS: "customers",
};

export const STRIPE_ACTIONS = {
  CREATE: "create",
  LIST: "list",
  RETRIEVE: "retrieve",
  UPDATE: "update",
  DELETE: "del",
};

class StripeAPI {
  private stripe = require("stripe")(process.env.STRIPE_API_KEY, {
    apiVersion: process.env.STRIPE_API_VERSION,
  });

  async execute(
    object: string,
    action: string,
    ...args: [string | object, (string | object)?]
  ) {
    return await this.stripe[object][action](...args);
  }
}

export default StripeAPI;
