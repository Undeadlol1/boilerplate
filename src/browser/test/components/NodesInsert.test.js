import React from 'react'
import chai, { expect } from 'chai'
import chaiEnzyme from 'chai-enzyme'
// import Dialog from 'material-ui/Dialog'
import store from 'browser/redux/store'
import { shallow, mount } from 'enzyme'
// TODO remove material-ui things
import FlatButton from 'material-ui/FlatButton'
import { Provider as ReduxProvider } from 'react-redux'
import NodesInsert from 'browser/components/NodesInsert'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import NodesInsertContainer from 'browser/containers/NodesInsertContainer'

chai.should()
chai.use(chaiEnzyme())

describe('<NodesInsert />', () => {
  const props = {
    dialogIsOpen: true,
    moodSlug: 'penises',
    // TODO change handleSubmit to fix this shit
    handleSubmit: () => {},
    toggleDialog: () => {},
  }

  const wrapper = shallow(<NodesInsert {...props} />);

  it('has `.NodesInsert` class', () => {
    expect(wrapper).to.have.className('NodesInsert')
  });

  it('has <FloatingActionButton />', () => {
    const actionButton = wrapper.find('FloatingActionButton')
    expect(wrapper).to.have.descendants('FloatingActionButton');
    expect(actionButton).to.have.descendants('ContentAdd')
  });

  // it('has <Dialog />', () => {
  //   const dialog = wrapper.find('Dialog')
  //   expect(wrapper).to.have.descendants('Dialog');
  //   // TODO why is this not working? because of @connect?
  //   // expect(dialog).to.have.descendants('YoutubeSearch');
  // });

});