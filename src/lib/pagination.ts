import { CountElements } from "./MongoOperation";
// Aqui haremos la logica para hacer una paginacion de cualquier tipo de lista
import { Db } from "mongodb";

/**
 *
 * @param MongoDB -> Base de datos ( Conexion a Mongo )
 * @param collection -> Coleccion de la Base de Datos de Mongo
 * @param page -> Pagina en la que nos encontramos
 * @param items -> Items por Pagina
 * @returns Skip ( desde donde comienza en esa pagina )
 * @returns Total -> Numero de elementos que contiene la pagina
 * @returns Pages -> Numero de Paginas a cubrir el total de items por pagina
 */
export async function pagination(
  MongoDB: Db,
  collection: string,
  page: number = 1,
  items: number = 20
) {
  // Check the number of items per page
  if (items < 1 || items > 20) {
    items = 20;
  }
  if (page < 1) {
    page = 1;
  }
  const total = await CountElements(MongoDB, collection);
  const pages = Math.ceil(total / items);
  return {
    page,
    skip: (page - 1) * items,
    items,
    total,
    pages,
  };
}
