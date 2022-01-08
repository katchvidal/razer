import GenreQueryResolvers from "./genre";
import PlatformQueryResolvers from "./platform";
import UserQueryResolvers from "./user";

const GMR = require("@wiicamp/graphql-merge-resolvers");

const queryResolver = GMR.merge([
  UserQueryResolvers,
  GenreQueryResolvers,
  PlatformQueryResolvers,
]);

export default queryResolver;
