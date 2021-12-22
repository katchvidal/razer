import { COLLECTIONS, MESSAGE } from "./../config/constants";
import { IResolvers } from "@graphql-tools/utils";
import JWT from "../lib/jsonwebtoken";

const QueryResolvers: IResolvers = {
  Query: {
    Hello(root, args, context, info) {
      //console.log(root);
      //console.log(args);
      //console.log(context);
      //console.log(info);

      return "Hello World";
    },

    async users(_, __, { MongoDB }) {
      try {
        const users = await MongoDB.collection(COLLECTIONS.USERS)
          .find()
          .toArray();
        return {
          status: true,
          message: "All looks ok!",
          users,
        };
      } catch (error) {
        console.log(error);
        return {
          status: false,
          message: "Warning something went wrong",
          users: [],
        };
      }
    },

    async me(_, __, { token }) {
      let info = new JWT().verify(token);
      if (info === MESSAGE.TOKEN_VERIFICATION_FAILED) {
        return {
          message: info,
          status: true,
          user: null,
        };
      }
      return {
        message: "User Verified Correctly",
        status: true,
        user: Object.values(info)[0],
      };
    },
  },
};

export default QueryResolvers;
