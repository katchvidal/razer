import UserMutationResolvers from "./user";

const GMR = require("@wiicamp/graphql-merge-resolvers");

const mutationResolver = GMR.merge([UserMutationResolvers]);

export default mutationResolver;
