import { COLLECTIONS, EXPIRETIME } from "./../config/constants";
import { IResolvers } from "@graphql-tools/utils";
import JWT from "../lib/jsonwebtoken";

const MutationResolvers: IResolvers = {
  Mutation: {
    async CreateUser(_, { input }, { MongoDB }) {
      //console.log(context);
      //console.log(context.MongoDB);
      const LastUser = await MongoDB.collection(COLLECTIONS.USERS)
        .find()
        .limit(1)
        .sort({ create_At: -1 })
        .toArray();
      console.log(LastUser);

      if (LastUser.length === 0) {
        input.id = 1;
      } else {
        input.id = LastUser[0].id + 1;
      }

      input.create_At = new Date().toISOString();

      return await MongoDB.collection(COLLECTIONS.USERS)
        .insertOne(input)
        .then(async () => {
          return input;
        })
        .catch((err: Error) => {
          console.log(err.message);
          return null;
        });
    },

    async LoginUser(_, { input }, { MongoDB }) {
      try {
        const VerifyEmail = await MongoDB.collection(COLLECTIONS.USERS).findOne(
          {
            email: input.email,
          }
        );
        if (!VerifyEmail) {
          return {
            status: false,
            message: "Pasword or Email incorrect",
            token: null,
            user: null,
          };
        }
        const user = await MongoDB.collection(COLLECTIONS.USERS).findOne({
          email: input.email,
          password: input.password,
        });

        if (user) {
          delete user.password;
          delete user.birthday;
          delete user.create_At;
          delete user.role;
        }
        return {
          status: true,
          message: user === null ? "Pasword or Email incorrect" : "All look ok",
          user,
          token: !user ? null : new JWT().sign({ user }, EXPIRETIME.M20),
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
