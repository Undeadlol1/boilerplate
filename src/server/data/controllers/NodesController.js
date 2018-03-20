import { Op } from 'sequelize'
import extend from 'lodash/assignIn'
import { Node, Decision, sequelize } from "../models/index"
// TODO add tests! ⚠️ ✏️️
/**
 * after migrating ratings to decimal point (in order to make them unique),
 * not all of them changed properly.
 * This function checks ratings and modifies them to decimal point with Date.now()
 * @export
 * @param {object} node
 */
export async function normalizeRating(node) {
    if (node.rating.includes('.00000000000000000') && (node.rating % 1) == 0) {
        console.log('node.rating', node.rating)
        console.log('after point', node.rating % 1)
        console.log('point test', (Number(node.rating + '.' + Date.now())) % 1)
        console.warn('rating is not normal!')
        console.info('Normalizing...')
        const id = node.id
        const newRating = node.rating.includes('.00000000000000000')
                        ? Number(0 + '.' + Date.now())
                        : Number(node.rating + '.' + Date.now())
        await Node.update({rating: newRating}, {where: {id}})
        await Decision.update({NodeRating: newRating}, {where: {NodeId: id}})
    }
}
/**
 * find node with highest node.Decision.rating
 * @export
 * @param {string} MoodId
 * @param {string} [UserId]
 * @param {number} [afterRating] threshold too look after
 * @returns
 */
export async function findHighestRatingNode(MoodId, UserId, afterRating) {
    // using extend function to have clean object and
    // avoid things like {UserId: undefined}, which gets unexpected results from DB
    const where = extend(
        {MoodId},
        // UserId && {UserId},
        afterRating && {
            rating: {
                [Op.lt]: afterRating,
            }
        },
    )

    return await Node.findOne({
        where,
        limit: 1,
        raw: true,
        nest: true,
        order: [['rating', 'DESC']],
        // include: [{
        //     where,
        //     model: Decision,
        //     order: [['rating', 'DESC']],
        // }],
    })
}
/**
 * find node with lowest node.Decision.position
 * @export
 * @param {string} UserId
 * @param {string} MoodId
 * @param {number} [beforePosition] threshold too look before
 * @returns
 */
export async function findHighestPositionNode(UserId, MoodId, beforePosition) {
  return await Node.findOne({
    where: {}, // comment out?
    include: [{
        model: Decision,
        order: [['position', 'DESC']],
        where:  extend(
            {UserId, MoodId},
            beforePosition
            ?   {
                    position: {
                        [Op.gt]: beforePosition,
                    }
                }
            : undefined
        ),
    }],
  })
}

export async function findRandomNode(MoodId) {
  return await Node.findOne({
    where: {MoodId},
    order: sequelize.random(),
  })
}

export async function findRandomNodes(MoodId) {
  const nodes = await Node.findAll({
    raw: true,
    nest: true,
    limit: 100,
    where: {MoodId},
    include: [Decision],
    order: sequelize.random(),
  })
  /*
    remove downvoted by user nodes
    (i could not make sequelize to filter data by children values,
    so had to filter manually)
  */
  return nodes.filter(node => {
      const { vote } = node.Decision
      return !(vote == 0 || vote === false)
  })
}