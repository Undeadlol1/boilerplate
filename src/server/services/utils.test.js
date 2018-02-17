import 'babel-polyfill'
import chai, { expect, assert } from 'chai'
import { Mood, User } from 'server/data/models'
import { createPagination } from 'server/services/utils'
chai.should()
chai.use(require('chai-properties'))

export default describe('utils', function() {
    describe('createPagination()', function() {
        it('returns proper values', async () => {
            const data = await createPagination({
                model: User,
                where: {},
            })
            expect(data.values).to.be.a('array')
            expect(data.values).to.have.length(10)
            expect(data).to.have.properties({
                totalPages: 2,
                currentPage: 1,
            })
        })
    })

})