import { Db } from "mongodb";

/**
 *
 * @param Mongo
 * @param collection
 * @returns
 */
export const AssignDocumentID = async (Mongo: Db, collection: string) => {
  const LasElement = await Mongo.collection(collection)
    .find()
    .limit(1)
    .sort({ create_At: -1 })
    .toArray();

  if (LasElement.length === 0) {
    return 1;
  }
  return LasElement[0].id + 1;
};

/**
 *
 * @param Mongo -> MongoDB Connexion
 * @param collection -> Collecion
 * @param filter -> { elemento : elemento }
 * @returns -> Retorna elemento buscado
 */
export const FindOneElement = async (
  Mongo: Db,
  collection: string,
  filter: object
) => {
  return Mongo.collection(collection).findOne(filter);
};

/**
 *
 * @param Mongo
 * @param collection
 * @param element
 * @returns
 */
export const InserOneElement = async (
  Mongo: Db,
  collection: string,
  element: object
) => {
  return Mongo.collection(collection).insertOne(element);
};

/**
 *
 * @param Mongo
 * @param collection
 * @param elements
 * @returns
 */
export const InserManyElement = async (
  Mongo: Db,
  collection: string,
  elements: Array<object>
) => {
  return await Mongo.collection(collection).insertMany(elements);
};

/**
 *
 * @param Mongo
 * @param collection
 * @param filter
 * @returns
 */
export const FindElements = async (
  Mongo: Db,
  collection: string,
  filter: object = {}
) => {
  return await Mongo.collection(collection).find(filter).toArray();
};
