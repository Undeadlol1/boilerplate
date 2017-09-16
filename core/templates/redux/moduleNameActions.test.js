import nock from 'nock'
import isArray from 'lodash/isArray'
import thunk from 'redux-thunk'
import chai, { expect } from 'chai'
import chaiImmutable from 'chai-immutable'
import configureMockStore from 'redux-mock-store'
import { createAction, createActions } from 'redux-actions'
import { initialState } from 'browser/redux/ModuleName/ModuleNameReducer'
import { updateModuleName, toggleLoginDialog, logoutCurrentModuleName, fetchCurrentModuleName, fetchModuleName, actions } from 'browser/redux/ModuleName/ModuleNameActions'
chai.should();
chai.use(chaiImmutable);

const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)
// TODO add API_PREFIX instead of API_URL?
const { URL, API_URL } = process.env
const authApi = '/api/auth/'
const moduleNamesApi = '/api/moduleNames/'
const moduleName = {moduleNamename: 'misha', id: 1}
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
    nock('http://127.0.0.1:3000')[method](url).reply(200, moduleName)
    const store = mockStore()
    return store
      // call redux action
      .dispatch(action(param))
      // compare called actions with expected result
      .then(() => expect(store.getActions()).to.deep.equal(result))
}

describe('ModuleNameActions', () => {

  afterEach(() => nock.cleanAll())


  it('fetchCurrentModuleName calls fetchingModuleName and recieveCurrentModuleName', async () => {
    const expectedActions = [
                              actions.fetchingModuleName(),
                              actions.recieveCurrentModuleName(moduleName)
                            ]
    await mockRequest(authApi + 'current_moduleName', fetchCurrentModuleName, undefined, expectedActions)
  })

  it('logoutCurrentModuleName calls removeCurrentModuleName', async () => {
    const expectedActions = [actions.removeCurrentModuleName()]
    await mockRequest(authApi + 'logout', logoutCurrentModuleName, undefined, expectedActions)
  })

  it('fetchModuleName calls fetchingModuleName and recieveFetchedModuleName', async () => {
    const { moduleNamename } = moduleName
    const expectedActions = [
                              actions.fetchingModuleName(),
                              actions.recieveFetchedModuleName(moduleName)
                            ]
    await mockRequest(moduleNamesApi + 'moduleName/' + moduleNamename, fetchModuleName, moduleNamename, expectedActions)
  })


  it('updateModuleName calls recieveCurrentModuleName', async () => {
    const { moduleNamename } = moduleName
    const expectedActions = [actions.recieveCurrentModuleName(moduleName)]
    await mockRequest(
      moduleNamesApi + 'moduleName/' + moduleNamename,
      updateModuleName,
      moduleNamename,
      expectedActions,
      'put'
    )
  })

  describe('toggleLoginDialog', () => {
    it('toggles with argument', () => {
      const store = mockStore({moduleName: initialState})
      const expectedActions = [actions.toggleLoginDialog(true)]
      store.dispatch(toggleLoginDialog(true))
      expect(store.getActions()).to.deep.equal(expectedActions)
    })
    it('toggles without argument', () => {
      const store = mockStore({moduleName: initialState})
      const expectedActions = [actions.toggleLoginDialog(true)]
      store.dispatch(toggleLoginDialog())
      expect(store.getActions()).to.deep.equal(expectedActions)
    })
  })
})