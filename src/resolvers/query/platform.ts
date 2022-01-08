import { IResolvers } from "@graphql-tools/utils";
import PlatformsService from "../../services/platform.service";

const PlatformQueryResolvers: IResolvers = {
  Query: {
    async platforms(_, { page, items }, { MongoDB }) {
      return new PlatformsService(
        _,
        { pagination: { page, items } },
        { MongoDB }
      ).items();
    },
  },
};

export default PlatformQueryResolvers;
