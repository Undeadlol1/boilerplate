import chai, { expect } from 'chai'
import { Map, List } from 'immutable'
import chaiImmutable from 'chai-immutable'
import { actions } from 'browser/redux/forum/ForumActions'
import reducer, { initialState } from 'browser/redux/forum/ForumReducer'
chai.should()
chai.use(chaiImmutable)

describe('forum reducer', async () => {

  const forum = {
    id: 1,
    UserId: 2,
    ForumId: 3,
    type: 'video',
    contentId: 123,
    url: 'google.com',
    rating: '1.32332300',
    provider: 'youtube',
    Decision: {},
  }

  const forums = {
    totalPages: 1,
    currentPage: 1,
    values: [
      {id: 1},
      {id: 2},
      {id: 3},
    ]
  }

  const thread = {
    id: 1,
    UserId: 2,
    parentId: 3,
    name: 'somename',
    User: {id: 1},
  }

  const threads = {
    totalPages: 1,
    currentPage: 1,
    values: [
      {id: 1},
      {id: 2},
      {id: 3},
    ]
  }


  it('should have initial state', () => {
    expect(reducer(undefined, {})).to.equal(initialState)
  })

  it('should handle ADD_FORUM action on initial state', () => {
    const action = actions.addForum(forum)
    const newState = reducer(undefined, action)
    const forums = newState.getIn(['forums', 'values']).toJS()
    expect(forums).to.deep.eq([forum])
  })

  it('should handle RECIEVE_FORUM action on initial state', async () => {
    const action = actions.recieveForum(forum)
    const newState = reducer(undefined, action)
    expect(newState).to.have.property('id', forum.id)
    expect(newState).to.have.property('loading', false)
    expect(newState).to.have.property('contentId', forum.contentId)
  })

  it('should handle ADD_THREAD action on initial state', () => {
    const action = actions.addThread(thread)
    const newState = reducer(undefined, action)
    const threads = newState.getIn(['threads', 'values']).toJS()
    expect(threads).to.deep.eq([thread])
  })

  it('should handle RECIEVE_FORUMS action on initial state', () => {
    const action = actions.recieveForums(forums)
    const newState = reducer(undefined, action)
    expect(newState.get('forums').toJS()).to.deep.equal(forums)
  })

  it('should handle RECIEVE_THREAD action on initial state', () => {
    const action = actions.recieveThread(thread)
    const newState = reducer(undefined, action)
    const threadInState = newState.get('thread').toJS()
    expect(threadInState).to.deep.eq(thread)
  })

  it('should handle UPDATE_FORUM action', async () => {
    expect(
      reducer(undefined, actions.updateForum(forum))
    )
    .to.have.property('id', forum.id)
  })

  it('should handle TOGGLE_DIALOG action on initial state', async () => {
    expect(
      reducer(undefined, actions.toggleDialog(true))
    )
    .to.have.property('dialogIsOpen', true)
  })

  // it('should handle UNLOAD_FORUM action', () => {
  //   const action = actions.unloadForum()
  //   const newState = reducer(undefined, action)
  //   expect(newState).to.equal(initialState)
  // })

  // it('should handle REMOVE_FORUM action', () => {
  //   const action = actions.recieveForums(forums)
  //   // state containing active forum and forums list
  //   const initialState = reducer(undefined, action).merge(forum)
  //   const newState = reducer(initialState, actions.removeForum(1))
  //   expect(newState.get('forums').toJS())
  //     .to.have.length(2)
  //     .and.not.contain({id: 1})
  // })

})