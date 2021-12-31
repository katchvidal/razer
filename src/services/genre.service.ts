import { COLLECTIONS } from "./../config/constants";
import { IContextData } from "./../interface/context-data.interfaces";
import ResolverOperationService from "./resolver.service";

class GenresService extends ResolverOperationService {
  constructor(root: object, variables: object, context: IContextData) {
    super(root, variables, context);
  }

  // List information "Genres"
  async items() {
    const result = await this.List(COLLECTIONS.GENRES, "Genres");
    return {
      status: result.status,
      message: result.message,
      genres: result.items,
    };
  }

  // Get Details "Genres"
  async item() {
    const result = await this.GetOne(COLLECTIONS.GENRES, "Genre");
    return {
      status: result.status,
      message: result.message,
      genre: result.item,
    };
  }

  // Add Item "Genres"

  // Modify Item "Genres"

  // Delete Item "Genres"
}

export default GenresService;
