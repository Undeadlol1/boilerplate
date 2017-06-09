require('babel-polyfill')
const chai = require('chai')
const slugify = require('slug')
const uniqid = require('uniqid')
const { expect } = require('chai')
const { isEqual } = require('lodash')
const extend = require('lodash/assignIn')
const { parseUrl } = require('../../shared/parsers.js')
const userFixtures = require('../data/fixtures/users.js')
const { User, Mood, Node, Decision, Profile } = require('../data/models/index.js')
chai.should()

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
before(function() {
    // close server incase of supertest.agent server is in use
    require('../server.js').default.close()

    const moods = [],
          nodes = [],
          profiles = [],
          decisions = [],
          createdUsers = []

    const usersWithHashedPassword = userFixtures.map(user => {
        // create new object to avoid object mutablity
        // (user.password = "some" overrides fixture data)
        const newUser = Object.assign({}, user);
        newUser.password = User.generateHash(newUser.password)
        return newUser
    })

    // create users
    return User.bulkCreate(usersWithHashedPassword)
        // refetch users because .bulkCreate return objects with id == null
        .then(() => User.findAll())
        // create moods fixtures array
        .each(user => {
            const   name = uniqid(),
                    language = 'ru',
                    slug = slugify(name),
                    UserId = user.get('id')
            createdUsers.push(user)
            profiles.push({UserId, language})
            moods.push({name, UserId, slug})
        })
        // create profiles
        .then(() => Profile.bulkCreate(profiles))
        // .then(() => Profile.findAll({where: {}, raw: true}))
        // .then(profiles => console.log('profiles', profiles))
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
        .each((node, index) => {
            return createdUsers.forEach((user, index2) => {                  
                decisions.push({
                    position: index, 
                    NodeId: node.id,
                    MoodId: node.MoodId,
                    UserId: user.id,
                    NodeRating: node.rating,
                    rating: Number(randomIntFromInterval(-3, 20)),
                })
            })
        })
        // create decisions
        .then(() => Decision.bulkCreate(decisions))
        .catch(error => {
            console.error(error)
            return error
            // throw new Error(error)
        })
})

// clean up db
after(async function() {
    try {
        User.destroy({ where: {} })
        Profile.destroy({ where: {} })
        Mood.destroy({ where: {} })
        Node.destroy({ where: {} })
        Decision.destroy({ where: {} })
    }
    catch(error) {
        console.log(error)
        throw new Error(error)
    }
})

// TODO make proper names
describe('fixture data setup', function() {
    it('added fixtures properly', async function(){
        try {
            const users = await User.findAll({raw: true})
            const moods = await Mood.findAll({raw: true})
            const nodes = await Node.findAll({raw: true})
            const profiles = await Profile.findAll({raw: true})
            const decisions = await Decision.findAll({raw: true})

            expect(users.length).to.be.equal(10)
            expect(moods.length).to.be.equal(10)
            expect(nodes.length).to.be.equal(100) // 10 moods * 10 nodes
            expect(profiles.length).to.be.equal(10)
            expect(decisions.length).to.be.equal(1000) // 10 moods * 10 nodes * 10 decisions
            
            moods.forEach(mood => {
                const moodNodes = nodes.filter(
                    node => node.MoodId == mood.id
                )
                expect(
                    moodNodes.length,
                    'each mood must have 10 nodes'
                ).to.be.equal(10)
            })

            nodes.forEach(async node => {
                const nodeDecisions = decisions.filter(
                    decision => decision.NodeId == node.id
                )
                expect(
                    nodeDecisions.length,
                    'each node must have 10 decisions'
                ).to.be.equal(10)
            })

            users.forEach(user => {
                nodes.forEach(node => {
                    const userDecisions = decisions.filter(
                        decision => (decision.MoodId == node.MoodId
                                    && decision.UserId == user.id)
                    )
                    expect(
                        userDecisions.length,
                        'each user in mood must have 10 decisions'
                    ).to.be.equal(10)
                })
            })
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