import { Db, MongoClient } from "mongodb";
import chalk from "chalk";
class MONGODATABASE {
  db?: Db;

  async init(): Promise<Db | undefined> {
    try {
      const MONGOCDN = process.env.MONGOCDN;

      const mongoClient = await MongoClient.connect(MONGOCDN || "");
      this.db = mongoClient.db();
      // Mensaje visual con el estado
      console.log("================DATABASE================");
      console.log(`STATUS: ${chalk.greenBright("ONLINE")}`);
      console.log(`DATABASE NAME: ${chalk.greenBright(this.db.databaseName)}`);
    } catch (error) {
      console.log("================DATABASE================");
      console.log(`ERROR: ${error}`);
      console.log(`STATUS: ${chalk.redBright("OFFLINE")}`);
      console.log(`DATABASE: ${chalk.redBright(this.db?.databaseName)}`);
    }
    return this.db;
  }
}

export default MONGODATABASE;
