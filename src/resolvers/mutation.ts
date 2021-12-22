import { COLLECTIONS, EXPIRETIME } from "./../config/constants";
import { IResolvers } from "@graphql-tools/utils";
import JWT from "../lib/jsonwebtoken";
import bcrypt from "bcrypt";

const MutationResolvers: IResolvers = {
  Mutation: {
    async CreateUser(_, { input }, { MongoDB }) {
      try {
        const UserExist = await MongoDB.collection(COLLECTIONS.USERS).findOne({
          email: input.email,
        });

        if (UserExist) {
          return {
            message: `${input.email} has already taken`,
            status: true,
            input: null,
          };
        }
        const LastUser = await MongoDB.collection(COLLECTIONS.USERS)
          .find()
          .limit(1)
          .sort({ create_At: -1 })
          .toArray();

        if (LastUser.length === 0) {
          input.id = 1;
        } else {
          input.id = LastUser[0].id + 1;
        }

        input.create_At = new Date().toISOString();

        input.password = bcrypt.hashSync(input.password, 10);

        return {
          message: "All look ok",
          status: true,
          user: await MongoDB.collection(COLLECTIONS.USERS)
            .insertOne(input)
            .then(async () => {
              return input;
            }),
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
      try {
        const user = await MongoDB.collection(COLLECTIONS.USERS).findOne({
          email: input.email,
        });

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
          token: PasswordValid
            ? new JWT().sign({ user }, EXPIRETIME.M20)
            : null,
        };
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

export default MutationResolvers;
