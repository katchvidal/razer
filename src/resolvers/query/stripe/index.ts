import StripeCustomerQueryResolvers from "./customer";

const GMR = require("@wiicamp/graphql-merge-resolvers");

const queryStripeResolver = GMR.merge([StripeCustomerQueryResolvers]);

export default queryStripeResolver;
