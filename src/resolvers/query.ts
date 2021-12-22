import { COLLECTIONS } from "./../config/constants";
import { IResolvers } from "@graphql-tools/utils";

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
  },
};

export default QueryResolvers;
