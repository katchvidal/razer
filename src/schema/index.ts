import "graphql-import-node";
import { GraphQLSchema } from "graphql";
import { makeExecutableSchema } from "@graphql-tools/schema";
import resolvers from "../resolvers";
import { mergeTypeDefs } from "@graphql-tools/merge";
import { loadFilesSync } from "@graphql-tools/load-files";

const loadedFiles = loadFilesSync(`${__dirname}/**/*.graphql`);
const typeDefs = mergeTypeDefs(loadedFiles);
const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export default schema;
