import { Node, Mood, Decision, User } from '../data/models'
import { mustLogin } from '../services/permissions'
import { parseUrl } from '../../shared/parsers'
import { YOUTUBE_KEY } from '../../../config'
import { assignIn as extend } from 'lodash'
import sequelize from "sequelize"
import { Router } from "express"

// routes
export default Router()

  // TODO: rework to query instead of params
  // get node for async validation in node adding form
  .get('/validate/:MoodId/:contentId', async function(req, res) {
    try {
      const { MoodId, contentId } = req.params

      if (!contentId || !MoodId) return res.boom.badRequest('invalid query')

      const node = await Node.findOne({
                          raw: true,
                          where: { MoodId, contentId },
                        })
      res.json(node || {})
    } catch (error) {
      console.error(error);
      res.boom.internal(error)
    }
  })

  .get('/:moodSlug/:nodeId?', async function({ params, user }, res) {
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
      const previousNode = params.nodeId
                              ? await Node.findById(params.nodeId)
                              : null

      if (!MoodId) return res.boom.notFound()

      /* USER IS NOT LOGGED IN */
      // if (!UserId) {
        if(previousNode) {
          /*
            after migrating ratings to decimal point (in order to make them unique),
            not all of them changed properly.
            This function checks ratings and modifies them to decimal point with Date.now()
          */
          async function normalizeRating() {
            if (previousNode.rating == '0.00000000000000000' && (previousNode.rating % 1) == 0) {
              console.log('previousNode.rating', previousNode.rating)
              console.log('after point', previousNode.rating % 1)
              console.log('point test', (Number(previousNode.rating + '.' + Date.now())) % 1)
              console.warn('rating is not normal!')
              console.info('Normalizing...')
              const id = previousNode.id
              const newRating = previousNode.rating == '0.00000000000000000'
                                ? Number(0 + '.' + Date.now())
                                : Number(previousNode.rating + '.' + Date.now())
              await Node.update({rating: newRating}, {where: {id}})
              await Decision.update({NodeRating: newRating}, {where: {NodeId: id}})
            }
          }
          await normalizeRating()

          response = await Node.findOne({
                              where: {
                                MoodId,
                                id: { $not: previousNode.id }, // TODO i most likely don't need this
                                rating: { $lt: previousNode.rating },
                              },
                              order: [['rating', 'DESC']] // TODO ineed this?
                            })
        }
      // }

      /* USER IS LOGGED IN */
      // else {// IMPLEMENT THIS // DO NOT FORGET TO IMPLEMENT DECISIONS ON USER CREATION

      //     const decisionsCount = await Decision.count({where: { UserId, MoodId }})
      //     const nodesCount = await Node.count({where: { MoodId }})

      //     if (previousNode) {
      //       const previousDecision =  await Decision.findOne({
      //                                   where: { UserId, NodeId: previousNode.id }
      //                                 })
      //       // set lastViewAt, increment viewedAmount and set position
      //       const previousPosition = (Number((previousDecision.position < 0 ? 0 : previousDecision.position)) + 1)
      //       const modifier = Number(previousDecision.viewedAmount == 0 ? 1 : previousDecision.viewedAmount)
      //       const newPosition = previousPosition * modifier
      //       await Decision.update(
      //               {
      //                 lastViewAt: new Date(),
      //                 viewedAmount: Number(previousDecision.viewedAmount) + 1,
      //                 position: newPosition
      //               },
      //               { where: { id: previousDecision.id } }
      //             )

      //       // decrement previous decision.position / increment next ones

      //       await Decision.update(
      //         { position: sequelize.literal('position +1') },
      //         {
      //           where: {
      //             UserId,
      //             MoodId,
      //             position: { $gte: newPosition },
      //             id: { $not: previousDecision.id },
      //           }
      //         }
      //       )     

      //       await Decision.update(
      //         { position: sequelize.literal('position -1') },
      //         {
      //           where: {
      //             UserId,
      //             MoodId,
      //             position: { $lte: newPosition },
      //             id: { $not: previousDecision.id },
      //           }
      //         }
      //       )

      //       // prepare response
      //       const decision = await Decision.findOne({
      //         where: {
      //           UserId,
      //           MoodId,
      //           position: {$gt: previousDecision.position},
      //         },
      //         order: [['position', 'ASC']],                        
      //         raw: true
      //       })

      //       response = await Node.findById(decision && decision.NodeId, {raw: true})
      //       if (response) response.Decision = decision
      //       else {
      //         const highestPositionDecision = await Decision.findOne({
      //           where: { UserId, MoodId, },
      //           order: [['position', 'ASC']],
      //           raw: true
      //         })
      //         response = await Node.findById(highestPositionDecision && highestPositionDecision.NodeId, {raw: true})
      //         if (highestPositionDecision) response.Decision = highestPositionDecision
      //       }
      //   }
      //     if (!response) {
      //         const decision = await Decision.findOne({
      //         where: {
      //           UserId,
      //           MoodId,
      //         },
      //         order: [['position', 'ASC']],                        
      //         raw: true
      //       })
      //       const node = await Node.findById(decision && decision.NodeId, {raw: true})          
      //         response = node
      //         if (response) {
      //           response.Decision = decision
      //         }
      //     }
      // }

      if (!response) {
        // console.log('there is no response!!!')
        response = await Node.findOne({
          where: { MoodId },
          order: [['rating', 'DESC']]            
        })
      }

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