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
 * @param Mongo
 * @param collection
 * @param filter
 * @returns
 */
export const FindOneElement = async (
  Mongo: Db,
  collection: string,
  filter: object
) => {
  return Mongo.collection(collection).findOne(filter);
};
