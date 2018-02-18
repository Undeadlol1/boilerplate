require('babel-polyfill')
require('babel-register')();
require('source-map-support').install();
const chai = require('chai')
const slugify = require('slug')
const casual = require('casual')
const uniqid = require('uniqid')
const { expect } = require('chai')
const filter = require('lodash/filter')
const isEqual = require('lodash/isEqual')
const extend = require('lodash/assignIn')
const { parseUrl } = require('shared/parsers.js')
const userFixtures = require('server/data/fixtures/users.js')
const getRandomDate = require('random-date-generator').getRandomDate
const models = require('server/data/models/index.js')
const { User, Local, Forums, Threads, Mood, Node, Decision, Profile } = require('server/data/models/index.js')
chai.should()

// TODO move this to fixtures
const urls = [
            "https://www.youtube.com/watch?v=nBwHtgQH2EQ",
            "https://www.youtube.com/watch?v=l5-gja10qkw",
            "https://www.youtube.com/watch?v=M3B5U1S-I4Y",
            "https://www.youtube.com/watch?v=P027oGJy2n4",
            "https://www.youtube.com/watch?v=VoA9tLkrgHY",
            "https://www.youtube.com/watch?v=7CPH5L7ip3A",
            "https://www.youtube.com/watch?v=Jwglgn1mo3M",
            "https://www.youtube.com/watch?v=3Pv7jAKIPa0",
            "https://www.youtube.com/watch?v=KrCMWS_fB4o",
            "https://www.youtube.com/watch?v=W7mNmiW9qts",
        ]

const randomNames = casual.array_of_words(10)

/*
    this function creates random digit and
    adds Date.now after decimal point
    afterwards last digit after decimal is randomized,
    since on .bulkCreate every Date.now() is the same
    (this is needed to make every rating unique to
    avoid duplicates and infinite cycles in node fetching api)
*/
function randomIntFromInterval(min, max) {
    const randomNumber = Math.floor(Math.random()*(max-min+1)+min)
    let now = ('0.' + Date.now().toString()).split('')
    const dateLastDigit = now.pop()
    now.push(Number(dateLastDigit) + Math.abs(Number(randomNumber))) // sometimes adds two digits instead of one
    now = Number(now.join(''))
    const randomWithDate = Number(randomNumber.toFixed(1)) + now
    return randomWithDate
}

// insert fixtures into database
before(async function() {
    try {
        // Clean up DB just in case, to avoid possible bugs.
        await cleanUpDB()
        // Close server incase of supertest.agent server is in use.
        await require('server/server.js').default.close()

        const moods = [],
                nodes = [],
                locals = [],
                profiles = [],
                decisions = [],
                createdUsers = [],
                forums = [],
                threads = []

        const localsWithHashedPassword = userFixtures.map(user => {
            // create new object to avoid object mutablity
            // (user.password = "some" overrides fixture data)
            const newLocal = Object.assign({}, user);
            newLocal.password = Local.generateHash(newLocal.password)
            return newLocal
        })

        // create users
        await User.bulkCreate(userFixtures)
            // refetch users because .bulkCreate return objects with id == null
            .then(() => User.findAll())
            // create moods fixtures array
            .each((user, index) => {
                const   name = uniqid(),
                        language = 'ru',
                        slug = slugify(name),
                        UserId = user.get('id'),
                        // mood rating
                        rating = randomIntFromInterval(1, 100000)
                const local = localsWithHashedPassword[index]
                local.UserId = user.id
                locals.push(local)
                createdUsers.push(user)
                profiles.push({UserId, language})
                moods.push({name, UserId, slug, rating, createdAt: getRandomDate()})
                forums.push({id: name, name, slug, UserId})
            })
            // create locals
            .then(() => Local.bulkCreate(locals))
            // create profiles
            .then(() => Profile.bulkCreate(profiles))
            // create forums
            .then(() => Forums.bulkCreate(forums))
            .then(() => Forums.findAll({where: {}}))
            .each(forum => {
                randomNames.forEach(() => {
                    const name = uniqid()
                    threads.push({
                            name,
                            slug: slugify(name),
                            text: casual.description,
                            parentId: forum.id,
                            UserId: forum.UserId,
                        }
                    )
                })
            })
            // create threads
            .then(() => Threads.bulkCreate(threads))
            // create moods
            .then(() => Mood.bulkCreate(moods))
            .then(() => Mood.findAll({where: {}}))
            .each(mood => {
                urls.forEach(url => {
                    const rating = randomIntFromInterval(-3, 20)
                    nodes.push(
                        extend(
                            parseUrl(url), {
                            rating,
                            MoodId: mood.id,
                            UserId: mood.UserId,
                        })
                    )
                })
            })
            // create nodes
            .then(() => Node.bulkCreate(nodes))
            .then(() => Node.findAll({raw: true}))
            // .each((node, index) => {
            //     return createdUsers.forEach((user, index2) => {
            //         decisions.push({
            //             position: index,
            //             NodeId: node.id,
            //             MoodId: node.MoodId,
            //             UserId: user.id,
            //             NodeRating: node.rating,
            //             rating: Number(randomIntFromInterval(-3, 20)),
            //         })
            //     })
            // })
            // create decisions
            .then(() => Decision.bulkCreate(decisions))
            .catch(error => {
                console.error(error)
                throw error
            })
    } catch (error) {
        throw error
    }
})

// clean up db
after(cleanUpDB)

async function cleanUpDB() {
    try {
        // get all model names except reserved ones for Sequelize
        const modelNames = filter(
            Object.getOwnPropertyNames(models),
            (modelName) => {
                if (modelName === 'Sequelize') return false
                if (modelName === 'sequelize') return false
                else return true
            }
        )
        // destroy everything in every model
        await Promise.all(modelNames.map(name => models[name].destroy({where: {}})))
    }
    catch(error) {
        console.log(error)
        throw new Error(error)
    }
}

// TODO make proper names
describe('fixture data setup', function() {
    it('added fixtures properly', async function(){
        try {
            const users = await User.findAll({raw: true})
            const locals = await Local.findAll({raw: true})
            const moods = await Mood.findAll({raw: true})
            const nodes = await Node.findAll({raw: true})
            const profiles = await Profile.findAll({raw: true})
            const decisions = await Decision.findAll({raw: true})
            const forums = await Forums.findAll({raw: true})
            const threads = await Threads.findAll({raw: true})

            expect(users).to.have.length(10, '10 users')
            expect(locals).to.have.length(10, '10 local profiles')
            expect(moods).to.have.length(10, '10 moods')
            expect(nodes).to.have.length(100, '100 nodes') // 10 moods * 10 nodes
            expect(profiles).to.have.length(10, '10 profiles')
            expect(forums).to.have.length(10, '10 forums')
            expect(threads).to.have.length(100, '100 threads') // 10 forums * 10 threads
            // expect(decisions).to.have.length(1000) // 10 moods * 10 nodes * 10 decisions

            moods.forEach(mood => {
                const moodNodes = nodes.filter(
                    node => node.MoodId == mood.id
                )
                expect(
                    moodNodes.length,
                    'each mood must have 10 nodes'
                ).to.be.equal(10)
            })

            // nodes.forEach(async node => {
            //     const nodeDecisions = decisions.filter(
            //         decision => decision.NodeId == node.id
            //     )
            //     expect(
            //         nodeDecisions.length,
            //         'each node must have 10 decisions'
            //     ).to.be.equal(10)
            // })

            // users.forEach(user => {
            //     nodes.forEach(node => {
            //         const userDecisions = decisions.filter(
            //             decision => (decision.MoodId == node.MoodId
            //                         && decision.UserId == user.id)
            //         )
            //         expect(
            //             userDecisions.length,
            //             'each user in mood must have 10 decisions'
            //         ).to.be.equal(10)
            //     })
            // })
        } catch (error) {
            console.log(error)
            throw new Error(error)
        }
    })
})

/* This will search for files ending in .test.js and
   require them into webpack bundle */
var context = require.context('.', true, /.+\.test\.js?$/);
context.keys().forEach(context);
module.exports = context;