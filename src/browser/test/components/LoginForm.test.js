// TODO
import React from 'react'
import chai, { expect } from 'chai'
import chaiEnzyme from 'chai-enzyme'
// import Dialog from 'material-ui/Dialog'
import store from 'browser/redux/store'
import { shallow, mount } from 'enzyme'
// TODO remove material-ui things
import { Tabs, Tab } from 'material-ui/Tabs'
import FlatButton from 'material-ui/FlatButton'
import { Provider as ReduxProvider } from 'react-redux'
import { LoginForm } from 'browser/components/LoginForm'

// import FloatingActionButton from 'material-ui/FloatingActionButton'
// import LoginFormContainer from 'browser/containers/LoginFormContainer'

chai.should()
chai.use(chaiEnzyme())

describe('<LoginForm />', () => {
  const props = {
    // dialogIsOpen: true,
    // moodSlug: 'penises',
    // TODO change handleSubmit to fix this shit
    insertMood: () => {},
    handleSubmit: () => {},
    asyncValidating: false,
  }

  const wrapper = shallow(<LoginForm {...props} />);

  it('has `.LoginForm` class and <Tabs>', () => {
    // console.log('wrapper: ', wrapper.debug())
    expect(wrapper).to.have.className('LoginForm')
    expect(wrapper.type()).to.eq(Tabs)
  });

  // it('has <FloatingActionButton />', () => {
  //   const actionButton = wrapper.find('FloatingActionButton')
  //   expect(wrapper).to.have.descendants('FloatingActionButton');
  //   expect(actionButton).to.have.descendants('ContentAdd')
  // });

  // it('has <Dialog />', () => {
  //   const dialog = wrapper.find('Dialog')
  //   expect(wrapper).to.have.descendants('Dialog');
  //   // TODO why is this not working? because of @connect?
  //   // expect(dialog).to.have.descendants('YoutubeSearch');
  // });

});