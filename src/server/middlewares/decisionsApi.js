import { Node, Mood, Decision, User } from 'server/data/models'
import { mustLogin } from 'server/services/permissions'
import { Router } from 'express'

export default Router()
  .post('/', mustLogin, async function({user, body}, res) {
    /*
      When user makes a decision we need to:
      1. Create a Decision
      2. Update Node.rating
    */
    try {
      const { id: UserId } = user,
            { NodeId, vote } = body,
            node = await Node.findById(NodeId),
            newRating = Number(node.rating) + (vote ? 1 : -1)

      // 1. Create a Decision
      const decision = await Decision.create({
        vote,
        NodeId,
        UserId,
        MoodId: node.MoodId,
        NodeRating: newRating,
      })
      // 2. Update Node.rating
      await node.increment(
        { rating: newRating },
        { where: { id: NodeId } }
      )
      // send response
      res.json(decision)
    } catch (error) {
      console.error(error)
      res.boom.internal(error.message)
    }
  })

  .put('/', mustLogin, async function({user, body, params}, res) {
    /*
      When user changes decision we need to:
      1. Update a Decision
      2. Update Node.rating
    */
    try {
      const { id: UserId } = user,
            decision = await Decision.findById(body.id),
            node = await Node.findById(decision.NodeId),
            newRating = Number(node.rating) + (body.vote ? 1 : -1)
      // Update Node.rating
      await node.increment(
        { rating: newRating },
        { where: { id: node.id } }
      )
      // update decision
      res.json(
        await decision.update({
          vote: body.vote,
          NodeRating: newRating,
        })
      )
    } catch (error) {
      console.error(error)
      res.boom.internal(error.message)
    }
  })