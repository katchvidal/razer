import { IResolvers } from "@graphql-tools/utils";
import GenresService from "../../services/genre.service";

const GenreMutationResolvers: IResolvers = {
  Mutation: {
    CreateGenre(_, { genre }, { MongoDB }) {
      return new GenresService(_, { genre }, { MongoDB }).Add();
    },
  },
};

export default GenreMutationResolvers;
