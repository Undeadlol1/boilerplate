import { Node, Mood, Decision, User } from '../data/models'
import { mustLogin } from '../services/permissions'
import { assignIn as extend } from 'lodash'
import express from "express"
import selectn from "selectn"

const router = express.Router(); // TODO refactor without "const"?

// TODO rework into async functions
// TODO add comments

/**
 * calculate rating to increment field properly
 * 
 * @param {Number} previousRating rating before update
 * @param {Number} newRating value of update
 * @return {Number} calculated value
 */
function calculateNewRating(previousRating, newRating) {
  if ((newRating > 0 && previousRating < 0) && (newRating < 0 && previousRating > 0)) newRating = Math.abs(previousRating) * -1 //  || rating < 0 && previousRating < 0
  else newRating = newRating - previousRating
  return newRating
}

router
  .post('/', mustLogin, async function({user, body}, res) {

    /*
      When user makes a decision we need to:
      1. Update Node.rating
      2. Update Decision.rating with req.body.rating
      3. Update all decision's NodeRating with new Node.rating 
    */

    // TODO add body validators or just wrap everything in try/catch
    const { id: UserId } = user
    const { NodeId, rating } = body


    try {
      // TODO rework this awaits (RTFM, not all of them are needed)
      const node = await Node.findById(NodeId)
      const where = await {
                            NodeId,
                            UserId,
                            MoodId: node.MoodId
                          }
      const nextViewAt = new Date().setDate(new Date().getDate() + 1) // tommorow // TEST VALUE
      console.log('nextViewAt', nextViewAt);
      const defaults = await  {
                                nextViewAt,
                                NodeRating: calculateNewRating(node.rating, body.rating),
                              }

      // update Node.rating
      await node.increment({ rating: defaults.NodeRating }, { where: { id: NodeId } }) // do i actually need to specify id?
      const nodeAfterUpdate = await Node.findById(NodeId)
      const NodeRating = await nodeAfterUpdate.get('rating')

      // update Decision.rating
      await Decision.findOrCreate({
        where: {
          NodeId, UserId
        },
        defaults: {
          rating, ...defaults, ...where // watch for "where" (double use of NodeId may not work)
        }
      })
      await Decision.update(
        { rating, NodeRating, nextViewAt },
        { where: { NodeId, UserId } }
      )
      // await Decision.upsert( // REWORK THIS? UPSERT DOES NOT SEEM TO WORK
      //     { rating, NodeRating, ...defaults, ...where },
      //     {
      //       fields: ['NodeRating']
      //     }
      //   )

      // update all Decision.NodeRating
      const users = await User.findAll()
      await users.forEach(user => {
        Decision.findOrCreate({
         where: { NodeId, UserId: user.id },
         defaults: {
           NodeRating, MoodId: node.MoodId
         }
        })
      })
      await Decision.update(
        { NodeRating },
        { where: { NodeId } }
      )
      // await users.forEach(user => {
      //   return Decision.upsert({
      //      ...defaults,
      //      NodeId,
      //      NodeRating,
      //      UserId: user.id,
      //      MoodId: node.MoodId,
      //     },
      //     {
      //       fields: ['NodeRating']
      //     }
      //   )
      // })

      res.end()
            

    //   const decisions = await Decision.upsert({ where, defaults }) // try upsert again
    //   const updatedDecisions1 = await Decision.update(defaults, { where })
    //   const users = await User.findAll()
    //   await node.increment({ rating: newRating }, { where: { id: NodeId } })
    //   const decisionsToIncrement = await Decision.findCreateFind({ // or try .upsert again? // TODO ADD MOODID
    //                       where: {
    //                         NodeId,
    //                         UserId,
    //                         MoodId: where.MoodId,
    //                         rating: newRating,
    //                       },
    //                       defaults
    //                     })
    //   const updatedDecisions2 = await Decision.find({ where }).increment({rating: newRating})

    //   console.log('node.id', node.id);
    //   res.end()
    } catch (error) {
      console.error(error)
      res.boom.internal(error.message)
    }






    // // // Node.findById(NodeId).then(result => {
    // // //   where.MoodId = result.get('MoodId')
    // // // console.log('where', where);
    // // // // return res.end()
    // // // return Decision // using .findOrCreate => .update instead of upsert because Sequelize is buggy with upsert // TODO move upsert in model definition?
    // // //   .findCreateFind({ where, defaults }) // TODO try .upsert again
    // // //   .then((result) => Decision.update(defaults, { where })) // should this update be here?
    // // //   .then(result => Node.findById(NodeId))
    // // //   .then(result => {

    // // //     // const previousRating = result.get('rating')
    // // //     // let newRating = rating;
    // // //     // if ((rating > 0 && previousRating < 0) && (rating < 0 && previousRating > 0)) newRating = Math.abs(previousRating) * -1 //  || rating < 0 && previousRating < 0
    // // //     // else newRating = newRating - previousRating
    // // //     // return result.increment({ rating: newRating }, { where: { id: NodeId } })
    // // //     const newRating = calculateNewRating(result.get('rating'), body.rating)
    // // //     return result.increment({rating: newRating }, { where: { id: NodeId } }) // where is not needed?
    // // //             .then(() => {
    // // //               return User.findAll()
    // // //             })
    // // //             .each(user => {
    // // //               console.log('new where', where);
    // // //               return Decision.findCreateFind({ // or try .upsert again? // TODO ADD MOODID
    // // //                 where: {
    // // //                   NodeId,
    // // //                   UserId,
    // // //                   MoodId: where.MoodId,
    // // //                   rating: newRating,
    // // //                 },
    // // //                 defaults
    // // //               })
    // // //             })
    // // //             .then(() => Decision.find({ where }))
    // // //             .then(result => {
    // // //               return result.increment({rating: newRating})
    // // //             })
    // // //             .catch(error => {
    // // //               console.log(error);
    // // //               res.boom.internal(error.message)                  
    // // //             })
    // //   })
    // //   .then(result => {
    // //     // console.log('result after', result);
    // //     return result
    // //   })
    // //   .then(() => res.end())
    // //   .catch(error => {
    // //     console.log('defaults', defaults);
    // //     console.error(error);
    // //     res.boom.internal(error.message)
    // //   })
    // }) // THIS IS THE THING YOU ARE LOOKING FOR
  })

export default router