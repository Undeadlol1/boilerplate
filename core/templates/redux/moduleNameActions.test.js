import nock from 'nock'
import isArray from 'lodash/isArray'
import thunk from 'redux-thunk'
import chai, { expect } from 'chai'
import chaiImmutable from 'chai-immutable'
import configureMockStore from 'redux-mock-store'
import { createAction, createActions } from 'redux-actions'
import { initialState } from 'browser/redux/reducers/UserReducer'
import { updateUser, toggleLoginDialog, logoutCurrentUser, fetchCurrentUser, fetchUser, actions } from 'browser/redux/actions/UserActions'
chai.should();
chai.use(chaiImmutable);

const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)
// TODO add API_PREFIX instead of API_URL?
const { URL, API_URL } = process.env
const authApi = '/api/auth/'
const usersApi = '/api/users/'
const user = {username: 'misha', id: 1}
/**
 * test async action by intercepting http call
 * and cheking if expected redux actions have been called
 * @param {string} url request url
 * @param {function} action action to call
 * @param {any} param action param
 * @param {array} result expected actions
 * @param {string} [method='get'] request method
 * @returns
 */
function mockRequest(url, action, param, result, method = 'get') {
    // TODO rework this url (last character '/' was causing unmathing of url)
    // create request interceptor
    nock('http://127.0.0.1:3000')[method](url).reply(200, user)
    const store = mockStore()
    return store
      // call redux action
      .dispatch(action(param))
      // compare called actions with expected result
      .then(() => expect(store.getActions()).to.deep.equal(result))
}

describe('UserActions', () => {

  afterEach(() => nock.cleanAll())


  it('fetchCurrentUser calls fetchingUser and recieveCurrentUser', async () => {
    const expectedActions = [
                              actions.fetchingUser(),
                              actions.recieveCurrentUser(user)
                            ]
    await mockRequest(authApi + 'current_user', fetchCurrentUser, undefined, expectedActions)
  })

  it('logoutCurrentUser calls removeCurrentUser', async () => {
    const expectedActions = [actions.removeCurrentUser()]
    await mockRequest(authApi + 'logout', logoutCurrentUser, undefined, expectedActions)
  })

  it('fetchUser calls fetchingUser and recieveFetchedUser', async () => {
    const { username } = user
    const expectedActions = [
                              actions.fetchingUser(),
                              actions.recieveFetchedUser(user)
                            ]
    await mockRequest(usersApi + 'user/' + username, fetchUser, username, expectedActions)
  })


  it('updateUser calls recieveCurrentUser', async () => {
    const { username } = user
    const expectedActions = [actions.recieveCurrentUser(user)]
    await mockRequest(
      usersApi + 'user/' + username,
      updateUser,
      username,
      expectedActions,
      'put'
    )
  })

  describe('toggleLoginDialog', () => {
    it('toggles with argument', () => {
      const store = mockStore({user: initialState})
      const expectedActions = [actions.toggleLoginDialog(true)]
      store.dispatch(toggleLoginDialog(true))
      expect(store.getActions()).to.deep.equal(expectedActions)
    })
    it('toggles without argument', () => {
      const store = mockStore({user: initialState})
      const expectedActions = [actions.toggleLoginDialog(true)]
      store.dispatch(toggleLoginDialog())
      expect(store.getActions()).to.deep.equal(expectedActions)
    })
  })
})