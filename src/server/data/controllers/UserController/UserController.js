import extend from 'lodash/assignIn'
import * as models from "server/data/models/index"
import select from 'selectn'

const { User, Profile, Local, Twitter, Vk } = models

// TODO add tests! ⚠️ ✏️️
/**
 * TODO comments
 * @export
 * @param {string} authType
 * @param {object} payload
 */
export async function createUser(authType, payload) {
    // TODO comment

    const user = await User.create({
        image: payload.image,
        displayName: payload.username || payload.displayName,
    })

    if (authType == 'Local') payload.password = Local.generateHash(payload.password)
    await models[authType].create(extend(payload, {UserId: user.id}))

    return await User.findById(user.id, {include: [Profile]})
}

// TODO add tests! ⚠️ ✏️️

/**
 * TODO think if any of these even needed. Maybe i should normalize data client side?s
 */

/**
 * TODO
 * @export
 * @param {string} UserId
 * @returns {object} updated user
 */
export async function normalizePublicInfo(UserId) {
    const user = await User.findById(
        UserId,
        /**
         * After update of "sequelize" package
         * something broke and user were null untill
         * i specify "required: false" everywhere.
         */
        {include: [
            {
                model: Profile,
                required: false,
            },
            {
                model: Local,
                required: false,
            },
            {
                model: Twitter,
                required: false,
            },
            {
                model: Vk,
                required: false,
            }
        ]}
    )
    const displayName = select('Local.username', user)
        || select('Twitter.username', user)
        || select('Twitter.displayName', user)
        || select('Vk.username', user)
        || select('Vk.displayName', user)

    if (!user.displayName) user.set('displayName', displayName)

    if (!user.image) user.set('image',
        select('Twitter.image', user)
        || select('Vk.image', user)
    )

    await user.save()

    return await User.findById(user.id, {raw: true, nest: true})
}
/**
 * TODO
 * @export
 * @param {string} authType model name
 * @param {object} payload properties to update
 */
export async function updateSocialInfo(authType, payload) {
    await models[authType]
            .update(
                payload,
                {where: {id: payload.id}
            })
}
