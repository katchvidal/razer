import GenreMutationResolvers from "./genre";
import UserMutationResolvers from "./user";

const GMR = require("@wiicamp/graphql-merge-resolvers");

const mutationResolver = GMR.merge([
  UserMutationResolvers,
  GenreMutationResolvers,
]);

export default mutationResolver;
