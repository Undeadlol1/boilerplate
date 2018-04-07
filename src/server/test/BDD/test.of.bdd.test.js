var Nightmare = require('nightmare');
var expect = require('chai').expect; // jshint ignore:line
var config = require('../../../../development.json')
// var server = require('../../../server/server').default
// TODO make this work.
// 1) fire up the server on testing start
// let app = server.listen(process.env.PORT)
describe('sample bdd test', function() {
    // before(() => {
    //     // Stop server incase it is running.
    //     server.close()
    //     // app && app.stop()
    //     app = server.listen(process.env.PORT)
    // })
    // after(() => {
    //     server.close()
    // })
    it('Sample website crawler', async function() {
        return await Nightmare()
            .goto(config.URL)
            .click('.NavBar')
            .end()
            .then(result => {
                console.log('result: ', result);
            })
            .catch(error => {throw error})
    })
});