import Boom from 'boom'
import selectn from 'selectn'

/**
 * TODO
 *
 * @param {string} redirectRoute // TODO
 * @returns
 */
export function mustLogin(req, res, next) {
    req.isAuthenticated() ? next() : res.boom.unauthorized('Please, log in to do this')
}

/**
 * check administrator permissions
 */
export function isAdmin(req, res, next) {
    selectn('user.id', req) === process.env.ADMIN_ID
    ? next()
    : res.boom.unauthorized('You must be an administrator to do this')
}