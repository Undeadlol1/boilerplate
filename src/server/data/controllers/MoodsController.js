import { Mood, Node, sequelize } from "../models/index"

// TODO write tests!
/**
 * get moods by user id (paginated)
 * @export
 * @param {string} UserId
 * @param {number} page after which page to return results?
 * @returns {object}
 */
export async function getUsersMoods(UserId, page) {
    // TODO create special config file for 'limit' and over variables
    const limit = 12
    const offset = page ? limit * (page -1) : 0
    const totalMoods = await Mood.count()
    const totalPages = Math.ceil(totalMoods / limit)
    const moods = await Mood.findAll({
        where: { UserId },
        limit,
        offset,
        order: [['rating', 'DESC']],
        // add preview image
        include: [{
          limit: 1,
          model: Node,
          required: false,
          order: sequelize.random(),
        }]
    })
    return { moods, totalPages }
}