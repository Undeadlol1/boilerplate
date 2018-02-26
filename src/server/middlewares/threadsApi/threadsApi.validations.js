import { matchedData, sanitize } from 'express-validator/filter'
import { check, validationResult, checkSchema } from 'express-validator/check'

export default {
    getOne: checkSchema({
        slug: {
            trim: true,
            exists: true,
            errorMessage: 'Is required', // FIXME: tests
        }
    }),
    get: checkSchema({
        parentId: {
            exists: true,
            errorMessage: 'Is required', // FIXME: tests
        },
        // FIXME: tests
        page: {
            isInt: true,
            toInt: true, // is this working?ß
            optional: true,
            errorMessage: 'Is required',
        }
    }),
    put: checkSchema({
        // Params validation.
        threadsId: {
            trim: true,
            exists: true,
            isUUID: true,
            errorMessage: 'Is required',
            // TODO: tests
            // errorMessage: ''
        },
        // Body validation.
        // Every other field in body will be ignored.
        text: {
            trim: true,
            exists: true,
            errorMessage: 'Is required',
            isLength: {
            options: { min: 5 },
            errorMessage: 'Text should be atleast 5 characters long',
            }
        },
    }),
    post: checkSchema({
        parentId: {
            exists: true,
            errorMessage: 'Parent id is required',
            isUUID: {
            errorMessage: 'Parent id is not valid UUID',
            },
        },
        name: {
            exists: true,
            errorMessage: 'Name is required',
            isLength: {
            options: { min: 5, max: 100 },
            errorMessage: 'Name must be between 5 and 100 characters long',
            },
        },
        text: {
            exists: true,
            errorMessage: 'Text is required',
            isLength: {
            options: { min: 5 },
            errorMessage: 'Text should be atleast 5 characters long',
            }
        },
    }),

}