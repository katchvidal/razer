import { Db } from "mongodb";
import { IVariables } from "./../interface/variables-data.interfaces";
import { IContextData } from "./../interface/context-data.interfaces";
import {
  FindElements,
  FindOneElement,
  InserOneElement,
} from "./../lib/MongoOperation";

class ResolverOperationService {
  private root: object;
  private variables: IVariables;
  private context: IContextData;
  constructor(root: object, variables: IVariables, context: IContextData) {
    this.root = root;
    this.variables = variables;
    this.context = context;
  }

  protected getVariables(): IVariables {
    return this.variables;
  }
  protected getMongoDB(): Db {
    return this.context.MongoDB;
  }

  // List information
  protected async List(collection: string, element: string) {
    try {
      return {
        status: true,
        message: `List of ${element} below `,
        items: await FindElements(this.context.MongoDB, collection),
      };
    } catch (error) {
      return {
        status: true,
        message: `Something Went Wrong: ${error}`,
        items: null,
      };
    }
  }

  // Get Details
  protected async GetOne(collection: string, element: string) {
    // Not information
    try {
      // Status 200
      return await FindOneElement(this.context.MongoDB, collection, {
        id: this.variables.id,
      }).then((result) => {
        if (result) {
          return {
            status: true,
            message: `The ${element} Show below `,
            item: result,
          };
        }
        return {
          status: true,
          message: `The ${element} Has not Found `,
          item: null,
        };
      });
    } catch (error) {
      // Status 500
      return {
        status: false,
        message: `Something Went Wrong ${error}`,
        item: null,
      };
    }
  }

  // Add Item
  protected async CreateOne(
    collection: string,
    document: object,
    element: string
  ) {
    try {
      return await InserOneElement(
        this.context.MongoDB,
        collection,
        document
      ).then((resp) => {
        if (resp.insertedId.id) {
          return {
            status: true,
            message: `Create succesfull a new One: ${element}`,
            element: document,
          };
        }
        return {
          status: false,
          message: `We cant insert: ${element}`,
          element: null,
        };
      });
    } catch (error) {
      return {
        status: false,
        message: `Something Went Wrong to Create a New One: ${element}`,
        element: null,
      };
    }
  }

  // Modify Item

  // Delete Item
}

export default ResolverOperationService;
