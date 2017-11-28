import nock from 'nock'
import isArray from 'lodash/isArray'
import thunk from 'redux-thunk'
import chai, { expect } from 'chai'
import chaiImmutable from 'chai-immutable'
import configureMockStore from 'redux-mock-store'
import { createAction, createActions } from 'redux-actions'
import { initialState } from 'browser/redux/forum/ForumReducer'
import { updateForum, toggleLoginDialog, logoutCurrentForum, fetchCurrentForum, fetchForum, actions } from 'browser/redux/forum/ForumActions'
chai.should();
chai.use(chaiImmutable);

const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)
// TODO add API_PREFIX instead of API_URL?
const { URL, API_URL } = process.env
const authApi = '/api/auth/'
const forumsApi = '/api/forums/'
const forum = {name: 'misha', id: 1}
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
  console.log('url: ', url);
    // TODO rework this url (last character '/' was causing unmathing of url)
    // create request interceptor
    nock('http://127.0.0.1:3000/api/forums/')[method](url).reply(200, forum)
    const store = mockStore()
    return store
      // call redux action
      .dispatch(action(param))
      // compare called actions with expected result
      .then(() => expect(store.getActions()).to.deep.equal(result))
}

describe('ForumActions', () => {

  afterEach(() => nock.cleanAll())

  it('fetchForum calls recieveForum', async () => {
    const { name } = forum
    const expectedActions = [
      actions.recieveForum(forum)
    ]
    console.log('expectedActions: ', expectedActions);
    await mockRequest( 'forum/' + name, fetchForum, name, expectedActions)
  })


  it('updateForum calls recieveCurrentForum', async () => {
    const { name } = forum
    const expectedActions = [actions.recieveCurrentForum(forum)]
    await mockRequest(
      forumsApi + 'forum/' + name,
      updateForum,
      name,
      expectedActions,
      'put'
    )
  })

  describe('toggleLoginDialog', () => {
    it('toggles with argument', () => {
      const store = mockStore({forum: initialState})
      const expectedActions = [actions.toggleLoginDialog(true)]
      store.dispatch(toggleLoginDialog(true))
      expect(store.getActions()).to.deep.equal(expectedActions)
    })
    it('toggles without argument', () => {
      const store = mockStore({forum: initialState})
      const expectedActions = [actions.toggleLoginDialog(true)]
      store.dispatch(toggleLoginDialog())
      expect(store.getActions()).to.deep.equal(expectedActions)
    })
  })
})