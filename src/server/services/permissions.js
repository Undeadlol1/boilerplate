import selectn from 'selectn'

/**
 * Check if user is logged in.
 * @export
 */
export function mustLogin(req, res, next) {
    req.isAuthenticated() ? next() : res.boom.unauthorized('Please, log in to do this')
}
/**
 * Check if user has admin permissions.
 * @export
 */
export function isAdmin(req, res, next) {
    selectn('user.id', req) === process.env.ADMIN_ID
    ? next()
    : res.boom.unauthorized('You must be an administrator to do this')
}