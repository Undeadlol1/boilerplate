import models from 'server/data/models'
/**
 * Create typical paginated data for API reponse.
 * @export
 * @param {Object} options
 * @param {Object} options.model        - Model to fetch from.
 * @param {Object} options.where        - What to look for in model.
 * @param {number} [options.page = 1]   - Page to load.
 * @param {number} [options.limit = 10] - Documents per page.
 * @returns paginated data object
 */
export async function createPagination({model, where, page = 1, limit = 10}) {
    try {
        const   documentsCount = await model.count({where}),
                offset = page ? limit * (page - 1) : 0
        return {
            currentPage: page,
            totalPages: Math.ceil(documentsCount / limit) || 1,
            values: await model.findAll({where, limit, offset, raw: true, nest: true}),
        }
    }
    catch (error) {
        console.error('Something went wrong during building pagination data.')
        throw error
    }
}