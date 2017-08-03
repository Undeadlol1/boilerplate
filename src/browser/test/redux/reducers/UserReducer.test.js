import chai, { expect } from 'chai'
import chaiImmutable from 'chai-immutable'
import { actions } from 'browser/redux/actions/UserActions'
import reducer, { initialState } from 'browser/redux/reducers/UserReducer'
chai.should();
chai.use(chaiImmutable);

describe('user reducer', async () => {

  const user =  { id: 1, username: 'something' }
  const fetchedUser = {id: 2, username: 'anotherthing'}

  it('should have initial state', () => {
    expect(reducer(undefined, {})).to.equal(initialState);
  });

  it('should handle FETCHING_USER action on initial state', () => {
    const action = actions.fetchingUser()
    const newState = reducer(undefined, action)
    const expectedState = initialState.set('loading', true)
    expect(newState).to.equal(expectedState)
  });

  it('should handle RECIEVE_CURRENT_USER action on initial state', async () => {
    const action = actions.recieveCurrentUser(user)
    const newState = reducer(undefined, action)
    expect(newState).to.have.property('id', user.id)
    expect(newState).to.have.property('loading', false)
    expect(newState).to.have.property('loginIsOpen', false)
  });

  it('should handle REMOVE_CURRENT_USER action on initial state', () => {
    const action = actions.removeCurrentUser()
    const newState = reducer(undefined, action)
    expect(newState.toJS()).to.deep.equal(initialState.toJS())
  });

  it('should handle RECIEVE_FETCHED_USER action on initial state', async () => {
    const action = actions.recieveCurrentUser(fetchedUser)
    const newState = reducer(undefined, action)
    expect(newState).to.have.property('id', fetchedUser.id)
    expect(newState).to.have.property('loading', false)
  });

  it('should handle REMOVE_FETCHED_USER action on initial state', () => {
    const action = actions.removeFetchedUser()
    const newState = reducer(undefined, action)
    expect(newState).to.equal(initialState)
  });

  it('should handle TOGGLE_LOGIN_DIALOG action on initial state', () => {
    const action = actions.toggleLoginDialog(true)
    const newState = reducer(undefined, action)
    const expectedState = initialState.set('loginIsOpen', true)
    expect(newState).to.equal(expectedState)
  });

});