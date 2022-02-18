import StripeCustomerMutationResolvers from "./customer";

const GMR = require("@wiicamp/graphql-merge-resolvers");

const mutationStripeResolver = GMR.merge([StripeCustomerMutationResolvers]);

export default mutationStripeResolver;
