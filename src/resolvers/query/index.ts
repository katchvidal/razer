import UserQueryResolvers from "./user";

const GMR = require("@wiicamp/graphql-merge-resolvers");

const queryResolver = GMR.merge([UserQueryResolvers]);

export default queryResolver;
