import { userType } from './user'
/**
 * This is a full query interface for a logged in user.
 * @export
 */
export default {
    type: userType,
    resolve: (source, args, { user }) => user,
    description: 'Currently logged in user. (you)',
}