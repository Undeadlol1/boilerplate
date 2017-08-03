import Boom from 'boom';

/**
 * TODO
 *
 * @param {string} redirectRoute // TODO
 * @returns
 */
export function mustLogin(req, res, next) {
    req.isAuthenticated() ? next() : res.boom.unauthorized('Please, log in to do this')
}