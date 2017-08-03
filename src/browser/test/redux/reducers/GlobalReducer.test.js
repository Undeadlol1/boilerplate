import chai, { expect } from 'chai'
import { fromJS } from 'immutable'
import chaiImmutable from 'chai-immutable'
import global, { initialState } from 'browser/redux/reducers/GlobalReducer'
import { actions } from 'browser/redux/actions/GlobalActions'
chai.should();
chai.use(chaiImmutable);

describe('global reducer', () => {

  it('should have initial state', () => {
    expect(global(undefined, {})).to.equal(initialState);
  });

  it('should handle TOGGLE_HEADER action on initial state', () => {
    const action = actions.toggleHeader()
    const newState = global(undefined, action)
    const expectedState = initialState.set('headerIsShown', false)
    expect(newState).to.equal(expectedState)
  });

  it('should handle TOGGLE_SIDEBAR action on initial state', () => {
    const action = actions.toggleSidebar()
    const newState = global(undefined, action)
    const expectedState = initialState.set('sidebarIsOpen', true)
    expect(newState).to.equal(expectedState)
  });

  it('should handle TOGGLE_CONTROLS action on initial state', () => {
    const action = actions.toggleControls()
    const newState = global(undefined, action)
    const expectedState = initialState.set('controlsAreShown', true)
    expect(newState).to.equal(expectedState)
  });

  // all toggle actions rely on single function which checks params
  it('should not fail to toggle if parameter is not boolean', () => {
    const action = actions.toggleControls(new Object())
    const newState = global(undefined, action)
    const expectedState = initialState.set('controlsAreShown', true)
    expect(newState).to.equal(expectedState)
  });

});