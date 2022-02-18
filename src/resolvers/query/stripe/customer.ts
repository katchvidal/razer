import { STRIPE_ACTIONS } from "./../../../lib/stripeApi";
import { IStripeCustomer } from "./../../../interface/stripe/customer.interface";
import { IResolvers } from "@graphql-tools/utils";
import StripeAPI, { STRIPE_OBJECTS } from "../../../lib/stripeApi";

const StripeCustomerQueryResolvers: IResolvers = {
  Query: {
    async Customers(_, { limit, startingAfter, endingBefore }) {
      let pagination;
      if (startingAfter !== "" && endingBefore === "") {
        pagination = { starting_after: startingAfter };
      } else if (startingAfter === "" && endingBefore !== "") {
        pagination = { ending_before: endingBefore };
      } else {
        pagination = {};
      }
      return await new StripeAPI()
        .execute(STRIPE_OBJECTS.CUSTOMERS, STRIPE_ACTIONS.LIST, {
          limit,
          ...pagination,
        })
        .then((result: { has_more: boolean; data: Array<IStripeCustomer> }) => {
          return {
            status: true,
            message: `List of Custommer Load Succesfull`,
            hasMore: result.has_more,
            customers: result.data,
          };
        })
        .catch((err: Error) => {
          return {
            status: false,
            message: `Something Went Wrong contact with a Admin`.concat(
              err.message
            ),
            hasMore: null,
            customers: null,
          };
        });
    },
    async Customer(_, { id }) {
      return await new StripeAPI()
        .execute(STRIPE_OBJECTS.CUSTOMERS, STRIPE_ACTIONS.RETRIEVE, id)
        .then(async (result: IStripeCustomer) => {
          return {
            status: true,
            message: `Custommer: ${result.name} Load Succesfull`,
            customer: result,
          };
        })
        .catch((err: Error) => {
          return {
            status: false,
            message: `Something Went Wrong contact with a Admin`.concat(
              err.message
            ),
          };
        });
    },
  },
};

export default StripeCustomerQueryResolvers;
