import chai, { expect } from 'chai'
import { Map, List } from 'immutable'
import chaiImmutable from 'chai-immutable'
import { actions } from 'browser/redux/ui/UiActions'
import reducer, { initialState } from 'browser/redux/ui/UiReducer'
chai.should()
chai.use(chaiImmutable)

describe('ui reducer', async () => {

  const ui = {
    // id: 1,
    // UserId: 2,
    // UiId: 3,
    // type: 'video',
    // contentId: 123,
    // url: 'google.com',
    // rating: '1.32332300',
    // provider: 'youtube',
    // Decision: {},
  }

  const uis = [
    {id: 1},
    {id: 2},
    {id: 3},
  ]

  it('should have initial state', () => {
    expect(reducer(undefined, {})).to.equal(initialState)
  })

  it('should handle TOGGLE_LOADING action on initial state', async () => {
    const action = actions.toggleLoading()
    const newState = reducer(undefined, action)
    expect(newState).to.have.property('loading', true)
  })

  // it('should handle RECIEVE_UIS action on initial state', () => {
  //   const action = actions.recieveUis(uis)
  //   const newState = reducer(undefined, action)
  //   expect(newState.get('uis').toJS()).to.deep.equal(uis)
  // })

  // it('should handle UPDATE_UI action', async () => {
  //   expect(
  //     reducer(undefined, actions.updateUi(ui))
  //   )
  //   .to.have.property('id', ui.id)
  // })

  // it('should handle TOGGLE_DIALOG action on initial state', async () => {
  //   expect(
  //     reducer(undefined, actions.toggleDialog(true))
  //   )
  //   .to.have.property('dialogIsOpen', true)
  // })

  // it('should handle UNLOAD_UI action', () => {
  //   const action = actions.unloadUi()
  //   const newState = reducer(undefined, action)
  //   expect(newState).to.equal(initialState)
  // })

  // it('should handle REMOVE_UI action', () => {
  //   const action = actions.recieveUis(uis)
  //   // state containing active ui and uis list
  //   const initialState = reducer(undefined, action).merge(ui)
  //   const newState = reducer(initialState, actions.removeUi(1))
  //   expect(newState.get('uis').toJS())
  //     .to.have.length(2)
  //     .and.not.contain({id: 1})
  // })

  // it('should handle RECIEVE_SEARCHED_VIDEOS action on initial state', () => {
  //   const action = actions.recieveSearchedVideos([])
  //   const newState = reducer(undefined, action)
  //   const expectedState = initialState.merge({
  //       searchedVideos: [],
  //       searchIsActive: false,
  //   })
  //   expect(newState).to.deep.eq(expectedState)
  // })

})