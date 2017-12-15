import nock from 'nock'
import thunk from 'redux-thunk'
import generateUuid from 'uuid/v4'
import chai, { expect } from 'chai'
import isArray from 'lodash/isArray'
import chaiImmutable from 'chai-immutable'
import configureMockStore from 'redux-mock-store'
import { createAction, createActions } from 'redux-actions'
import { initialState } from 'browser/redux/moduleName/ModuleNameReducer'
import { updateModuleName, insertThread, fetchModuleName, fetchModuleNames, actions } from 'browser/redux/moduleName/ModuleNameActions'
chai.should();
chai.use(chaiImmutable);

const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)
const { API_URL } = process.env
const threadsApi = API_URL + 'moduleNames/'

// TODO: edit this variables
const moduleName = {
  id: generateUuid()
}
const name = ""

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
    // create request interceptor
    nock(API_URL + 'moduleNames')[method](url).reply(200, moduleName)
    const store = mockStore()
    return store
      // call redux action
      .dispatch(action(param))
      // compare called actions with expected result
      .then(() => expect(store.getActions()).to.deep.equal(result))
}

describe('ModuleNameActions', () => {

  afterEach(() => nock.cleanAll())

  it('fetchModuleName calls recieveModuleName', async () => {
    const { slug } = moduleName
    const expectedActions = [
                              actions.recieveModuleName(moduleName)
                            ]
    await mockRequest('/moduleName/' + slug, fetchModuleName, slug, expectedActions)
  })

})