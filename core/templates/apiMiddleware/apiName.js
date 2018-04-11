import { Router } from 'express'
import generateUuid from 'uuid/v4'
import { Plural } from 'server/data/models'
import asyncHandler from 'express-async-handler'
import { mustLogin } from 'server/services/permissions'
import { matchedData, sanitize } from 'express-validator/filter'
import { check, validationResult } from 'express-validator/check'

const limit = 12

export default Router()
  /**
   * Get all plural.
   */
  .get('/:page?', async (req, res) => {
    try {
      const page = req.params.page,
            totalPlurals = await Plural.count(),
            offset = page ? limit * (page - 1) : 0,
            totalPages = Math.ceil(totalPlurals / limit),
            values = await Plural.findAll({limit, offset})
      res.json({ values, totalPages, currentPage: page || 1 })
    }
    catch (error) {
      res.status(500).end(error)
    }
  })
  /**
   * Get single singular.
   */
  .get('/singular/:id', asyncHandler(async ({params}, res) => {
    res.json(
      await Plural.findById(params.id)
    )
  }))
  /**
   * Update singular.
   */
  .put('/:singularId', mustLogin,
    asyncHandler(async ({user, body, params}, res) => {
      const singular = await Plural.findById(params.singularId)
      // Check document existence.
      if (!singular) res.status(204).end()
      // Check permissions.
      // User can only update own documents.
      else if (singular.UserId != user.id) res.status(401).end()
      // Update and return document.
      else res.json(await singular.update(body))
  })
  /**
   * Create singular.
   */
  .post('/', mustLogin, asyncHandler(async ({user, body}, res) => {
    const UserId = user.id
    res.json(
      await Plural.create({...body, UserId})
    )
  }))
  /**
   * Delete singular.
   */
  .delete('/:id', mustLogin, asyncHandler(async ({user, body, params}, res) => {
      const singular = await Plural.findById(params.id)
      // Document was not found.
      if (!singular) res.status(204).end()
      // User must be documents owner to delete it.
      else if (singular.UserId == user.id) {
        await singular.destroy()
        await res.status(200).end()
      }
      // Send error if user not the owner.
      else res.boom.unauthorized('You must be the owner to delete this')
  }))