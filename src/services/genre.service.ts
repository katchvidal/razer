import { FindOneElement, AssignDocumentID } from "./../lib/MongoOperation";
import { COLLECTIONS } from "./../config/constants";
import { IContextData } from "./../interface/context-data.interfaces";
import ResolverOperationService from "./resolver.service";
import slugify from "slugify";

class GenresService extends ResolverOperationService {
  collection = COLLECTIONS.GENRES;

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

  // Add Item "Genres"
  async Add() {
    const genre = this.getVariables().genre;
    if (this.fillValue(genre || "")) {
      return {
        status: false,
        message: `The Genre is Empty`,
        genre: null,
      };
    }

    if (await this.checkInDatabase(genre || "")) {
      return {
        status: false,
        message: `Genre is already taken in DATA`,
        genre: null,
      };
    }
    const genreObject = {
      id: await AssignDocumentID(this.getMongoDB(), this.collection, {
        id: -1,
      }),
      name: genre,
      slug: slugify(genre || "", { lower: true }),
    };
    const result = await this.CreateOne(this.collection, genreObject, "Genre");
    return {
      status: result.status,
      message: result.message,
      genre: result.element,
    };
  }

  // Modify Item "Genres"

  // Delete Item "Genres"

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
