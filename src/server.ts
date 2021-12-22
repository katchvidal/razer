import { IContext } from "./interface/context.interface";
import express from "express";
import cors from "cors";
import compression from "compression";
import { createServer } from "http";
import enviroment from "./config/enviroments";
import { ApolloServer } from "apollo-server-express";
import schema from "./schema";
import expressPlayground from "graphql-playground-middleware-express";
import MONGODATABASE from "./lib/database";
import chalk from "chalk";

//  Configuracion de las Variables de Entorno
if (process.env.NODE_ENV !== "production") {
  const env = enviroment;
  console.log(env);
}

async function init() {
  const app = express();
  app.use(cors());
  app.use(compression());

  const database = new MONGODATABASE();
  const MongoDB = await database.init();

  const context = async ({ req, connection }: IContext) => {
    const token = req ? req.headers.authorization : connection.authorization;

    return { token, MongoDB };
  };

  const server = new ApolloServer({
    schema,
    introspection: true,
    context,
  });

  await server.start();
  server.applyMiddleware({ app });

  app.get("/", expressPlayground({ endpoint: "/graphql" }));

  const httpServer = createServer(app);
  const PORT = process.env.PORT;
  httpServer.listen(
    {
      port: PORT,
    },
    () => {
      console.log("================SERVER================");
      console.log(
        `WORKING AT: ${chalk.greenBright(`http://localhost:${PORT}/graphql`)}`
      );
    }
  );
}

init();
