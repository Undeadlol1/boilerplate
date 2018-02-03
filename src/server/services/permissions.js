import Boom from 'boom'
import selectn from 'selectn'

/**
 * check if user logged in or not
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