import GenreQueryResolvers from "./genre";
import PlatformQueryResolvers from "./platform";
import queryStripeResolver from "./stripe";
import UserQueryResolvers from "./user";

const GMR = require("@wiicamp/graphql-merge-resolvers");

const queryResolver = GMR.merge([
  UserQueryResolvers,
  GenreQueryResolvers,
  PlatformQueryResolvers,
  queryStripeResolver,
]);

export default queryResolver;
