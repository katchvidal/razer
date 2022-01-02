import { IResolvers } from "@graphql-tools/utils";
import GenresService from "../../services/genre.service";

const GenreQueryResolvers: IResolvers = {
  Query: {
    async genres(_, { page, items }, { MongoDB }) {
      return new GenresService(
        _,
        { pagination: { page, items } },
        { MongoDB }
      ).items();
    },

    async genre(_, { id }, { MongoDB }) {
      return new GenresService(_, { id }, { MongoDB }).item();
    },
  },
};

export default GenreQueryResolvers;
