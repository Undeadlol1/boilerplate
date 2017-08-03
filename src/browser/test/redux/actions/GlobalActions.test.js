import chai, { expect } from 'chai'
import { actions } from 'browser/redux/actions/GlobalActions'
chai.should();

function testAction(type, payload, action) {
  const expectation = { type, payload }
  expect(action(payload)).to.deep.equal(expectation)
}

describe('GlobalActions', () => {
  it('TOGGLE_HEADER', () => {
    testAction('TOGGLE_HEADER', true, actions.toggleHeader)
  })

  it('TOGGLE_SIDEBAR', () => {
    testAction('TOGGLE_SIDEBAR', true, actions.toggleSidebar)
  })

  it('TOGGLE_CONTROLS', () => {
    testAction('TOGGLE_CONTROLS', true, actions.toggleControls)
  })

})