<<<<<<< HEAD
import {
  AssignDocumentID,
  FindOneElement,
  InserOneElement,
} from "../../lib/MongoOperation";
import { COLLECTIONS } from "../../config/constants";
=======
>>>>>>> main
import { IResolvers } from "@graphql-tools/utils";
import UserService from "../../services/user.service";

const UserMutationResolvers: IResolvers = {
  Mutation: {
    async CreateUser(_, { input }, contexto) {
      return new UserService(_, { user: input }, contexto).Add();
    },

    async LoginUser(_, { email, password }, context) {
      return new UserService(_, { user: { email, password } }, context).Login();
    },

    async UpdateUser(_, { input }, contexto) {
      return new UserService(_, { user: input }, contexto).Update();
    },

    async DeleteUser(_, { id }, contexto) {
      return new UserService(_, { id }, contexto).Delete();
    },
  },
};

export default UserMutationResolvers;
