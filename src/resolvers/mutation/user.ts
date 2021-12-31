import {
  AssignDocumentID,
  FindOneElement,
  InserOneElement,
} from "./../../lib/MongoOperation";
import { COLLECTIONS } from "../../config/constants";
import { IResolvers } from "@graphql-tools/utils";
import JWT from "../../lib/jsonwebtoken";
import bcrypt from "bcrypt";

const UserMutationResolvers: IResolvers = {
  Mutation: {
    async CreateUser(_, { input }, { MongoDB }) {
      try {
        const UserExist = await FindOneElement(MongoDB, COLLECTIONS.USERS, {
          email: input.email,
        });

        if (UserExist) {
          return {
            message: `${input.email} has already taken`,
            status: true,
            input: null,
          };
        }

        input.id = await AssignDocumentID(MongoDB, COLLECTIONS.USERS);

        input.create_At = new Date().toISOString();

        input.password = bcrypt.hashSync(input.password, 10);

        return {
          message: "User Create Successfull",
          status: true,
          user: await InserOneElement(MongoDB, COLLECTIONS.USERS, input),
        };
      } catch (error) {
        console.log(error);
        return {
          status: false,
          message: "Warning Something Went Wrong",
          user: null,
        };
      }
    },

    async LoginUser(_, { input }, { MongoDB }) {
      const { email } = input;
      try {
        const user = await MongoDB.collection(COLLECTIONS.USERS).findOne({
          email: input.email,
        });

        /* const user = await FindOneElement(MongoDB, COLLECTIONS.USERS, {
          email,
        });*/

        if (!user) {
          return {
            status: true,
            message: "Password / Email not valid",
            token: null,
            user: null,
          };
        }

        const PasswordValid = bcrypt.compareSync(input.password, user.password);

        if (PasswordValid) {
          delete user.password;
          delete user.birthday;
          delete user.create_At;
          delete user.role;
        }

        return {
          status: true,
          message: PasswordValid ? "ALL LOOK OK" : "Password / Email not valid",
          user: PasswordValid ? user : null,
          token: PasswordValid ? new JWT().sign({ user }) : null,
        };
        user;
      } catch (error) {
        console.log(error);
        return {
          status: false,
          message: "Warning Something Went Wrong Contact to Admin",
          user: null,
          token: null,
        };
      }
    },
  },
};

export default UserMutationResolvers;
