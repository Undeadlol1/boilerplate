import { Router } from "express"
import sequelize from "sequelize"
import extend from 'lodash/assignIn'
import { parseUrl } from 'shared/parsers'
import { mustLogin } from 'server/services/permissions'
import { Node, Mood, Decision, User } from 'server/data/models'
import { normalizeRating } from 'server/data/controllers/NodesController'
import { updatePositionAndViews } from 'server/data/controllers/DecisionsController'
import { findHighestRatingNode, findRandomNode, findRandomNodes } from 'server/data/controllers/NodesController'

// routes
export default Router()

  .get('/:moodSlug/', async function(req, res) {
    const { moodSlug } = req.params
    try {
      // validate params
      if (!moodSlug) return res.status(400).end('mood slug is required')
      // const MoodId = await Mood.findIdBySlug(moodSlug)
      Mood
      .findIdBySlug(moodSlug)
      // find nodes
      .then(MoodId => findRandomNodes(MoodId))
      // respond
      .then(nodes => res.json(nodes || []))
    } catch (error) {
      console.error(error);
      res.boom.internal(error)
    }
  })

  // get node for async validation in node adding form
  .get('/validate/:MoodId/:contentId', async function(req, res) {
    const { params } = req
    try {
      // validate params
      if (!params.MoodId) return res.status(400).end('mood id is required')
      if (!params.contentId) return res.status(400).end('content id is required')
      // find node
      Node.findOne({where: params})
      // respond
      .then(node => res.json(node || {}))
    } catch (error) {
      console.error(error);
      res.boom.internal(error)
    }
  })

  .get('/deprecated/:moodSlug/:nodeId?', async function({ params, user }, res) {
    /*
      If user is NOT logged in:
        1. Show highest rated Node
        2. Afterwards show lower rated Node
        3. If there is no Node just send the highest rated one
      If user IS logged in:
        1.
    */

    try {

      let response

      const UserId = await user && user.id
      const MoodId = await Mood.findIdBySlug(params.moodSlug)
      const previousNode = await params.nodeId
                              ? await Node.findById(params.nodeId)
                              : null
      if (!MoodId) return res.status(404).send('mood not found')

      // see function comment (hover over it)
      if (previousNode) await normalizeRating(previousNode)

      /* USER IS NOT LOGGED IN */
      // if (!UserId) {
      //   if(previousNode) {
      //     response = await Node.findOne({
      //                         where: {
      //                           MoodId,
      //                           id: { $not: previousNode.id }, // TODO i most likely don't need this
      //                           rating: { $lt: previousNode.rating },
      //                         },
      //                         order: [['rating', 'DESC']] // TODO ineed this?
      //                       })
      //   }
      // // }

      /* USER IS LOGGED IN */
      // TODO some of this things i do in decisionsApi
      // else {// IMPLEMENT THIS // DO NOT FORGET TO IMPLEMENT DECISIONS ON USER CREATION
      //     if (previousNode) {
      //       /* set lastViewAt, increment viewedAmount and set position */
      //       const where = { UserId, NodeId: previousNode.id }
      //       // TODO test 'findOrCreate'
      //       const previousDecision =  await Decision.findOrCreate({
      //         where,
      //         limit: 1,
      //         defaults: {MoodId},
      //       })
      //       // TODO remove this in future (when availability of decision will be certain)
      //       if (previousDecision) await updatePositionAndViews(previousDecision)
      //       // find next node
      //       response = await findHighestRatingNode(MoodId, UserId, previousDecision.NodeRating) // $qt //.position // TODO qt is not unique?
      //       console.log('response: ', response);
      //   }
      // }

      // // fallback to highest rated node if nothing was found
      // if (!response) response = await findHighestRatingNode(MoodId, UserId)
      if (!response) response = await findRandomNode(MoodId)
      // close request
      res.json(response)
    } catch (error) {
      console.error(error);
      res.boom.internal(error)
    }
  })

  .post('/', mustLogin, async function({user, body}, res) {
    // TODO add validations
    /*
      When user creates a node do the following:
      1. Create Node
      2. Create a Decision for every User corresponding with this NodeId
    */
    try {
      const MoodId = body.MoodId || await Mood.findIdBySlug(body.moodSlug)
      const url = body.url || 'https://www.youtube.com/watch?v=' + body.contentId
      extend(
        body,
        { url, MoodId, UserId: user.id },
        // url is optional if 'provider' and 'contentId' is provided
        body.url ? parseUrl(body.url).contentId : {},
      )
      const node   = await Node.create(body)
      const users  = await User.findAll()

      await users.forEach(async user => {
            return await Decision.create({
                      UserId: user.get('id'),
                      NodeId: node.get('id'),
                      MoodId: node.get('MoodId'),
                      NodeRating: node.get('rating'),
                    })
      })

      res.json(node)
    } catch (error) {
      console.error(error);
      res.boom.internal(error)
    }
  })