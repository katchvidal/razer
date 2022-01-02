import { IPaginatioOption } from "./../interface/pagination-option.interface";
import { Db } from "mongodb";

/**
 *
 * @param Mongo
 * @param collection
 * @returns
 */
export const AssignDocumentID = async (
  Mongo: Db,
  collection: string,
  sort: any = { create_At: -1 }
) => {
  const LasElement = await Mongo.collection(collection)
    .find()
    .limit(1)
    .sort(sort)
    .toArray();

  if (LasElement.length === 0) {
    return 1;
  }
  return String(+LasElement[0].id + 1);
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
  return await Mongo.collection(collection).insertOne(element);
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
  filter: object = {},
  paginationOptions: IPaginatioOption = {
    page: 1,
    items: -1,
    pages: 1,
    total: -1,
    skip: 0,
  }
) => {
  if (paginationOptions.total === -1) {
    return await Mongo.collection(collection).find(filter).toArray();
  }

  return await Mongo.collection(collection)
    .find(filter)
    .limit(paginationOptions.items)
    .skip(paginationOptions.skip)
    .toArray();
};

/**
 *
 * @param Mongo
 * @param collection
 * @param filter
 * @param objectUpdate
 * @returns
 */
export const UpdateOneElement = async (
  Mongo: Db,
  collection: string,
  filter: object,
  objectUpdate: object
) => {
  return await Mongo.collection(collection).updateOne(filter, {
    $set: objectUpdate,
  });
};

/**
 *
 * @param Mongo
 * @param collection
 * @param filter
 * @returns
 */
export const DeleteOneElement = async (
  Mongo: Db,
  collection: string,
  filter: object
) => {
  return await Mongo.collection(collection).deleteOne(filter);
};

/**
 *
 * @param database
 * @param collection
 * @returns
 */
export const CountElements = async (
  database: Db,
  collection: string,
  filter: object = {}
) => {
  return await database.collection(collection).countDocuments(filter);
};
