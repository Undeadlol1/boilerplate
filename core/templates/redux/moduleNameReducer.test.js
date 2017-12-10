import chai, { expect } from 'chai'
import { Map, List } from 'immutable'
import chaiImmutable from 'chai-immutable'
import { actions } from 'browser/redux/moduleName/ModuleNameActions'
import reducer, { initialState } from 'browser/redux/moduleName/ModuleNameReducer'
chai.should()
chai.use(chaiImmutable)

describe('moduleName reducer', async () => {

  const moduleName = {
    id: 1,
    UserId: 2,
    ModuleNameId: 3,
    type: 'video',
    contentId: 123,
    url: 'google.com',
    rating: '1.32332300',
    provider: 'youtube',
    Decision: {},
  }

  const moduleNames = [
    {id: 1},
    {id: 2},
    {id: 3},
  ]

  it('should have initial state', () => {
    expect(reducer(undefined, {})).to.equal(initialState)
  })

  it('should handle RECIEVE_MODULENAME action on initial state', async () => {
    const action = actions.recieveModuleName(moduleName)
    const newState = reducer(undefined, action)
    expect(newState).to.have.property('id', moduleName.id)
    expect(newState).to.have.property('contentId', moduleName.contentId)
    expect(newState).to.have.property('loading', false)
  })

  it('should handle RECIEVE_MODULENAMES action on initial state', () => {
    const action = actions.recieveModuleNames(moduleNames)
    const newState = reducer(undefined, action)
    expect(newState.get('moduleNames').toJS()).to.deep.equal(moduleNames)
  })

  it('should handle UPDATE_MODULENAME action', async () => {
    expect(
      reducer(undefined, actions.updateModuleName(moduleName))
    )
    .to.have.property('id', moduleName.id)
  })

  it('should handle TOGGLE_DIALOG action on initial state', async () => {
    expect(
      reducer(undefined, actions.toggleDialog(true))
    )
    .to.have.property('dialogIsOpen', true)
  })

  it('should handle UNLOAD_MODULENAME action', () => {
    const action = actions.unloadModuleName()
    const newState = reducer(undefined, action)
    expect(newState).to.equal(initialState)
  })

  it('should handle REMOVE_MODULENAME action', () => {
    const action = actions.recieveModuleNames(moduleNames)
    // state containing active moduleName and moduleNames list
    const initialState = reducer(undefined, action).merge(moduleName)
    const newState = reducer(initialState, actions.removeModuleName(1))
    expect(newState.get('moduleNames').toJS())
      .to.have.length(2)
      .and.not.contain({id: 1})
  })

  it('should handle RECIEVE_SEARCHED_VIDEOS action on initial state', () => {
    const action = actions.recieveSearchedVideos([])
    const newState = reducer(undefined, action)
    const expectedState = initialState.merge({
        searchedVideos: [],
        searchIsActive: false,
    })
    expect(newState).to.deep.eq(expectedState)
  })

})