import EmailMutationResolvers from "./email";
import GenreMutationResolvers from "./genre";
import mutationStripeResolver from "./stripe";
import UserMutationResolvers from "./user";

const GMR = require("@wiicamp/graphql-merge-resolvers");

const mutationResolver = GMR.merge([
  UserMutationResolvers,
  GenreMutationResolvers,
  EmailMutationResolvers,
  mutationStripeResolver,
]);

export default mutationResolver;
