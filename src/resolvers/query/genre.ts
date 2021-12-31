import { IResolvers } from "@graphql-tools/utils";
import GenresService from "../../services/genre.service";

const GenreQueryResolvers: IResolvers = {
  Query: {
    async genres(_, __, { MongoDB }) {
      return new GenresService(_, __, { MongoDB }).items();
    },

    async genre(_, { id }, { MongoDB }) {
      return new GenresService(_, { id }, { MongoDB }).item();
    },
  },
};

export default GenreQueryResolvers;
