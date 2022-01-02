import { IResolvers } from "@graphql-tools/utils";
import GenresService from "../../services/genre.service";

const GenreMutationResolvers: IResolvers = {
  Mutation: {
    CreateGenre(_, { genre }, { MongoDB }) {
      return new GenresService(_, { genre }, { MongoDB }).Add();
    },

    UpdateGenre(_, variable, context) {
      return new GenresService(_, variable, context).Update();
    },

    DeleteGenre(_, variable, context) {
      return new GenresService(_, variable, context).Delete();
    },

    BlockGenre(_, { id }, context) {
      return new GenresService(_, { id }, context).Block();
    },
  },
};

export default GenreMutationResolvers;
