var Nightmare = require('nightmare');
var expect = require('chai').expect; // jshint ignore:line
var server = require('../../../server/server')
// TODO make this work.
// 1) fire up the server on testing start

describe('test duckduckgo search results', function() {
    // before((done) => {
    //     // console.log('server', server.default)
    //     server.listen(3001, done)
    // })
    // before(() => server.stop())
    it('should find the nightmare github link first', async function() {
        await Nightmare()
            .goto(process.env.URL)
            .click('#MoodsList__item')
            .end()
            .then(result => console.log(result))
    })
});