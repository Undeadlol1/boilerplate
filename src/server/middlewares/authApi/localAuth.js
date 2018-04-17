import { Op } from 'sequelize'
import passport from "passport"
import { Router } from "express"
import { createUser } from 'server/data/controllers/UserController'
import { User, Local, Profile, sequelize } from 'server/data/models'

const router = Router()

router
  .post('/signup',   async function(req, res) {
    const { username, email, password } = req.body
    // TODO test for params
    if(!username || !email || !password) res.status(400).end('params are required')
    // find a user whose email is the same as the forms email
    // we are checking to see if the user trying to login already exists

    // TODO add validation tests
    try {
        const existingUser = await Local.scope('all').findOne({
          where: {
            [Op.or]: [{email}, {username}]
          }
        })

        if (existingUser) res.status(401).end('user already exists')
        else {
          const user = await createUser('Local', req.body)
          req.login(user, error => {
            if (error) throw new Error(error)
            else return res.json(user)
          })
        }
    } catch (error) {
        console.error(error)
        res.status(500).end(error)
    }
  })

  .post('/login', async function(req, res) {
      try {
        const {username, password} = req.body
        if(!username || !password) return res.status(400).end('Invalid query')
        // TODO this
        const email = username
        const user =  await User.findOne({
                        where: {},
                        include: [Profile, {
                          model: Local.scope('all'),
                          where: { [Op.or]: [{email}, {username}] },
                        }],
                      })
        if (!user) {
          return res.status(401).end('User not exists')
        }
        if (!user.Local.validPassword(password)) {
          const newLocal = await Local.scope('all').findById(user.Local.id)
          return res.status(401).end('Incorrect password')
        }
        req.login(user, error => {
          if (error) throw new Error(error)
          else return res.json(user)
        })
      } catch (error) {
          console.error(error)
          res.status(500).end(error)
      }
  })
  // TODO tests
  .get('/validate/:username', async (req, res) => {
    const {username} = req.params
    Local
    .findOne({
      where: {
        [Op.or]: [{username}, {email: username}]
      }
    })
    .then(user => res.json(user || {}))
  })

export default router