import {
  ModelType,
  Model,
  WhereOperators,
  ModelCtor,
  WhereValue
} from "sequelize/types";
import { WhereOptions, ArrayDataType } from "sequelize";

interface paginationArguments {
  model: ModelCtor<Model>;
  where: WhereOptions;
  page?: number;
  limit?: number;
}
/**
 * Typical pagination structure.
 */
export interface pagination {
  values: [object];
  currentPage: number;
  totalPages: number;
  perPage: number;
}
/**
 * Create typical paginated data for API response.
 * @returns paginated data object
 */
export async function createPagination({
  model,
  where,
  page = 1,
  limit = 10
}: paginationArguments): Promise<pagination> {
  try {
    const documentsCount = await model.count({ where }),
      offset = page ? limit * (page - 1) : 0;
    return {
      perPage: limit,
      currentPage: page,
      totalPages: Math.ceil(documentsCount / limit) || 1,
      // I can't make it work :(
      // @ts-ignore
      values: await model.findAll<[object]>({
        where,
        limit,
        offset,
        raw: true,
        nest: true
      })
    };
  } catch (error) {
    console.error("Something went wrong during building pagination data.");
    throw error;
  }
}
