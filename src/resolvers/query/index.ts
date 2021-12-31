import GenreQueryResolvers from "./genre";
import UserQueryResolvers from "./user";

const GMR = require("@wiicamp/graphql-merge-resolvers");

const queryResolver = GMR.merge([UserQueryResolvers, GenreQueryResolvers]);

export default queryResolver;
