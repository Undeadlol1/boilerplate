import slugify from 'slug'
import selectn from 'selectn'
import { Router } from 'express'
import generateUuid from 'uuid/v4'
import { Subscriptions } from 'server/data/models'
import { matchedData } from 'express-validator/filter'
import { createPagination } from '../../services/utils'
import { mustLogin } from 'server/services/permissions'
import { handleValidationErrors } from '../../services/errors'
import { check, validationResult, checkSchema, param } from 'express-validator/check'

const limit = 12
// type validtion is done multiple times
const type = {
  trim: true,
  optional: true,
  isLength: {
    options: { min: 3, max: 100 },
    errorMessage: 'Must be between 3 and 100 characters long',
  },
}

export default Router()
  // get single subscription
  .get('/subscription/:id',
    checkSchema({
      id: {
          trim: true,
          exists: true,
          isUUID: {
            errorMessage: 'Must be UUID'
          },
          errorMessage: 'Is required',
      }
    }),
    handleValidationErrors,
    async (req, res) => {
      try {
        res.json(
          await Subscriptions.findById(
            matchedData(req).id
          )
        )
      } catch (error) {
        res.status(500).end(error)
      }
    }
  )

  // get subscriptions by UserId
  .get('/:UserId/:page?',
    checkSchema({
      UserId: {
        trim: true,
        exists: true,
        errorMessage: 'Is required',
      },
      page: {
        trim: true,
        optional: true,
        isInt: {
          errorMessage: 'Must be an integer'
        },
      }
    }),
    handleValidationErrors,
    async (req, res) => {
      try {
        const params = matchedData(req)
        res.json(
          await createPagination({
            limit,
            page: params.page,
            model: Subscriptions,
            where: {UserId: params.UserId},
          })
        )
      }
      catch (error) {
        console.log(error)
        res.status(500).end(error)
      }
    }
  )

  // update subscription
  .put('/:subscriptionId',
    mustLogin,
    checkSchema({
      // can only update "type" field
      type,
      subscriptionId: {
        trim: true,
        exists: true,
        isUUID: {
          errorMessage: 'Must be UUID'
        },
        errorMessage: 'Is required',
      },
    }),
    handleValidationErrors,
    async (req, res) => {
      try {
        const UserId = req.user.id
        const data = matchedData(req)
        const subscription = await Subscriptions.findById(data.subscriptionId)

        // check permissions
        if (selectn('UserId', subscription) != UserId) return res.status(401).end()
        else res.json(await subscription.update(data))

      } catch (error) {
        console.log(error)
        res.status(500).end(error)
      }
    }
  )

  // create subscription
  .post('/',
    // self explanatory
    mustLogin,
    checkSchema({
      // Optional "type" field.
      // For example: "user" or "teacher".
      type,
      // single required field
      parentId: {
        trim: true,
        exists: true,
        errorMessage: 'Is required',
        isLength: {
          options: { min: 1, max: 100 },
          errorMessage: 'Must be between 1 and 100 characters long',
        },
      }
    }),
    handleValidationErrors,
    async (req, res) => {
      try {
        const UserId = req.user.id
        const payload = matchedData(req)
        res.json(
          await Subscriptions.create({...payload, UserId})
        )
      }
      catch (error) {
        res.status(500).end(error)
      }
    }
  )