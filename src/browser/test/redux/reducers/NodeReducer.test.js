import chai, { expect } from 'chai'
import { Map, List } from 'immutable'
import chaiImmutable from 'chai-immutable'
import { actions } from 'browser/redux/actions/NodeActions'
import reducer, { initialState } from 'browser/redux/reducers/NodeReducer'
chai.should();
chai.use(chaiImmutable);

describe('user reducer', async () => {

  const node =  {
    id: 1,
    UserId: 2,
    MoodId: 3,
    type: 'video',
    contentId: 123,
    url: 'google.com',
    rating: '1.32332300',
    provider: 'youtube',
    Decision: {},
  }
  const nodes = [
    {id: 1},
    {id: 2},
    {id: 3},
  ]

  it('should have initial state', () => {
    expect(reducer(undefined, {})).to.equal(initialState);
  });

  it('should handle RECIEVE_NODE action on initial state', async () => {
    const action = actions.recieveNode(node)
    const newState = reducer(undefined, action)
    expect(newState).to.have.property('id', node.id)
    expect(newState).to.have.property('contentId', node.contentId)
    expect(newState).to.have.property('loading', false)
  });

  it('should handle RECIEVE_NODES action on initial state', () => {
    const action = actions.recieveNodes(nodes)
    const newState = reducer(undefined, action)
    expect(newState.get('nodes').toJS()).to.deep.equal(nodes)
  });

  it('should handle UPDATE_NODE action', async () => {
    expect(
      reducer(undefined, actions.updateNode(node))
    )
    .to.have.property('id', node.id)
  });

  it('should handle TOGGLE_DIALOG action on initial state', async () => {
    expect(
      reducer(undefined, actions.toggleDialog(true))
    )
    .to.have.property('dialogIsOpen', true)
  });

  it('should handle UNLOAD_NODE action', () => {
    const action = actions.unloadNode()
    const newState = reducer(undefined, action)
    expect(newState).to.equal(initialState)
  });

  it('should handle REMOVE_NODE action', () => {
    const action = actions.recieveNodes(nodes)
    // state containing active node and nodes list
    const initialState = reducer(undefined, action).merge(node)
    const newState = reducer(initialState, actions.removeNode(1))
    expect(newState.get('nodes').toJS())
      .to.have.length(2)
      .and.not.contain({id: 1})
  });

  it('should handle RECIEVE_SEARCHED_VIDEOS action on initial state', () => {
    const action = actions.recieveSearchedVideos([])
    const newState = reducer(undefined, action)
    const expectedState = initialState.merge({
        searchedVideos: [],
        searchIsActive: false,
    })
    expect(newState).to.deep.eq(expectedState)
  });

});