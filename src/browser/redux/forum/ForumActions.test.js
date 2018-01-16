import nock from 'nock'
import { spy } from 'sinon'
import thunk from 'redux-thunk'
import chaiImmutable from 'chai-immutable'
import chai, { expect, assert } from 'chai'
import configureMockStore from 'redux-mock-store'
import { initialState } from 'browser/redux/forum/ForumReducer'
import {
  actions,
  fetchForum,
  fetchForums,
  insertForum,
  updateForum,
  fetchThread,
  insertThread,
  toggleLoginDialog,
  fetchCurrentForum,
  logoutCurrentForum,
} from 'browser/redux/forum/ForumActions'
chai.should();
chai.use(chaiImmutable);

const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)
// TODO add API_PREFIX instead of API_URL?
const { URL, API_URL } = process.env
const forum = {name: 'misha', id: 1}
const thread = {
  id: 1,
  name: 'someNam',
  slug: 'someNam',
  text: "some text",
  parentId: forum.id,
}
const forums = {
  totalPages: 1,
  currentPage: 1,
  values: [forum, forum],
}
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
function mockRequest(url, action, param, result, method = 'get', response=forum) {
    // create request interceptor
    nock(API_URL + 'forums')[method](url).reply(200, response)
    // nock(API_URL + '/forums')[method](url).reply(200, forum)
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
    const expectedActions = [actions.recieveForum(forum)]
    await mockRequest(
      '/forum/' + name,
      fetchForum,
      name,
      expectedActions
    )
  })

  it('fetchForums calls recieveForums', async () => {
    // const { name } = forum
    const expectedActions = [actions.recieveForums(forums)]
    await mockRequest("/1", fetchForums, "1", expectedActions, 'get', forums)
  })

  it('fetchThread calls recieveThread', async () => {
    const store = mockStore()
    const expectedActions = [actions.recieveThread(thread)]
    nock(`${API_URL}threads/thread/`).get('/' + thread.slug).reply(200, thread)
    return store
      // call redux action
      .dispatch(fetchThread(thread.slug))
      // compare called actions with expected result
      .then(() => {
        expect(store.getActions()).to.deep.equal(expectedActions)
      })
  })

  it('insertForum calls addThread and callback', async () => {
    const callback = spy()
    const store = mockStore()
    const expectedActions = [actions.addForum(forum)]
    // intercept request
    nock(API_URL).post('/forums/', forum).reply(200, forum)
    return store
      // call redux action
      .dispatch(insertForum(forum, callback))
      // compare called actions with expected result
      .then(() => {
        expect(store.getActions()).to.deep.equal(expectedActions)
        // make sure callback is called
        assert(callback.calledOnce, 'callback not called')
        assert(callback.calledWith(forum), 'callback not called with proper params')
      })
  })

  it('insertThread calls addThread and callback', async () => {
    const callback = spy()
    const store = mockStore()
    const expectedActions = [actions.addThread(thread)]
    // intercept request
    nock(API_URL).post('/threads/', thread).reply(200, thread)
    return store
      // call redux action
      .dispatch(insertThread(thread, callback))
      // compare called actions with expected result
      .then(() => {
        expect(store.getActions()).to.deep.equal(expectedActions)
        // make sure callback is called
        assert(callback.calledOnce, 'callback not called')
        assert(callback.calledWith(thread), 'callback not called with proper params')
      })
  })

})