import { Db } from "mongodb";

export interface IContextData {
  MongoDB?: Db;
  token?: string;
}
