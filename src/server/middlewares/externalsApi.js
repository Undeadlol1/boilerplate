import { Node, Mood, Decision, User } from 'server/data/models'
import { mustLogin } from 'server/services/permissions'
import { parse as parseQuery } from 'query-string'
import { parseUrl } from 'shared/parsers'
import extend from 'lodash/assignIn'
import isEmpty from 'lodash/isEmpty'
// import YouTube from 'youtube-node'
import sequelize from "sequelize"
import { Router } from "express"

/**
 * NOTE: youtube-node is the reason behind "uuid warning"
 * which frequently pops up on build
 * upgrade it in the future and remove this note
 */


/*
  ⚠️ note about YouTube API ⚠️
  currently youtube key works only on specific IP's
  so, when multi server infrastructure is created either
  add server IP addresses in YouTube dashboard,
  or bound key to website URL and move YT search to client
*/
// const youTube = new YouTube(),
//       maxResults = 4,
//       options = {
//                   maxResults,
//                   type: 'video',
//                   videoEmbeddable: true,
//                 }
// youTube.setKey(process.env.YOUTUBE_KEY);

// // routes
export default Router()
  .get('/search', async function(req, res) {
    try {
      res.end()
      // const selector = req.query.query // TODO rework this ✏️
      // if (!selector || isEmpty(selector)) return res.boom.badRequest('invalid query')
      // youTube.search(selector, maxResults, options,
      //   (error, result) => {
      //     if (error) throw error
      //     else res.json(result.items)
      // });
    } catch (error) {
      console.error(error);
      res.boom.internal(error)
    }
  })
