import { FindOneElement, AssignDocumentID } from "./../lib/MongoOperation";
import { COLLECTIONS } from "./../config/constants";
import { IContextData } from "./../interface/context-data.interfaces";
import ResolverOperationService from "./resolver.service";
import slugify from "slugify";

class GenresService extends ResolverOperationService {
  collection = COLLECTIONS.USERS;

  constructor(root: object, variables: object, context: IContextData) {
    super(root, variables, context);
  }

  // List information "Genres"
  async items() {
    const result = await this.List(this.collection, "Genres");
    return {
      status: result.status,
      message: result.message,
      genres: result.items,
    };
  }

  // Get Details "Genres"
  async item() {
    const result = await this.GetOne(this.collection, "Genre");
    return {
      status: result.status,
      message: result.message,
      genre: result.item,
    };
  }

  //  Funcionalidades
  private fillValue(value: string) {
    return value === "" || value === undefined ? true : false;
  }

  private async checkInDatabase(value: string) {
    return await FindOneElement(this.getMongoDB(), this.collection, {
      name: value,
    });
  }
}

export default GenresService;
