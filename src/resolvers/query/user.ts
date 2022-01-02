<<<<<<< HEAD
import { FindElements } from "../../lib/MongoOperation";
=======
>>>>>>> main
import { COLLECTIONS, MESSAGE } from "../../config/constants";
import { IResolvers } from "@graphql-tools/utils";
import JWT from "../../lib/jsonwebtoken";
import UserService from "../../services/user.service";

const UserQueryResolvers: IResolvers = {
  Query: {
    Hello(root, args, context, info) {
      //console.log(root);
      //console.log(args);
      //console.log(context);
      //console.log(info);

      return "Hello World";
    },

    async users(_, __, context) {
      return new UserService(_, __, context).items();
    },

    async me(_, __, { token }) {
      return new UserService(_, __, { token }).auth();
    },
  },
};

export default UserQueryResolvers;
