import { validationResult } from 'express-validator/check'

/**
 * Middleware to create error response if values didn't pass validation checks.
 * Shall be used as default validation handler.
 * Function copypasted from https://github.com/ctavan/express-validator
 * @example
 * .get('/:id',
 *  {"id" validations here}, // validate
 *  handleValidationErrors, // handle errors
 *  (req, res) => {} // handle route
 * )
 * @export
 */
export const handleValidationErrors = (req, res, next) => {
    try {
        // Get the validation result
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.mapped() })
        }
        else next()
    } catch (error) {
        console.error(error)
    }
  }