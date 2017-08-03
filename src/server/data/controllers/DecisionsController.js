import { Decision } from "../models/index"
import sequelize from "sequelize"

// TODO clean up and write tests!

/**
 * TODO
 *
 * @param {any} position
 * @param {any} viewedAmount
 * @returns
 */
function calculateNewPosition(position, viewedAmount) {
    const previousPosition = Number((position < 0 ? 0 : position)) + 1
    const modifier = Number(viewedAmount == 0 ? 1 : viewedAmount)
    return previousPosition * modifier
}

// TODO rework the copy + paste
/**
 * @export
 * @param {Object} decision
 */
// TODO dont messup previousDecision and previousDecision
export async function updatePositionAndViews(decision) {
    const { position, viewedAmount } = decision
    const newPosition = calculateNewPosition(position, viewedAmount)

    /** TODO POSITION UPDATING HAS BEEN DISABLED TILL FIXED */
    // set lastViewAt, increment viewedAmount and set position
    const updatedDecision = await Decision.update({
                                // position: newPosition,
                                // lastViewAt: new Date(),
                                viewedAmount: sequelize.literal('viewedAmount +1'),
                            }, {where: {id: decision.id}})

    // decrement previous decision.position / increment next ones
    // const where = selector => ({
    //     position: selector,
    //     UserId: decision.UserId,
    //     MoodId: decision.MoodId,
    //     id: { $not: decision.id },
    // })
    // await Decision.update(
    //     { position: sequelize.literal('position +1') },
    //     { where: where({ $gte: newPosition }) }
    // )
    // await Decision.update(
    //     { position: sequelize.literal('position -1') },
    //     { where: where({ $lte: newPosition }) }
    // )
    return updatedDecision
}

// export default class {
// }