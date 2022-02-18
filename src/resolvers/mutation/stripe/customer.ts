import { COLLECTIONS } from "./../../../config/constants";
import {
  FindOneElement,
  UpdateOneElement,
} from "./../../../lib/MongoOperation";
import { IResolvers } from "@graphql-tools/utils";
import { IStripeCustomer } from "../../../interface/stripe/customer.interface";
import StripeAPI, {
  STRIPE_ACTIONS,
  STRIPE_OBJECTS,
} from "../../../lib/stripeApi";
import UserService from "../../../services/user.service";

const StripeCustomerMutationResolvers: IResolvers = {
  Mutation: {
    async CreateCustomer(_, { name, email }, { MongoDB }) {
      const UserExist: { data: Array<IStripeCustomer> } =
        await new StripeAPI().execute(
          STRIPE_OBJECTS.CUSTOMERS,
          STRIPE_ACTIONS.LIST,
          { email }
        );

      if (UserExist.data.length > 0) {
        return {
          status: false,
          message: `Email Already Taken: ${email}`,
        };
      }
      return await new StripeAPI()
        .execute(STRIPE_OBJECTS.CUSTOMERS, STRIPE_ACTIONS.CREATE, {
          name,
          email,
          description: `${name} (${email})`,
        })
        .then(async (result: IStripeCustomer) => {
          // Update in database
          const user: any = await FindOneElement(MongoDB, COLLECTIONS.USERS, {
            email,
          });
          if (user) {
            user.stripeCustomer = result.id;
            const resultado = await new UserService(
              _,
              { user },
              { MongoDB }
            ).Update();
            console.log(resultado);
          }

          return {
            status: true,
            message: `Customer Create Succesfull ${name}`,
            customer: result,
          };
        })
        .catch((err: Error) => {
          return {
            status: false,
            message: err,
            customer: null,
          };
        });
    },

    async UpdateCustomer(_, { id, input }) {
      return await new StripeAPI()
        .execute(STRIPE_OBJECTS.CUSTOMERS, STRIPE_ACTIONS.UPDATE, id, input)
        .then((result: IStripeCustomer) => {
          return {
            status: true,
            message: "Customer Update Succesfull",
            customer: result,
          };
        })
        .catch((err: Error) => {
          return {
            status: false,
            message: `Error: ${err}`,
          };
        });
    },

    async DeleteCustomer(_, { id }, { MongoDB }) {
      return await new StripeAPI()
        .execute(STRIPE_OBJECTS.CUSTOMERS, STRIPE_ACTIONS.DELETE, id)
        .then(async (result: { id: string; deleted: boolean }) => {
          if (result.deleted) {
            const resultOperation = await MongoDB.collection(
              COLLECTIONS.USERS
            ).UpdateOneElement(
              { stripeCustomer: result.id },
              { $unset: { stripeCustomer: result.id } }
            );
            return {
              status: result.deleted && resultOperation ? true : false,
              message:
                result.deleted && resultOperation
                  ? `Customer :${id} Delete Succesfull`
                  : `Customer ${id} Was Not Updated Succesfull`,
            };
          }
          return {
            status: false,
            message: `Customer :${id} Delete Was Not Deleted`,
          };
        })
        .catch((err: Error) => {
          return {
            status: false,
            message: `Error: ${err}`,
          };
        });
    },
  },
};

export default StripeCustomerMutationResolvers;
